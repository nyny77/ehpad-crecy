import jobsData from "@/lib/data/jobs.json";
import { JOB_FACILITIES, type JobOffer, type JobsData } from "@/lib/job-types";

export type { JobOffer, JobsData } from "@/lib/job-types";
export { JOB_FACILITIES } from "@/lib/job-types";

const facilityOrder = new Map(JOB_FACILITIES.map((facility, index) => [facility.id, index]));
export const ALL_CAREERS_OFFERS = (jobsData as JobsData).offers;
export const CAREERS_OFFERS: JobOffer[] = ALL_CAREERS_OFFERS
    .filter((offer) => offer.status === "published")
    .sort((a, b) => (facilityOrder.get(a.facilityId) ?? 99) - (facilityOrder.get(b.facilityId) ?? 99)
        || String(b.publishedAt || b.createdAt).localeCompare(String(a.publishedAt || a.createdAt)));
export const JOBS_LAST_SYNC_AT = (jobsData as JobsData).lastFhfSyncAt;

export const SPONTANEOUS_APPLICATION = {
    title: "Envie de nous rejoindre ?",
    description: "Votre profil ne correspond pas aux offres ci-dessus ?\nNous sommes toujours à la recherche de talents : aides-soignants, ASH, animateurs, cuisiniers... Venez découvrir un établissement à taille humaine où il fait bon travailler !",
    cta: "Déposer ma candidature"
};
