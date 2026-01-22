"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, AUTH_CONFIG } from "@/lib/authUtils";

interface AuthOverlayProps {
    onLoginSuccess: () => void;
    onClose?: () => void;
}

type View = "login" | "request";

export default function AuthOverlay({ onLoginSuccess, onClose }: AuthOverlayProps) {
    const [view, setView] = useState<View>("login");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Request access form
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [relation, setRelation] = useState("");
    const [requestSent, setRequestSent] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        setTimeout(() => {
            const result = login(password);
            setIsLoading(false);

            if (result.success) {
                onLoginSuccess();
            } else {
                setError(result.message);
                setPassword("");
            }
        }, 500);
    };

    const handleRequestAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Envoi via Formspree
            const response = await fetch(AUTH_CONFIG.formspreeEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    relation,
                    _subject: `Demande d'accès Vie Sociale - ${name}`,
                }),
            });

            if (response.ok) {
                setRequestSent(true);
            } else {
                // En cas d'erreur, ouvrir le mailto
                window.location.href = `mailto:${AUTH_CONFIG.adminEmail}?subject=Demande d'accès Vie Sociale&body=Nom: ${name}%0AEmail: ${email}%0ALien avec le résident: ${relation}`;
                setRequestSent(true);
            }
        } catch {
            // Fallback mailto
            window.location.href = `mailto:${AUTH_CONFIG.adminEmail}?subject=Demande d'accès Vie Sociale&body=Nom: ${name}%0AEmail: ${email}%0ALien avec le résident: ${relation}`;
            setRequestSent(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Fond flouté */}
            <div className="absolute inset-0 backdrop-blur-md bg-charcoal-900/40" onClick={onClose} />

            {/* Contenu */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative z-10 w-full max-w-md mx-4 bg-white rounded-3xl shadow-warm overflow-hidden"
            >
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-100 rounded-full transition-colors z-20"
                        aria-label="Fermer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <AnimatePresence mode="wait">
                    {view === "login" && !requestSent && (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-8"
                        >
                            {/* Icône */}
                            <div className="w-16 h-16 bg-gradient-to-br from-terracotta-400 to-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-warm">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>

                            {/* Titre */}
                            <h2 className="font-serif text-2xl text-charcoal-900 text-center mb-2">
                                Espace Famille
                            </h2>
                            <p className="text-charcoal-600 text-center mb-6">
                                Entrez votre code d&apos;accès pour consulter les actualités
                            </p>

                            {/* Formulaire */}
                            <form onSubmit={handleLogin}>
                                <div className="mb-4">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Code d'accès"
                                        className="w-full px-5 py-4 rounded-xl border border-cream-300 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 outline-none text-center text-lg tracking-widest transition-all"
                                        autoFocus
                                    />
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm text-center mt-2"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading || !password}
                                    className="w-full py-4 bg-terracotta-500 text-white font-semibold rounded-xl hover:bg-terracotta-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Accéder
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Séparateur */}
                            <div className="flex items-center my-6">
                                <div className="flex-1 h-px bg-cream-300" />
                                <span className="px-4 text-sm text-charcoal-500">ou</span>
                                <div className="flex-1 h-px bg-cream-300" />
                            </div>

                            {/* Bouton demander accès */}
                            <button
                                onClick={() => setView("request")}
                                className="w-full py-4 border-2 border-forest-500 text-forest-600 font-semibold rounded-xl hover:bg-forest-50 transition-colors"
                            >
                                Demander un accès
                            </button>
                        </motion.div>
                    )}

                    {view === "request" && !requestSent && (
                        <motion.div
                            key="request"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-8"
                        >
                            {/* Retour */}
                            <button
                                onClick={() => setView("login")}
                                className="flex items-center gap-2 text-charcoal-600 hover:text-charcoal-900 mb-6"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Retour
                            </button>

                            <h2 className="font-serif text-2xl text-charcoal-900 mb-2">
                                Demander un accès
                            </h2>
                            <p className="text-charcoal-600 mb-6">
                                Remplissez ce formulaire et l&apos;administration vous enverra le code d&apos;accès.
                            </p>

                            <form onSubmit={handleRequestAccess} className="space-y-4">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Votre nom"
                                    className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 outline-none"
                                    required
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Votre email"
                                    className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 outline-none"
                                    required
                                />
                                <input
                                    type="text"
                                    value={relation}
                                    onChange={(e) => setRelation(e.target.value)}
                                    placeholder="Lien avec le résident (ex: fils de Mme Martin)"
                                    className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 outline-none"
                                    required
                                />

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Envoyer la demande
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    )}

                    {requestSent && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="font-serif text-2xl text-charcoal-900 mb-2">
                                Demande envoyée !
                            </h2>
                            <p className="text-charcoal-600 mb-6">
                                L&apos;administration va examiner votre demande et vous enverra le code d&apos;accès par email.
                            </p>
                            <button
                                onClick={() => {
                                    setRequestSent(false);
                                    setView("login");
                                    setName("");
                                    setEmail("");
                                    setRelation("");
                                }}
                                className="text-terracotta-500 font-medium hover:underline"
                            >
                                Retourner à la connexion
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
