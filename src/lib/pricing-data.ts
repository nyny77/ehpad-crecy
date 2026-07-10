export type RoomType = "simple" | "double";

export interface DependanceTariff {
    gir: string;
    dependance: number;
    apa: number;
}

export interface PricingPlan {
    id: RoomType;
    name: string;
    hebergementParJour: number;
    hebergementParMois: number;
    ticketModerateur: number;
    mensualite: number; // Reste à charge mensuel
    dependanceRates: DependanceTariff[];
}

export const PRICING_DATE = "Avril 2026";

export const UNDER_60_PRICING = {
    parJour: 85.36,
    parMois: 2646.16,
};

// Tarifs de dépendance communs
const COMMON_DEPENDANCE_RATES: DependanceTariff[] = [
    { gir: "GIR 1 - 2", dependance: 22.52, apa: 16.46 },
    { gir: "GIR 3 - 4", dependance: 14.29, apa: 8.23 },
    { gir: "GIR 5 - 6", dependance: 6.06, apa: 0.00 },
];

export const PRICING_DATA: Record<RoomType, PricingPlan> = {
    double: {
        id: "double",
        name: "Chambre Double",
        hebergementParJour: 63.17,
        hebergementParMois: 1958.27,
        ticketModerateur: 6.06,
        mensualite: 2146.13, // 69,23/jour
        dependanceRates: COMMON_DEPENDANCE_RATES,
    },
    simple: {
        id: "simple",
        name: "Chambre Simple",
        hebergementParJour: 69.31,
        hebergementParMois: 2148.61,
        ticketModerateur: 6.06,
        mensualite: 2336.47, // 75,37/jour
        dependanceRates: COMMON_DEPENDANCE_RATES,
    },
};

export const PRICING_INCLUDES = [
    "Les repas",
    "La fourniture et l'entretien du linge de literie et de toilette",
    "L'entretien du linge personnel des résidents",
    "La fourniture des protections",
    "Les soins donnés par le personnel de l'établissement (infirmiers, psychologue)",
    "Les animations",
];

export const PRICING_EXCLUDES = [
    "Les soins de pédicure",
    "La coiffeuse",
    "Les médicaments non remboursés",
    "Les consultations ou visites des médecins à l'extérieur",
    "Les séances de kinésithérapie",
];
