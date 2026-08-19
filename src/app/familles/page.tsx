"use client";

import { useState, useRef } from "react";
import {
    Mail,
    KeyRound,
    Send,
    CheckCircle2,
    Loader2,
    ArrowLeft,
    Camera,
    Image as ImageIcon,
    Clock,
    Utensils,
    HelpCircle,
    Phone,
    Heart,
    Calendar,
    Sparkles,
    Shield,
    Users
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { EHPAD_INFO } from "@/lib/constants";
import Link from "next/link";
import { motion } from "framer-motion";

type TabId = "postier" | "visites" | "table" | "faq";
type Step = "login" | "compose" | "success";

const MAX_WIDTH = 1200;
const QUALITY = 0.8;

const FAMILLE_FAQS = [
    {
        q: "Quelles sont les heures de visite recommandées ?",
        a: "Les visites sont libres, mais nous recommandons particulièrement le créneau de 14h00 à 18h00 afin de respecter le rythme des soins matinaux et le calme des repas."
    },
    {
        q: "Puis-je venir avec mon animal de compagnie ?",
        a: "Oui avec grand plaisir ! Les chiens et chats tenus en laisse et à jour de leurs vaccinations sont les bienvenus dans l'enceinte de l'établissement et dans le parc arboré."
    },
    {
        q: "Comment réserver un repas avec mon proche (Table des Invités) ?",
        a: "Il vous suffit de prévenir l'accueil au moins 48 heures à l'avance (par téléphone au 01 64 63 82 62 ou directement sur place) pour que notre chef prépare vos couverts supplémentaires."
    },
    {
        q: "Comment fonctionne le marquage et l'entretien du linge ?",
        a: "Le linge de lit et de toilette est fourni et blanchi par l'établissement. Pour les vêtements personnels, notre équipe propose l'étiquetage au nom du résident dès l'admission."
    },
    {
        q: "Comment participer à la vie de l'EHPAD (CVS, bénévolat) ?",
        a: "Le Conseil de la Vie Sociale (CVS) se réunit 3 fois par an et comprend des représentants élus des familles. Vous pouvez également proposer des interventions bénévoles auprès du service animation."
    }
];

export default function FamillesPage() {
    const [activeTab, setActiveTab] = useState<TabId>("postier");

    // Postier State
    const [step, setStep] = useState<Step>("login");
    const [secretCode, setSecretCode] = useState("");
    const [senderName, setSenderName] = useState("");
    const [message, setMessage] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [residentName, setResidentName] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!secretCode.trim()) {
            setError("Veuillez entrer le code secret.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/.netlify/functions/famille-send-message", {
                method: "POST",
                body: JSON.stringify({ action: "verify", secretCode })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Code invalide");

            setResidentName(data.residentName);
            setStep("compose");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const bmp = await window.createImageBitmap(file);
            const canvas = document.createElement("canvas");
            let width = bmp.width;
            let height = bmp.height;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            } else if (height > MAX_WIDTH) {
                width = Math.round((width * MAX_WIDTH) / height);
                height = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(bmp, 0, 0, width, height);

            const webp = canvas.toDataURL("image/webp", QUALITY);
            setImage(webp);

            bmp.close();
        } catch (error) {
            console.error("Error processing image:", error);
            setError("Erreur lors du traitement de l'image. Veuillez essayer une autre photo.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!senderName.trim()) return setError("Veuillez indiquer votre nom.");
        if (!message.trim()) return setError("Veuillez écrire un petit mot.");

        setLoading(true);
        try {
            const res = await fetch("/.netlify/functions/famille-send-message", {
                method: "POST",
                body: JSON.stringify({ action: "send", secretCode, senderName, text: message, imageBase64: image })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");

            trackEvent("postier_message_sent", "Carte Postier envoyée");
            setStep("success");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-cream-50 pt-28 sm:pt-36 pb-24">
            <div className="container-custom px-4 max-w-5xl mx-auto">
                {/* En-tête principal */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-100/70 border border-terracotta-200 text-terracotta-700 text-sm font-semibold mb-4">
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Portail des proches & familles</span>
                    </div>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 mb-3">
                        L&apos;Espace Familles
                    </h1>
                    <p className="text-charcoal-600 text-base md:text-lg">
                        Restez en contact permanent avec votre proche, préparez votre venue et retrouvez toutes les informations pratiques du quotidien.
                    </p>
                </div>

                {/* Barre d'onglets (Navigation Hub Famille) */}
                <div
                    role="tablist"
                    aria-label="Sections de l'espace famille"
                    className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-cream-200/80 backdrop-blur-md rounded-2xl md:rounded-full max-w-3xl mx-auto mb-12 border border-cream-300 shadow-inner"
                >
                    <button
                        role="tab"
                        aria-selected={activeTab === "postier"}
                        aria-controls="panel-postier"
                        id="tab-postier"
                        onClick={() => setActiveTab("postier")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl md:rounded-full font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
                            activeTab === "postier"
                                ? "bg-white text-terracotta-600 shadow-md shadow-charcoal-900/5"
                                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/50"
                        }`}
                    >
                        <Mail className="w-4 h-4" />
                        <span>Le Postier Numérique</span>
                    </button>

                    <button
                        role="tab"
                        aria-selected={activeTab === "visites"}
                        aria-controls="panel-visites"
                        id="tab-visites"
                        onClick={() => setActiveTab("visites")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl md:rounded-full font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
                            activeTab === "visites"
                                ? "bg-white text-terracotta-600 shadow-md shadow-charcoal-900/5"
                                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/50"
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        <span>Visites & Horaires</span>
                    </button>

                    <button
                        role="tab"
                        aria-selected={activeTab === "table"}
                        aria-controls="panel-table"
                        id="tab-table"
                        onClick={() => setActiveTab("table")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl md:rounded-full font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
                            activeTab === "table"
                                ? "bg-white text-terracotta-600 shadow-md shadow-charcoal-900/5"
                                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/50"
                        }`}
                    >
                        <Utensils className="w-4 h-4" />
                        <span>Table des Invités</span>
                    </button>

                    <button
                        role="tab"
                        aria-selected={activeTab === "faq"}
                        aria-controls="panel-faq"
                        id="tab-faq"
                        onClick={() => setActiveTab("faq")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl md:rounded-full font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
                            activeTab === "faq"
                                ? "bg-white text-terracotta-600 shadow-md shadow-charcoal-900/5"
                                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/50"
                        }`}
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span>FAQ & Contacts</span>
                    </button>
                </div>

                {/* ========================================================================= */}
                {/* ONGLET 1 : LE POSTIER NUMÉRIQUE                                          */}
                {/* ========================================================================= */}
                {activeTab === "postier" && (
                    <div
                        role="tabpanel"
                        id="panel-postier"
                        aria-labelledby="tab-postier"
                        className="max-w-2xl mx-auto"
                    >
                        {/* Login Step */}
                        {step === "login" && (
                            <div className="bg-white rounded-3xl shadow-xl border border-cream-200 p-6 md:p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center flex-shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-charcoal-900">Envoyer une carte postale</h2>
                                        <p className="text-xs text-charcoal-500">Service gratuit imprimé et remis par l&apos;équipe d&apos;animation</p>
                                    </div>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div>
                                        <label htmlFor="code" className="block text-sm font-medium text-charcoal-700 mb-2">
                                            Code secret du résident
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <KeyRound className="h-5 w-5 text-charcoal-400" />
                                            </div>
                                            <input
                                                id="code"
                                                type="text"
                                                value={secretCode}
                                                onChange={(e) => setSecretCode(e.target.value.toUpperCase())}
                                                placeholder="EX: MARIE-1234"
                                                aria-describedby="resident-code-help"
                                                autoComplete="off"
                                                required
                                                className="block w-full pl-12 pr-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 font-bold tracking-widest text-charcoal-900 uppercase text-lg"
                                            />
                                        </div>
                                        <p id="resident-code-help" className="text-xs text-charcoal-500 mt-2">
                                            Ce code personnel vous a été remis lors de l&apos;admission de votre proche. En cas d&apos;oubli, contactez l&apos;accueil.
                                        </p>
                                    </div>

                                    {error && <div role="alert" aria-live="assertive" className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{error}</div>}

                                    <button
                                        type="submit"
                                        disabled={loading || !secretCode}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-terracotta-600 text-white font-bold hover:bg-terracotta-700 transition-colors disabled:opacity-50 shadow-md shadow-terracotta-600/20"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Accéder à la composition de la carte"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Compose Step */}
                        {step === "compose" && (
                            <div className="bg-white rounded-3xl shadow-xl border border-cream-200 overflow-hidden">
                                <div className="bg-terracotta-50 border-b border-cream-200 p-6 text-center relative">
                                    <button
                                        type="button"
                                        aria-label="Retour à la saisie du code résident"
                                        onClick={() => setStep("login")}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-terracotta-600 hover:bg-terracotta-100 rounded-full transition-colors"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <h2 className="font-serif text-xl font-bold text-terracotta-900">
                                        Nouveau message pour {residentName}
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
                                    <div>
                                        <label htmlFor="sender-name" className="block text-sm font-medium text-charcoal-700 mb-2">
                                            Votre nom ou signature (ex: &quot;Ton fils Paul & tes petits-enfants&quot;)
                                        </label>
                                        <input
                                            id="sender-name"
                                            type="text"
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            placeholder="De la part de..."
                                            autoComplete="name"
                                            required
                                            className="block w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 text-charcoal-900"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="family-message" className="block text-sm font-medium text-charcoal-700 mb-2">
                                            Votre message
                                        </label>
                                        <textarea
                                            id="family-message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={5}
                                            placeholder="Écrivez des nouvelles chaleureuses..."
                                            required
                                            className="block w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 text-charcoal-900 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <p className="block text-sm font-medium text-charcoal-700 mb-2">Ajouter une photo souvenir (optionnel)</p>

                                        {!image ? (
                                            <>
                                                <div className="mb-4 bg-terracotta-50/70 border border-terracotta-100 rounded-xl p-3 flex items-start gap-3">
                                                    <Sparkles className="w-5 h-5 text-terracotta-500 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-charcoal-600 leading-relaxed">
                                                        <strong className="text-terracotta-700 font-semibold block mb-0.5">Conseil pour un plus beau rendu :</strong>
                                                        Privilégiez le format <b>paysage</b> (à l&apos;horizontale) car la carte postale est imprimée dans ce sens !
                                                    </p>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <button
                                                        type="button"
                                                        aria-controls="camera-photo-input"
                                                        onClick={() => cameraInputRef.current?.click()}
                                                        className="flex-1 border-2 border-dashed border-terracotta-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-terracotta-50 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600"
                                                    >
                                                        <Camera className="mx-auto h-10 w-10 text-terracotta-500 group-hover:scale-110 transition-transform mb-3" />
                                                        <p className="text-sm font-bold text-terracotta-700">Prendre une photo</p>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        aria-controls="gallery-photo-input"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="flex-1 border-2 border-dashed border-cream-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-cream-50 hover:border-terracotta-300 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600"
                                                    >
                                                        <ImageIcon className="mx-auto h-10 w-10 text-cream-400 group-hover:text-terracotta-500 transition-colors mb-3" />
                                                        <p className="text-sm font-medium text-charcoal-700">Choisir dans la galerie</p>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="relative rounded-2xl overflow-hidden group border border-cream-200">
                                                <img src={image} alt="Photo sélectionnée" className="w-full h-auto object-cover max-h-80" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setImage(null)}
                                                        className="px-4 py-2 bg-white text-red-600 font-bold rounded-lg shadow-lg hover:bg-red-50"
                                                    >
                                                        Supprimer la photo
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            id="gallery-photo-input"
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                            aria-label="Choisir une photo dans la galerie"
                                        />
                                        <input
                                            id="camera-photo-input"
                                            type="file"
                                            ref={cameraInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            aria-label="Prendre une photo"
                                        />
                                    </div>

                                    {error && <div role="alert" aria-live="assertive" className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{error}</div>}

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading || !message.trim() || !senderName.trim()}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-terracotta-600 text-white font-bold hover:bg-terracotta-700 transition-colors disabled:opacity-50 shadow-md shadow-terracotta-600/20"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Envoyer la carte postale</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Success Step */}
                        {step === "success" && (
                            <div className="bg-white rounded-3xl shadow-xl border border-cream-200 p-10 text-center">
                                <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-charcoal-900 mb-4">Carte postale envoyée avec succès !</h2>
                                <p className="text-charcoal-600 mb-8 max-w-md mx-auto">
                                    L&apos;équipe de l&apos;EHPAD imprimera votre carte et la remettra en main propre à <strong>{residentName}</strong> lors de la prochaine distribution du courrier.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep("compose");
                                        setMessage("");
                                        setImage(null);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-terracotta-300 text-terracotta-700 font-bold hover:bg-terracotta-50 transition-colors"
                                >
                                    Envoyer une autre carte
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================================================= */}
                {/* ONGLET 2 : VISITES & HORAIRES                                             */}
                {/* ========================================================================= */}
                {activeTab === "visites" && (
                    <div
                        role="tabpanel"
                        id="panel-visites"
                        aria-labelledby="tab-visites"
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Carte Horaires */}
                            <div className="p-8 rounded-3xl bg-white border border-cream-200 shadow-md">
                                <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                                    Horaires conseillés
                                </h3>
                                <p className="text-sm text-charcoal-600 mb-4 leading-relaxed">
                                    Les visites sont libres, particulièrement recommandées de :
                                </p>
                                <div className="p-4 rounded-2xl bg-terracotta-50 border border-terracotta-100 text-terracotta-800 font-bold text-lg text-center">
                                    14h00 — 18h00
                                </div>
                                <p className="text-xs text-charcoal-500 mt-4">
                                    La matinée est dédiée aux soins et au repos des résidents.
                                </p>
                            </div>

                            {/* Carte Espaces de rencontre */}
                            <div className="p-8 rounded-3xl bg-white border border-cream-200 shadow-md">
                                <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                                    Espaces de rencontre
                                </h3>
                                <p className="text-sm text-charcoal-600 leading-relaxed mb-4">
                                    Vous pouvez retrouver votre proche en toute intimité :
                                </p>
                                <ul className="text-xs text-charcoal-700 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-forest-500" />
                                        Dans sa chambre privative
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-forest-500" />
                                        Dans les salons d&apos;étage lumineux
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-forest-500" />
                                        Dans le grand parc arboré aménagé
                                    </li>
                                </ul>
                            </div>

                            {/* Carte Animaux bienvenus */}
                            <div className="p-8 rounded-3xl bg-white border border-cream-200 shadow-md">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                                    Animaux de compagnie
                                </h3>
                                <p className="text-sm text-charcoal-600 leading-relaxed mb-4">
                                    Vos animaux sont les bienvenus pour apporter de la joie à leur maître !
                                </p>
                                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-xs text-amber-900">
                                    <strong>Conditions :</strong> Tenus en laisse, vaccinés et sociables.
                                </div>
                            </div>
                        </div>

                        {/* Appel à la sérénité */}
                        <div className="p-8 rounded-3xl bg-cream-100 border border-cream-200 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h4 className="font-serif text-xl font-bold text-charcoal-900">
                                    Envie de faire une visite découverte ?
                                </h4>
                                <p className="text-sm text-charcoal-600">
                                    Vous pouvez également explorer notre parc en visite virtuelle 360°.
                                </p>
                            </div>
                            <Link
                                href="/visite"
                                className="px-6 py-3 rounded-full bg-terracotta-500 text-white font-semibold text-sm hover:bg-terracotta-600 transition-colors shadow-sm whitespace-nowrap"
                            >
                                Explorer la visite virtuelle 360°
                            </Link>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* ONGLET 3 : LA TABLE DES INVITÉS                                          */}
                {/* ========================================================================= */}
                {activeTab === "table" && (
                    <div
                        role="tabpanel"
                        id="panel-table"
                        aria-labelledby="tab-table"
                        className="bg-white rounded-3xl p-8 md:p-12 border border-cream-200 shadow-lg"
                    >
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center flex-shrink-0">
                                    <Utensils className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-900">
                                        Déjeuner avec votre proche
                                    </h2>
                                    <p className="text-sm text-charcoal-500">
                                        Partagez un moment gourmand dans notre restaurant historique de 1868
                                    </p>
                                </div>
                            </div>

                            <div className="prose prose-charcoal max-w-none text-charcoal-700 leading-relaxed space-y-4 mb-8 text-sm md:text-base">
                                <p>
                                    À l&apos;EHPAD de Crécy, les repas sont des moments privilégiés de partage et de convivialité.
                                    Vous avez la possibilité de réserver une <strong>Table des Invités</strong> pour partager le déjeuner
                                    du midi aux côtés de votre proche.
                                </p>
                                <p>
                                    Tous les plats sont <strong>préparés sur place par notre chef cuisinier</strong> à partir de produits frais
                                    et selon des menus équilibrés validés par une diététicienne.
                                </p>
                            </div>

                            {/* Étapes de réservation */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200">
                                    <span className="inline-block w-7 h-7 rounded-full bg-terracotta-500 text-white font-bold text-xs text-center leading-7 mb-2">
                                        1
                                    </span>
                                    <h4 className="font-semibold text-charcoal-900 text-sm mb-1">Prévenir 48h à l&apos;avance</h4>
                                    <p className="text-xs text-charcoal-600">Pour permettre au chef d&apos;ajuster les quantités de produits frais.</p>
                                </div>

                                <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200">
                                    <span className="inline-block w-7 h-7 rounded-full bg-terracotta-500 text-white font-bold text-xs text-center leading-7 mb-2">
                                        2
                                    </span>
                                    <h4 className="font-semibold text-charcoal-900 text-sm mb-1">Indiquer le nombre</h4>
                                    <p className="text-xs text-charcoal-600">Précisez les régimes éventuels auprès du standard d&apos;accueil.</p>
                                </div>

                                <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200">
                                    <span className="inline-block w-7 h-7 rounded-full bg-terracotta-500 text-white font-bold text-xs text-center leading-7 mb-2">
                                        3
                                    </span>
                                    <h4 className="font-semibold text-charcoal-900 text-sm mb-1">Règlement à l&apos;accueil</h4>
                                    <p className="text-xs text-charcoal-600">Tarif invité réglementaire abordable facturé sur place.</p>
                                </div>
                            </div>

                            {/* Contact réservation */}
                            <div className="p-6 rounded-2xl bg-forest-50 border border-forest-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-forest-700" />
                                    <div>
                                        <p className="font-bold text-forest-900 text-sm">Réservation au standard :</p>
                                        <p className="text-xs text-forest-700">{EHPAD_INFO.phone} · {EHPAD_INFO.officeHours.main}</p>
                                    </div>
                                </div>
                                <a
                                    href={`tel:${EHPAD_INFO.phone.replace(/\s/g, "")}`}
                                    className="px-6 py-2.5 rounded-full bg-forest-600 text-white text-xs font-bold hover:bg-forest-700 transition-colors shadow-sm whitespace-nowrap"
                                >
                                    Appeler pour réserver
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* ONGLET 4 : FAQ & CONTACTS UTILES                                         */}
                {/* ========================================================================= */}
                {activeTab === "faq" && (
                    <div
                        role="tabpanel"
                        id="panel-faq"
                        aria-labelledby="tab-faq"
                        className="space-y-8"
                    >
                        {/* Questions fréquentes */}
                        <div className="bg-white rounded-3xl p-8 md:p-10 border border-cream-200 shadow-md">
                            <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                                <HelpCircle className="w-6 h-6 text-terracotta-500" />
                                Questions fréquentes des familles
                            </h2>

                            <div className="space-y-6 divide-y divide-cream-100">
                                {FAMILLE_FAQS.map((faq, index) => (
                                    <div key={index} className={index > 0 ? "pt-6" : ""}>
                                        <h3 className="font-semibold text-charcoal-900 text-base mb-2">
                                            {faq.q}
                                        </h3>
                                        <p className="text-sm text-charcoal-600 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Annuaire des contacts utiles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm">
                                <h3 className="font-bold text-charcoal-900 text-base mb-1">Standard / Accueil</h3>
                                <p className="text-xs text-charcoal-500 mb-4">Renseignements généraux, rendez-vous</p>
                                <p className="font-bold text-terracotta-600 text-lg mb-1">{EHPAD_INFO.phone}</p>
                                <p className="text-xs text-charcoal-500">{EHPAD_INFO.email}</p>
                            </div>

                            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm">
                                <h3 className="font-bold text-charcoal-900 text-base mb-1">Animation & Vie Sociale</h3>
                                <p className="text-xs text-charcoal-500 mb-4">Activités, sorties, gazette, postier</p>
                                <Link
                                    href="/animation"
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-terracotta-600 hover:underline"
                                >
                                    Découvrir le programme →
                                </Link>
                            </div>

                            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm">
                                <h3 className="font-bold text-charcoal-900 text-base mb-1">Admissions & Facturation</h3>
                                <p className="text-xs text-charcoal-500 mb-4">Dossiers APA, aides ASH, factures</p>
                                <Link
                                    href="/hebergement"
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-terracotta-600 hover:underline"
                                >
                                    Consulter les tarifs →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
