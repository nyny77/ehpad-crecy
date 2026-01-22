"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { SERVICES } from "@/lib/constants";

export default function TeamPreview() {
    const ref = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = direction === "left" ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section ref={ref} className="section-padding bg-cream-100">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-14">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-forest-500 font-medium mb-4"
                    >
                        Une équipe dévouée
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6"
                    >
                        Des professionnels au service du bien-être
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-charcoal-600 max-w-2xl mx-auto"
                    >
                        Notre équipe pluridisciplinaire travaille main dans la main
                        pour offrir un accompagnement de qualité à chaque résident.
                    </motion.p>
                </div>

                {/* Carrousel Wrapper */}
                <div className="relative group/carousel">
                    {/* Bouton Gauche */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-3 rounded-full bg-white shadow-lg text-terracotta-600 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                        aria-label="Défiler à gauche"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Zone de scroll */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {SERVICES.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                className="flex-shrink-0 w-72 md:w-80 snap-start"
                            >
                                <Link href={`/equipe/${service.id}`} className="block h-full">
                                    <div className="group h-full card-warm overflow-hidden hover:shadow-warm transition-all duration-300">
                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={service.image}
                                                alt={service.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent" />

                                            {/* Badge */}
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-terracotta-600 shadow-sm">
                                                    {service.subtitle}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Contenu */}
                                        <div className="p-6">
                                            <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-2 group-hover:text-terracotta-600 transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-charcoal-600 text-sm line-clamp-3">
                                                {service.description}
                                            </p>

                                            <div className="mt-4 flex items-center gap-2 text-terracotta-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                                En savoir plus
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bouton Droite */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-3 rounded-full bg-white shadow-lg text-terracotta-600 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110"
                        aria-label="Défiler à droite"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Indicateur visuel de scroll (mobile) */}
                <div className="flex justify-center mt-6 md:hidden text-charcoal-400 text-sm animate-pulse">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Glisser pour voir plus
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </div>

                {/* Global CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center mt-12"
                >
                    <Link href="/equipe">
                        <button className="btn-secondary">
                            Voir toute l&apos;équipe sur une page
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
