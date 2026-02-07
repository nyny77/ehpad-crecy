import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { SIGNUP_ROLES } from '@/lib/constants';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignupSuccess: () => void;
}

export default function SignupModal({ isOpen, onClose, onSignupSuccess }: SignupModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        relationship: '' // New field
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [hasReadTerms, setHasReadTerms] = useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            // Si on est à moins de 10px du bas ou si le contenu est petit
            if (scrollTop + clientHeight >= scrollHeight - 20) {
                setHasReadTerms(true);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Using the global netlifyIdentity object
            if (!window.netlifyIdentity) {
                throw new Error("Le service d'authentification n'est pas disponible.");
            }

            // @ts-ignore - gotrue is accessible on the widget instance but not strictly typed in the simplified definition
            const gotrue = window.netlifyIdentity.gotrue;

            if (!gotrue) {
                throw new Error("Erreur interne d'authentification.");
            }

            await gotrue.signup(formData.email, formData.password, {
                full_name: `${formData.firstName} ${formData.lastName}`,
                first_name: formData.firstName,
                last_name: formData.lastName,
                fonction: formData.role,
                lien_parente: formData.relationship
            });

            // Notification silencieuse via Netlify Forms
            try {
                const encode = (data: any) => {
                    return Object.keys(data)
                        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
                        .join("&");
                };

                await fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: encode({
                        "form-name": "nouveau-membre",
                        prenom: formData.firstName,
                        nom: formData.lastName,
                        fonction: formData.role,
                        lien_parente: formData.relationship,
                        email: formData.email
                    })
                });
            } catch (notifyError) {
                console.error("Erreur notification form:", notifyError);
                // On ne bloque pas l'inscription pour ça
            }

            onSignupSuccess();
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setIsLoading(false);
        }
    };

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
                        id="signup-modal-content"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-charcoal-800 rounded-2xl shadow-xl z-50 p-8 border dark:border-charcoal-700"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-charcoal-700 dark:hover:text-white rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-serif text-terracotta-700 dark:text-terracotta-400 mb-2">Inscription</h2>
                            <p className="text-charcoal-600 dark:text-gray-300">
                                Créez votre compte pour suivre l'actualité de l'EHPAD.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-600 dark:text-terracotta-400 text-sm rounded-xl border border-terracotta-100 dark:border-terracotta-900/50">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    Fonction / Lien
                                </label>
                                <select
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                >
                                    <option value="" className="text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">Sélectionnez votre fonction...</option>
                                    {SIGNUP_ROLES.map((role) => (
                                        <option key={role.value} value={role.value} className="text-gray-900 bg-white dark:bg-gray-800 dark:text-white">
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Champ conditionnel pour la famille */}
                            <AnimatePresence>
                                {formData.role === 'famille' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                            Lien de parenté (ex: Fils de Mme Martin)
                                        </label>
                                        <input
                                            type="text"
                                            name="relationship"
                                            required={formData.role === 'famille'}
                                            value={formData.relationship}
                                            onChange={handleChange}
                                            placeholder="Fille de Mr Dupont, ..."
                                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-amber-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] transition-colors"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                />
                            </div>

                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 max-h-40 overflow-y-auto mb-4 custom-scrollbar"
                            >
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Charte de confidentialité & Droit à l'image</h4>
                                <p className="mb-2">
                                    Cet espace privé contient des photos de la vie sociale de l'EHPAD. En demandant un accès, vous vous engagez formellement à :
                                </p>
                                <ul className="list-disc pl-4 space-y-1 mb-3">
                                    <li>Ne <strong>jamais diffuser</strong> ces photos en dehors de ce cadre (interdiction formelle de partage sur Facebook, Instagram, etc.).</li>
                                    <li>Utiliser ces images uniquement dans un cadre strictement privé et familial.</li>
                                    <li>Respecter la dignité et le droit à l'image des résidents et du personnel photographiés.</li>
                                </ul>
                                <p className="mb-2">
                                    <strong>Information RGPD :</strong> Les personnes figurant sur ces photos (ou leurs représentants) ont été informées et n'ont pas exprimé d'opposition à leur publication dans cet espace sécurisé.
                                </p>
                                <p className="mb-4">
                                    Conformément à la loi, vous pouvez à tout moment demander le retrait d'une photo vous concernant en contactant le support technique.
                                </p>
                                <div className="text-center pt-4 pb-2 text-forest-600 dark:text-forest-400 font-medium text-[10px] uppercase tracking-wider opacity-60">
                                    — Fin du document —
                                </div>
                            </div>

                            <div
                                className={`flex items-start gap-4 mb-6 group p-2 rounded-lg transition-colors ${hasReadTerms ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : 'cursor-not-allowed opacity-50'}`}
                                onClick={() => {
                                    if (hasReadTerms) setTermsAccepted(!termsAccepted);
                                }}
                            >
                                <div className={`shrink-0 mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${termsAccepted ? 'bg-forest-600 border-forest-600 text-white scale-110' : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 group-hover:border-forest-500'}`}>
                                    {termsAccepted && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-900 dark:text-white select-none">
                                        Je reconnais avoir pris connaissance de la charte ci-dessus. <span className="font-bold">Cocher cette case vaut signature numérique</span> et engagement de ma responsabilité en cas de diffusion non autorisée.
                                    </span>
                                    {!hasReadTerms && (
                                        <span className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium">
                                            ⚠️ Veuillez lire la charte jusqu'en bas pour activer la case.
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !termsAccepted}
                                className="w-full py-3 px-4 bg-gradient-to-r from-terracotta-500 to-terracotta-400 dark:bg-terracotta-600 text-white rounded-xl font-medium hover:brightness-110 dark:hover:bg-terracotta-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Inscription en cours...
                                    </>
                                ) : (
                                    "Créer mon compte"
                                )}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
