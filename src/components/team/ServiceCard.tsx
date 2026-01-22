"use client";

import { useState, useRef } from "react";
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

    // Effet 3D Tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
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
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative group cursor-pointer h-full"
            >
                <div
                    className={`relative overflow-hidden rounded-3xl bg-white shadow-card transition-shadow duration-500 h-full min-h-[300px] ${isHovered ? "shadow-warm" : ""
                        }`}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className={`object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"
                                }`}
                        />
                        {/* Overlay gradient */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${isHovered
                                ? "from-charcoal-900/90 via-charcoal-900/50 to-transparent"
                                : "from-charcoal-900/70 via-charcoal-900/30 to-transparent"
                                }`}
                        />
                    </div>

                    {/* Contenu */}
                    <div
                        className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
                        style={{ transform: "translateZ(50px)" }}
                    >
                        {/* Badge */}
                        <motion.span
                            animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
                            className="inline-block self-start px-3 py-1 bg-terracotta-500/90 backdrop-blur-sm rounded-full text-xs font-medium !text-white mb-3"
                            style={{ color: "white" }}
                        >
                            {subtitle}
                        </motion.span>

                        {/* Titre */}
                        <h3
                            className={`font-serif font-semibold !text-white mb-2 drop-shadow-lg ${isBigTitle ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                                }`}
                            style={{ color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
                        >
                            {title}
                        </h3>

                        {/* Description */}
                        <motion.p
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                y: isHovered ? 0 : 20,
                            }}
                            transition={{ duration: 0.3 }}
                            className={`!text-white ${isBigTitle ? "text-base" : "text-sm"} line-clamp-3`}
                            style={{ color: "white", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                        >
                            {description}
                        </motion.p>

                        {/* Indicateur */}
                        <motion.div
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                x: isHovered ? 0 : -10,
                            }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="mt-4 flex items-center gap-2 text-terracotta-300"
                        >
                            <span className="text-sm font-medium">Découvrir ce service</span>
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
                            transition: "transform 0.6s ease-out",
                        }}
                    />
                </div>
            </motion.div>
        </Link>
    );
}
