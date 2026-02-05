"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useTime } from "framer-motion";
import { EHPAD_INFO } from "@/lib/constants";
import WaveSeparator from "@/components/ui/WaveSeparator";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // --- Automatic Floating Logic ---
    const time = useTime();

    // Create a gentle floating motion using sine/cosine waves
    // Increased amplitude and speed for better visibility as requested
    const rotateX = useTransform(time, (t) => Math.sin(t / 2000) * 5); // +/- 5 degrees (was 2)
    const rotateY = useTransform(time, (t) => Math.cos(t / 2500) * 5); // +/- 5 degrees (was 2)

    const sloganWords = EHPAD_INFO.slogan.split(" ");

    return (
        <section
            ref={containerRef}
            className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-cream-50 perspective-1000"
            style={{ perspective: "1000px" }}
        >
            {/* Background Image with Parallax */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <Image
                    src={EHPAD_INFO.heroImage}
                    alt="EHPAD de Crécy"
                    fill
                    className="object-cover object-center scale-105"
                    priority
                />
                {/* Overlay équilibré (30%) */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
            </motion.div>

            {/* Main Content Container with Tilt */}
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    opacity
                }}
                className="relative z-10 container-custom px-4 pt-20"
            >
                {/* Glass Card */}
                <div className="relative max-w-5xl mx-auto">

                    {/* Animated Blobs behind the glass */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            x: [0, 30, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-20 -left-20 w-72 h-72 bg-terracotta-500/50 rounded-full blur-[80px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -60, 0],
                            x: [0, -40, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                        className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-400/40 rounded-full blur-[80px]"
                    />

                    {/* Bordure gradient animée */}
                    <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-terracotta-500 via-forest-500 to-terracotta-500 rounded-[2.5rem] opacity-80 blur-md animate-gradient-x"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    />

                    {/* The Card Itself */}
                    <div className="hero-glass-card relative bg-white/50 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 md:p-16 shadow-2xl overflow-hidden group">

                        {/* Effet de brillance interne */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/40 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-terracotta-200/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                        <div className="text-center relative z-10">
                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-charcoal-900 mb-8 leading-tight drop-shadow-sm tracking-tight"
                            >
                                {EHPAD_INFO.name}
                            </motion.h1>

                            {/* Divider */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                className="h-1 w-24 md:w-40 bg-gradient-to-r from-terracotta-400 via-forest-400 to-terracotta-400 mx-auto mb-8 rounded-full"
                            />

                            {/* Animated Slogan */}
                            <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-12">
                                {sloganWords.map((word, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, y: 20, rotateX: 90 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.8 + index * 0.1,
                                            type: "spring",
                                            damping: 12
                                        }}
                                        className="text-2xl md:text-3xl lg:text-4xl text-charcoal-700 font-serif italic"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Buttons */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 1.8 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                            >
                                <Link href="/contact" className="w-full sm:w-auto group">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-terracotta-500 to-terracotta-400 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-lg hover:brightness-110 shadow-terracotta-500/30"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Venir nous rencontrer
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </motion.button>
                                </Link>

                                <Link href="/hebergement" className="w-full sm:w-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-secondary w-full sm:w-auto text-lg"
                                    >
                                        Découvrir nos tarifs
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Floating Info Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2.2 }}
                    className="absolute -bottom-24 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
                >
                    <div className="hero-info-badge flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-xl border border-white/50">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-charcoal-800">
                            {EHPAD_INFO.capacity.total} résidents · Habilité aide sociale
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-charcoal-900/90 backdrop-blur-md rounded-full">
                        <svg className="w-4 h-4 text-terracotta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium text-white">
                            Crécy-la-Chapelle, Seine-et-Marne (77)
                        </span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="w-[30px] h-[50px] rounded-3xl border-2 border-white/50 flex justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1 h-2 bg-white rounded-full mb-1"
                    />
                </div>
            </motion.div>
        </section>
    );
}
