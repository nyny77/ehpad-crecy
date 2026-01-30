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
    heroImage: "/images/global-hero.jpg",
};

// Services et équipe - Descriptions améliorées depuis le site Wix
export const SERVICES = [
    {
        id: "soignants",
        title: "La soignante",
        subtitle: "Aides-soignants & Accompagnement",
        description: "Notre équipe soignante accompagne chaque résident au quotidien, avec professionnalisme et bienveillance. Une présence rassurante 24h/24 pour tous les gestes de la vie quotidienne.",
        image: "/images/services/soignants.png",
    },
    {
        id: "infirmiere",
        title: "L'infirmière",
        subtitle: "Soins infirmiers & Suivi médical",
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
        title: "La restauration",
        subtitle: "Service hôtelier & Repas équilibrés",
        description: "Le service de restauration propose chaque jour des menus variés et équilibrés, servis à l'assiette. Nous respectons scrupuleusement les régimes tout en préservant le plaisir de la table.",
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
        title: "L'agente administrative",
        subtitle: "Accueil, Administration & Facturation",
        description: "L'agente administrative vous accueille et vous accompagne dans toutes vos démarches (dossiers, facturations résidents & prestataires) avec bienveillance et efficacité.",
        image: "/images/services/admin.png",
    },
    {
        id: "technique",
        title: "Le technicien",
        subtitle: "Maintenance & Sécurité",
        description: "Le service technique assure la sécurité et la maintenance de l'établissement. Une équipe dédiée veille au bon fonctionnement des installations au quotidien.",
        image: "/images/services/technique.png",
    },
    {
        id: "hotelier",
        title: "L'agent hôtelier",
        subtitle: "Confort au quotidien",
        description: "L'agent de service hospitalier veille chaque jour à maintenir un cadre de vie impeccable. Son attention aux détails crée une atmosphère confortable et accueillante.",
        image: "/images/services/hotelier.png",
    },
    {
        id: "rh",
        title: "La Responsable RH",
        subtitle: "Ressources Humaines",
        description: "La responsable RH veille au bon climat social, gère la paie et accompagne les carrières. Elle participe activement à la qualité de vie au travail de tous les collaborateurs.",
        image: "/images/services/rh.png",
    },
    {
        id: "direction",
        title: "La direction multisite",
        subtitle: "Pilotage & Vision",
        description: "La directrice multisite coordonne l'ensemble des activités avec une vision stratégique et humaine. Elle garantit la cohérence du projet d'établissement et le respect des valeurs qui nous unissent.",
        image: "/images/services/direction.png",
    },
    {
        id: "psychologue",
        title: "Le psychologue",
        subtitle: "Écoute & Accompagnement",
        description: "Le psychologue accompagne les résidents et leurs familles dans les moments de vie importants. Il offre un espace d'écoute bienveillant et contribue au bien-être émotionnel de chacun.",
        image: "/images/services/psychologue.png",
    },
    {
        id: "idec",
        title: "L'IDEC",
        subtitle: "Coordination des Soins",
        description: "L'Infirmière Diplômée d'État Coordinatrice (IDEC) organise et supervise l'ensemble des soins. Elle assure la liaison entre les équipes, les familles et les médecins pour une prise en charge optimale.",
        image: "/images/services/idec.png",
    },
    {
        id: "medecins",
        title: "Les médecins",
        subtitle: "Suivi Médical",
        description: "Les médecins assurent le suivi médical des résidents en collaboration avec leur médecin traitant. Ils interviennent régulièrement pour garantir une prise en charge médicale de qualité.",
        image: "/images/services/medecins.png",
    },
    {
        id: "benevoles",
        title: "Les bénévoles",
        subtitle: "Solidarité & Partage",
        description: "Nos bénévoles apportent leur temps et leur sourire pour animer des activités, accompagner les résidents et créer des moments de partage et de convivialité au quotidien.",
        image: "/images/services/benevoles.png",
    },
];

// Navigation
export const NAV_LINKS = [
    { href: "/", label: "Accueil" },
    { href: "/histoire", label: "Notre Ville" },
    { href: "/equipe", label: "Notre Équipe" },
    { href: "/galerie", label: "Galerie Photos" },
    { href: "/vie-sociale", label: "Vie Sociale" },
    { href: "/admissions", label: "Admissions" },
    { href: "/hebergement", label: "Hébergement" },
    { href: "/recrutement", label: "Recrutement" },
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
