"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AuthSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
    onSignup: () => void;
}

export default function AuthSelectionModal({
    isOpen,
    onClose,
    onLogin,
    onSignup,
}: AuthSelectionModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-50 p-6 overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center">
                            {/* Icône */}
                            <div className="w-12 h-12 bg-gradient-to-br from-terracotta-400 to-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>

                            <h2 className="font-serif text-xl text-charcoal-900 mb-1">
                                Espace Famille
                            </h2>
                            <p className="text-sm text-charcoal-600 mb-6">
                                Accédez aux photos et actualités
                            </p>

                            {/* Bouton Connexion */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onLogin}
                                className="w-full py-3 bg-terracotta-500 text-white font-semibold rounded-lg hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-2 mb-3 text-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Se connecter
                            </motion.button>

                            {/* Séparateur */}
                            <div className="flex items-center my-3">
                                <div className="flex-1 h-px bg-cream-200" />
                                <span className="px-3 text-xs text-charcoal-400">ou</span>
                                <div className="flex-1 h-px bg-cream-200" />
                            </div>

                            {/* Bouton Inscription */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onSignup}
                                className="w-full py-3 border-2 border-forest-500 text-forest-600 font-semibold rounded-lg hover:bg-forest-50 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Créer un compte famille
                            </motion.button>

                            {/* Mention RGPD compacte */}
                            <p className="text-xs text-charcoal-400 mt-4 flex items-center justify-center gap-1">
                                <svg className="w-3 h-3 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Données protégées (RGPD)
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
