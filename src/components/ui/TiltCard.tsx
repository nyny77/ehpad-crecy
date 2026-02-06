"use client";

import { useRef, MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useTime } from "framer-motion";

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    /** Max rotation in degrees (default: 8) */
    intensity?: number;
    /** Use mouse-based tilt (true) or automatic floating animation (false) */
    interactive?: boolean;
}

/**
 * TiltCard - A reusable 3D tilt card component
 * 
 * Two modes:
 * - interactive=true: Mouse-based tilting (for cards, images)
 * - interactive=false: Automatic floating animation (for decorative elements)
 */
export default function TiltCard({
    children,
    className = "",
    intensity = 8,
    interactive = true,
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Mouse-based motion values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 100, damping: 10 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 10 });

    const mouseRotateX = useTransform(springY, [-0.5, 0.5], [intensity, -intensity]);
    const mouseRotateY = useTransform(springX, [-0.5, 0.5], [-intensity, intensity]);

    // Automatic floating animation
    const time = useTime();
    const autoRotateX = useTransform(time, (t) => Math.sin(t / 2000) * (intensity / 2));
    const autoRotateY = useTransform(time, (t) => Math.cos(t / 2500) * (intensity / 2));

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!interactive || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        if (!interactive) return;
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div
            ref={cardRef}
            className={className}
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX: interactive ? mouseRotateX : autoRotateX,
                    rotateY: interactive ? mouseRotateY : autoRotateY,
                }}
                className="h-full w-full"
            >
                {children}
            </motion.div>
        </div>
    );
}
