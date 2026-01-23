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
            className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-cream-100"
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
                className="relative z-10 container-custom text-center px-4 pt-20"
            >
                {/* Badge/Subtitle */}
                {subtitle && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6 border border-cream-200"
                    >
                        <span className="text-sm font-medium text-terracotta-600 uppercase tracking-wide">
                            {subtitle}
                        </span>
                    </motion.div>
                )}

                {/* Titre principal */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-glow font-serif text-4xl md:text-5xl lg:text-6xl font-bold !text-white mb-6 mx-auto leading-tight drop-shadow-sm"
                >
                    {title}
                </motion.h1>

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
