"use client";

import { useState, useRef } from "react";
import { Mail, KeyRound, Upload, Send, CheckCircle2, Loader2, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Step = "login" | "compose" | "success";

const MAX_WIDTH = 1200;
const QUALITY = 0.8;

export default function FamillesPage() {
    const [step, setStep] = useState<Step>("login");
    const [secretCode, setSecretCode] = useState("");
    const [senderName, setSenderName] = useState("");
    const [message, setMessage] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [residentName, setResidentName] = useState("");
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!secretCode.trim()) {
            setError("Veuillez entrer le code secret.");
            return;
        }
        
        // On the login step, we don't actually verify the code via the backend immediately to save an API call and keep it simple.
        // We will verify it during the final submission. Wait, actually we SHOULD verify it so we can show who they are writing to!
        // But our backend API is a single `famille-send-message.ts`. We can add a "verify" action.
        
        // Actually, to make it seamless, let's just create a quick endpoint or modify the existing one.
        // I will modify `famille-send-message.ts` locally in my mind to handle action="verify".
        setLoading(true);
        try {
            const res = await fetch("/.netlify/functions/famille-send-message", {
                method: "POST",
                body: JSON.stringify({ action: "verify", secretCode })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Code incorrect");
            
            setResidentName(data.residentName);
            setStep("compose");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;
                
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);
                
                const webp = canvas.toDataURL("image/webp", QUALITY);
                setImage(webp);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
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
            
            setStep("success");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-cream-50 pt-32 pb-20">
            <div className="container-custom px-4 max-w-2xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-full bg-terracotta-100 text-terracotta-600 flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} />
                    </div>
                    <h1 className="font-serif text-3xl md:text-4xl text-charcoal-900 mb-2">Le Postier Numérique</h1>
                    <p className="text-charcoal-600">Envoyez facilement une carte postale à votre proche.</p>
                </div>

                {/* Login Step */}
                {step === "login" && (
                    <div className="bg-white rounded-3xl shadow-xl border border-cream-200 p-6 md:p-10">
                        <h2 className="text-xl font-bold text-charcoal-900 mb-6 text-center">Connexion Sécurisée</h2>
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
                                        className="block w-full pl-12 pr-4 py-3 border border-cream-300 rounded-xl focus:ring-terracotta-500 focus:border-terracotta-500 font-bold tracking-widest text-charcoal-900 uppercase"
                                    />
                                </div>
                                <p className="text-sm text-charcoal-500 mt-2">
                                    Ce code vous a été transmis par l'équipe de l'EHPAD.
                                </p>
                            </div>
                            
                            {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

                            <button
                                type="submit"
                                disabled={loading || !secretCode}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-terracotta-600 text-white font-bold hover:bg-terracotta-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Accéder à la messagerie"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Compose Step */}
                {step === "compose" && (
                    <div className="bg-white rounded-3xl shadow-xl border border-cream-200 overflow-hidden">
                        <div className="bg-terracotta-50 border-b border-cream-200 p-6 text-center relative">
                            <button onClick={() => setStep("login")} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-terracotta-600 hover:bg-terracotta-100 rounded-full transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="font-serif text-xl font-bold text-terracotta-900">Nouveau message pour {residentName}</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">Votre nom (ex: "Ton fils Paul")</label>
                                <input
                                    type="text"
                                    value={senderName}
                                    onChange={(e) => setSenderName(e.target.value)}
                                    placeholder="De la part de..."
                                    className="block w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-terracotta-500 focus:border-terracotta-500 text-charcoal-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">Votre message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                    placeholder="Écrivez un petit mot..."
                                    className="block w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-terracotta-500 focus:border-terracotta-500 text-charcoal-900 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">Ajouter une photo (optionnel)</label>
                                
                                {!image ? (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-cream-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-cream-50 hover:border-terracotta-300 transition-colors group"
                                    >
                                        <Camera className="mx-auto h-12 w-12 text-cream-400 group-hover:text-terracotta-500 transition-colors mb-3" />
                                        <p className="text-sm font-medium text-charcoal-700">Cliquez pour ajouter une photo</p>
                                        <p className="text-xs text-charcoal-500 mt-1">Sera imprimée avec votre message</p>
                                    </div>
                                ) : (
                                    <div className="relative rounded-2xl overflow-hidden group">
                                        <img src={image} alt="Photo sélectionnée" className="w-full h-auto object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                type="button"
                                                onClick={() => setImage(null)}
                                                className="px-4 py-2 bg-white text-red-600 font-bold rounded-lg"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || !message.trim() || !senderName.trim()}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-terracotta-600 text-white font-bold hover:bg-terracotta-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Envoyer le message</>}
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
                        <h2 className="text-2xl font-bold text-charcoal-900 mb-4">Message envoyé !</h2>
                        <p className="text-charcoal-600 mb-8">
                            L'équipe de l'EHPAD l'imprimera et le remettra à {residentName} dans les plus brefs délais.
                        </p>
                        <button
                            onClick={() => {
                                setStep("compose");
                                setMessage("");
                                setImage(null);
                            }}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-terracotta-200 text-terracotta-700 font-bold hover:bg-terracotta-50 transition-colors"
                        >
                            Envoyer un autre message
                        </button>
                    </div>
                )}

            </div>
        </main>
    );
}
