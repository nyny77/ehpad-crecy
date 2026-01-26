"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { EHPAD_INFO } from "@/lib/constants";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    // Animation des mots du slogan
    const sloganWords = EHPAD_INFO.slogan.split(" ");

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream-50"
        >
            {/* Image de fond avec parallax */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <Image
                    src={EHPAD_INFO.heroImage}
                    alt="EHPAD de Crécy"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Overlays pour lisibilité - Plus chaud/gold */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-tr from-terracotta-500/20 via-transparent to-cream-50/30 mix-blend-overlay" />
            </motion.div>

            {/* Contenu */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 container-custom text-center px-4 pt-20"
            >
                {/* Container Glassmorphism pour le titre et slogan */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-block bg-white/40 backdrop-blur-md border border-white/40 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl max-w-5xl mx-auto"
                >
                    {/* Titre principal */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-charcoal-900 mb-6 leading-tight drop-shadow-sm"
                    >
                        {EHPAD_INFO.name}
                    </motion.h1>

                    {/* Slogan avec animation mot par mot */}
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                        {sloganWords.map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.6 + index * 0.1,
                                    ease: "easeOut",
                                }}
                                className="text-2xl md:text-3xl lg:text-4xl text-terracotta-800 font-serif italic drop-shadow-sm"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Description - Carte Glassmorphism plus propre */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="max-w-3xl mx-auto mb-12"
                >
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 md:p-8 shadow-xl">
                        <p className="text-lg md:text-xl text-white font-medium drop-shadow-sm leading-relaxed">
                            Un lieu de vie chaleureux au cœur de la Seine-et-Marne,<br className="hidden md:block" />
                            où chaque résident trouve sa place dans une ambiance familiale.
                        </p>
                    </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-5"
                >
                    <Link href="/contact" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-terracotta-900/20"
                        >
                            Venir nous rencontrer
                            <svg
                                className="ml-2 w-5 h-5 inline-block"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </motion.button>
                    </Link>
                    <Link href="/hebergement" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)" }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-secondary w-full sm:w-auto text-lg px-8 py-4 bg-white/90 backdrop-blur-sm border-white !text-terracotta-600 hover:!text-terracotta-700 shadow-lg"
                        >
                            Découvrir nos tarifs
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Badge élégant */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg mt-14 border border-white/50"
                >
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-forest-500"></span>
                    </span>
                    <span className="text-sm md:text-base font-semibold text-charcoal-700 tracking-wide">
                        Établissement public · {EHPAD_INFO.capacity.total} résidents
                    </span>
                </motion.div>
            </motion.div>

            {/* Indicateur de scroll */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                    <svg
                        className="w-10 h-10 drop-shadow-md"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
}
