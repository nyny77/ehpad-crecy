"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, MessageCircle, FileText, CheckCircle, ChevronLeft, ChevronRight, Upload } from "lucide-react";

export default function ConversationalForm() {
    const [step, setStep] = useState(1);
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

    // Pour scroller en haut du formulaire à chaque changement d'étape
    const formRef = useRef<HTMLDivElement>(null);

    const handleStepChange = (newStep: number) => {
        setStep(newStep);
        // formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Peut être irritant, désactivé
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Construction explicite du FormData pour éviter les oublis
            const body = new FormData();
            body.append("form-name", "contact-v2");

            // Ajout explicite de chaque champ
            body.append("subject", formData.subject);
            body.append("message", formData.message);
            body.append("firstName", formData.firstName);
            body.append("lastName", formData.lastName);
            body.append("email", formData.email);
            body.append("phone", formData.phone);
            body.append("wantsVisit", formData.wantsVisit ? "true" : "false");

            // Ajout conditionnel des fichiers
            if (formData.cv) body.append("cv", formData.cv);
            if (formData.coverLetter) body.append("coverLetter", formData.coverLetter);

            console.log("Envoi du formulaire:", Object.fromEntries(body.entries()));

            await fetch("/", {
                method: "POST",
                body: body,
            });

            setIsSubmitting(false);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Erreur d'envoi", error);
            setIsSubmitting(false);
            alert("Une erreur est survenue lors de l'envoi. Merci de réessayer.");
        }
    };

    const nextStep = () => {
        if (step < 3) handleStepChange(step + 1);
    };

    const prevStep = () => {
        if (step > 1) handleStepChange(step - 1);
    };

    // Validation basique
    const isStep1Valid = formData.subject !== "";
    const isStep2Valid = formData.message.length > 5;
    const isStep3Valid = formData.firstName && formData.lastName && formData.email;

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-10 text-center shadow-warm border border-cream-100"
            >
                <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6 text-forest-500">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-charcoal-900 mb-4">Message bien reçu !</h3>
                <p className="text-charcoal-600 mb-8 max-w-md mx-auto">
                    Merci {formData.firstName}. Nous avons bien pris en compte votre demande de <strong>{formData.subject}</strong>.
                    Nous vous recontacterons très prochainement.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-terracotta-500 font-medium hover:underline"
                >
                    Envoyer un autre message
                </button>
            </motion.div>
        );
    }

    return (
        <div ref={formRef} className="bg-white rounded-3xl shadow-card overflow-hidden">
            {/* Header avec progression */}
            <div className="bg-cream-100 p-6 md:p-8 flex items-center justify-between">
                <div>
                    <h3 className="font-serif text-xl md:text-2xl text-charcoal-900 font-bold mb-1">
                        {step === 1 && "Comment pouvons-nous vous aider ?"}
                        {step === 2 && "Dites-nous en plus"}
                        {step === 3 && "Vos coordonnées"}
                    </h3>
                    <p className="text-sm text-charcoal-500">
                        Étape {step} sur 3
                    </p>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-3 h-3 rounded-full transition-colors ${s === step ? 'bg-terracotta-500' : s < step ? 'bg-terracotta-200' : 'bg-cream-300'}`}
                        />
                    ))}
                </div>
            </div>

            <form
                name="contact-v2"
                method="POST"
                data-netlify="true"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
                className="p-6 md:p-8"
            >
                <input type="hidden" name="form-name" value="contact-v2" />
                {/* Honeypot field for spam protection */}
                <p className="hidden">
                    <label>Don't fill this out if you're human: <input name="bot-field" onChange={(e) => handleChange("bot-field", e.target.value)} /></label>
                </p>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: "information", label: "Demande d'information", icon: <MessageCircle className="w-5 h-5" /> },
                                    { id: "visite", label: "Programmer une visite", icon: <User className="w-5 h-5" /> },
                                    { id: "admission", label: "Dossier d'admission", icon: <FileText className="w-5 h-5" /> },
                                    { id: "recrutement", label: "Recrutement / RH", icon: <User className="w-5 h-5" /> },
                                    { id: "autre", label: "Autre demande", icon: <MessageCircle className="w-5 h-5" /> },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => {
                                            handleChange("subject", option.id);
                                            // Auto-advance
                                            setTimeout(() => nextStep(), 200);
                                        }}
                                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${formData.subject === option.id
                                            ? "border-terracotta-500 bg-terracotta-50 text-terracotta-700"
                                            : "border-cream-200 hover:border-terracotta-200 hover:bg-cream-50"
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.subject === option.id ? "bg-terracotta-100" : "bg-cream-100"
                                            }`}>
                                            {option.icon}
                                        </div>
                                        <span className="font-medium">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                    {formData.subject === 'recrutement' ? 'Votre motivation' : 'Votre message'} <span className="text-terracotta-500">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => handleChange("message", e.target.value)}
                                    placeholder={formData.subject === 'recrutement' ? "Pourquoi souhaitez-vous nous rejoindre ?" : "Bonjour, je vous contacte car..."}
                                    className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Recrutement Files */}
                            {formData.subject === 'recrutement' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal-700 mb-2">CV (PDF)</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                name="cv"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => handleFileChange(e, 'cv')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="px-4 py-3 bg-cream-50 border-2 border-dashed border-terracotta-200 rounded-xl flex items-center gap-2 text-terracotta-600 hover:bg-terracotta-50 transition-colors">
                                                <Upload className="w-5 h-5" />
                                                <span className="text-sm truncate">
                                                    {formData.cv ? formData.cv.name : "Téléverser mon CV"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Visite Checkbox (si pas recrutement) */}
                            {formData.subject !== 'recrutement' && (
                                <label className="flex items-start gap-3 cursor-pointer p-4 bg-cream-50 rounded-xl border border-cream-100 hover:border-terracotta-200 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="wantsVisit"
                                        checked={formData.wantsVisit}
                                        onChange={(e) => handleChange("wantsVisit", e.target.checked)}
                                        className="mt-1 w-5 h-5 text-terracotta-600 rounded focus:ring-terracotta-500 border-gray-300"
                                    />
                                    <div>
                                        <span className="font-medium text-charcoal-800">Je souhaite programmer une visite</span>
                                        <p className="text-xs text-charcoal-500 mt-0.5">Nous vous proposerons des créneaux de rendez-vous.</p>
                                    </div>
                                </label>
                            )}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Prénom *</label>
                                    <input type="text" name="firstName" required value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Nom *</label>
                                    <input type="text" name="lastName" required value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">Email *</label>
                                <input type="email" name="email" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">Téléphone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-terracotta-400 focus:outline-none" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream-100">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex items-center gap-2 text-charcoal-500 hover:text-charcoal-900 font-medium px-4 py-2 rounded-lg hover:bg-cream-100 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Retour
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                            className="flex items-center gap-2 bg-charcoal-900 text-white px-6 py-3 rounded-full font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Suivant
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!isStep3Valid || isSubmitting}
                            className="flex items-center gap-2 bg-terracotta-500 text-white px-8 py-3 rounded-full font-bold hover:bg-terracotta-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-warm hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Envoi...
                                </>
                            ) : (
                                <>
                                    Envoyer
                                    <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
