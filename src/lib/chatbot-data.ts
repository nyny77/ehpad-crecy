
export interface ChatRule {
    id: string;
    keywords: string[];
    response: string;
    links?: { text: string; url: string }[];
}

export const CHAT_KNOWLEDGE_BASE: ChatRule[] = [
    {
        id: "tarifs",
        keywords: ["tarif", "prix", "coût", "combien", "payer", "facture", "ash", "apl"],
        response: "Nos tarifs d'hébergement commencent à environ 60€/jour (habilité à l'Aide Sociale). Le tarif dépend du type de chambre (simple/double) et de vos droits aux aides (ASH, APA, APL). Voulez-vous voir la grille détaillée ?",
        links: [{ text: "Voir les tarifs", url: "/hebergement" }]
    },
    {
        id: "admission",
        keywords: ["admission", "inscription", "dossier", "place", "disponible", "entrer", "venir"],
        response: "Pour faire une demande d'admission, tout se passe sur le site national ViaTrajectoire. C'est simple et sécurisé. Nous pouvons vous accompagner dans cette démarche si besoin.",
        links: [{ text: "Faire une demande (ViaTrajectoire)", url: "https://trajectoire.sante-ra.fr/GrandAge/Pages/Public/AccesEtablissement.aspx?FINESS=770701050" }, { text: "Infos Admissions", url: "/admissions" }]
    },
    {
        id: "recrutement",
        keywords: ["recrutement", "emploi", "travail", "poste", "stage", "job", "embauche", "infirmiere", "soignant", "cuisine"],
        response: "Nous recrutons régulièrement ! Nous offrons les avantages de la FPH (Fonction Publique Hospitalière), le CGOS, et nous sommes à 15 min du Val d'Europe. Vous pouvez consulter nos offres ou déposer une candidature spontanée.",
        links: [{ text: "Voir les offres", url: "/recrutement" }]
    },
    {
        id: "contact",
        keywords: ["contact", "téléphone", "telephone", "tel", "mail", "email", "adresse", "joindre", "appeler"],
        response: "Vous pouvez nous joindre au 01 64 63 82 62 ou par email à accueil@ehpad-crecy.fr. Nous sommes situés au 18 rue de la Chapelle, 77580 Crécy-la-Chapelle.",
        links: [{ text: "Page Contact", url: "/contact" }]
    },
    {
        id: "visite",
        keywords: ["visite", "horaire", "voir", "famille", "venir", "ouverture"],
        response: "Les visites sont libres, nous recommandons généralement de venir entre 11h et 19h pour le confort des résidents. L'accueil administratif est ouvert du lundi au vendredi de 9h à 17h.",
    },
    {
        id: "animation",
        keywords: ["animation", "activité", "sortie", "loisir", "vie sociale"],
        response: "La vie sociale est très riche ici ! Ateliers mémoire, gym douce, chorale, sorties au marché... Nous avons une animatrice à temps plein et des bénévoles engagés.",
        links: [{ text: "Découvrir la Vie Sociale", url: "/vie-sociale" }]
    },
    {
        id: "soins",
        keywords: ["soin", "medecin", "médecin", "infirmiere", "psy", "kine"],
        response: "Notre équipe médicale est complète : médecin coordonnateur, infirmières 24h/24, psychologue, kinésithérapeute et psychomotricienne intervenants. Votre médecin traitant peut bien sûr continuer à vous suivre.",
        links: [{ text: "Notre Équipe", url: "/equipe" }]
    },
    {
        id: "repas",
        keywords: ["repas", "manger", "cuisine", "nourriture", "menu", "cantine"],
        response: "Les repas sont préparés sur place par nos chefs ! C'est une cuisine familiale, adaptée aux régimes, servie à l'assiette au restaurant. Les familles peuvent venir déjeuner sur réservation.",
    }
];

export const DEFAULT_RESPONSE = "Je ne suis pas sûr d'avoir compris. Je peux vous renseigner sur les tarifs, les admissions, le recrutement ou la vie à l'EHPAD. Essayez avec des mots simples comme 'tarifs' ou 'emploi'.";

export const GREETINGS = [
    "Bonjour ! Je suis l'assistant virtuel de l'EHPAD. Comment puis-je vous aider ?",
    "Bienvenue ! Une question sur nos tarifs ou nos disponibilités ?",
    "Bonjour, je suis là pour répondre à vos questions sur notre maison."
];
