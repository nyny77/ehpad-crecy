import type { Handler } from "@netlify/functions";
import { schedule } from "@netlify/functions";
import { fetchFhfOffers, mergeFhfOffers } from "./_shared/fhf-jobs";
import { readJobs, writeJobs } from "./_shared/jobs-store";

const syncHandler: Handler = async (event) => {
    try {
        const current = await readJobs(event);
        const imported = await fetchFhfOffers();
        await writeJobs(event, mergeFhfOffers(current, imported));
        return { statusCode: 200, body: `${imported.length} offre(s) synchronisée(s)` };
    } catch (error) {
        return { statusCode: 500, body: error instanceof Error ? error.message : "Synchronisation impossible" };
    }
};

export const handler = schedule("17 5 * * *", syncHandler);

