"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
}

export default function ScrollReveal({ 
    children, 
    className = "", 
    delay = 0,
    direction = "up"
}: ScrollRevealProps) {
    const getDirectionOffset = () => {
        switch (direction) {
            case "up": return { y: 40, x: 0 };
            case "down": return { y: -40, x: 0 };
            case "left": return { x: 40, y: 0 };
            case "right": return { x: -40, y: 0 };
            case "none": return { x: 0, y: 0 };
            default: return { y: 40, x: 0 };
        }
    };

    const offset = getDirectionOffset();

    return (
        <motion.div
            initial={{ opacity: 0, ...offset }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
                duration: 0.6, 
                delay: delay, 
                ease: "easeOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
