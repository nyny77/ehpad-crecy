"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceCardProps {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    index: number;
    size?: "small" | "large" | "horizontal" | "vertical";
    imagePosition?: string;
}

export default function ServiceCard({
    id,
    title,
    subtitle,
    description,
    image,
    index,
    size = "small",
    imagePosition = "object-center",
}: ServiceCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse handlers removed, only hover state remains


    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    // Calcul des classes de taille
    const getSizeClasses = () => {
        switch (size) {
            case "large":
                return "md:col-span-2 md:row-span-2";
            case "horizontal":
                return "md:col-span-2 md:row-span-1";
            case "vertical":
                return "md:col-span-1 md:row-span-2";
            default:
                return "md:col-span-1 md:row-span-1";
        }
    };

    const isBigTitle = size === "large" || size === "horizontal";
    // Randomize slightly based on index to avoid robotic uniformity
    const floatDuration = 4 + (index % 2); // Faster 
    const blurDuration = 3 + (index % 2);

    return (
        <Link href={`/equipe/${id}`} className={getSizeClasses()}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="h-full relative group"
            >
                {/* Breathing Glow Background - Automatic */}
                <motion.div
                    className="absolute inset-4 bg-terracotta-500/25 rounded-3xl -z-10"
                    animate={{
                        opacity: [0.2, 0.8, 0.2], // More visible
                        scale: [0.95, 1.08, 0.95],
                        filter: ["blur(10px)", "blur(20px)", "blur(10px)"]
                    }}
                    transition={{
                        duration: blurDuration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: index * 0.2
                    }}
                />

                <div
                    ref={ref}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={handleMouseLeave}
                    className="h-full"
                >
                    <div className="h-full">
                        <div
                            className={`relative overflow-hidden rounded-3xl bg-cream-50 shadow-card transition-all duration-500 h-full min-h-[220px] ${isHovered ? "shadow-2xl scale-[1.02]" : ""}`}
                        >
                            {/* Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className={`object-cover transition-transform duration-[20s] ease-in-out ${isHovered ? "scale-110" : "scale-105"} ${imagePosition}`}
                                />

                                {/* Overlay gradient */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${isHovered
                                        ? "from-charcoal-900/95 via-charcoal-900/70 to-charcoal-900/20"
                                        : "from-charcoal-900/90 via-charcoal-900/50 to-charcoal-900/10"
                                        }`}
                                />
                            </div>

                            {/* Contenu - Avec fond semi-transparent pour lisibilité garantie */}
                            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/60 to-transparent pt-16">
                                {/* Badge */}
                                <motion.span
                                    animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.9 }}
                                    className="inline-block self-start px-3 py-1 bg-terracotta-500 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-sm border border-terracotta-400"
                                >
                                    {subtitle}
                                </motion.span>

                                {/* Titre */}
                                <h3
                                    className={`font-serif font-bold text-white mb-2 !text-white ${isBigTitle ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}
                                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                                >
                                    {title}
                                </h3>

                                {/* Description */}
                                <motion.p
                                    animate={{
                                        opacity: isHovered ? 1 : 0.9,
                                        y: isHovered ? 0 : 5,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`text-white/90 font-medium ${isBigTitle ? "text-base" : "text-sm"} line-clamp-3`}
                                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                                >
                                    {description}
                                </motion.p>

                                {/* Indicateur */}
                                <motion.div
                                    animate={{
                                        opacity: isHovered ? 1 : 0,
                                        x: isHovered ? 0 : -10,
                                        height: isHovered ? "auto" : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4 flex items-center gap-2 text-terracotta-300 overflow-hidden"
                                >
                                    <span className="text-sm font-bold uppercase tracking-wide">Découvrir</span>
                                    <svg
                                        className="w-4 h-4"
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
                                </motion.div>
                            </div>

                            {/* Effet de brillance auto qui passe de temps en temps */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)",
                                }}
                                initial={{ x: "-100%" }}
                                animate={{ x: "200%" }}
                                transition={{
                                    repeat: Infinity,
                                    repeatDelay: 3 + (index % 5), // Random delay between shines
                                    duration: 1.5,
                                    ease: "easeInOut",
                                    delay: index * 0.5
                                }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
