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

    // Horaires
    visitingHours: {
        weekdays: "10h00 - 19h00",
        weekends: "10h00 - 19h00",
        note: "Accueil administratif : du lundi au vendredi, 9h00 - 17h00",
    },

    // Statut
    type: "public",
    socialAidEligible: true,
    aplEligible: true,

    // Images
    heroImage: "/images/hero.jpg",
};

// Services et équipe - Descriptions améliorées depuis le site Wix
export const SERVICES = [
    {
        id: "soignants",
        title: "La soignante",
        subtitle: "Aides-soignants & Médecin",
        description: "Notre équipe médicale et soignante accompagne chaque résident au quotidien, en lien étroit avec leur médecin traitant et les professionnels de santé locaux. Nous collaborons avec les hôpitaux et spécialistes pour garantir un suivi complet et personnalisé.",
        image: "/images/services/soignants.png",
    },
    {
        id: "infirmiere",
        title: "L'infirmière",
        subtitle: "Coordination des soins",
        description: "Nos infirmières assurent la coordination des soins 24h/24, garantissant un suivi médical rigoureux et rassurant. Elles sont le lien essentiel entre résidents, familles et l'ensemble de l'équipe médicale.",
        image: "/images/services/infirmiere.png",
    },
    {
        id: "animation",
        title: "L'animatrice",
        subtitle: "Activités & Loisirs",
        description: "L'animatrice coordinatrice, soutenue par des bénévoles, propose des activités variées et stimulantes. Elle contribue au bien-être et à l'épanouissement de chacun, en respectant les envies et capacités de tous.",
        image: "/images/services/animation.png",
    },
    {
        id: "cuisine",
        title: "Le cuisinier",
        subtitle: "Équipe & Responsable",
        description: "Notre équipe de cuisiniers, pilotée par une responsable cuisine, concocte chaque jour des repas variés, équilibrés et savoureux. Nous adaptons les menus aux régimes particuliers tout en préservant le plaisir de la table.",
        image: "/images/services/cuisine.png",
    },
    {
        id: "bienetre",
        title: "La coiffeuse",
        subtitle: "Bien-être & Détente",
        description: "La coiffeuse offre des moments de soin et de détente privilégiés. Ces instants permettent à chaque résident de préserver sa coquetterie, maintenir des liens sociaux et retrouver des habitudes réconfortantes.",
        image: "/images/services/bienetre.png",
    },
    {
        id: "kine",
        title: "Le kinésithérapeute",
        subtitle: "Rééducation & Mobilité",
        description: "Le kinésithérapeute intervient sur prescription pour rééduquer, soulager et maintenir les capacités physiques. Il adapte massages, exercices et soins à chacun, en coordination avec l'équipe soignante.",
        image: "/images/services/kine.png",
    },
    {
        id: "lingerie",
        title: "La lingère",
        subtitle: "Entretien du linge",
        description: "La lingère assure l'entretien soigné du linge de chaque résident. Présente au quotidien, elle joue aussi un rôle social précieux lors des échanges pendant la distribution.",
        image: "/images/services/lingerie.png",
    },
    {
        id: "admin",
        title: "L'agent administratif",
        subtitle: "Accueil, RH & Direction",
        description: "L'agent administratif, en lien avec la direction et les RH, vous accueille et vous accompagne dans toutes vos démarches avec bienveillance et efficacité.",
        image: "/images/services/admin.png",
    },
    {
        id: "technique",
        title: "Le technicien",
        subtitle: "Maintenance & Sécurité",
        description: "Piloté par un responsable technique SSIAP, chargé des travaux et des suivis, le service assure la sécurité et la maintenance de l'établissement avec un agent polyvalent.",
        image: "/images/services/technique.png",
    },
    {
        id: "hotelier",
        title: "L'agent hôtelier",
        subtitle: "Confort au quotidien",
        description: "L'agent de service hospitalier veille chaque jour à maintenir un cadre de vie impeccable. Son attention aux détails crée une atmosphère confortable et accueillante.",
        image: "/images/services/hotelier.png",
    },
];

// Navigation
export const NAV_LINKS = [
    { href: "/", label: "Accueil" },
    { href: "/vie-sociale", label: "Vie Sociale" },
    { href: "/galerie", label: "Galerie Photos" },
    { href: "/equipe", label: "Notre Équipe" },
    { href: "/hebergement", label: "Hébergement" },
    { href: "/admissions", label: "Admissions & Tarifs" },
    { href: "/recrutement", label: "Recrutement" },
    { href: "/contact", label: "Contact" },
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
