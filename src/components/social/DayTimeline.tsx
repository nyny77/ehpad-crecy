"use client";

import { motion } from "framer-motion";
import { Sun, Coffee, Utensils, Moon, Music, BookOpen } from "lucide-react";

const EVENTS = [
    {
        time: "08h00",
        title: "Réveil en douceur & Petit déjeuner",
        description: "Un réveil personnalisé respectant le rythme de chacun, suivi d'un petit déjeuner gourmand servi en chambre ou en salle de restauration.",
        icon: <Sun className="w-6 h-6" />,
        color: "bg-terracotta-100 text-terracotta-600",
        side: "left"
    },
    {
        time: "10h30",
        title: "Ateliers & Activités",
        description: "Stimulation cognitive, gym douce, revue de presse... Des moments d'échange et de maintien de l'autonomie.",
        icon: <BookOpen className="w-6 h-6" />,
        color: "bg-forest-100 text-forest-600",
        side: "right"
    },
    {
        time: "12h30",
        title: "Déjeuner du Chef",
        description: "Une cuisine faite maison, savoureuse et équilibrée, servie à l'assiette dans notre restaurant convivial.",
        icon: <Utensils className="w-6 h-6" />,
        color: "bg-terracotta-100 text-terracotta-600",
        side: "left"
    },
    {
        time: "15h00",
        title: "Vie Sociale & Animations",
        description: "Lotos, chorale, jeux de société, sorties... L'après-midi est dédié au partage et à la détente.",
        icon: <Music className="w-6 h-6" />,
        color: "bg-forest-100 text-forest-600",
        side: "right"
    },
    {
        time: "16h30",
        title: "Goûter Gourmand",
        description: "Le moment plaisir de la journée avec pâtisseries maison et boissons chaudes.",
        icon: <Coffee className="w-6 h-6" />,
        color: "bg-terracotta-100 text-terracotta-600",
        side: "left"
    },
    {
        time: "19h00",
        title: "Dîner & Soirée Calme",
        description: "Un repas léger suivi d'une soirée apaisante pour préparer une bonne nuit de sommeil.",
        icon: <Moon className="w-6 h-6" />,
        color: "bg-charcoal-100 text-charcoal-600",
        side: "right"
    }
];

export default function DayTimeline() {
    return (
        <section className="section-padding bg-cream-50 relative overflow-hidden">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <span className="text-terracotta-500 font-medium">Au quotidien</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 mt-2">
                        Une journée type à la résidence
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Ligne centrale */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-terracotta-200 via-forest-200 to-charcoal-200 -translate-x-1/2 hidden md:block" />

                    <div className="space-y-12 relative">
                        {EVENTS.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row gap-8 items-center ${event.side === "right" ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Contenu */}
                                <div className="flex-1 w-full md:w-1/2 text-center md:text-left">
                                    <div className={`p-6 bg-white rounded-2xl shadow-card border border-cream-100 hover:shadow-warm transition-shadow duration-300 relative group`}>
                                        {/* Petite flèche */}
                                        <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-cream-100 ${event.side === "left" ? "-right-2 border-l-0 border-t-[1px] border-r-[1px] border-b-0" : "-left-2 border-r-0 border-b-[1px]"
                                            } `} style={{ borderColor: 'inherit' }} />
                                        {/* Correction CSS flèche rapide : je vais faire simple sans flèche complexe pour éviter bugs visuels */}

                                        <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.color.replace('text-', 'bg-').replace('100', '500').replace('600', 'white text-white')}`}>
                                                {event.time}
                                            </span>
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-charcoal-600 text-sm leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Point central avec icône */}
                                <div className="relative z-10 flex-shrink-0">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${event.color}`}>
                                        {event.icon}
                                    </div>
                                </div>

                                {/* Espace vide pour l'équilibre */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
