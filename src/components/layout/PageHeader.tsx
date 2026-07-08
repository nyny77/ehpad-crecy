"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useTime, Variants } from "framer-motion";
import WaveSeparator from "@/components/ui/WaveSeparator";

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

// Composant pour animer le titre mot par mot (sans coupure en milieu de mot)
function AnimatedTitle({ children }: { children: React.ReactNode }) {
    const text = typeof children === 'string' ? children : String(children);
    const words = text.split(' ');

    let letterIndex = 0;

    return (
        <span className="inline-flex flex-wrap justify-center gap-x-3 md:gap-x-4">
            {words.map((word, wordIdx) => {
                const letters = word.split('');
                const wordStart = letterIndex;
                letterIndex += letters.length + 1; // +1 for the space

                return (
                    <span key={wordIdx} className="whitespace-nowrap inline-flex">
                        {letters.map((letter, i) => (
                            <motion.span
                                key={i}
                                custom={wordStart + i}
                                variants={letterVariants}
                                initial="hidden"
                                animate="visible"
                                style={{ display: 'inline-block' }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </span>
                );
            })}
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
                    className="absolute rounded-full bg-gradient-to-br from-terracotta-500/60 to-forest-500/60"
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
                        opacity: [0.6, 1, 0.6],
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
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    // Fade out effect on scroll (quick fade at start)
    const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.25], [0, -30]);

    const time = useTime();

    return (
        <section
            ref={containerRef}
            className="page-header-section relative flex items-center justify-center min-h-[100vh] overflow-hidden bg-cream-50"
            style={{ perspective: "1000px" }}
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
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

                {/* Effet de fondu sur les bords (Vignette) */}
                <div className="absolute inset-y-0 left-0 w-16 md:w-32 lg:w-64 bg-gradient-to-r from-cream-50 via-cream-50/80 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 lg:w-64 bg-gradient-to-l from-cream-50 via-cream-50/80 to-transparent pointer-events-none" />
            </motion.div>

            {/* Particules décoratives */}
            <FloatingParticles />

            {/* Contenu avec effet 3D tilt + fade on scroll */}
            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="relative z-10 container-custom text-center px-4"
            >
                <div className="relative inline-block group">
                    {/* Pulsing Background Glow */}
                    <motion.div
                        className="absolute inset-0 bg-terracotta-500/30 blur-3xl rounded-full"
                        animate={{
                            scale: [0.8, 1.1, 0.8],
                            opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Container Glassmorphism lumineux avec flottement continu */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}
                        transition={{
                            opacity: { duration: 1, ease: [0.215, 0.61, 0.355, 1] },
                            scale: { duration: 1, ease: [0.215, 0.61, 0.355, 1] }
                        }}
                        className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl max-w-2xl mx-auto overflow-hidden group"
                    >
                        {/* Lueurs chaudes internes */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-terracotta-200/40 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-forest-200/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        {/* Shine Effect Periodique */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                            initial={{ x: "-100%" }}
                            animate={{ x: "200%" }}
                            transition={{
                                repeat: Infinity,
                                repeatDelay: 5,
                                duration: 2,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Badge/Subtitle */}
                        {subtitle && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="inline-block mb-5 relative z-10"
                            >
                                <span className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-terracotta-600 uppercase tracking-[0.15em] px-3 py-1.5 bg-gradient-to-r from-terracotta-100/80 to-forest-100/80 rounded-full border border-terracotta-200/50 shadow-sm">
                                    <motion.span
                                        className="w-2 h-2 rounded-full bg-terracotta-500"
                                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    {subtitle}
                                    <motion.span
                                        className="w-2 h-2 rounded-full bg-forest-500"
                                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                    />
                                </span>
                            </motion.div>
                        )}

                        {/* Titre principal avec effet de vague */}
                        <h1
                            className="relative z-10 font-serif text-3xl md:text-4xl font-bold mx-auto leading-tight mb-4 w-full text-charcoal-900"
                            style={{
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                            }}
                        >
                            <AnimatedTitle>{title}</AnimatedTitle>
                        </h1>

                        {/* Ligne décorative avec effet de glow */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{
                                scaleX: 1,
                                boxShadow: [
                                    "0 0 10px rgba(64, 64, 74, 0.3), 0 0 20px rgba(64, 64, 74, 0.2)",
                                    "0 0 20px rgba(64, 64, 74, 0.6), 0 0 40px rgba(64, 64, 74, 0.4)",
                                    "0 0 10px rgba(64, 64, 74, 0.3), 0 0 20px rgba(64, 64, 74, 0.2)"
                                ]
                            }}
                            transition={{
                                scaleX: { duration: 1, delay: 0.8, ease: "easeOut" },
                                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="relative z-10 w-24 h-1 bg-gradient-to-r from-[#85002A] via-[#C80040] to-[#FF85A3] mx-auto rounded-full mb-6"
                        />

                        {/* Description */}
                        {description && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                                className="relative z-10 text-base md:text-lg text-charcoal-700 max-w-xl mx-auto font-serif italic leading-relaxed"
                            >
                                {typeof description === 'string' ? <p>{description}</p> : description}
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Children */}
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

            {/* Indicateur de scroll */}
            <motion.div
                className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
            >
                <motion.div
                    className="w-8 h-12 rounded-full border-2 border-charcoal-500/50 flex items-start justify-center p-2 bg-white/30 backdrop-blur-sm"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1.5 h-3 bg-charcoal-700 rounded-full"
                        animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>

            {/* Vague de séparation */}
            <div className="absolute bottom-0 left-0 w-full z-20">
                <WaveSeparator position="bottom" className="text-cream-100" />
            </div>
        </section>
    );
}
