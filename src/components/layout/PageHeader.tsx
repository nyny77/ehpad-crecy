"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: string;
    description?: React.ReactNode;
    image?: string;
    alt?: string;
    children?: React.ReactNode;
}

// Animation pour chaque lettre du titre
const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            delay: i * 0.04,
            duration: 0.5,
            ease: [0.215, 0.61, 0.355, 1],
        },
    }),
};

// Composant pour animer le titre lettre par lettre
function AnimatedTitle({ children }: { children: React.ReactNode }) {
    const text = typeof children === 'string' ? children : String(children);
    const letters = text.split('');

    return (
        <span className="inline-flex flex-wrap justify-center">
            {letters.map((letter, i) => (
                <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className={letter === ' ' ? 'w-3 md:w-4' : ''}
                    style={{ display: 'inline-block' }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ))}
        </span>
    );
}

// Particules décoratives flottantes
function FloatingParticles() {
    const particles = [
        { size: 6, x: "10%", y: "20%", delay: 0, duration: 4 },
        { size: 4, x: "85%", y: "15%", delay: 1, duration: 5 },
        { size: 8, x: "75%", y: "70%", delay: 2, duration: 4.5 },
        { size: 5, x: "20%", y: "75%", delay: 0.5, duration: 5.5 },
        { size: 7, x: "50%", y: "85%", delay: 1.5, duration: 4 },
        { size: 4, x: "30%", y: "30%", delay: 2.5, duration: 5 },
        { size: 6, x: "90%", y: "50%", delay: 0.8, duration: 4.2 },
        { size: 5, x: "5%", y: "60%", delay: 1.8, duration: 5.2 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-br from-terracotta-400/40 to-forest-400/40"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: p.x,
                        top: p.y,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
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
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-cream-50"
        >
            {/* Image de fond avec parallax amélioré */}
            <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Overlays multiples pour effet de profondeur */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/50" />
                <div className="absolute inset-0 bg-gradient-to-tr from-terracotta-500/25 via-transparent to-cream-50/40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-bl from-forest-500/15 via-transparent to-transparent mix-blend-overlay" />
            </motion.div>

            {/* Particules décoratives */}
            <FloatingParticles />

            {/* Contenu */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 container-custom text-center px-4 pt-20"
            >
                {/* Container avec bordure gradient animée */}
                <div className="relative inline-block group">
                    {/* Bordure gradient animée */}
                    <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-terracotta-400 via-forest-400 to-terracotta-400 rounded-3xl opacity-60 blur-sm animate-gradient-x"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    />

                    {/* Container Glassmorphism premium */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
                        className="relative bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-8 md:p-14 shadow-2xl max-w-5xl mx-auto overflow-hidden"
                    >
                        {/* Effet de brillance interne */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/40 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-terracotta-200/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        {/* Badge/Subtitle avec effet shine */}
                        {subtitle && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="inline-block mb-5 relative"
                            >
                                <span className="relative inline-flex items-center gap-2 text-sm md:text-base font-bold text-terracotta-600 uppercase tracking-[0.2em] px-4 py-2 bg-gradient-to-r from-terracotta-100/80 to-forest-100/80 rounded-full border border-terracotta-200/50">
                                    <motion.span
                                        className="w-2 h-2 rounded-full bg-terracotta-500"
                                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    {subtitle}
                                    <motion.span
                                        className="w-2 h-2 rounded-full bg-forest-500"
                                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                    />
                                </span>
                            </motion.div>
                        )}

                        {/* Titre principal animé lettre par lettre */}
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-charcoal-900 mx-auto leading-tight mb-6 drop-shadow-sm">
                            <AnimatedTitle>{title}</AnimatedTitle>
                        </h1>

                        {/* Ligne décorative animée */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                            className="w-24 h-1 bg-gradient-to-r from-terracotta-400 via-forest-400 to-terracotta-400 mx-auto rounded-full mb-6"
                        />

                        {/* Description avec animation */}
                        {description && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                                className="text-lg md:text-xl text-charcoal-700 max-w-2xl mx-auto font-serif italic leading-relaxed"
                            >
                                {typeof description === 'string' ? <p>{description}</p> : description}
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Children / Extra content */}
                {children && (
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.8 }}
                        className="mt-8"
                    >
                        {children}
                    </motion.div>
                )}
            </motion.div>

            {/* Indicateur de scroll animé */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
            >
                <motion.div
                    className="w-8 h-12 rounded-full border-2 border-white/60 flex items-start justify-center p-2"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1.5 h-3 bg-white/80 rounded-full"
                        animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
