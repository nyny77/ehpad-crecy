const { spawnSync } = require("node:child_process");

const NON_DEPLOYED_PATHS = [
    /^src\/lib\/data\/messages\.json$/,
    /^src\/lib\/data\/residents\.json$/,
];

function shouldIgnoreBuild(paths) {
    return paths.every((filePath) =>
        NON_DEPLOYED_PATHS.some((pattern) => pattern.test(filePath.replaceAll("\\", "/")))
    );
}

function main() {
    const previousCommit = process.env.CACHED_COMMIT_REF;
    const currentCommit = process.env.COMMIT_REF;
    if (!previousCommit || !currentCommit) {
        console.log("[build-ignore] Variables de commit non définies, build autorisé.");
        return 1;
    }
    if (previousCommit === currentCommit) {
        console.log(`[build-ignore] Rebuild manuel ou même commit (${currentCommit.slice(0, 7)}), build autorisé.`);
        return 1;
    }

    const result = spawnSync(
        "git",
        ["diff", "--name-only", "--diff-filter=ACDMRTUXB", previousCommit, currentCommit, "--"],
        { encoding: "utf8" },
    );
    if (result.error || result.status !== 0) {
        console.log("[build-ignore] Erreur lors de git diff, build autorisé par précaution.");
        return 1;
    }

    const paths = result.stdout.split(/\r?\n/).filter(Boolean);
    if (paths.length === 0) {
        console.log("[build-ignore] Aucun chemin détecté dans le diff, build autorisé.");
        return 1;
    }

    const shouldIgnore = shouldIgnoreBuild(paths);
    console.log(`[build-ignore] ${paths.length} fichier(s) modifié(s). Décision: ${shouldIgnore ? "IGNORER" : "CONSTRUIRE"}`);
    return shouldIgnore ? 0 : 1;
}

if (require.main === module) {
    process.exitCode = main();
}

module.exports = { shouldIgnoreBuild };
