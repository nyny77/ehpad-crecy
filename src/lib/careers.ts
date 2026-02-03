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
    title: "Envie de nous rejoindre ?",
    description: "Votre profil ne correspond pas aux offres ci-dessus ?\nNous sommes toujours à la recherche de talents : aides-soignants, ASH, animateurs, cuisiniers... Venez découvrir un établissement à taille humaine où il fait bon travailler !",
    cta: "Déposer ma candidature"
};
