"use client";

import React, { useRef } from "react";
import Image from "@/components/ui/OptimizedImage";
import LazyVideo from "@/components/ui/LazyVideo";
import { motion, useScroll, useTransform } from "framer-motion";

const LOCATIONS = [
    {
        id: "eau",
        title: "L'Eau : L'Âme de Crécy",
        subtitle: "Une ville tissée par la rivière",
        description: "La première chose qui vous frappera à Crécy, c'est la présence apaisante de l'eau. Au fil des siècles, les habitants ont creusé de petits canaux, appelés ici des « brassets ». C'est une ville où il fait bon écouter le clapotis de l'eau.",
        quote: "La Venise Briarde",
        image: "/images/history/canal.jpg",
        size: "large",
        theme: "charcoal"
    },
    {
        id: "beffroi",
        title: "Le Beffroi",
        subtitle: "Une silhouette unique",
        description: "Sa base massive en pierre est le vestige d'une tour de défense du XIIe siècle, surmontée d'une tour plus fine en briques rouges ajoutée en 1874.",
        quote: "Symbole de la ville",
        image: "/images/history/tour.jpg",
        size: "vertical",
        theme: "terracotta"
    },
    {
        id: "marche",
        title: "Cœur de Ville",
        subtitle: "Vivant et paisible",
        description: "Un centre-ville à taille humaine avec ses commerces de proximité, son marché traditionnel et son ambiance de village convivial.",
        image: "/images/history/marche.jpg",
        size: "vertical",
        theme: "sage"
    },
    {
        id: "peintres",
        title: "Vallée des Peintres",
        subtitle: "Terre d'inspiration",
        description: "Des maîtres comme Corot ou Altmann y ont posé leur chevalet, charmés par les reflets changeants du Grand Morin et la douceur des paysages briards.",
        image: "/images/history/peintre.jpg",
        size: "large",
        theme: "forest"
    },
    {
        id: "collegiale",
        title: "La Collégiale",
        subtitle: "Chef-d'œuvre gothique",
        description: "Elle veille sur la ville depuis des siècles. Ce joyau du 13ème siècle est lumineux, élégant et inspire la sérénité.",
        quote: "Un repère de paix",
        image: "/images/history/collegiale.png",
        size: "large",
        theme: "charcoal"
    },
    {
        id: "hospice",
        title: "L'Hospice & l'École",
        subtitle: "Une double vocation",
        description: "L'histoire de notre établissement est riche. Construit comme Hospice en 1868, il accueillait aussi une école primaire tenue par des bonnes sœurs où des générations d'enfants ont grandi.",
        image: "/images/history/hospice-ecole.jpg",
        size: "wide",
        theme: "terracotta"
    }
];

// Helper pour les tailles
const getSizeClasses = (size: string) => {
    switch (size) {
        case "large": return "md:col-span-2 md:row-span-2";
        case "vertical": return "md:col-span-1 md:row-span-2";
        case "wide": return "lg:col-span-4 md:col-span-2 md:row-span-2";
        default: return "md:col-span-1 md:row-span-2";
    }
};

// Helper pour les couleurs
const getThemeColors = (theme: string) => {
    switch (theme) {
        case "terracotta": return "bg-terracotta-900/90 text-white border-terracotta-400";
        case "forest": return "bg-forest-900/90 text-white border-forest-400";
        case "sage": return "bg-sage-900/90 text-white border-sage-400";
        case "charcoal": return "bg-charcoal-900/90 text-white border-charcoal-400";
        default: return "bg-charcoal-900/90 text-white border-charcoal-400";
    }
};

export default function HistoirePage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <main className="min-h-screen bg-cream-100 relative overflow-hidden" ref={containerRef}>
            <div className="container-custom pt-48 md:pt-64 pb-32 relative z-10">
                
                {/* Hero Section - Postcard Style */}
                <motion.div 
                    initial={{ opacity: 0, y: 50, rotate: -2 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-[12px] border-white relative mb-24 mt-16 md:mt-24"
                >
                    {/* Timbre décoratif */}
                    <div className="absolute top-6 right-6 w-16 h-20 bg-cream-200 border-2 border-dashed border-terracotta-300 rounded-sm flex flex-col items-center justify-center transform rotate-6 opacity-80 select-none">
                        <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-widest">Crécy</span>
                        <svg className="w-6 h-6 text-terracotta-400 mt-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/></svg>
                    </div>

                    <div className="text-center relative z-10">
                        <motion.h1 
                            className="font-serif text-5xl md:text-7xl font-bold text-charcoal-900 mb-6 drop-shadow-sm"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Notre Ville
                        </motion.h1>
                        
                        <div className="w-24 h-1 bg-gradient-to-r from-terracotta-400 to-sage-400 mx-auto rounded-full mb-8" />
                        
                        <p className="font-serif text-2xl md:text-3xl text-terracotta-600 italic mb-6 leading-relaxed">
                            "Vous allez bientôt poser vos valises..."
                        </p>
                        
                        <p className="text-lg md:text-xl text-charcoal-600 leading-relaxed max-w-2xl mx-auto">
                            Oubliez le tumulte des grandes villes. Ici, vous arrivez dans un <strong>havre de paix</strong>, chargé d'histoire et bercé par l'eau. Bienvenue dans la Venise Briarde.
                        </p>
                    </div>

                    {/* Décoration "Scribble" */}
                    <svg className="absolute bottom-4 left-10 w-24 h-12 text-sage-200 opacity-60 pointer-events-none" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 25 Q 25 5, 50 25 T 95 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </motion.div>

                {/* Bento Grid Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px] max-w-6xl mx-auto">
                    {LOCATIONS.map((loc, index) => (
                        <motion.div
                            key={loc.id}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 80, 
                                damping: 20, 
                                delay: index * 0.1 
                            }}
                            className={`relative rounded-3xl overflow-hidden group shadow-xl ${getSizeClasses(loc.size)}`}
                        >
                            {/* Background Image */}
                            <Image
                                src={loc.image}
                                alt={loc.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Always visible bottom gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent opacity-80" />
                            
                            {/* Default State Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transform transition-transform duration-500 group-hover:translate-y-full">
                                <h3 className="text-2xl md:text-3xl font-serif font-bold !text-white mb-1 drop-shadow-md">
                                    {loc.title}
                                </h3>
                                <p className="text-cream-100 font-medium text-sm md:text-base uppercase tracking-widest">
                                    {loc.subtitle}
                                </p>
                            </div>

                            {/* Hover Reveal Overlay (Glassmorphism) */}
                            <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-xl overflow-y-auto ${getThemeColors(loc.theme)}`}>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileHover={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="my-auto"
                                >
                                    <h3 className="text-2xl font-serif font-bold mb-4 drop-shadow-md border-b-2 border-current pb-2 inline-block !text-white">
                                        {loc.title}
                                    </h3>
                                    <p className="text-base md:text-lg leading-relaxed mb-4 text-white">
                                        {loc.description}
                                    </p>
                                    {loc.quote && (
                                        <p className="font-serif italic text-white/90">
                                            "{loc.quote}"
                                        </p>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Video Section */}
                <motion.div
                    id="videos"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto mt-24 px-4 scroll-mt-32"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-charcoal-900 mb-6">
                            Découvrez Crécy-la-Chapelle
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-terracotta-400 to-sage-400 mx-auto rounded-full mb-6" />
                        <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
                            Plongez dans l'atmosphère unique de la Venise Briarde à travers ce reportage et cette balade au fil de l'eau.
                        </p>
                    </div>
                    
                    <div className="flex justify-center">
                        {/* Vidéo locale (portrait) */}
                        <div className="w-full max-w-[320px] mx-auto">
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-white p-2 border-[6px] border-cream-200 aspect-[9/16] group transform transition-transform hover:scale-[1.02] duration-500">
                                {/* Encoche "Notch" décorative */}
                                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                                    <div className="w-28 h-6 bg-cream-200 rounded-b-2xl pointer-events-none"></div>
                                </div>
                                <LazyVideo 
                                    type="local"
                                    src="/videos/balade-crecy.mp4"
                                    mobileSrc="/videos/balade-crecy-mobile.mp4"
                                    poster="/images/history/canal.jpg"
                                    title="Balade au fil de l'eau"
                                    captionsSrc="/videos/balade-crecy.fr.vtt"
                                    className="rounded-[2rem]"
                                />
                                {/* Titre sous la vidéo */}
                                <div className="absolute bottom-6 left-0 right-0 z-20 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-charcoal-800 shadow-lg border border-white/50">
                                        Balade au fil de l'eau
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <details className="mx-auto mt-8 max-w-4xl rounded-2xl border border-charcoal-500 bg-white p-6 text-charcoal-700 shadow-soft">
                        <summary className="cursor-pointer font-bold text-charcoal-900">Lire la transcription de la balade au fil de l’eau</summary>
                        <div className="mt-5 space-y-4 leading-relaxed">
                            <p>Crécy-la-Chapelle est une petite ville de Seine-et-Marne nichée dans une boucle du Grand Morin. Avec un peu plus de 4 700 habitants, elle est traversée par l’eau et entourée de verdure, ce qui lui vaut le surnom de « Venise de la Brie ».</p>
                            <p>À l’origine, Crécy-en-Brie et La Chapelle-sous-Crécy étaient deux communes séparées. Elles ont fusionné en 1972. La ville, marquée par le Moyen Âge, ses remparts, ses foires et ses échanges, se trouvait entre Champagne et domaine royal. Le Grand Morin faisait tourner les moulins, permettait de laver les peaux et de transporter les marchandises.</p>
                            <p>La collégiale Notre-Dame de l’Assomption est un joyau gothique dont la voûte est portée par douze ogives. L’église Saint-Georges fut reconstruite au XVIIIe siècle dans le domaine du château, à l’initiative du duc de Penthièvre.</p>
                            <p>Crécy est aussi une ville d’art, fréquentée notamment par Corot, Dunoyer de Segonzac et Altmann. Autour du centre se trouvent cinq hameaux : Mongrolle, Montbarbin, Férolles, Libernon et Serbonne.</p>
                            <p>Le Moulin Jaune, jardin onirique créé par Slava Polunin, est classé Jardin remarquable. Le Grand Morin invite également au canoë-kayak, à la marche et au VTT. Crécy-la-Chapelle est présentée comme une ville à taille humaine, médiévale et vivante, où l’eau et la nature imposent un autre rythme.</p>
                        </div>
                    </details>
                </motion.div>

                {/* Final Call to Action Block */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 mb-12 bg-white p-8 md:p-12 rounded-[3rem] shadow-soft text-center max-w-3xl mx-auto border-4 border-cream-200 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-terracotta-50/50 to-sage-50/50" />
                    
                    <div className="relative z-10">
                        <h3 className="text-3xl font-serif bg-gradient-to-r from-terracotta-500 to-sage-500 bg-clip-text text-transparent mb-6 font-bold">
                            Prêt à découvrir Crécy ?
                        </h3>
                        <p className="text-charcoal-600 mb-8 text-lg md:text-xl">
                            Crécy-la-Chapelle est une ville qui prend soin de ses habitants. Nous espérons que ce petit aperçu vous a plu !
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-terracotta-500 !text-white rounded-full font-bold hover:bg-terracotta-600 hover:scale-105 transition-all shadow-md hover:shadow-lg">
                                Venir visiter la résidence
                            </a>
                            <a href="https://www.crecylachapelle.eu/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-white !text-charcoal-800 border-2 border-cream-300 rounded-full font-bold hover:border-terracotta-400 hover:!text-terracotta-500 transition-colors">
                                Site de la Mairie
                            </a>
                        </div>
                    </div>
                </motion.div>
                
            </div>
        </main>
    );
}
