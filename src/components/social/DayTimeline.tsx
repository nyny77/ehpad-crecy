"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sun, Coffee, Utensils, Moon, Music, BookOpen } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

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
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Ligne qui se dessine au scroll (plus fluide)
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section className="section-padding bg-cream-50 relative overflow-hidden" ref={containerRef}>
            {/* Éléments décoratifs de fond animés (Breathing Effect) */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 w-64 h-64 bg-terracotta-200/20 rounded-full blur-[80px]"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-40 right-10 w-80 h-80 bg-forest-200/20 rounded-full blur-[100px]"
            />

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 bg-terracotta-100 text-terracotta-600 rounded-full text-sm font-semibold mb-4 border border-terracotta-200">Au quotidien</span>
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
                    {/* Règle temporelle (Graduated Line) - Desktop Only */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 hidden xl:flex flex-col justify-between py-12 pointer-events-none z-0">
                        {/* Ligne verticale de fond */}
                        <div className="absolute right-0 top-0 bottom-0 w-px bg-terracotta-200" />

                        {/* Ligne de progression (remplissage) */}
                        <motion.div
                            className="absolute right-0 top-0 w-[3px] bg-terracotta-500 origin-top translate-x-[1px]"
                            style={{ scaleY }}
                        />

                        {/* Graduations */}
                        {Array.from({ length: 13 }).map((_, i) => {
                            const hour = 8 + i; // 8h à 20h
                            return (
                                <div key={hour} className="relative flex items-center justify-end w-full pr-4 h-0">
                                    <span className="text-xs font-bold text-terracotta-300 font-serif mr-2">{hour}h</span>
                                    {/* Tiret */}
                                    <div className="absolute right-0 w-3 h-px bg-terracotta-300" />
                                </div>
                            );
                        })}
                    </div>

                    {/* Ligne centrale animée (connecteur des cartes) */}
                    <motion.div
                        className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-terracotta-300 via-forest-300 to-charcoal-300 -translate-x-1/2 hidden md:block rounded-full origin-top opacity-30"
                        style={{ scaleY }}
                    />

                    <div className="space-y-24 relative">
                        {EVENTS.map((event, index) => (
                            <div
                                key={index}
                                className={`flex flex-col md:flex-row gap-8 items-center ${event.side === "right" ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Contenu avec image */}
                                <motion.div
                                    className="flex-1 w-full md:w-1/2"
                                    initial={{ opacity: 0, x: event.side === 'left' ? -50 : 50, rotate: event.side === 'left' ? -2 : 2 }}
                                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 50,
                                        damping: 20,
                                        delay: 0.1
                                    }}
                                >
                                    <motion.div
                                        className="relative bg-white rounded-[2rem] shadow-xl border border-white/50 overflow-hidden group hover:shadow-2xl transition-all duration-500"
                                        whileHover={{ y: -8, scale: 1.02 }}
                                    >
                                        {/* Image watercolor */}
                                        <div className="relative h-56 md:h-64 overflow-hidden">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            {/* Overlay gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />

                                            {/* Badge horaire flottant */}
                                            <motion.div
                                                className={`absolute top-4 left-4 px-5 py-2 ${event.badgeColor} text-white rounded-2xl text-sm font-bold shadow-lg backdrop-blur-sm bg-opacity-90`}
                                                whileHover={{ scale: 1.1, rotate: -2 }}
                                            >
                                                {event.time}
                                            </motion.div>
                                        </div>

                                        {/* Contenu texte */}
                                        <div className="p-8 pt-4">
                                            <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-3 group-hover:text-terracotta-600 transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-charcoal-600 leading-relaxed text-lg">
                                                {event.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* Point central avec icône */}
                                <div className="relative z-10 flex-shrink-0">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        whileInView={{ scale: 1, rotate: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: 0.2
                                        }}
                                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${event.color}`}
                                        whileHover={{ scale: 1.2, rotate: 15 }}
                                    >
                                        {event.icon}
                                    </motion.div>

                                    {/* Pulse effect constant */}
                                    <div className="absolute inset-0 -z-10">
                                        <span className={`absolute inset-0 rounded-full ${event.color.split(' ')[0]} animate-ping opacity-20`}></span>
                                    </div>
                                </div>

                                {/* Espace vide pour l'équilibre */}
                                <div className="flex-1 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
