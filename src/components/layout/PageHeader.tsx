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
    const rotateX = useTransform(time, (t) => Math.sin(t / 2000) * 5);
    const rotateY = useTransform(time, (t) => Math.cos(t / 2500) * 5);

    return (
        <section
            ref={containerRef}
            className="page-header-section relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-cream-50"
            style={{ perspective: "1000px" }}
        >
            {/* Image de fond avec parallax */}
            <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
            </motion.div>

            {/* Particules décoratives */}
            <FloatingParticles />

            {/* Contenu avec effet 3D tilt + fade on scroll */}
            <motion.div
                style={{ rotateX, rotateY, opacity: contentOpacity, y: contentY }}
                className="relative z-10 container-custom text-center px-4 pt-32 lg:pt-28 2xl:pt-48 mt-8 lg:mt-0"
            >
                <div className="relative inline-block group">
                    {/* Container Glassmorphism lumineux */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
                        className="relative bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-8 lg:p-10 2xl:p-14 shadow-2xl max-w-5xl mx-auto overflow-hidden"
                    >
                        {/* Lueurs chaudes internes */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-terracotta-200/40 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-forest-200/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        {/* Badge/Subtitle */}
                        {subtitle && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="inline-block mb-5"
                            >
                                <span className="inline-flex items-center gap-2 text-sm md:text-base font-bold text-terracotta-600 uppercase tracking-[0.2em] px-4 py-2 bg-gradient-to-r from-terracotta-100/80 to-forest-100/80 rounded-full border border-terracotta-200/50">
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

                        {/* Titre principal */}
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-5xl 2xl:text-7xl font-bold text-charcoal-900 mx-auto leading-tight mb-6" style={{ textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>
                            <AnimatedTitle>{title}</AnimatedTitle>
                        </h1>

                        {/* Ligne décorative */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                            className="w-24 h-1 bg-gradient-to-r from-terracotta-500 via-forest-500 to-terracotta-500 mx-auto rounded-full mb-6"
                        />

                        {/* Description */}
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
                className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
            >
                <motion.div
                    className="w-8 h-12 rounded-full border-2 border-terracotta-300/50 flex items-start justify-center p-2 bg-white/30 backdrop-blur-sm"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1.5 h-3 bg-terracotta-500 rounded-full"
                        animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>

            {/* Vague de séparation */}
            <div className="absolute bottom-0 left-0 w-full z-20">
                <WaveSeparator position="bottom" className="text-cream-50" />
            </div>
        </section>
    );
}
