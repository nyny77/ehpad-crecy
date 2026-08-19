import { EHPAD_INFO } from "@/lib/constants";
import { PRICING_DATA, PRICING_DATE } from "@/lib/pricing-data";

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
        response: `Le tarif d'hébergement d'une chambre simple est de ${PRICING_DATA.simple.hebergementParJour.toFixed(2).replace(".", ",")} € par jour (${PRICING_DATE}). Il comprend notamment le logement, les repas et l'animation. Pour une estimation selon votre dépendance (GIR), consultez notre simulateur.`,
        relatedLinks: [{ label: "Voir les tarifs détaillés", url: "/admissions#tarifs" }]
    },
    {
        id: "visite",
        keywords: ["visite", "voir", "rencontrer", "rendez-vous", "rdv", "horaire", "venir"],
        response: "Vous pouvez venir visiter l'EHPAD sur rendez-vous. Les visites aux résidents sont libres tous les jours, particulièrement entre 14h et 18h.",
        relatedLinks: [{ label: "Prendre rendez-vous", url: "/contact" }, { label: "Visite Virtuelle", url: "/visite" }]
    },
    {
        id: "animaux",
        keywords: ["animaux", "chien", "chat", "animal"],
        response: "Oui, nous acceptons les animaux de compagnie sous certaines conditions (carnet de vaccination à jour, capacité du résident à s'en occuper). C'est important pour nous que vous vous sentiez comme à la maison.",
    },
    {
        id: "restauration",
        keywords: ["manger", "repas", "cuisine", "nourriture", "menu", "cantine", "restaurant"],
        response: "Notre chef prépare tous les repas sur place avec des produits frais. Les menus sont savoureux, équilibrés et validés par une diététicienne.",
        relatedLinks: [{ label: "En savoir plus sur la restauration", url: "/hebergement" }]
    },
    {
        id: "admission",
        keywords: ["inscription", "dossier", "entrée", "inscrire", "place", "disponible", "admission"],
        response: "Pour une demande d'admission, le plus simple est de remplir le dossier via le portail Trajectoire ou de nous contacter directement à l'accueil.",
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
        id: "postier",
        keywords: ["postier", "courrier", "lettre", "carte", "photo", "famille", "message"],
        response: "Le service gratuit « Le Postier » permet aux proches d'envoyer un message et une photo à un résident. L'équipe d'animation l'imprime et le remet en main propre !",
        relatedLinks: [{ label: "Envoyer un courrier", url: "/familles" }]
    },
    {
        id: "histoire",
        keywords: ["histoire", "crécy", "origine", "patrimoine", "ville", "venise briarde"],
        response: "L'EHPAD de Crécy est ancré au cœur de la Venise Briarde, offrant un cadre de vie paisible, verdoyant et convivial.",
        relatedLinks: [{ label: "Découvrir notre ville & histoire", url: "/histoire" }]
    },
    {
        id: "aides",
        keywords: ["aide", "apa", "ash", "apl", "caf", "financière", "allocation"],
        response: "L'établissement est habilité à l'Aide Sociale à l'Hébergement (ASH) et conventionné pour l'APL/ALS. L'APA (Allocation Personnalisée d'Autonomie) est directement déductible selon votre GIR.",
        relatedLinks: [{ label: "Simuler mes aides et tarifs", url: "/admissions#tarifs" }]
    },
    {
        id: "hello",
        keywords: ["bonjour", "salut", "hello", "coucou", "hého", "aide"],
        response: "Bonjour ! Je suis l'assistant officiel de l'EHPAD de Crécy. Je peux répondre à toutes vos questions sur les tarifs, les admissions, la vie quotidienne ou les visites.",
    }
];

export const SUGGESTED_QUESTIONS = [
    "Quels sont les tarifs 2026 ?",
    "Quels sont les horaires de visite ?",
    "Comment envoyer une carte avec Le Postier ?",
    "Quelles sont les activités proposées ?"
];

export const FALLBACK_MESSAGE = "Je n'ai pas trouvé l'information exacte. Vous pouvez reformuler ou joindre directement notre accueil au 01 64 63 80 00.";
