export interface GitHubConfig {
    owner: string;
    repo: string;
    branch: string;
    token: string;
}

export interface GitChange {
    path: string;
    content: string | null;
    encoding?: "utf-8" | "base64";
}

export function skipCiCommitMessage(message: string): string {
    return `${message} [skip ci]`;
}

export function getGitHubConfig(): GitHubConfig {
    const repository = process.env.GITHUB_REPOSITORY || "nyny77/ehpad-crecy";
    const [owner, repo] = repository.split("/");
    const token = process.env.GITHUB_CONTENT_TOKEN;
    if (!owner || !repo || !token) throw new Error("Configuration GitHub manquante : GITHUB_CONTENT_TOKEN");
    return { owner, repo, token, branch: process.env.GITHUB_CONTENT_BRANCH || "main" };
}

export async function githubRequest(path: string, init: RequestInit = {}) {
    const { token } = getGitHubConfig();
    return fetch(`https://api.github.com${path}`, {
        ...init,
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            ...init.headers,
        },
    });
}

async function responseJson<T>(response: Response, label: string): Promise<T> {
    if (!response.ok) {
        const details = await response.text();
        throw new Error(`${label} (${response.status}) ${details.slice(0, 180)}`);
    }
    return response.json() as Promise<T>;
}

import fs from "node:fs/promises";
import path from "node:path";

export async function readRepositoryText(filePath: string): Promise<string> {
    if (process.env.CONTEXT === "dev") {
        try {
            return await fs.readFile(path.resolve(process.cwd(), filePath), "utf-8");
        } catch (e: any) {
            if (e.code === "ENOENT") throw new Error("Lecture GitHub impossible (404)");
            throw e;
        }
    }
    const { owner, repo, branch } = getGitHubConfig();
    const encoded = filePath.split("/").map(encodeURIComponent).join("/");
    const response = await githubRequest(`/repos/${owner}/${repo}/contents/${encoded}?ref=${encodeURIComponent(branch)}`, {
        headers: { Accept: "application/vnd.github.raw+json" },
    });
    if (!response.ok) throw new Error(`Lecture GitHub impossible (${response.status})`);
    return response.text();
}

export async function commitChanges(message: string, changes: GitChange[]): Promise<void> {
    if (process.env.CONTEXT === "dev") {
        for (const change of changes) {
            const absolutePath = path.resolve(process.cwd(), change.path);
            if (change.content === null) {
                try { await fs.unlink(absolutePath); } catch (e) {}
            } else {
                await fs.mkdir(path.dirname(absolutePath), { recursive: true });
                await fs.writeFile(absolutePath, change.content, { encoding: change.encoding || "utf-8" });
            }
        }
        return;
    }
    const { owner, repo, branch } = getGitHubConfig();
    const ref = await responseJson<{ object: { sha: string } }>(
        await githubRequest(`/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`),
        "Lecture de la branche impossible",
    );
    const parentSha = ref.object.sha;
    const commit = await responseJson<{ tree: { sha: string } }>(
        await githubRequest(`/repos/${owner}/${repo}/git/commits/${parentSha}`),
        "Lecture du commit impossible",
    );

    const tree = [] as Array<{ path: string; mode: "100644"; type: "blob"; sha: string | null }>;
    for (const change of changes) {
        if (change.content === null) {
            tree.push({ path: change.path, mode: "100644", type: "blob", sha: null });
            continue;
        }
        const blob = await responseJson<{ sha: string }>(
            await githubRequest(`/repos/${owner}/${repo}/git/blobs`, {
                method: "POST",
                body: JSON.stringify({ content: change.content, encoding: change.encoding || "utf-8" }),
            }),
            "Création d’un fichier impossible",
        );
        tree.push({ path: change.path, mode: "100644", type: "blob", sha: blob.sha });
    }

    const nextTree = await responseJson<{ sha: string }>(
        await githubRequest(`/repos/${owner}/${repo}/git/trees`, {
            method: "POST",
            body: JSON.stringify({ base_tree: commit.tree.sha, tree }),
        }),
        "Création de l’arborescence impossible",
    );
    const nextCommit = await responseJson<{ sha: string }>(
        await githubRequest(`/repos/${owner}/${repo}/git/commits`, {
            method: "POST",
            body: JSON.stringify({ message, tree: nextTree.sha, parents: [parentSha] }),
        }),
        "Création du commit impossible",
    );
    await responseJson(
        await githubRequest(`/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
            method: "PATCH",
            body: JSON.stringify({ sha: nextCommit.sha, force: false }),
        }),
        "Mise à jour de la branche impossible",
    );
}
