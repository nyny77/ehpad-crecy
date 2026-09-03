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
    if (!previousCommit || !currentCommit) return 1;

    const result = spawnSync(
        "git",
        ["diff", "--name-only", "--diff-filter=ACDMRTUXB", previousCommit, currentCommit, "--"],
        { encoding: "utf8" },
    );
    if (result.error || result.status !== 0) return 1;

    const paths = result.stdout.split(/\r?\n/).filter(Boolean);
    return shouldIgnoreBuild(paths) ? 0 : 1;
}

if (require.main === module) {
    process.exitCode = main();
}

module.exports = { shouldIgnoreBuild };
