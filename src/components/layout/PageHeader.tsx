"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: string;
    description?: React.ReactNode;
    image?: string;
    alt?: string;
    children?: React.ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    description,
    image = "/images/global-hero.jpg",
    alt = "En-tête de page",
    children,
}: PageHeaderProps) {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-cream-100"
        >
            {/* Image de fond avec parallax */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Overlays pour lisibilité - Plus léger pour mieux voir le dessin */}
                <div className="absolute inset-0 bg-gradient-to-b from-cream-100/30 via-transparent to-cream-100/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-cream-100/90 via-transparent to-transparent" />
            </motion.div>

            {/* Contenu */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 container-custom text-center px-4 pt-32 pb-12"
            >
                {/* Container Glassmorphism global pour l'en-tête */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="inline-block bg-white/40 backdrop-blur-md border border-white/40 rounded-3xl p-8 md:p-10 mb-8 shadow-2xl max-w-4xl mx-auto"
                >
                    {/* Badge/Subtitle */}
                    {subtitle && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-block mb-4"
                        >
                            <span className="text-sm md:text-base font-semibold text-terracotta-700 uppercase tracking-wider">
                                {subtitle}
                            </span>
                        </motion.div>
                    )}

                    {/* Titre principal */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-900 mx-auto leading-tight drop-shadow-sm"
                    >
                        {title}
                    </motion.h1>
                </motion.div>

                {description && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-charcoal-700 max-w-2xl mx-auto mb-8 bg-white/40 backdrop-blur-sm rounded-2xl px-6 py-4"
                    >
                        {typeof description === 'string' ? <p>{description}</p> : description}
                    </motion.div>
                )}

                {/* Children / Extra content */}
                {children && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        {children}
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
