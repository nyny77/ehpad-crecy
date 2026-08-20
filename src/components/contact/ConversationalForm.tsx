"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Upload } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { CAREERS_OFFERS, type JobOffer } from "@/lib/careers";

export default function ConversationalForm() {
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
        wantsVisit: boolean;
    }>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "information",
        message: "",
        wantsVisit: false,
    });

    const [cvFileName, setCvFileName] = useState<string>("");
    const [applicationOffer, setApplicationOffer] = useState<JobOffer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const stepHeadingRef = useRef<HTMLHeadingElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const offer = CAREERS_OFFERS.find((item) => item.id === params.get("offer"));
        if (offer) {
            setApplicationOffer(offer);
            setFormData((current) => ({
                ...current,
                subject: "recrutement",
                message: current.message || `Je souhaite postuler au poste « ${offer.title} » à ${offer.facilityName} (${offer.city}).`,
            }));
        } else if (params.get("subject") === "recrutement") {
            setFormData((current) => ({ ...current, subject: "recrutement" }));
        }
    }, []);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const body = new FormData(e.currentTarget as HTMLFormElement);

            await fetch("/", {
                method: "POST",
                body: body,
            });

            trackEvent("contact_submission", formData.wantsVisit ? "Contact (demande de visite)" : `Contact (${formData.subject})`);

            setIsSubmitting(false);
            setIsSubmitted(true);
            window.setTimeout(() => stepHeadingRef.current?.focus(), 0);
        } catch (error) {
            console.error("Erreur d'envoi", error);
            setIsSubmitting(false);
            alert("Une erreur est survenue lors de l'envoi. Merci de réessayer.");
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-md border border-cream-200"
            >
                <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4 text-forest-600">
                    <CheckCircle className="w-7 h-7" />
                </div>
                <h3 ref={stepHeadingRef} tabIndex={-1} className="font-serif text-xl font-bold text-charcoal-900 mb-2 focus:outline-none">Message bien reçu !</h3>
                <p className="text-charcoal-600 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                    Merci {formData.firstName}. Nous avons bien pris en compte votre message et nous vous répondrons dans les plus brefs délais.
                </p>
                <button
                    onClick={() => {
                        setIsSubmitted(false);
                        setApplicationOffer(null);
                        setFormData({
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            subject: "information",
                            message: "",
                            wantsVisit: false,
                        });
                    }}
                    className="text-xs text-terracotta-600 font-semibold hover:underline"
                >
                    Envoyer un autre message
                </button>
            </motion.div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-2xs border border-cream-300 p-5 md:p-6 font-sans">
            <h2
                ref={stepHeadingRef}
                tabIndex={-1}
                className="!font-sans font-bold text-charcoal-900 mb-4 pb-2.5 border-b border-cream-200 focus:outline-none"
                style={{ fontSize: "18px", lineHeight: "1.4" }}
            >
                Envoyer un message
            </h2>

            <form
                name="contact-v5"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
                className="space-y-4 text-sm"
            >
                <input type="hidden" name="form-name" value="contact-v5" />
                <input type="hidden" name="wantsVisit" value={formData.wantsVisit ? "true" : "false"} />
                <input type="hidden" name="jobOfferId" value={applicationOffer?.id || ""} />
                <input type="hidden" name="jobTitle" value={applicationOffer?.title || ""} />
                <input type="hidden" name="jobFacility" value={applicationOffer ? `${applicationOffer.facilityName} — ${applicationOffer.city}` : ""} />

                <p className="hidden">
                    <label>Don&apos;t fill this out if you&apos;re human: <input name="bot-field" /></label>
                </p>

                {/* Objet de la demande */}
                {applicationOffer && (
                    <div className="rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-900">
                        <p className="font-bold">Candidature : {applicationOffer.title}</p>
                        <p className="text-xs">{applicationOffer.facilityName} — {applicationOffer.city}</p>
                    </div>
                )}
                <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                        Objet de votre demande <span className="text-terracotta-600">*</span>
                    </label>
                    <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-charcoal-800 text-sm focus:border-terracotta-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta-500 transition-colors"
                    >
                        <option value="information">Demande d&apos;information générale</option>
                        <option value="visite">Programmer une visite de l&apos;établissement</option>
                        <option value="admission">Dossier d&apos;admission / Tarifs</option>
                        <option value="recrutement">Recrutement / Candidature RH</option>
                        <option value="autre">Autre demande</option>
                    </select>
                </div>

                {/* Nom & Prénom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                        <label htmlFor="contact-first-name" className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                            Prénom <span className="text-terracotta-600">*</span>
                        </label>
                        <input
                            id="contact-first-name"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            required
                            placeholder="Jean"
                            value={formData.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-charcoal-800 text-sm focus:border-terracotta-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta-500 transition-colors placeholder:text-charcoal-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="contact-last-name" className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                            Nom <span className="text-terracotta-600">*</span>
                        </label>
                        <input
                            id="contact-last-name"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            required
                            placeholder="Dupont"
                            value={formData.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-charcoal-800 text-sm focus:border-terracotta-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta-500 transition-colors placeholder:text-charcoal-400"
                        />
                    </div>
                </div>

                {/* Email & Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                        <label htmlFor="contact-email" className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                            Email <span className="text-terracotta-600">*</span>
                        </label>
                        <input
                            id="contact-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="jean.dupont@email.fr"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-charcoal-800 text-sm focus:border-terracotta-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta-500 transition-colors placeholder:text-charcoal-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="contact-phone" className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                            Téléphone
                        </label>
                        <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="06 12 34 56 78"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-charcoal-800 text-sm focus:border-terracotta-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta-500 transition-colors placeholder:text-charcoal-400"
                        />
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                        {formData.subject === 'recrutement' ? 'Lettre de motivation / Message' : 'Votre message'} <span className="text-terracotta-600">*</span>
                    </label>
                    <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder={formData.subject === 'recrutement' ? "Précisez votre poste recherché et vos disponibilités..." : "Bonjour, je souhaite des renseignements concernant..."}
                        required
                        className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-charcoal-800 text-sm focus:border-terracotta-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta-500 transition-colors placeholder:text-charcoal-400 resize-y"
                    />
                </div>

                {/* Upload CV si recrutement */}
                {formData.subject === 'recrutement' && (
                    <div>
                        <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                            Curriculum Vitae (PDF, DOC)
                        </label>
                        <input
                            id="contact-cv"
                            ref={cvInputRef}
                            type="file"
                            name="cv"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setCvFileName(e.target.files[0].name);
                                }
                            }}
                            className="sr-only"
                        />
                        <button
                            type="button"
                            onClick={() => cvInputRef.current?.click()}
                            className="w-full px-3.5 py-2.5 bg-cream-50 border border-dashed border-terracotta-300 rounded-xl flex items-center gap-2 text-terracotta-700 hover:bg-terracotta-50 transition-colors text-left text-xs font-medium"
                        >
                            <Upload className="w-4 h-4 shrink-0 text-terracotta-600" />
                            <span className="truncate">{cvFileName || "Sélectionner un fichier CV"}</span>
                        </button>
                    </div>
                )}

                {/* Case visite si non-recrutement */}
                {formData.subject !== 'recrutement' && formData.subject !== 'visite' && (
                    <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-cream-50 rounded-xl border border-cream-200 hover:bg-cream-100 transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.wantsVisit}
                            onChange={(e) => handleChange("wantsVisit", e.target.checked)}
                            className="w-4 h-4 text-terracotta-600 rounded focus:ring-terracotta-500 border-cream-300"
                        />
                        <span className="text-xs text-charcoal-700 font-medium">Je souhaite également programmer une visite des lieux</span>
                    </label>
                )}

                {/* Bouton d'envoi */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                Envoyer le message
                                <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
