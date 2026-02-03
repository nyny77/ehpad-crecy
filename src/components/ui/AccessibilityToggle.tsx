"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccessibilityToggle() {
    const [isAccessible, setIsAccessible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Load preference from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("accessibility-mode");
        if (saved === "true") {
            setIsAccessible(true);
            document.documentElement.classList.add("accessible-mode");
        }
    }, []);

    const toggleAccessibility = () => {
        const newValue = !isAccessible;
        setIsAccessible(newValue);
        localStorage.setItem("accessibility-mode", String(newValue));

        if (newValue) {
            document.documentElement.classList.add("accessible-mode");
        } else {
            document.documentElement.classList.remove("accessible-mode");
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${isAccessible
                        ? "bg-charcoal-900 text-white"
                        : "bg-white text-charcoal-700 border-2 border-charcoal-200"
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Options d'accessibilité"
                title="Options d'accessibilité"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </motion.button>

            {/* Popup Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-16 left-0 bg-white rounded-2xl shadow-xl p-4 min-w-[280px] border border-charcoal-100"
                    >
                        <h3 className="font-serif font-semibold text-charcoal-900 mb-3 text-lg">
                            Accessibilité
                        </h3>

                        <button
                            onClick={toggleAccessibility}
                            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${isAccessible
                                    ? "bg-forest-500 text-white"
                                    : "bg-cream-100 text-charcoal-700 hover:bg-cream-200"
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isAccessible ? "bg-white/20" : "bg-white"
                                }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">
                                    {isAccessible ? "Mode accessible activé" : "Activer le mode accessible"}
                                </p>
                                <p className={`text-sm ${isAccessible ? "text-forest-100" : "text-charcoal-500"}`}>
                                    Grandes polices + contraste élevé
                                </p>
                            </div>
                            {isAccessible && (
                                <svg className="w-6 h-6 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        <p className="text-xs text-charcoal-400 mt-3 text-center">
                            Votre préférence sera mémorisée
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
