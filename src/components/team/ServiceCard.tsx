"use client";

import { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ServiceCardProps {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    index: number;
    size?: "small" | "large" | "horizontal" | "vertical";
}

export default function ServiceCard({
    id,
    title,
    subtitle,
    description,
    image,
    index,
    size = "small",
}: ServiceCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // 3D Tilt effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 100, damping: 10 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 10 });

    const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
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

    return (
        <Link href={`/equipe/${id}`} className={getSizeClasses()}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="h-full"
            >
                <div
                    ref={ref}
                    style={{ perspective: "1000px" }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={handleMouseLeave}
                    className="h-full"
                >
                    <motion.div
                        style={{ rotateX, rotateY }}
                        className="h-full"
                    >
                        <div
                            className={`relative overflow-hidden rounded-3xl bg-white shadow-card transition-shadow duration-500 h-full min-h-[300px] ${isHovered ? "shadow-2xl" : ""}`}
                        >
                            {/* Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className={`object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
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
                            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/60 to-transparent pt-20">
                                {/* Badge */}
                                <motion.span
                                    animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.9 }}
                                    className="inline-block self-start px-3 py-1 bg-terracotta-500 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-sm border border-terracotta-400"
                                >
                                    {subtitle}
                                </motion.span>

                                {/* Titre */}
                                <h3
                                    className={`font-serif font-bold text-white mb-2 !text-white ${isBigTitle ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}
                                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                                >
                                    {title}
                                </h3>

                                {/* Description */}
                                <motion.p
                                    animate={{
                                        opacity: isHovered ? 1 : 0.9, // Toujours visible mais plus brillant au hover
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

                            {/* Effet de brillance au hover */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background:
                                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)",
                                    transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
                                    transition: "transform 0.8s ease-out",
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
}
