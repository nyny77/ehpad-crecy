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
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream-100"
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
                {/* Overlays pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-b from-cream-100/30 via-transparent to-cream-100/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-cream-100/90 via-transparent to-transparent" />
            </motion.div>

            {/* Contenu */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 container-custom text-center px-4 pt-20"
            >
                {/* Badge déplacé en bas */}

                {/* Titre principal */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-glow font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold !text-white mb-6 max-w-4xl mx-auto leading-tight drop-shadow-sm"
                >
                    {EHPAD_INFO.name}
                </motion.h1>

                {/* Slogan avec animation mot par mot */}
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-8 max-w-3xl mx-auto">
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
                            className="text-glow text-xl md:text-2xl lg:text-3xl !text-white font-serif italic drop-shadow-sm"
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="text-lg md:text-xl text-charcoal-700 max-w-2xl mx-auto mb-10 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4"
                >
                    Un lieu de vie chaleureux au cœur de la Seine-et-Marne,
                    où chaque résident trouve sa place dans une ambiance familiale.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/contact">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -5px rgba(193, 119, 103, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary text-lg px-8 py-4 shadow-lg"
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
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </motion.button>
                    </Link>
                    <Link href="/hebergement">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary text-lg px-8 py-4 shadow-md"
                        >
                            Découvrir nos tarifs
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Badge déplacé ici */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg mt-12 border border-cream-200"
                >
                    <span className="w-2.5 h-2.5 bg-forest-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-charcoal-700">
                        Établissement public · {EHPAD_INFO.capacity.total} résidents
                    </span>
                </motion.div>
            </motion.div>

            {/* Indicateur de scroll */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex flex-col items-center gap-2 text-charcoal-600"
                >
                    <span className="text-sm font-medium">Découvrir</span>
                    <svg
                        className="w-6 h-6"
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
