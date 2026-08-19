"use client";

import { motion } from "framer-motion";
import { Sun, Coffee, Utensils, Moon, Music, BookOpen } from "lucide-react";
import Image from "@/components/ui/OptimizedImage";

const EVENTS = [
    {
        step: 1,
        time: "08h00",
        title: "Réveil & Petit déjeuner",
        description: "Un réveil personnalisé respectant le rythme de chacun, suivi d'un petit déjeuner gourmand servi en chambre.",
        icon: <Sun className="w-5 h-5" />,
        badgeBg: "bg-terracotta-600 text-white",
        iconBg: "bg-terracotta-50 text-terracotta-600",
        borderAccent: "border-terracotta-200",
        image: "/images/timeline/reveil.png",
    },
    {
        step: 2,
        time: "10h30",
        title: "Ateliers & Activités",
        description: "Stimulation cognitive, gym douce, revue de presse... Des moments d'échange et de maintien de l'autonomie.",
        icon: <BookOpen className="w-5 h-5" />,
        badgeBg: "bg-forest-600 text-white",
        iconBg: "bg-forest-50 text-forest-600",
        borderAccent: "border-forest-200",
        image: "/images/timeline/activites.png",
    },
    {
        step: 3,
        time: "12h30",
        title: "Déjeuner du Chef",
        description: "Une cuisine savoureuse et équilibrée élaborée sur place, servie à l'assiette en salle de restaurant.",
        icon: <Utensils className="w-5 h-5" />,
        badgeBg: "bg-terracotta-600 text-white",
        iconBg: "bg-terracotta-50 text-terracotta-600",
        borderAccent: "border-terracotta-200",
        image: "/images/timeline/dejeuner.png",
    },
    {
        step: 4,
        time: "15h00",
        title: "Vie Sociale & Animations",
        description: "Lotos, chorale, jeux de société, rencontres intergénérationnelles... Un après-midi dédié au partage.",
        icon: <Music className="w-5 h-5" />,
        badgeBg: "bg-forest-600 text-white",
        iconBg: "bg-forest-50 text-forest-600",
        borderAccent: "border-forest-200",
        image: "/images/timeline/vie-sociale.png",
    },
    {
        step: 5,
        time: "16h30",
        title: "Goûter Gourmand",
        description: "Un moment convivial de pause et de plaisir avec pâtisseries fraîches et boissons chaudes.",
        icon: <Coffee className="w-5 h-5" />,
        badgeBg: "bg-terracotta-600 text-white",
        iconBg: "bg-terracotta-50 text-terracotta-600",
        borderAccent: "border-terracotta-200",
        image: "/images/timeline/gouter.png",
    },
    {
        step: 6,
        time: "19h00",
        title: "Dîner & Soirée Calme",
        description: "Un repas léger et équilibré suivi d'une soirée apaisante pour préparer une douce nuit de repos.",
        icon: <Moon className="w-5 h-5" />,
        badgeBg: "bg-charcoal-700 text-white",
        iconBg: "bg-charcoal-100 text-charcoal-700",
        borderAccent: "border-cream-300",
        image: "/images/timeline/diner.png",
    }
];

export default function DayTimeline() {
    return (
        <section className="section-padding bg-cream-100 relative overflow-hidden py-16 md:py-24 font-sans">
            <div className="container-custom max-w-6xl relative z-10">
                {/* En-tête de section */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 bg-terracotta-100 text-terracotta-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-terracotta-200">
                        Au quotidien
                    </span>
                    <h2
                        className="!font-sans font-bold text-charcoal-900 mb-3 tracking-tight"
                        style={{ fontSize: "28px", lineHeight: "1.3" }}
                    >
                        Une journée type à la maison
                    </h2>
                    <p className="text-sm md:text-base text-charcoal-600 leading-relaxed">
                        Le quotidien à l’EHPAD de Crécy s&apos;articule autour de repères rassurants, tout en respectant les habitudes et le rythme de chaque résident.
                    </p>
                </div>

                {/* Frise chronologique horizontale (Ruban d'étapes) - Masquée sur mobile */}
                <div className="hidden lg:block mb-10">
                    <div className="relative flex items-center justify-between max-w-4xl mx-auto">
                        {/* Ligne horizontale connectrice */}
                        <div className="absolute top-1/2 left-4 right-4 h-1 bg-cream-300 -translate-y-1/2 rounded-full -z-0" />

                        {EVENTS.map((event) => (
                            <div key={event.step} className="relative z-10 flex flex-col items-center group">
                                <div className={`w-10 h-10 rounded-full ${event.badgeBg} shadow-sm flex items-center justify-center font-bold text-xs border-2 border-white transition-transform group-hover:scale-110`}>
                                    {event.time}
                                </div>
                                <span className="text-[11px] font-semibold text-charcoal-700 mt-2 whitespace-nowrap">
                                    Étape {event.step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grille horizontale des 6 moments de la journée */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {EVENTS.map((event) => (
                        <motion.div
                            key={event.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: event.step * 0.08 }}
                            className={`bg-white rounded-2xl border ${event.borderAccent} shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group`}
                        >
                            {/* Image du moment avec badge heure intégré */}
                            <div className="relative h-44 w-full bg-cream-200 overflow-hidden shrink-0">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                {/* Heure intégrée directement sur l'image */}
                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full ${event.badgeBg} text-xs font-bold shadow-sm flex items-center gap-1.5`}>
                                    <span>{event.time}</span>
                                </div>

                                {/* Numéro d'étape */}
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs text-charcoal-700 text-xs font-bold flex items-center justify-center shadow-xs">
                                    {event.step}
                                </div>
                            </div>

                            {/* Contenu textuel */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className={`w-8 h-8 rounded-lg ${event.iconBg} flex items-center justify-center shrink-0`}>
                                            {event.icon}
                                        </div>
                                        <h3
                                            className="!font-sans font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors"
                                            style={{ fontSize: "16px", lineHeight: "1.3" }}
                                        >
                                            {event.title}
                                        </h3>
                                    </div>
                                    <p className="text-xs md:text-sm text-charcoal-600 leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
