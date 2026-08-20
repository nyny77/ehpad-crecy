import fs from "node:fs/promises";
import path from "node:path";
import type { JobsData } from "../src/lib/job-types";
import { fetchFhfOffers, mergeFhfOffers } from "../netlify/functions/_shared/fhf-jobs";

async function main() {
    const jobsPath = path.resolve(process.cwd(), "src/lib/data/jobs.json");
    const current = JSON.parse(await fs.readFile(jobsPath, "utf8")) as JobsData;
    const imported = await fetchFhfOffers();
    const next = mergeFhfOffers(current, imported);
    await fs.writeFile(jobsPath, JSON.stringify(next, null, 2) + "\n", "utf8");
    console.log(`${imported.length} offre(s) des quatre EHPAD détectée(s) sur la FHF.`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
