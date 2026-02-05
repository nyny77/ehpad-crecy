"use client";

import { useRef } from "react";
import { motion, useTransform, useTime } from "framer-motion";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}

export default function TiltCard({ children, className = "", intensity = 10 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    // --- Automatic Floating Logic ---
    const time = useTime();

    // Create a gentle floating motion using sine/cosine waves
    // Increased amplitude for better visibility
    const rotateX = useTransform(time, (t) => Math.sin(t / 2000) * 5); // +/- 5 degrees
    const rotateY = useTransform(time, (t) => Math.cos(t / 2500) * 5); // +/- 5 degrees

    return (
        <div
            ref={ref}
            className={`${className}`}
            style={{ perspective: "1000px" }}
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
