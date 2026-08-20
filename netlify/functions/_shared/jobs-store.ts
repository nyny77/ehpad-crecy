import { connectLambda, getStore } from "@netlify/blobs";
import fallbackData from "../../../src/lib/data/jobs.json";
import type { JobsData } from "../../../src/lib/job-types";

const STORE_NAME = "ehpad-crecy-recruitment";
const STORE_KEY = "jobs";

export async function readJobs(event: unknown): Promise<JobsData> {
    connectLambda(event as Parameters<typeof connectLambda>[0]);
    const stored = await getStore(STORE_NAME).get(STORE_KEY, { type: "json" }) as JobsData | null;
    return stored || fallbackData as JobsData;
}

export async function writeJobs(event: unknown, data: JobsData): Promise<void> {
    connectLambda(event as Parameters<typeof connectLambda>[0]);
    await getStore(STORE_NAME).setJSON(STORE_KEY, data);
}

