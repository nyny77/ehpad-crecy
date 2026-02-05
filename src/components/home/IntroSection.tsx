"use client";

import { useRef, useState, useEffect } from "react";
import { Heart, Sparkles, Eye, Users } from "lucide-react";
import Image from "next/image";
import { motion, useInView, useTransform, useTime } from "framer-motion";
import { VALUES } from "@/lib/constants";
import WaveSeparator from "@/components/ui/WaveSeparator";

// Color configurations for each value type
const valueStyles = {
    heart: {
        gradient: "from-rose-500 via-terracotta-500 to-rose-600",
        bg: "bg-rose-500",
        glow: "shadow-rose-500/50",
        ring: "ring-rose-400/30"
    },
    star: {
        gradient: "from-amber-400 via-yellow-500 to-orange-500",
        bg: "bg-amber-500",
        glow: "shadow-amber-500/50",
        ring: "ring-amber-400/30"
    },
    eye: {
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        bg: "bg-emerald-500",
        glow: "shadow-emerald-500/50",
        ring: "ring-emerald-400/30"
    },
    users: {
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        bg: "bg-violet-500",
        glow: "shadow-violet-500/50",
        ring: "ring-violet-400/30"
    },
};

const iconComponents: { [key: string]: React.ReactNode } = {
    heart: <Heart className="w-10 h-10 text-white" strokeWidth={2.5} fill="currentColor" />,
    star: <Sparkles className="w-10 h-10 text-white" strokeWidth={2.5} />,
    eye: <Eye className="w-10 h-10 text-white" strokeWidth={2.5} />,
    users: <Users className="w-10 h-10 text-white" strokeWidth={2.5} />,
};

// Dynamic animated value card component
function ValueCard({ value, index }: { value: typeof VALUES[0], index: number }) {
    const style = valueStyles[value.icon as keyof typeof valueStyles];
    const IconComponent = iconComponents[value.icon];
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detect dark mode
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
        };
        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.7,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
            }}
            className="relative group cursor-pointer"
        >
            {/* Animated gradient background that expands on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-110`} />

            {/* Main card - Theme aware */}
            <div className={`relative h-full rounded-3xl px-3 py-6 flex flex-col items-center transition-all duration-500 ${isDarkMode
                ? 'bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-black border border-charcoal-700/50 group-hover:border-white/20'
                : 'bg-gradient-to-br from-white via-cream-50 to-cream-100 border-2 border-cream-200 shadow-xl group-hover:border-terracotta-300 group-hover:shadow-2xl'
                }`}>

                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Orbiting particle 1 */}
                    <motion.div
                        className={`absolute w-2 h-2 ${style.bg} rounded-full ${isDarkMode ? 'opacity-60' : 'opacity-40'}`}
                        animate={{
                            x: [0, 100, 200, 100, 0],
                            y: [0, -50, 0, 50, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.5
                        }}
                        style={{ top: "20%", left: "10%" }}
                    />
                    {/* Orbiting particle 2 */}
                    <motion.div
                        className={`absolute w-3 h-3 ${style.bg} rounded-full ${isDarkMode ? 'opacity-40' : 'opacity-25'}`}
                        animate={{
                            x: [0, -80, 0, 80, 0],
                            y: [0, 60, 0, -60, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.3
                        }}
                        style={{ top: "60%", right: "20%" }}
                    />
                    {/* Glowing orb */}
                    <motion.div
                        className={`absolute w-32 h-32 ${style.bg} rounded-full blur-2xl ${isDarkMode ? 'opacity-10' : 'opacity-20'}`}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: isDarkMode ? [0.1, 0.2, 0.1] : [0.15, 0.25, 0.15],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2
                        }}
                        style={{ top: "-20%", right: "-20%" }}
                    />
                </div>

                {/* Icon container with pulse animation */}
                <div className="relative flex justify-center mb-6">
                    {/* Outer pulsing ring */}
                    <motion.div
                        className={`absolute inset-0 w-24 h-24 mx-auto rounded-full ${style.ring} ring-8 opacity-50`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.2, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.25
                        }}
                    />

                    {/* Icon background with gradient and shadow */}
                    <motion.div
                        className={`relative w-24 h-24 bg-gradient-to-br ${style.gradient} rounded-full flex items-center justify-center shadow-2xl ${style.glow} group-hover:shadow-3xl transition-shadow duration-500`}
                        animate={{
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3
                        }}
                        whileHover={{
                            scale: 1.15,
                            rotate: 360,
                            transition: { duration: 0.6 }
                        }}
                    >
                        {IconComponent}
                    </motion.div>
                </div>

                {/* Title - Theme aware */}
                <motion.h3
                    className={`w-full font-serif text-sm font-bold text-center mb-3 ${isDarkMode
                        ? 'bg-gradient-to-r from-white via-cream-100 to-white bg-clip-text text-transparent'
                        : 'text-charcoal-900'
                        }`}
                    whileHover={{ scale: 1.05 }}
                >
                    {value.title}
                </motion.h3>

                {/* Description - Theme aware */}
                <p className={`text-center text-sm leading-relaxed ${isDarkMode ? 'text-cream-200/80' : 'text-charcoal-600'
                    }`}>
                    {value.description}
                </p>

                {/* Bottom accent line that animates on hover */}
                <motion.div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r ${style.gradient} rounded-full`}
                    initial={{ width: "30%" }}
                    whileHover={{ width: "80%" }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </motion.div>
    );
}

export default function IntroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="section-padding bg-cream-100 relative mt-0 pt-24 md:pt-32">
            {/* Wave top (transition from Hero) */}
            <WaveSeparator position="top" className="text-cream-100" />
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-terracotta-500 font-medium mb-4"
                    >
                        Ce qui nous définit
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6"
                    >
                        Nos valeurs au quotidien
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-charcoal-600 max-w-2xl mx-auto"
                    >
                        Chaque jour, notre équipe s&apos;engage à offrir un accompagnement
                        personnalisé, dans le respect et la dignité de chaque résident.
                    </motion.p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {VALUES.map((value, index) => (
                        <ValueCard key={value.title} value={value} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
