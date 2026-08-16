import { EHPAD_INFO } from "@/lib/constants";

export type ChatRule = {
    id: string;
    keywords: string[];
    response: string;
    relatedLinks?: { label: string; url: string }[];
};

export const CHAT_RULES: ChatRule[] = [
    {
        id: "tarifs",
        keywords: ["prix", "tarif", "cout", "coût", "combien", "payer", "hébergement", "hebergement", "chambre"],
        response: "Les tarifs d'hébergement sont d'environ 69€ par jour pour une chambre simple. Ce tarif comprend le logement, les repas et l'animation. Pour un devis précis selon votre dépendance (GIR), je vous invite à consulter notre page Tarifs.",
        relatedLinks: [{ label: "Voir les tarifs détaillés", url: "/admissions#tarifs" }]
    },
    {
        id: "visite",
        keywords: ["visite", "voir", "rencontrer", "rendez-vous", "rdv", "horaire", "venir"],
        response: "Vous pouvez venir visiter l'EHPAD sur rendez-vous. Nous organisons des visites personnalisées pour vous faire découvrir les chambres et les lieux de vie. N'hésitez pas à nous contacter pour fixer une date.",
        relatedLinks: [{ label: "Prendre rendez-vous", url: "/contact" }, { label: "Visite Virtuelle", url: "/visite" }]
    },
    {
        id: "animaux",
        keywords: ["animaux", "chien", "chat", "animal"],
        response: "Oui, nous acceptons les animaux de compagnie sous certaines conditions (carnet de vaccination à jour, capacité du résident à s'en occuper). C'est important pour nous que vous vous sentiez comme à la maison.",
    },
    {
        id: "restauration",
        keywords: ["manger", "repas", "cuisine", "nourriture", "menu", "cantine"],
        response: "Notre chef prépare tous les repas sur place avec des produits frais. Les menus sont validés par une diététicienne et s'adaptent aux régimes spécifiques (sans sel, texture modifiée...). Les familles peuvent aussi venir déjeuner !",
        relatedLinks: [{ label: "Voir le Blog", url: "/blog" }]
    },
    {
        id: "admission",
        keywords: ["inscription", "dossier", "entrée", "inscrire", "place", "disponible"],
        response: "Pour une demande d'admission, le plus simple est de remplir le dossier via Trajectoire ou de nous contacter directement. Nous avons parfois des places disponibles rapidement.",
        relatedLinks: [{ label: "En savoir plus sur l'Admission", url: "/admissions" }]
    },
    {
        id: "recrutement",
        keywords: ["emploi", "travail", "poste", "stage", "recrutement", "candidature", "embauche"],
        response: "Nous recrutons régulièrement du personnel soignant et hôtelier. Vous pouvez consulter nos offres ou envoyer une candidature spontanée via la page Recrutement.",
        relatedLinks: [{ label: "Espace Recrutement", url: "/recrutement" }]
    },
    {
        id: "contact",
        keywords: ["téléphone", "mail", "email", "adresse", "contact", "joindre", "appel"],
        response: `Vous pouvez nous joindre au ${EHPAD_INFO.phone} ou via notre formulaire de contact. Les horaires détaillés sont disponibles sur la page Contact.`,
        relatedLinks: [{ label: "Nous contacter", url: "/contact" }]
    },
    {
        id: "hello",
        keywords: ["bonjour", "salut", "hello", "coucou", "hého", "aide"],
        response: "Bonjour ! Je suis l'assistant virtuel de l'EHPAD. Je peux répondre à vos questions sur les tarifs, les visites, la vie quotidienne ou les admissions. Que souhaitez-vous savoir ?",
    }
];

export const FALLBACK_MESSAGE = "Je n'ai pas bien compris votre question. Essayez avec des mots clés simples comme 'tarifs', 'visite', 'repas' ou 'recrutement'. Vous pouvez aussi nous appeler directement.";
