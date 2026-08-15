"use client";

import { useEffect, useState } from "react";
import { BookOpen, Camera, LogIn, LogOut, ShieldCheck } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import type { GalleryImage } from "@/lib/gallery";
import {
    getCurrentUser,
    initNetlifyIdentity,
    isAdmin,
    logout,
    onAuthChange,
    openLoginWidget,
} from "@/lib/netlifyAuth";
import PhotoManager from "./PhotoManager";
import BlogManager from "./BlogManager";
import GazetteManager from "./GazetteManager";
import ResidentManager from "./ResidentManager";
import CourrierManager from "./CourrierManager";
import { Newspaper, Users, Mail } from "lucide-react";

type AccessState = "loading" | "guest" | "forbidden" | "admin";

export default function AdminDashboard({ initialArticles, initialPhotos }: { initialArticles: BlogPost[]; initialPhotos: GalleryImage[] }) {
    const [access, setAccess] = useState<AccessState>("loading");
    const [tab, setTab] = useState<"photos" | "blog" | "gazette" | "residents" | "courrier">("photos");

    useEffect(() => {
        if (window.location.hash === "#blog") setTab("blog");
        if (window.location.hash === "#gazette") setTab("gazette");
        if (window.location.hash === "#residents") setTab("residents");
        if (window.location.hash === "#courrier") setTab("courrier");
        let unsubscribe = () => {};
        let attempts = 0;
        const timer = window.setInterval(() => {
            attempts += 1;
            if (!window.netlifyIdentity && attempts < 60) return;
            window.clearInterval(timer);
            initNetlifyIdentity();
            const update = () => setAccess(!getCurrentUser() ? "guest" : isAdmin() ? "admin" : "forbidden");
            update();
            unsubscribe = onAuthChange(update);
        }, 100);
        return () => {
            window.clearInterval(timer);
            unsubscribe();
        };
    }, []);

    if (access !== "admin") {
        return (
            <main className="pt-36 pb-24 min-h-screen bg-cream-100 px-4">
                <section className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-cream-200 p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-terracotta-50 text-terracotta-600 flex items-center justify-center mx-auto mb-5">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="font-serif text-3xl text-charcoal-900 mb-3">Administration</h1>
                    {access === "loading" && <p className="text-charcoal-600">Vérification de votre session…</p>}
                    {access === "guest" && (
                        <>
                            <p className="text-charcoal-600 mb-6">Connectez-vous avec votre compte administrateur Netlify.</p>
                            <button onClick={() => openLoginWidget("login")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta-600 text-white font-semibold">
                                <LogIn size={19} /> Se connecter
                            </button>
                        </>
                    )}
                    {access === "forbidden" && (
                        <>
                            <p className="text-charcoal-600 mb-2">Le compte <strong>{getCurrentUser()?.email}</strong> ne possède pas le rôle administrateur.</p>
                            <p className="text-sm text-charcoal-500 mb-6">Les comptes famille n’ont pas accès à cette page.</p>
                            <button onClick={() => logout()} className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-charcoal-300 text-charcoal-700 font-semibold">
                                <LogOut size={19} /> Changer de compte
                            </button>
                        </>
                    )}
                </section>
            </main>
        );
    }

    return (
        <main className="pt-32 md:pt-40 pb-20 min-h-screen bg-cream-100">
            <div className="container-custom px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
                    <div>
                        <p className="uppercase tracking-[0.2em] text-xs text-terracotta-600 font-bold mb-2">Espace sécurisé</p>
                        <h1 className="font-serif text-4xl md:text-5xl text-charcoal-900">Administration</h1>
                        <p className="text-charcoal-600 mt-2">Connecté avec {getCurrentUser()?.email}</p>
                    </div>
                    <button onClick={() => logout()} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white border border-cream-300 text-charcoal-700 hover:border-terracotta-300">
                        <LogOut size={18} /> Déconnexion
                    </button>
                </div>

                <nav className="inline-flex flex-wrap gap-2 bg-white rounded-2xl border border-cream-200 p-1.5 shadow-sm mb-8" aria-label="Sections d’administration">
                    <button onClick={() => { setTab("photos"); window.history.replaceState(null, "", "#photos"); }} className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold transition-colors ${tab === "photos" ? "bg-terracotta-600 text-white" : "text-charcoal-600 hover:bg-cream-100"}`}>
                        <Camera size={19} /> <span className="hidden md:inline">Photos</span>
                    </button>
                    <button onClick={() => { setTab("blog"); window.history.replaceState(null, "", "#blog"); }} className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold transition-colors ${tab === "blog" ? "bg-terracotta-600 text-white" : "text-charcoal-600 hover:bg-cream-100"}`}>
                        <BookOpen size={19} /> <span className="hidden md:inline">Blog</span>
                    </button>
                    <button onClick={() => { setTab("gazette"); window.history.replaceState(null, "", "#gazette"); }} className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold transition-colors ${tab === "gazette" ? "bg-terracotta-600 text-white" : "text-charcoal-600 hover:bg-cream-100"}`}>
                        <Newspaper size={19} /> <span className="hidden md:inline">Écho du Coeur</span>
                    </button>
                    <button onClick={() => { setTab("residents"); window.history.replaceState(null, "", "#residents"); }} className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold transition-colors ${tab === "residents" ? "bg-terracotta-600 text-white" : "text-charcoal-600 hover:bg-cream-100"}`}>
                        <Users size={19} /> <span className="hidden md:inline">Résidents</span>
                    </button>
                    <button onClick={() => { setTab("courrier"); window.history.replaceState(null, "", "#courrier"); }} className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold transition-colors ${tab === "courrier" ? "bg-terracotta-600 text-white" : "text-charcoal-600 hover:bg-cream-100"}`}>
                        <Mail size={19} /> <span className="hidden md:inline">Courrier</span>
                    </button>
                </nav>

                {tab === "photos" && <PhotoManager initialPhotos={initialPhotos} />}
                {tab === "blog" && <BlogManager initialArticles={initialArticles} />}
                {tab === "gazette" && <GazetteManager />}
                {tab === "residents" && <ResidentManager />}
                {tab === "courrier" && <CourrierManager />}
            </div>
        </main>
    );
}
