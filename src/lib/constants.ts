// Informations réelles de l'EHPAD de Crécy-la-Chapelle
export const EHPAD_INFO = {
    name: "EHPAD de Crécy",
    fullName: "EHPAD de Crécy-la-Chapelle",
    slogan: "L'art de bien vivre, entouré et en toute sérénité.",

    // Coordonnées
    address: {
        street: "18, rue de la Chapelle",
        postalCode: "77580",
        city: "Crécy-la-Chapelle",
        region: "Seine-et-Marne",
        country: "France",
        full: "18, rue de la Chapelle, 77580 Crécy-la-Chapelle",
    },

    phone: "01 64 63 82 62",
    email: "accueil@ehpad-crecy.fr",

    // Capacité
    capacity: {
        total: 63,
        description: "63 lits en chambres simples et doubles",
    },

    // Liens externes
    viaTrajectoireUrl: "https://trajectoire.sante-ra.fr/GrandAge/Pages/Public/AccesEtablissement.aspx?FINESS=770701050",

    // Tarifs (mis à jour 2025)
    pricing: {
        accommodation: {
            singleRoom: {
                standard: 69.31,
                socialAid: 60.63,
                label: "Chambre simple",
            },
            doubleRoom: {
                standard: 64.73,
                socialAid: 56.43,
                label: "Chambre double",
            },
        },
        dependency: {
            gir1_2: {
                rate: 22.23,
                label: "GIR 1-2",
                description: "Dépendance forte",
            },
            gir3_4: {
                rate: 14.15,
                label: "GIR 3-4",
                description: "Dépendance moyenne",
            },
            gir5_6: {
                rate: 5.98,
                label: "GIR 5-6",
                description: "Dépendance faible",
            },
        },
        lastUpdate: "2025",
    },

    // Horaires administratifs
    officeHours: {
        main: "Lun, Mar, Mer, Ven : 9h00 - 12h30 / 13h30 - 17h00",
        thursday: "Jeudi : Fermé",
    },

    // Statut
    type: "public",
    socialAidEligible: true,
    aplEligible: true,

    // Images
    heroImage: "/images/global-hero.jpg",
};

// NOTE: SERVICES data has been consolidated into src/lib/services-data.ts
// Use SERVICES_EXTENDED from services-data.ts for service information

// Navigation
export const NAV_LINKS = [
    { href: "/", label: "Accueil" },
    { href: "/histoire", label: "Notre Ville" },
    { href: "/equipe", label: "Notre Équipe" },
    { href: "/galerie", label: "Galerie Photos" },
    { href: "/vie-sociale", label: "Vie Sociale" },
    { href: "/admissions", label: "Admissions" },
    { href: "/hebergement", label: "Tarifs" },
    { href: "/recrutement", label: "Recrutement" },
    { href: "/visite", label: "Visite Virtuelle" },
];

// Valeurs de l'établissement
export const VALUES = [
    {
        title: "Bienveillance",
        description: "Un accompagnement humain et respectueux au quotidien.",
        icon: "heart",
    },
    {
        title: "Professionnalisme",
        description: "Une équipe qualifiée et formée aux meilleures pratiques.",
        icon: "star",
    },
    {
        title: "Transparence",
        description: "Des tarifs clairs et une communication ouverte avec les familles.",
        icon: "eye",
    },
    {
        title: "Vie Sociale",
        description: "Des animations et activités pour une vie riche et épanouissante.",
        icon: "users",
    },
];

// Rôles pour le formulaire d'inscription
export const SIGNUP_ROLES = [
    { value: "famille", label: "Famille de résident" },
    { value: "soignants", label: "Aide-soignante" },
    { value: "infirmiere", label: "Infirmière" },
    { value: "animation", label: "Animation" },
    { value: "cuisine", label: "Restauration" },
    { value: "bienetre", label: "Coiffure / Esthétique" },
    { value: "kine", label: "Kinésithérapeute" },
    { value: "lingerie", label: "Lingerie" },
    { value: "admin", label: "Administration" },
    { value: "technique", label: "Technique / Sécurité" },
    { value: "hotelier", label: "Agent Hôtelier" },
    { value: "rh", label: "Ressources Humaines" },
    { value: "direction", label: "Direction" },
    { value: "psychologue", label: "Psychologue" },
    { value: "idec", label: "IDEC" },
    { value: "medecins", label: "Médecin" },
    { value: "benevoles", label: "Bénévole" },
    { value: "autre", label: "Autre" },
];
