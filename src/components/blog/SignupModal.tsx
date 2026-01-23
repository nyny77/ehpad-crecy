"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SignupModal({ isOpen, onClose, onSuccess }: SignupModalProps) {
    const [step, setStep] = useState<"form" | "success" | "error">("form");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Champs du formulaire
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("famille");
    const [relation, setRelation] = useState("");
    const [residentName, setResidentName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch("/.netlify/identity/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    data: {
                        full_name: fullName,
                        role_requested: role,
                        relation: role === "famille" ? relation : role,
                        resident_name: role === "famille" ? residentName : "",
                        relation_display: role === "famille" ? `${relation} de ${residentName}` : role,
                    },
                }),
            });

            if (response.ok) {


                setStep("success");
            } else {
                const data = await response.json();
                setErrorMessage(data.error_description || data.msg || "Une erreur est survenue.");
                setStep("error");
            }
        } catch {
            setErrorMessage("Erreur de connexion. Veuillez réessayer.");
            setStep("error");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setStep("form");
        setEmail("");
        setPassword("");
        setFullName("");
        setRole("famille");
        setRelation("");
        setResidentName("");
        setErrorMessage("");
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <div className="absolute inset-0 backdrop-blur-md bg-charcoal-900/40" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-warm overflow-hidden"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-100 rounded-full transition-colors z-20"
                    aria-label="Fermer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <AnimatePresence mode="wait">
                    {step === "form" && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-5"
                        >
                            {/* Header compact */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-forest-400 to-forest-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-serif text-xl text-charcoal-900">Créer un compte</h2>
                                    <p className="text-sm text-charcoal-500">Accès espace famille</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                {/* Nom complet */}
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Votre nom complet"
                                    className="w-full px-3 py-2.5 rounded-lg border border-cream-300 focus:border-forest-400 focus:ring-1 focus:ring-forest-100 outline-none text-sm"
                                    required
                                />

                                {/* Email et mot de passe sur 2 colonnes */}
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        className="w-full px-3 py-2.5 rounded-lg border border-cream-300 focus:border-forest-400 focus:ring-1 focus:ring-forest-100 outline-none text-sm"
                                        required
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mot de passe"
                                        className="w-full px-3 py-2.5 rounded-lg border border-cream-300 focus:border-forest-400 focus:ring-1 focus:ring-forest-100 outline-none text-sm"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                {/* Rôle */}
                                <div className="mb-3">
                                    <label className="block text-xs font-semibold text-charcoal-500 mb-1 ml-1 uppercase tracking-wide">Je suis...</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border border-cream-300 focus:border-forest-400 focus:ring-1 focus:ring-forest-100 outline-none bg-white text-sm"
                                        required
                                    >
                                        <option value="famille">Membre de la famille</option>
                                        <option value="personnel">Personnel de l&apos;EHPAD</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>

                                {/* Champs conditionnels FAMILLE */}
                                {role === "famille" && (
                                    <>
                                        <div className="flex items-center py-1">
                                            <div className="flex-1 h-px bg-cream-200" />
                                            <span className="px-3 text-xs text-charcoal-400">Lien avec le résident</span>
                                            <div className="flex-1 h-px bg-cream-200" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                value={relation}
                                                onChange={(e) => setRelation(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border border-cream-300 focus:border-forest-400 focus:ring-1 focus:ring-forest-100 outline-none bg-white text-sm"
                                                required
                                            >
                                                <option value="">Lien...</option>
                                                <option value="Fils">Fils</option>
                                                <option value="Fille">Fille</option>
                                                <option value="Époux">Époux</option>
                                                <option value="Épouse">Épouse</option>
                                                <option value="Petit-fils">Petit-fils</option>
                                                <option value="Petite-fille">Petite-fille</option>
                                                <option value="Neveu">Neveu</option>
                                                <option value="Nièce">Nièce</option>
                                                <option value="Ami(e)">Ami(e)</option>
                                                <option value="Autre">Autre</option>
                                            </select>
                                            <input
                                                type="text"
                                                value={residentName}
                                                onChange={(e) => setResidentName(e.target.value)}
                                                placeholder="De Mr/Mme..."
                                                className="w-full px-3 py-2.5 rounded-lg border border-cream-300 focus:border-forest-400 focus:ring-1 focus:ring-forest-100 outline-none text-sm"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Bouton submit */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-forest-500 text-white font-semibold rounded-lg hover:bg-forest-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Créer mon compte
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    )}

                    {step === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="font-serif text-xl text-charcoal-900 mb-2">Compte créé !</h2>
                            <p className="text-sm text-charcoal-600 mb-4">
                                Confirmez votre email à <strong>{email}</strong>
                            </p>
                            <button
                                onClick={() => { resetForm(); onSuccess(); onClose(); }}
                                className="text-terracotta-500 font-medium hover:underline text-sm"
                            >
                                Fermer
                            </button>
                        </motion.div>
                    )}

                    {step === "error" && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="font-serif text-xl text-charcoal-900 mb-2">Erreur</h2>
                            <p className="text-sm text-charcoal-600 mb-4">{errorMessage}</p>
                            <button
                                onClick={() => setStep("form")}
                                className="text-terracotta-500 font-medium hover:underline text-sm"
                            >
                                Réessayer
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
