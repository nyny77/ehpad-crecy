import jobsData from "@/lib/data/jobs.json";

export interface JobOffer {
    id: string;
    title: string;
    contract: string;
    description: string;
    requirements: { req: string }[];
}

export const CAREERS_OFFERS: JobOffer[] = (jobsData.offers as unknown) as JobOffer[];

export const SPONTANEOUS_APPLICATION = {
    title: "Candidature Spontanée",
    description: "Votre profil ne correspond pas aux offres ci-dessus ?\nNous sommes toujours à la recherche de talents (ASH, animateur, personnel de cuisine...). N'hésitez pas à nous envoyer votre CV.",
    cta: "Envoyer une candidature spontanée"
};
