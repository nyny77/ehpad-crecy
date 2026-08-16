"use client";

import { usePathname } from "next/navigation";
import { useId } from "react";
import { motion } from "framer-motion";

interface WaveSeparatorProps {
    position?: "top" | "bottom";
    className?: string;
    showBorder?: boolean;
}

export default function WaveSeparator({ position = "top", className = "text-white", showBorder = true }: WaveSeparatorProps) {
    const pathname = usePathname();
    const gradientId = useId().replace(/:/g, "");

    if (position === "top") {
        // Wave pointing UP - sits above the section, intrudes into previous section
        return (
            <div
                className={`wave-separator absolute top-0 left-0 w-full z-10 pointer-events-none ${className}`}
                style={{ transform: 'translateY(-100%)' }}
            >
                <svg
                    aria-hidden="true"
                    focusable="false"
                    className="w-full h-12 sm:h-16 md:h-20"
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id={`${gradientId}-top`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#85002A" />
                            <stop offset="50%" stopColor="#C80040" />
                            <stop offset="100%" stopColor="#FF85A3" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="currentColor"
                        d="M0,100 L0,50 Q360,0 720,50 T1440,50 L1440,100 Z"
                    />
                    {/* Raspberry Red Border - Drawing Animation with Framer Motion */}
                    {showBorder && (
                        <motion.path
                            key={pathname}
                            fill="none"
                            stroke={`url(#${gradientId}-top)`}
                            strokeWidth="15"
                            d="M0,50 Q360,0 720,50 T1440,50"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                                duration: 2.5,
                                ease: "easeInOut",
                            }}
                        />
                    )}
                </svg>
            </div>
        );
    }

    // Wave pointing DOWN - sits at bottom of section, creates curved bottom edge
    return (
        <div className={`wave-separator absolute bottom-0 left-0 w-full z-10 pointer-events-none ${className}`}>
            <svg
                aria-hidden="true"
                focusable="false"
                className="w-full h-12 sm:h-16 md:h-20"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id={`${gradientId}-bottom`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#85002A" />
                        <stop offset="50%" stopColor="#C80040" />
                        <stop offset="100%" stopColor="#FF85A3" />
                    </linearGradient>
                </defs>
                <path
                    fill="currentColor"
                    d="M0,0 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z"
                />
                {/* Raspberry Red Border - Drawing Animation with Framer Motion */}
                {showBorder && (
                    <motion.path
                        key={pathname}
                        fill="none"
                        stroke={`url(#${gradientId}-bottom)`}
                        strokeWidth="15"
                        d="M0,0 Q360,100 720,50 T1440,50"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                            duration: 2.5,
                            ease: "easeInOut"
                        }}
                    />
                )}
            </svg>
        </div>
    );
}
