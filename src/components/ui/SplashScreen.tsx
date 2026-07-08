"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const funMessages = [
    "Préparation d'un accueil chaleureux...",
    "Chauffe du café pour les résidents...",
    "Mise en place des sourires...",
    "Ouverture des volets sur le jardin...",
    "Un instant de douceur arrive..."
];

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        // Prevent scrolling while splash screen is active
        document.body.style.overflow = 'hidden';

        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % funMessages.length);
        }, 1200);

        const timeout = setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
        }, 5000);

        return () => {
            clearInterval(messageInterval);
            clearTimeout(timeout);
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-cream-50 backdrop-blur-md"
                >
                    <div className="relative flex flex-col items-center justify-center">
                        
                        <div className="relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56 mb-8">
                            {/* Logo */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-32 h-32 md:w-40 md:h-40 shadow-xl rounded-full overflow-hidden border-2 border-white z-10 bg-white"
                            >
                                <Image
                                    src="/images/logo.png"
                                    alt="Logo EHPAD"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="160px"
                                />
                            </motion.div>

                            {/* Progress Circle (5 seconds duration) */}
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90 z-20 drop-shadow-md" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="48"
                                    fill="transparent"
                                    stroke="#E7E5E4" 
                                    strokeWidth="1.5"
                                />
                                {/* Animated progress circle */}
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="48"
                                    fill="transparent"
                                    stroke="#C80040" 
                                    strokeWidth="2.5"
                                    strokeDasharray="302"
                                    initial={{ strokeDashoffset: 302 }}
                                    animate={{ strokeDashoffset: 0 }}
                                    transition={{ duration: 4.8, ease: "linear" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        {/* Fun Message */}
                        <div className="h-10 flex items-center justify-center overflow-hidden w-full px-4">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={messageIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-charcoal-700 font-serif italic text-lg md:text-xl text-center font-medium"
                                >
                                    {funMessages[messageIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
