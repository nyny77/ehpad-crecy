"use client";

import { useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}

export default function TiltCard({ children, className = "", intensity = 10 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Motion values for mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics - exactly like HeroSection
    const springX = useSpring(mouseX, { stiffness: 100, damping: 10 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 10 });

    // Transform to rotation - numbers, not strings (Framer handles units)
    const rotateX = useTransform(springY, [-0.5, 0.5], [intensity, -intensity]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-intensity, intensity]);

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
    };

    return (
        <div
            ref={ref}
            className={`${className}`}
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                }}
                className="h-full w-full"
            >
                {children}
            </motion.div>
        </div>
    );
}
