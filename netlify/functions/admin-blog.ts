import type { Handler } from "@netlify/functions";
import { isAdminRequest, json } from "./_shared/admin-auth";

type BlogCategory = "activite" | "evenement" | "sortie" | "fete" | "autre";

interface ArticleInput {
    id?: string;
    title: string;
    date: string;
    category: BlogCategory;
    excerpt: string;
    image?: string | null;
    content: string;
    draft?: boolean;
}

function githubConfig() {
    const repository = process.env.GITHUB_REPOSITORY || "nyny77/ehpad-crecy";
    const [owner, repo] = repository.split("/");
    const token = process.env.GITHUB_CONTENT_TOKEN;
    if (!owner || !repo || !token) throw new Error("Configuration GitHub manquante : GITHUB_CONTENT_TOKEN");
    return { owner, repo, token, branch: process.env.GITHUB_CONTENT_BRANCH || "main" };
}

function slugify(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "article";
}

function articleMarkdown(article: ArticleInput): string {
    const frontmatter = [
        "---",
        `title: ${JSON.stringify(article.title.trim())}`,
        `date: ${JSON.stringify(new Date(article.date).toISOString())}`,
        `category: ${JSON.stringify(article.category)}`,
        `image: ${article.image ? JSON.stringify(article.image) : "null"}`,
        `excerpt: ${JSON.stringify(article.excerpt.trim())}`,
        `draft: ${article.draft === true}`,
        "---",
        "",
    ].join("\n");
    return `${frontmatter}${article.content.trim()}\n`;
}

async function githubRequest(path: string, init: RequestInit = {}) {
    const { token } = githubConfig();
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

async function getSha(owner: string, repo: string, branch: string, filePath: string): Promise<string | undefined> {
    const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
    const response = await githubRequest(`/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`);
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`GitHub : lecture impossible (${response.status})`);
    const data = await response.json() as { sha?: string };
    return data.sha;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const { owner, repo, branch } = githubConfig();
        const body = JSON.parse(event.body || "{}");
        const action = body.action || "save";

        if (action === "delete") {
            const id = String(body.id || "");
            if (!id || id.includes("..") || /[\\/]/.test(id)) return json(400, { error: "Identifiant d’article invalide" });
            const filePath = `content/articles/${id}.md`;
            const sha = await getSha(owner, repo, branch, filePath);
            if (!sha) return json(404, { error: "Article introuvable" });
            const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
            const response = await githubRequest(`/repos/${owner}/${repo}/contents/${encodedPath}`, {
                method: "DELETE",
                body: JSON.stringify({ message: `Supprime l’article ${id}`, sha, branch }),
            });
            if (!response.ok) throw new Error(`GitHub : suppression impossible (${response.status})`);
            return json(200, { success: true });
        }

        const article = body.article as ArticleInput;
        if (!article?.title?.trim() || !article.content?.trim() || !article.date) {
            return json(400, { error: "Titre, date et contenu sont obligatoires" });
        }
        const categories = new Set(["activite", "evenement", "sortie", "fete", "autre"]);
        if (!categories.has(article.category)) return json(400, { error: "Catégorie invalide" });

        const id = article.id || `${article.date.slice(0, 10)}-${slugify(article.title)}`;
        const filePath = `content/articles/${id}.md`;
        const sha = await getSha(owner, repo, branch, filePath);
        const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
        const payload: Record<string, unknown> = {
            message: `${sha ? "Met à jour" : "Publie"} l’article ${article.title.trim()}`,
            content: Buffer.from(articleMarkdown(article)).toString("base64"),
            branch,
        };
        if (sha) payload.sha = sha;

        const response = await githubRequest(`/repos/${owner}/${repo}/contents/${encodedPath}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const details = await response.text();
            throw new Error(`GitHub : publication impossible (${response.status}) ${details.slice(0, 180)}`);
        }
        return json(200, { success: true, id });
    } catch (error) {
        console.error("blog administration failed", error);
        return json(500, { error: error instanceof Error ? error.message : "Erreur de publication" });
    }
};
