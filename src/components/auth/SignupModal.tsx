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

    React.useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

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
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="signup-modal-title"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-xl sm:p-8"
                    >
                        <button
                            type="button"
                            aria-label="Fermer la fenêtre d’inscription"
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6 text-center sm:mb-8">
                            <h2 id="signup-modal-title" className="text-2xl font-serif text-terracotta-600 mb-2">Inscription</h2>
                            <p className="text-gray-600">
                                Créez votre compte pour suivre l'actualité de l'EHPAD.
                            </p>
                        </div>

                        {error && (
                            <div role="alert" aria-live="assertive" className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="signup-first-name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Prénom
                                    </label>
                                    <input
                                        id="signup-first-name"
                                        type="text"
                                        name="firstName"
                                        autoComplete="given-name"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="signup-last-name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom
                                    </label>
                                    <input
                                        id="signup-last-name"
                                        type="text"
                                        name="lastName"
                                        autoComplete="family-name"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="signup-role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fonction / Lien
                                </label>
                                <select
                                    id="signup-role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                >
                                    <option value="" className="text-gray-500">Sélectionnez votre fonction...</option>
                                    {SIGNUP_ROLES.map((role) => (
                                        <option key={role.value} value={role.value} className="text-gray-900">
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
                                        <label htmlFor="signup-relationship" className="block text-sm font-medium text-gray-700 mb-1">
                                            Lien de parenté (ex: Fils de Mme Martin)
                                        </label>
                                        <input
                                            id="signup-relationship"
                                            type="text"
                                            name="relationship"
                                            required={formData.role === 'famille'}
                                            value={formData.relationship}
                                            onChange={handleChange}
                                            placeholder="Fille de Mr Dupont, ..."
                                            className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-amber-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    id="signup-email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mot de passe
                                </label>
                                <input
                                    id="signup-password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
                                />
                            </div>

                            {/* Charte - Light mode only */}
                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                tabIndex={0}
                                aria-labelledby="privacy-charter-title"
                                className="bg-cream-50 p-4 rounded-xl border border-cream-200 text-xs text-gray-700 max-h-40 overflow-y-auto mb-4 custom-scrollbar"
                            >
                                <h4 id="privacy-charter-title" className="font-bold text-gray-900 mb-2">Charte de confidentialité & Droit à l'image</h4>
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
                                <div className="text-center pt-4 pb-2 text-forest-600 font-medium text-[10px] uppercase tracking-wider opacity-60">
                                    — Fin du document —
                                </div>
                            </div>

                            {/* Checkbox area - Light mode only */}
                            <label className={`flex items-start gap-4 mb-6 group p-3 rounded-xl transition-colors ${hasReadTerms ? 'cursor-pointer hover:bg-cream-100 bg-cream-50' : 'cursor-not-allowed opacity-50 bg-gray-50'}`}>
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    disabled={!hasReadTerms}
                                    onChange={(event) => setTermsAccepted(event.target.checked)}
                                    aria-describedby={!hasReadTerms ? "terms-reading-help" : undefined}
                                    className="shrink-0 mt-0.5 h-6 w-6 rounded border-2 border-gray-300 text-forest-600 focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:ring-offset-2"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-800 select-none">
                                        Je reconnais avoir pris connaissance de la charte ci-dessus. <span className="font-bold">Cocher cette case vaut signature numérique</span> et engagement de ma responsabilité en cas de diffusion non autorisée.
                                    </span>
                                    {!hasReadTerms && (
                                        <span id="terms-reading-help" className="text-xs text-orange-600 mt-1 font-medium">
                                            ⚠️ Veuillez lire la charte jusqu'en bas pour activer la case.
                                        </span>
                                    )}
                                </div>
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading || !termsAccepted}
                                className="w-full py-3 px-4 bg-gradient-to-r from-terracotta-500 to-terracotta-400 text-white rounded-xl font-medium hover:brightness-110 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
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
