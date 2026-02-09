"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccessibilityToggle() {
    const [isAccessible, setIsAccessible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // Load preferences from localStorage on mount
    useEffect(() => {
        const savedAccessible = localStorage.getItem("accessibility-mode");
        if (savedAccessible === "true") {
            setIsAccessible(true);
            document.documentElement.classList.add("accessible-mode");
        }

        // FORCE REMOVE DARK MODE if it was previously set
        localStorage.removeItem("dark-mode");
        document.documentElement.classList.remove("dark-mode");

        // Show hint after 3 seconds if not already seen
        const hintSeen = localStorage.getItem("accessibility-hint-seen");
        if (!hintSeen) {
            const timer = setTimeout(() => {
                setShowHint(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismissHint = () => {
        setShowHint(false);
        localStorage.setItem("accessibility-hint-seen", "true");
    };

    const toggleAccessibility = () => {
        const newValue = !isAccessible;
        setIsAccessible(newValue);
        localStorage.setItem("accessibility-mode", String(newValue));

        if (newValue) {
            document.documentElement.classList.add("accessible-mode");
        } else {
            document.documentElement.classList.remove("accessible-mode");
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Hint bubble */}
            <AnimatePresence>
                {showHint && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute bottom-20 left-0 bg-charcoal-900 text-white px-4 py-3 rounded-xl shadow-xl max-w-[220px]"
                    >
                        <button
                            onClick={dismissHint}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-charcoal-700 rounded-full flex items-center justify-center text-white hover:bg-charcoal-600"
                        >
                            ×
                        </button>
                        <p className="text-sm font-medium">
                            👋 Besoin d'adapter l'affichage ?
                        </p>
                        <p className="text-xs text-charcoal-300 mt-1">
                            Grandes polices disponibles
                        </p>
                        <div className="absolute -bottom-2 left-6 w-4 h-4 bg-charcoal-900 rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                onClick={() => {
                    setIsOpen(!isOpen);
                    dismissHint();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transition-all ${isAccessible
                    ? "bg-charcoal-900 text-white"
                    : "bg-white text-charcoal-700 border-2 border-charcoal-200 hover:border-terracotta-400"
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Options d'affichage"
                title="Options d'affichage"
            >
                {!isAccessible && !isOpen && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-terracotta-400 opacity-20"></span>
                )}

                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${isAccessible ? "bg-white/20" : "bg-terracotta-100"
                    }`}>
                    <svg className={`w-6 h-6 ${isAccessible ? "text-white" : "text-terracotta-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </div>
                <span className="font-medium text-sm pr-1 hidden sm:inline">
                    Affichage
                </span>
            </motion.button>

            {/* Popup Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-20 left-0 rounded-2xl shadow-xl p-4 min-w-[300px] border bg-white border-charcoal-100"
                    >
                        <h3 className="font-serif font-semibold mb-4 text-lg flex items-center gap-2 text-charcoal-900">
                            <span className="text-2xl">⚙️</span>
                            Options d'affichage
                        </h3>

                        <div className="space-y-3">
                            {/* Accessibility Toggle */}
                            <button
                                onClick={toggleAccessibility}
                                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${isAccessible
                                    ? "bg-forest-500 text-white"
                                    : "bg-cream-100 text-charcoal-700 hover:bg-cream-200"
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isAccessible ? "bg-white/20" : "bg-white"
                                    }`}>
                                    <svg className={`w-6 h-6 ${isAccessible ? "text-white" : "text-charcoal-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-semibold">
                                        {isAccessible ? "✓ Grandes polices" : "♿ Mode accessible"}
                                    </p>
                                    <p className={`text-sm ${isAccessible ? "text-forest-100" : "text-charcoal-500"
                                        }`}>
                                        Texte agrandi + contraste élevé
                                    </p>
                                </div>
                                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isAccessible ? "bg-white/30" : "bg-charcoal-200"
                                    }`}>
                                    <motion.div
                                        className="w-5 h-5 rounded-full bg-white"
                                        animate={{ x: isAccessible ? 20 : 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </div>
                            </button>
                        </div>

                        <p className="text-xs mt-3 text-center text-charcoal-400">
                            Préférences mémorisées automatiquement
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
