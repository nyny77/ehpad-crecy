"use client";

import { motion } from "framer-motion";
import { Sun, Coffee, Utensils, Moon, Music, BookOpen } from "lucide-react";
import Image from "next/image";

const EVENTS = [
    {
        time: "08h00",
        title: "Réveil en douceur & Petit déjeuner",
        description: "Un réveil personnalisé respectant le rythme de chacun, suivi d'un petit déjeuner gourmand servi en chambre.",
        icon: <Sun className="w-6 h-6" />,
        color: "bg-terracotta-100 text-terracotta-600",
        badgeColor: "bg-terracotta-500",
        image: "/images/timeline/morning.png",
        side: "left"
    },
    {
        time: "10h30",
        title: "Ateliers & Activités",
        description: "Stimulation cognitive, gym douce, revue de presse... Des moments d'échange et de maintien de l'autonomie.",
        icon: <BookOpen className="w-6 h-6" />,
        color: "bg-forest-100 text-forest-600",
        badgeColor: "bg-forest-500",
        image: "/images/timeline/activities.png",
        side: "right"
    },
    {
        time: "12h30",
        title: "Déjeuner du Chef",
        description: "Une cuisine savoureuse et équilibrée, servie à l'assiette.",
        icon: <Utensils className="w-6 h-6" />,
        color: "bg-terracotta-100 text-terracotta-600",
        badgeColor: "bg-terracotta-500",
        image: "/images/timeline/lunch.png",
        side: "left"
    },
    {
        time: "15h00",
        title: "Vie Sociale & Animations",
        description: "Lotos, chorale, jeux de société, sorties... L'après-midi est dédié au partage et à la détente.",
        icon: <Music className="w-6 h-6" />,
        color: "bg-forest-100 text-forest-600",
        badgeColor: "bg-forest-500",
        image: "/images/timeline/social.png",
        side: "right"
    },
    {
        time: "16h30",
        title: "Goûter Gourmand",
        description: "Le moment plaisir de la journée avec pâtisseries et boissons chaudes.",
        icon: <Coffee className="w-6 h-6" />,
        color: "bg-terracotta-100 text-terracotta-600",
        badgeColor: "bg-terracotta-500",
        image: "/images/timeline/snack.png",
        side: "left"
    },
    {
        time: "19h00",
        title: "Dîner & Soirée Calme",
        description: "Un repas léger suivi d'une soirée apaisante pour préparer une bonne nuit de sommeil.",
        icon: <Moon className="w-6 h-6" />,
        color: "bg-charcoal-100 text-charcoal-600",
        badgeColor: "bg-charcoal-700",
        image: "/images/timeline/evening.png",
        side: "right"
    }
];

export default function DayTimeline() {
    return (
        <section className="section-padding bg-cream-50 relative overflow-hidden">
            {/* Éléments décoratifs de fond */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-terracotta-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-forest-200/20 rounded-full blur-3xl" />

            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 bg-terracotta-100 text-terracotta-600 rounded-full text-sm font-semibold mb-4">Au quotidien</span>
                    <h2 className="font-serif text-3xl md:text-5xl text-charcoal-900 mt-2">
                        Une journée type à la maison
                    </h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="w-24 h-1 bg-gradient-to-r from-terracotta-400 via-forest-400 to-terracotta-400 mx-auto rounded-full mt-6"
                    />
                </motion.div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Ligne centrale */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-terracotta-300 via-forest-300 to-charcoal-300 -translate-x-1/2 hidden md:block rounded-full" />

                    <div className="space-y-16 relative">
                        {EVENTS.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row gap-8 items-center ${event.side === "right" ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Contenu avec image */}
                                <div className="flex-1 w-full md:w-1/2">
                                    <motion.div
                                        className="relative bg-white rounded-3xl shadow-xl border border-cream-100 overflow-hidden group hover:shadow-2xl transition-all duration-500"
                                        whileHover={{ y: -5, scale: 1.01 }}
                                    >
                                        {/* Image watercolor */}
                                        <div className="relative h-48 md:h-56 overflow-hidden">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            {/* Overlay gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                                            {/* Badge horaire flottant */}
                                            <motion.div
                                                className={`absolute top-4 left-4 px-4 py-2 ${event.badgeColor} text-white rounded-full text-sm font-bold shadow-lg`}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {event.time}
                                            </motion.div>
                                        </div>

                                        {/* Contenu texte */}
                                        <div className="p-6 pt-2">
                                            <h3 className="font-serif text-xl md:text-2xl font-bold text-charcoal-900 mb-3">
                                                {event.title}
                                            </h3>
                                            <p className="text-charcoal-600 leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Point central avec icône */}
                                <div className="relative z-10 flex-shrink-0">
                                    <motion.div
                                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white ${event.color}`}
                                        whileHover={{ scale: 1.15, rotate: 10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {event.icon}
                                    </motion.div>
                                    {/* Pulse effect */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-full ${event.color.split(' ')[0]} opacity-40`}
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                    />
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
