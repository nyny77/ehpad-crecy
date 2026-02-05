"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
        wantsVisit: boolean;
        cv: File | null;
        coverLetter: File | null;
    }>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        wantsVisit: false,
        cv: null,
        coverLetter: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Check for params on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('success') === 'true') {
                setIsSubmitted(true);
            }
            if (params.get('subject')) {
                setFormData(prev => ({
                    ...prev,
                    subject: params.get('subject') || ""
                }));
            }
        }
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: files[0],
                }));
            }
        } else if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const myForm = e.target as HTMLFormElement;
            const formData = new FormData(myForm);

            // Envoi direct du FormData pour supporter le multipart/form-data
            await fetch("/", {
                method: "POST",
                body: formData,
            });

            setIsSubmitting(false);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Erreur d'envoi", error);
            setIsSubmitting(false);
            alert("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-10 md:p-14 text-center shadow-card"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-forest-400 to-forest-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-charcoal-900 mb-4">
                    Message envoyé !
                </h3>
                <p className="text-charcoal-600 mb-8">
                    Merci pour votre message. Notre équipe vous répondra
                    dans les meilleurs délais.
                </p>
                <button
                    onClick={() => {
                        window.history.replaceState({}, '', '/contact');
                        setIsSubmitted(false);
                        setFormData({
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            subject: "",
                            message: "",
                            wantsVisit: false,
                            cv: null,
                            coverLetter: null,
                        });
                    }}
                    className="btn-secondary"
                >
                    Envoyer un autre message
                </button>
            </motion.div>
        );
    }

    return (
        <form
            name="contact"
            method="POST"
            data-netlify="true"
            action="/contact?success=true"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-card"
        >
            {/* <input type="hidden" name="form-name" value="contact" />  - Gardé par React state ou champ caché explicite ci-dessous */}
            <input type="hidden" name="form-name" value="contact" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prénom */}
                <div className="relative">
                    <motion.label
                        animate={{
                            y: focusedField === "firstName" || formData.firstName ? -24 : 0,
                            scale: focusedField === "firstName" || formData.firstName ? 0.85 : 1,
                            color: focusedField === "firstName" ? "#C80040" : "#6D6D6D",
                        }}
                        className="absolute left-4 top-4 text-charcoal-500 pointer-events-none origin-left transition-all"
                    >
                        Prénom *
                    </motion.label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full px-4 pt-6 pb-2 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none transition-colors"
                    />
                </div>

                {/* Nom */}
                <div className="relative">
                    <motion.label
                        animate={{
                            y: focusedField === "lastName" || formData.lastName ? -24 : 0,
                            scale: focusedField === "lastName" || formData.lastName ? 0.85 : 1,
                            color: focusedField === "lastName" ? "#C80040" : "#6D6D6D",
                        }}
                        className="absolute left-4 top-4 text-charcoal-500 pointer-events-none origin-left transition-all"
                    >
                        Nom *
                    </motion.label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("lastName")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full px-4 pt-6 pb-2 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none transition-colors"
                    />
                </div>

                {/* Email */}
                <div className="relative">
                    <motion.label
                        animate={{
                            y: focusedField === "email" || formData.email ? -24 : 0,
                            scale: focusedField === "email" || formData.email ? 0.85 : 1,
                            color: focusedField === "email" ? "#C80040" : "#6D6D6D",
                        }}
                        className="absolute left-4 top-4 text-charcoal-500 pointer-events-none origin-left transition-all"
                    >
                        Email *
                    </motion.label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full px-4 pt-6 pb-2 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none transition-colors"
                    />
                </div>

                {/* Téléphone */}
                <div className="relative">
                    <motion.label
                        animate={{
                            y: focusedField === "phone" || formData.phone ? -24 : 0,
                            scale: focusedField === "phone" || formData.phone ? 0.85 : 1,
                            color: focusedField === "phone" ? "#C80040" : "#6D6D6D",
                        }}
                        className="absolute left-4 top-4 text-charcoal-500 pointer-events-none origin-left transition-all"
                    >
                        Téléphone
                    </motion.label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 pt-6 pb-2 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none transition-colors"
                    />
                </div>

                {/* Sujet */}
                <div className="md:col-span-2 relative">
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Sujet de votre demande *
                    </label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="information">Demande d&apos;information</option>
                        <option value="visite">Programmer une visite</option>
                        <option value="admission">Dossier d&apos;admission</option>
                        <option value="recrutement">Recrutement / Candidature</option>
                        <option value="tarifs">Questions sur les tarifs</option>
                        <option value="autre">Autre demande</option>
                    </select>
                    <svg
                        className="absolute right-4 top-[42px] w-5 h-5 text-charcoal-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Section Recrutement (Conditionnelle) */}
                <AnimatePresence>
                    {formData.subject === "recrutement" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
                        >
                            {/* CV */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                    CV (PDF, Doc) *
                                </label>
                                <input
                                    type="file"
                                    name="cv"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleChange}
                                    required={formData.subject === "recrutement"}
                                    className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-terracotta-50 file:text-terracotta-700 hover:file:bg-terracotta-100"
                                />
                            </div>

                            {/* Lettre de motivation */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                    Lettre de motivation
                                </label>
                                <input
                                    type="file"
                                    name="coverLetter"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-terracotta-50 file:text-terracotta-700 hover:file:bg-terracotta-100"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Message */}
                <div className="md:col-span-2 relative">
                    <motion.label
                        animate={{
                            y: focusedField === "message" || formData.message ? -24 : 0,
                            scale: focusedField === "message" || formData.message ? 0.85 : 1,
                            color: focusedField === "message" ? "#C80040" : "#6D6D6D",
                        }}
                        className="absolute left-4 top-4 text-charcoal-500 pointer-events-none origin-left transition-all"
                    >
                        {formData.subject === "recrutement" ? "Message / Motivation *" : "Votre message *"}
                    </motion.label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        required
                        rows={5}
                        className="w-full px-4 pt-6 pb-2 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none transition-colors resize-none"
                    />
                </div>

                {/* Checkbox visite */}
                <div className="md:col-span-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-1">
                            <input
                                type="checkbox"
                                name="wantsVisit"
                                checked={formData.wantsVisit}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-6 h-6 bg-cream-50 border-2 border-cream-300 rounded-lg peer-checked:bg-terracotta-500 peer-checked:border-terracotta-500 transition-all">
                                <svg
                                    className={`w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity ${formData.wantsVisit ? "opacity-100" : "opacity-0"
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <span className="font-medium text-charcoal-800">
                                Je souhaite programmer une visite
                            </span>
                            <p className="text-sm text-charcoal-500 mt-1">
                                Nous vous recontacterons pour convenir d&apos;un rendez-vous.
                                <br />
                                <span className="text-xs text-charcoal-400 italic">
                                    Note : Il n&apos;est pas possible de réserver une chambre en ligne.
                                </span>
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Bouton submit */}
            <div className="mt-8">
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`btn-primary w-full text-lg py-4 ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                        }`}
                >
                    <AnimatePresence mode="wait">
                        {isSubmitting ? (
                            <motion.span
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Envoi en cours...
                            </motion.span>
                        ) : (
                            <motion.span
                                key="send"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center gap-2"
                            >
                                Envoyer le message
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </form>
    );
}
