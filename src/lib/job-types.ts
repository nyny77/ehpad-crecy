export const JOB_FACILITIES = [
    { id: "crecy", name: "EHPAD de Crécy", city: "Crécy-la-Chapelle" },
    { id: "le-marais", name: "EHPAD Le Marais", city: "La Ferté-Gaucher" },
    { id: "saint-aile", name: "EHPAD Saint Aile", city: "Rebais" },
    { id: "pierre-comby", name: "EHPAD Pierre Comby", city: "Rozay-en-Brie" },
] as const;

export type JobFacilityId = (typeof JOB_FACILITIES)[number]["id"];
export type JobStatus = "pending" | "published" | "hidden" | "ignored";

export interface JobOffer {
    id: string;
    source: "fhf" | "manual";
    sourceUrl?: string;
    sourceActive?: boolean;
    facilityId: JobFacilityId;
    facilityName: string;
    city: string;
    title: string;
    contract: string;
    description: string;
    requirements: { req: string }[];
    publishedAt?: string;
    deadline?: string;
    status: JobStatus;
    createdAt: string;
    updatedAt: string;
    sourceSeenAt?: string;
}

export interface JobsData {
    offers: JobOffer[];
    lastFhfSyncAt?: string;
}
