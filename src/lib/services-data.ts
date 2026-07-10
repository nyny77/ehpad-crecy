// Extended service data with full descriptions for detail pages
export const SERVICES_EXTENDED = [
    {
        id: "direction",
        title: "La direction multisite",
        subtitle: "Pilotage & Vision stratégique",
        shortDescription: "La directrice multisite coordonne l'ensemble des activités avec une vision stratégique et humaine.",
        fullDescription: `La directrice multisite de l'EHPAD de Crécy assure le pilotage stratégique de l'établissement avec une vision à la fois globale et attentive aux détails du quotidien. Elle garantit la cohérence du projet d'établissement et veille au respect des valeurs qui nous unissent.

Son rôle est de coordonner l'ensemble des services, d'impulser une dynamique d'amélioration continue et de maintenir des liens étroits avec les familles, les partenaires et les autorités de tutelle. Elle est garante de la qualité de l'accompagnement proposé aux résidents.

Accessible et à l'écoute, elle accorde une importance particulière à la communication avec les équipes et les familles. Sa présence régulière et son implication personnelle contribuent à maintenir un climat de confiance et de sérénité au sein de l'établissement.`,
        highlights: [
            "Vision stratégique",
            "Coordination multisite",
            "Projet d'établissement",
            "Valeurs humaines",
        ],
        image: "/images/services/direction.png",
        imagePosition: "object-[50%_20%]",
        detailImage: "/images/services/direction.png",
        dailyRoutine: [
            { time: "08:30", activity: "Point avec les équipes encadrantes" },
            { time: "10:00", activity: "Visite de l'établissement" },
            { time: "11:00", activity: "Gestion budgétaire et administrative" },
            { time: "14:00", activity: "Rencontres familles et résidents" },
            { time: "16:00", activity: "Réunions projets et partenaires" },
        ],
        skills: ["Management", "Gestion financière", "Vision stratégique", "Communication", "Leadership"],
        quote: "Diriger un EHPAD, c'est orchestrer une partition humaine où chaque note compte pour l'harmonie générale."
    },
    {
        id: "hotelier",
        title: "L'agent hôtelier",
        subtitle: "Confort & Cadre de vie",
        shortDescription: "Un cadre de vie impeccable et accueillant au quotidien.",
        fullDescription: `L'agent hôtelier de l'EHPAD de Crécy œuvre chaque jour pour offrir aux résidents un cadre de vie agréable et confortable. Il est le gardien de la propreté et du bien-être quotidien.

Du nettoyage des chambres à l'entretien des espaces communs, chaque geste est accompli avec soin et attention. Son objectif : que chaque résident se sente chez lui, dans un environnement propre, ordonné et accueillant.

Au-delà de ses missions d'entretien, il est présent auprès des résidents. Son passage quotidien est l'occasion d'un bonjour, d'un sourire, d'un échange. Il contribue ainsi à l'atmosphère chaleureuse de l'établissement.`,
        highlights: [
            "Entretien quotidien",
            "Hygiène irréprochable",
            "Cadre accueillant",
            "Présence bienveillante",
        ],
        image: "/images/services/hotelier.png",
        detailImage: "/images/services/hotelier.png",
        imagePosition: "object-right",
        dailyRoutine: [
            { time: "08:00", activity: "Bio-nettoyage des chambres" },
            { time: "10:30", activity: "Entretien des parties communes" },
            { time: "12:00", activity: "Service du déjeuner en salle" },
            { time: "14:00", activity: "Remise en ordre de la salle à manger" },
            { time: "15:00", activity: "Nettoyage approfondi périodique" },
        ],
        skills: ["Hygiène", "Rigueur", "Discrétion", "Respect de l'intimité", "Ponctualité"],
        quote: "Un environnement propre et sain est la base du bien-être des résidents."
    },
    {
        id: "animation",
        title: "Coordinatrice de la vie sociale",
        subtitle: "Activités variées et stimulantes",
        shortDescription: "Des activités adaptées pour le bien-être et l'épanouissement de chacun.",
        fullDescription: `La vie sociale est au cœur du projet de l'EHPAD de Crécy. L'animatrice coordinatrice, soutenue par une équipe de bénévoles dévoués et une équipe pluridisciplinaire, propose un programme riche et varié d'activités.

Chaque semaine, elle invite les résidents à participer à des ateliers créatifs, des jeux de société, des séances de gymnastique douce, des concerts, des sorties... Ces moments de partage contribuent à maintenir le lien social et stimulent les capacités cognitives et physiques.

Elle organise également des événements festifs tout au long de l'année : fêtes de saison, anniversaires, spectacles... Ces célébrations rythment la vie de l'établissement et créent des souvenirs précieux.`,
        highlights: [
            "Ateliers créatifs et manuels",
            "Animations musicales",
            "Jeux de société et quiz",
            "Sorties et événements",
        ],
        image: "/images/services/animatrice.png",
        imagePosition: "object-[50%_20%]",
        detailImage: "/images/services/animatrice.png",
        dailyRoutine: [
            { time: "09:30", activity: "Revue de presse et discussion" },
            { time: "10:30", activity: "Atelier mémoire ou gymnastique douce" },
            { time: "12:00", activity: "Déjeuner convivial" },
            { time: "14:30", activity: "Grande animation (Loto, Chant, Cinéma...)" },
            { time: "16:30", activity: "Goûter et fin des activités" },
        ],
        skills: ["Créativité", "Dynamisme", "Écoute", "Adaptabilité", "Organisation"],
        quote: "L'animation, c'est mettre de la vie dans les jours, quand on ne peut plus ajouter de jours à la vie."
    },
    {
        id: "psychologue",
        title: "Le psychologue",
        subtitle: "Écoute & Accompagnement émotionnel",
        shortDescription: "Le psychologue accompagne les résidents et leurs familles dans les moments de vie importants.",
        fullDescription: `Le psychologue de l'EHPAD de Crécy offre un espace d'écoute bienveillant et confidentiel aux résidents, à leurs familles et aux équipes. Son rôle est essentiel dans l'accompagnement des transitions et des moments de vie parfois difficiles.

Il intervient auprès des résidents pour les aider à s'adapter à leur nouvelle vie, à maintenir leur estime de soi et à traverser les épreuves du quotidien. Il anime également des groupes de parole et des ateliers thérapeutiques favorisant le bien-être émotionnel.

Auprès des familles, il propose un soutien dans les moments de questionnement, lors de l'entrée en établissement ou face à l'évolution de l'état de santé de leur proche. Il les aide à maintenir un lien serein et à traverser ensemble les étapes du vieillissement.`,
        highlights: [
            "Écoute bienveillante",
            "Accompagnement des familles",
            "Groupes de parole",
            "Soutien émotionnel",
        ],
        image: "/images/services/psychologue.png",
        detailImage: "/images/services/psychologue.png",
        dailyRoutine: [
            { time: "09:00", activity: "Entretiens individuels résidents" },
            { time: "11:00", activity: "Atelier mémoire ou groupe de parole" },
            { time: "13:30", activity: "Réunion d'équipe pluridisciplinaire" },
            { time: "15:00", activity: "Soutien aux familles" },
            { time: "16:30", activity: "Élaboration des Projets Personnalisés" },
        ],
        skills: ["Psychologie clinique", "Écoute active", "Analyse", "Empathie", "Travail d'équipe"],
        quote: "Mettre des mots sur les maux pour apaiser l'esprit et redonner du sens au quotidien."
    },
    {
        id: "technique",
        title: "Le technicien",
        subtitle: "Maintenance & Sécurité",
        shortDescription: "Une équipe dédiée à la sécurité et au bon fonctionnement de l'établissement.",
        fullDescription: `Le service technique et sécurité de l'EHPAD de Crécy veille au bon fonctionnement de l'ensemble des installations. Une équipe dédiée assure la maintenance quotidienne et le suivi technique.

Ensemble, ils veillent au bon fonctionnement de l'ensemble des installations et à la sécurité des résidents et du personnel. Leur expertise complémentaire permet de gérer efficacement la maintenance quotidienne ainsi que les projets de travaux plus importants.

Leur champ d'action est vaste : sécurité incendie, maintenance préventive et curative, entretien des espaces verts, et petits travaux de réparation. Ils garantissent ainsi un environnement sûr, aux normes et confortable pour tous.`,
        highlights: [
            "Maintenance préventive",
            "Suivi des travaux",
            "Maintenance quotidienne",
            "Sécurité des locaux",
        ],
        image: "/images/services/technique.png",
        detailImage: "/images/services/technique.png",
        detailImage2: "/images/services/tech2.png",
        dailyRoutine: [
            { time: "08:00", activity: "Tour de contrôle sécurité et chaufferie" },
            { time: "09:00", activity: "Réparations courantes dans les chambres" },
            { time: "11:00", activity: "Entretien des espaces verts" },
            { time: "14:00", activity: "Suivi des entreprises extérieures" },
            { time: "16:00", activity: "Maintenance préventive matériel" },
        ],
        skills: ["Polyvalence", "Électricité/Plomberie", "Sécurité Incendie", "Réactivité", "Bricolage"],
        quote: "Notre mission : que tout fonctionne parfaitement pour le confort et la sécurité de tous."
    },
    {
        id: "rh",
        title: "L'agent RH",
        subtitle: "Ressources Humaines & Qualité de vie au travail",
        shortDescription: "L'agent RH veille au bon climat social et à l'épanouissement de tous les collaborateurs.",
        fullDescription: `L'agent RH de l'EHPAD de Crécy joue un rôle central dans la vie de l'établissement. Il est le point de contact privilégié pour l'ensemble des collaborateurs et veille au maintien d'un climat social serein et bienveillant.

Son action s'articule autour de plusieurs missions essentielles : la gestion de la paie, le recrutement de nouveaux talents, l'accompagnement des carrières, la formation continue et le développement des compétences. Il s'assure que chaque membre de l'équipe dispose des moyens nécessaires pour exercer son métier dans les meilleures conditions.

Au-delà de la gestion administrative, il porte une attention particulière à la qualité de vie au travail. Son écoute attentive et sa disponibilité contribuent à créer un environnement où chacun se sent reconnu et valorisé.`,
        highlights: [
            "Gestion de la paie",
            "Formation continue",
            "Qualité de vie au travail",
            "Recrutement et intégration",
        ],
        image: "/images/services/rh.png",
        detailImage: "/images/services/rh.png",
        dailyRoutine: [
            { time: "09:00", activity: "Gestion des plannings et remplacements" },
            { time: "10:30", activity: "Entretiens de recrutement" },
            { time: "12:00", activity: "Paie et administration du personnel" },
            { time: "14:00", activity: "Plan de formation et carrières" },
            { time: "16:00", activity: "Écoute et dialogue social" },
        ],
        skills: ["Droit du travail", "Écoute", "Gestion administrative", "Médiation", "Organisation"],
        quote: "Prendre soin de ceux qui soignent, c'est garantir la qualité de l'accompagnement de nos aînés."
    },
    {
        id: "lingerie",
        title: "La lingère",
        subtitle: "Entretien soigné du linge",
        shortDescription: "Un service attentionné pour le linge de chaque résident.",
        fullDescription: `L'EHPAD de Crécy dispose d'une lingerie intégrée où la lingère assure l'entretien soigné du linge de chaque résident. Ce service quotidien garantit à tous un linge propre, bien repassé et toujours disponible.

Présente au quotidien, elle veille à ce que chaque vêtement soit traité avec soin. Elle connaît les préférences de chacun et apporte une attention particulière aux pièces délicates ou aux tenues préférées.

Au-delà de l'aspect pratique, la lingerie est aussi un lieu d'échanges. Les moments de distribution du linge sont l'occasion pour elle de discuter, de prendre des nouvelles. Elle joue ainsi un rôle social précieux dans la vie de l'établissement.`,
        highlights: [
            "Lavage et repassage",
            "Marquage du linge",
            "Respect des textiles",
            "Service personnalisé",
        ],
        image: "/images/services/lingerie.png",
        detailImage: "/images/services/lingerie.png",
        dailyRoutine: [
            { time: "08:00", activity: "Réception du linge sale et tri" },
            { time: "09:30", activity: "Lancement des machines" },
            { time: "11:00", activity: "Repassage et pliage soigné" },
            { time: "14:00", activity: "Distribution du linge propre en chambre" },
            { time: "15:30", activity: "Petite couture et réparations" },
        ],
        skills: ["Rigueur", "Soin du linge", "Organisation", "Couture", "Discrétion"],
        quote: "Prendre soin des vêtements, c'est prendre soin de l'identité et de la dignité de chacun."
    },
    {
        id: "admin",
        title: "L'agent administratif",
        subtitle: "Accueil, Administration & Facturation",
        shortDescription: "Un accueil chaleureux et une gestion rigoureuse des dossiers et facturations.",
        fullDescription: `L'agent administratif de l'EHPAD de Crécy, en lien avec la direction multisite et le service RH, est un pilier de notre organisation.

Bien plus qu'un simple gestionnaire, il joue un rôle central. Il assure l'interface administrative tout en veillant à la qualité de l'accueil.

Il vous accueille avec chaleur et disponibilité. De la constitution du dossier à la gestion des facturations (résidents et prestataires), il vous accompagne à chaque étape, assurant un lien fluide entre les familles, les résidents et l'établissement.`,
        highlights: [
            "Accueil personnalisé",
            "Facturation résidents & prestataires",
            "Lien avec les familles",
            "Gestion des dossiers",
        ],
        image: "/images/services/admin.png",
        detailImage: "/images/services/admin.png",
        dailyRoutine: [
            { time: "09:00", activity: "Accueil physique et téléphonique" },
            { time: "10:00", activity: "Gestion des dossiers d'admission" },
            { time: "11:30", activity: "Courrier et messagerie" },
            { time: "14:00", activity: "Facturation et comptabilité" },
            { time: "16:00", activity: "Renseignements aux familles" },
        ],
        skills: ["Organisation", "Accueil", "Bureautique", "Discrétion", "Empathie"],
        quote: "Le sourire à l'accueil est la première étape du prendre soin."
    },
    {
        id: "cuisine",
        title: "La restauration",
        subtitle: "Service hôtelier & Repas équilibrés",
        shortDescription: "Des repas savoureux et équilibrés chaque jour, servis avec attention.",
        fullDescription: `Le service de restauration de l'EHPAD de Crécy propose chaque jour des menus variés et équilibrés. Une attention particulière est portée à la qualité des repas pour garantir le plaisir gustatif de chacun.

Les menus sont élaborés pour répondre aux besoins nutritionnels de nos résidents, tout en respectant leurs goûts et leurs habitudes. Le service est effectué à l'assiette, dans une ambiance conviviale et chaleureuse.

Les régimes particuliers sont scrupuleusement suivis (textures modifiées, sans sel, diabétiques...) pour assurer la sécurité et le bien-être de tous, sans jamais négliger le plaisir de la table.`,
        highlights: [
            "Menus variés et équilibrés",
            "Service à l'assiette",
            "Respect des régimes",
            "Ambiance conviviale",
        ],
        image: "/images/services/cuisine.png",
        detailImage: "/images/services/cuisine.png",
        dailyRoutine: [
            { time: "07:00", activity: "Réception des denrées fraîches" },
            { time: "08:30", activity: "Préparation des entrées et desserts" },
            { time: "10:00", activity: "Lancement des cuissons chaudes" },
            { time: "11:30", activity: "Dressage et envoi en salle" },
            { time: "14:30", activity: "Nettoyage et préparation du dîner" },
        ],
        skills: ["Cuisine traditionnelle", "Hygiène HACCP", "Créativité", "Textures modifiées", "Rigueur"],
        quote: "La cuisine est un acte d'amour, surtout quand elle ravive les souvenirs gustatifs de nos aînés."
    },
    {
        id: "idec",
        title: "L'IDEC",
        subtitle: "Coordination des Soins & Qualité",
        shortDescription: "L'Infirmière Diplômée d'État Coordinatrice organise et supervise l'ensemble des soins.",
        fullDescription: `L'Infirmière Diplômée d'État Coordinatrice (IDEC) de l'EHPAD de Crécy est la pierre angulaire de l'organisation des soins. Elle coordonne l'ensemble des interventions médicales et paramédicales pour garantir une prise en charge optimale de chaque résident.

Son expertise lui permet d'élaborer et de suivre les protocoles de soins, de superviser les équipes infirmières et aides-soignantes, et d'assurer la liaison avec les médecins traitants et spécialistes. Elle veille à la qualité et à la continuité des soins 24h/24.

L'IDEC est également l'interlocutrice privilégiée des familles pour toutes les questions relatives à la santé de leur proche. Elle organise les réunions de coordination, participe aux projets de soins personnalisés et garantit le respect des bonnes pratiques professionnelles.`,
        highlights: [
            "Coordination des soins",
            "Protocoles médicaux",
            "Liaison avec les familles",
            "Qualité des soins",
        ],
        image: "/images/services/idec.png",
        detailImage: "/images/services/idec.png",
        dailyRoutine: [
            { time: "08:00", activity: "Transmissions avec l'équipe de nuit" },
            { time: "09:00", activity: "Supervision des soins et planification" },
            { time: "11:00", activity: "Visite avec les médecins" },
            { time: "14:00", activity: "Gestion des admissions et sorties" },
            { time: "16:00", activity: "Rencontres familles et projets de soins" },
        ],
        skills: ["Management d'équipe", "Organisation", "Expertise soins", "Pédagogie", "Rigueur"],
        quote: "Coordonner les soins, c'est garantir que chaque résident reçoive l'attention juste et nécessaire au bon moment."
    },
    {
        id: "soignants",
        title: "La soignante",
        subtitle: "Aides-soignants & Accompagnement quotidien",
        shortDescription: "Notre équipe soignante accompagne chaque résident au quotidien.",
        fullDescription: `Notre équipe soignante constitue le cœur de l'EHPAD de Crécy. Composée d'aides-soignants dévoués, elle accompagne chaque résident au quotidien avec professionnalisme et bienveillance.

En lien étroit avec le médecin traitant de chaque résident, notre équipe assure un suivi personnalisé et attentif. Nous collaborons également avec les hôpitaux, spécialistes et professionnels libéraux de la région pour garantir une prise en charge complète.

Nos aides-soignants sont présents 24h/24, de jour comme de nuit, pour accompagner les gestes du quotidien : toilette, repas, déplacements... Leur présence constante et leur écoute attentive contribuent au bien-être et à la sérénité de chacun.`,
        highlights: [
            "Présence 24h/24, 7j/7",
            "Suivi médical personnalisé",
            "Coordination avec médecins traitants",
            "Collaboration avec spécialistes",
        ],
        image: "/images/services/soignants.png",
        detailImage: "/images/services/soignants.png",
        dailyRoutine: [
            { time: "07:00", activity: "Transmissions et début des toilettes" },
            { time: "08:30", activity: "Aide au petit-déjeuner en chambre ou salle" },
            { time: "10:00", activity: "Soins de confort et nursing" },
            { time: "12:00", activity: "Aide au repas du midi" },
            { time: "14:00", activity: "Transmissions équipe d'après-midi" },
            { time: "15:00", activity: "Animations et goûter" },
            { time: "18:30", activity: "Aide au repas du soir et couchers" },
        ],
        skills: ["Empathie", "Patience", "Gestes de soins", "Travail d'équipe", "Observation"],
        quote: "Chaque sourire d'un résident est une victoire, chaque geste de confort est notre mission.",
        training: "Diplôme d'État d'Aide-Soignant (DEAS)"
    },
    {
        id: "infirmiere",
        title: "L'infirmière",
        subtitle: "Soins infirmiers & Suivi médical",
        shortDescription: "Nos infirmières assurent la coordination des soins 24h/24.",
        fullDescription: `L'équipe infirmière de l'EHPAD de Crécy joue un rôle central dans la qualité des soins prodigués à nos résidents. Nos infirmières diplômées d'État assurent une coordination rigoureuse des soins, garantissant un suivi médical optimal.

Elles sont le lien essentiel entre les résidents, leurs familles et l'ensemble de l'équipe médicale. Leur expertise permet d'anticiper les besoins, d'adapter les traitements et de réagir rapidement en cas de nécessité.

Au-delà des soins techniques, nos infirmières apportent une présence rassurante et une écoute attentive. Elles prennent le temps d'expliquer, de rassurer et d'accompagner chaque résident dans son parcours de santé.`,
        highlights: [
            "Coordination des soins 24h/24",
            "Administration des traitements",
            "Suivi des constantes",
            "Lien avec les familles",
        ],
        image: "/images/services/infirmiere.png",
        detailImage: "/images/services/infirmiere.png",
        dailyRoutine: [
            { time: "06:45", activity: "Transmissions et préparation des traitements" },
            { time: "08:00", activity: "Tour des soins, pansements, injections" },
            { time: "11:00", activity: "Visite avec les médecins" },
            { time: "12:00", activity: "Distribution des médicaments" },
            { time: "14:00", activity: "RDV familles et transmissions" },
            { time: "16:00", activity: "Gestion des urgences et surveillance" },
        ],
        skills: ["Technicité", "Rigueur", "Relationnel", "Gestion de l'urgence", "Coordination"],
        quote: "Soigner, c'est aussi écouter, rassurer et prendre soin de l'autre dans sa globalité.",
        training: "Diplôme d'État d'Infirmier (IDE)"
    },
    {
        id: "bienetre",
        title: "La coiffeuse",
        subtitle: "Bien-être & Moments de détente",
        shortDescription: "Des moments privilégiés pour prendre soin de soi.",
        fullDescription: `Le salon de coiffure, ouvert une fois par semaine, est un espace dédié au bien-être. La coiffeuse vous accueille dans une ambiance chaleureuse et apaisante, où chaque résident peut prendre soin de lui et se faire chouchouter.

Ces moments sont précieux : ils permettent de préserver sa coquetterie, de maintenir une image positive de soi et de retrouver des habitudes réconfortantes du passé. C'est aussi l'occasion d'échanges privilégiés, de confiances partagées avec la coiffeuse.

Au-delà de l'aspect esthétique, elle participe au maintien des liens sociaux. Elle offre un lieu de vie où l'on prend le temps, où l'on écoute, où l'on partage un moment de complicité.`,
        highlights: [
            "Présence hebdomadaire",
            "Coupe et coiffage",
            "Moment de détente privilégié",
            "Échanges et écoute",
        ],
        image: "/images/services/bienetre.png",
        detailImage: "/images/services/bienetre.png",
        dailyRoutine: [
            { time: "09:00", activity: "Ouverture du salon et accueil" },
            { time: "09:15", activity: "Coupes et mises en plis" },
            { time: "11:30", activity: "Rangement du salon" },
            { time: "14:00", activity: "Visites en chambre pour les moins mobiles" },
            { time: "16:00", activity: "Derniers soins et discussions" },
        ],
        skills: ["Coiffure", "Douceur", "Écoute active", "Patience", "Esthétique"],
        quote: "Se sentir beau, c'est se sentir vivant. La coiffure est un soin de l'estime de soi."
    },
    {
        id: "kine",
        title: "La Kiné",
        subtitle: "Rééducation & Maintien de la mobilité",
        shortDescription: "Des séances adaptées pour maintenir mobilité et autonomie.",
        fullDescription: `La kinésithérapeute joue un rôle essentiel dans le maintien de l'autonomie des résidents. Elle intervient sur prescription médicale pour rééduquer, soulager et préserver les capacités physiques.

Chaque prise en charge est personnalisée et adaptée aux capacités et objectifs de chacun. Elle propose des séances pouvant inclure des exercices de mobilisation, des massages, des soins antalgiques ou du renforcement musculaire.

Elle travaille en étroite collaboration avec l'équipe soignante et médicale. Cette coordination permet d'assurer une continuité des soins et d'optimiser les résultats de la rééducation.`,
        highlights: [
            "Rééducation personnalisée",
            "Maintien de la mobilité",
            "Prévention des chutes",
            "Soulagement des douleurs",
        ],
        image: "/images/services/kine.png",
        imagePosition: "object-top",
        detailImage: "/images/services/kine.png",
        dailyRoutine: [
            { time: "09:00", activity: "Prise en charge individuelle en chambre" },
            { time: "11:00", activity: "Aide à la marche dans les étages" },
            { time: "14:00", activity: "Rééducation et maintien de l'autonomie" },
            { time: "15:30", activity: "Séances individuelles en chambre" },
        ],
        skills: ["Anatomie", "Pédagogie", "Douceur", "Rééducation", "Psychologie"],
        quote: "Le mouvement, c'est la vie. Mon but est d'aider chacun à conserver son autonomie le plus longtemps possible."
    },
    {
        id: "medecins",
        title: "Les médecins",
        subtitle: "Suivi Médical & Médecins traitants",
        shortDescription: "Les résidents conservent leur médecin traitant pour leur suivi médical.",
        fullDescription: `Chaque résident conserve le libre choix de son médecin traitant. Ce dernier assure le suivi médical régulier au sein de l'établissement, en étroite collaboration avec l'équipe soignante.

Les médecins traitants interviennent pour les consultations, les renouvellements d'ordonnances et le suivi des pathologies. Ils sont les interlocuteurs privilégiés des familles concernant la santé des résidents.

Cette organisation permet de maintenir une relation de confiance établie de longue date et garantit une continuité des soins respectueuse des habitudes de chacun.`,
        highlights: [
            "Libre choix du médecin",
            "Suivi par médecin traitant",
            "Continuité des soins",
            "Collaboration équipe soignante",
        ],
        image: "/images/services/medecins.png",
        detailImage: "/images/services/medecins.png",
        dailyRoutine: [
            { time: "Variable", activity: "Visites hebdomadaires planifiées" },
            { time: "Sur demande", activity: "Consultations d'urgence" },
            { time: "Coordination", activity: "Échanges avec l'IDEC et les infirmiers" },
            { time: "Dossier", activity: "Mise à jour du dossier médical informatisé" },
            { time: "Familles", activity: "Information aux proches si nécessaire" },
        ],
        skills: ["Médecine générale", "Gériatrie", "Écoute", "Disponibilité", "Coordination"],
        quote: "La médecine en EHPAD, c'est avant tout une médecine de proximité et de continuité."
    },
    {
        id: "benevoles",
        title: "Les bénévoles",
        subtitle: "Solidarité & Moments de partage",
        shortDescription: "Nos bénévoles apportent leur temps et leur sourire pour créer des moments de partage et de convivialité.",
        fullDescription: `Les bénévoles de l'EHPAD de Crécy sont des acteurs précieux de la vie sociale de l'établissement. Ils donnent de leur temps avec générosité pour apporter aux résidents des moments de partage, de convivialité et de chaleur humaine.

Leurs interventions sont variées : accompagnement lors de sorties, animation d'ateliers créatifs ou de jeux de société, lectures, discussions... Ils créent des liens uniques avec les résidents, leur offrant une présence amicale et généreuse qui enrichit leur quotidien.

Formés et accompagnés par l'équipe d'animation, les bénévoles s'intègrent harmonieusement dans le projet de vie de l'établissement. Leur engagement est une source d'enrichissement mutuel : ils apportent autant qu'ils reçoivent de ces échanges intergénérationnels.`,
        highlights: [
            "Présence chaleureuse",
            "Animations variées",
            "Lien social",
            "Accompagnement individuel",
        ],
        image: "/images/services/benevole.png",
        detailImage: "/images/services/benevole.png",
        dailyRoutine: [
            { time: "Après-midi", activity: "Arrivée et accueil par l'animatrice" },
            { time: "Activité", activity: "Animation d'atelier ou visites individuelles" },
            { time: "Goûter", activity: "Aide au service et partage convivial" },
            { time: "Échange", activity: "Discussion informelle avec les résidents" },
            { time: "Fin", activity: "Retour d'expérience avec l'équipe" },
        ],
        skills: ["Générosité", "Écoute", "Patience", "Bonne humeur", "Disponibilité"],
        quote: "Donner de son temps, c'est recevoir en retour des sourires inestimables."
    }
];
