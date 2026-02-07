"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import gazetteData from "@/lib/data/gazette.json";
import { motion } from "framer-motion";
import WaveSeparator from "@/components/ui/WaveSeparator";
import PageHeader from "@/components/layout/PageHeader";
import PrivateGallery from "@/components/social/PrivateGallery";
import BlogGrid from "@/components/blog/BlogGrid";
import DayTimeline from "@/components/social/DayTimeline";
import { BlogPost } from "@/lib/blog";
import { isAuthenticated, isAdmin, logout, onAuthChange, openLoginWidget, isPendingValidation } from "@/lib/netlifyAuth";
import AuthSelectionModal from "@/components/auth/AuthSelectionModal";
import SignupModal from "@/components/auth/SignupModal";

interface VieSocialeClientProps {
    initialArticles: BlogPost[];
}

// ...ActivityCard code...

// Styles copied and adapted from IntroSection.tsx
const activityStyles = {
    heart: { // Musique & Chant
        gradient: "from-rose-500 via-terracotta-500 to-rose-600",
        bg: "bg-rose-500",
        glow: "shadow-rose-500/50",
        ring: "ring-rose-400/30"
    },
    star: { // Rencontres
        gradient: "from-amber-400 via-yellow-500 to-orange-500",
        bg: "bg-amber-500",
        glow: "shadow-amber-500/50",
        ring: "ring-amber-400/30"
    },
    eye: { // Jeux & Loisirs
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        bg: "bg-emerald-500",
        glow: "shadow-emerald-500/50",
        ring: "ring-emerald-400/30"
    },
    users: { // Arts créatifs
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        bg: "bg-violet-500",
        glow: "shadow-violet-500/50",
        ring: "ring-violet-400/30"
    },
};

function ActivityCard({ activity, index }: { activity: any, index: number }) {
    // Map activity title to style
    let styleKey = "heart";
    if (activity.title.includes("Arts")) styleKey = "users";
    else if (activity.title.includes("Rencontres")) styleKey = "star";
    else if (activity.title.includes("Jeux")) styleKey = "eye";

    const style = activityStyles[styleKey as keyof typeof activityStyles];

    // Check dark mode for text colors (simplified check here as we are in client component)
    // In a real optimized app we might pass this down or use context, but let's stick to standard classes
    // and let Tailwind generic dark mode handle most, but detailed gradients need specific classes.
    // For consistency with IntroSection, we'll assume light/dark toggling works via class.

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.7,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
            }}
            className="relative group cursor-pointer h-full"
        >
            {/* Animated gradient background that expands on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-110`} />

            {/* Main card */}
            <div className="relative h-full rounded-[2rem] px-6 py-8 flex flex-col items-center transition-all duration-500 bg-white border-2 border-cream-200 shadow-xl group-hover:border-transparent group-hover:shadow-2xl">

                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                    <motion.div
                        className={`absolute w-2 h-2 ${style.bg} rounded-full opacity-40`}
                        animate={{
                            x: [0, 100, 200, 100, 0],
                            y: [0, -50, 0, 50, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.5
                        }}
                        style={{ top: "20%", left: "10%" }}
                    />
                    <motion.div
                        className={`absolute w-3 h-3 ${style.bg} rounded-full opacity-25`}
                        animate={{
                            x: [0, -80, 0, 80, 0],
                            y: [0, 60, 0, -60, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.3
                        }}
                        style={{ top: "60%", right: "20%" }}
                    />
                </div>

                {/* Icon container with pulse animation */}
                <div className="relative flex justify-center mb-6">
                    {/* Outer pulsing ring */}
                    <motion.div
                        className={`absolute inset-0 w-20 h-20 mx-auto rounded-full ${style.ring} ring-8 opacity-50`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.2, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.25
                        }}
                    />

                    {/* Icon background with gradient */}
                    <motion.div
                        className={`relative w-20 h-20 bg-gradient-to-br ${style.gradient} rounded-full flex items-center justify-center shadow-lg ${style.glow} group-hover:shadow-xl transition-shadow duration-500 text-white`}
                        whileHover={{
                            scale: 1.15,
                            rotate: 360,
                            transition: { duration: 0.6 }
                        }}
                    >
                        {activity.icon}
                    </motion.div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-center mb-3 text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                    {activity.title}
                </h3>

                {/* Description */}
                <p className="text-center text-sm leading-relaxed text-charcoal-600 font-medium">
                    {activity.description}
                </p>

                {/* Bottom accent line */}
                <motion.div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r ${style.gradient} rounded-full mb-1`}
                    initial={{ width: "30%" }}
                    whileHover={{ width: "60%" }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </motion.div>
    );
}

export default function VieSocialeClient({ initialArticles }: VieSocialeClientProps) {
    const [authenticated, setAuthenticated] = useState(false);
    const [adminMode, setAdminMode] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Onglet actif : 'news' ou 'gallery'
    const [activeTab, setActiveTab] = useState<"news" | "gallery">("news");
    const [showAuthChoice, setShowAuthChoice] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    useEffect(() => {
        // Initial check
        const checkAuth = () => {
            const isAuth = isAuthenticated();
            setAuthenticated(isAuth);
            setAdminMode(isAdmin());
            setIsPending(isPendingValidation());
            setIsLoading(false);
        };

        checkAuth();

        // Subscribe to changes
        const unsubscribe = onAuthChange((user) => {
            checkAuth();
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logout();
        setAuthenticated(false);
        setAdminMode(false);
    };

    const handleNotify = async () => {
        if (!confirm("Voulez-vous envoyer un email de notification aux inscrits pour signaler une nouveauté ?")) {
            return;
        }

        try {
            const token = window.netlifyIdentity?.currentUser()?.token?.access_token;
            const res = await fetch("/.netlify/functions/send-notification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    subject: "✨ Nouveauté sur l'Espace Vie Sociale",
                    message: "Un nouvel article ou une nouvelle photo vient d'être publié(e) sur l'espace privé des familles. Connectez-vous vite pour le découvrir !",
                }),
            });

            if (res.ok) {
                alert("Notification envoyée avec succès ! 📧");
            } else {
                throw new Error("Erreur lors de l'envoi");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur technique lors de l'envoi de la notification.");
        }
    };

    return (
        <>
            <PageHeader
                title="Vie Sociale"
                subtitle="Le cœur battant de notre maison"
                description="Animations, sorties, événements festifs... Découvrez tous les moments de partage qui rythment le quotidien de nos résidents."
                image="/images/global-hero.jpg"
                alt="Vie sociale à l'EHPAD"
            />

            <section className="py-8 pb-16 bg-cream-100">
                <div className="container-custom">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="relative">
                            {authenticated ? (
                                isPending ? (
                                    // Ecran d'attente de validation
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="w-full max-w-2xl mx-auto text-center bg-white rounded-3xl p-10 shadow-xl border border-cream-200"
                                    >
                                        <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-serif text-2xl md:text-3xl mb-4 font-bold text-charcoal-900">
                                            Compte en attente de validation
                                        </h3>
                                        <p className="text-charcoal-600 text-lg mb-8 leading-relaxed">
                                            Votre inscription a bien été enregistrée. Pour des raisons de sécurité et de confidentialité,
                                            l'accès à l'espace "Vie Sociale" nécessite une <strong>validation manuelle par l'administration</strong>.
                                        </p>
                                        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-8 inline-block">
                                            <p className="flex items-center gap-2">
                                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Vous recevrez un email dès que votre compte sera activé.
                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                onClick={handleLogout}
                                                className="text-charcoal-500 hover:text-terracotta-600 font-medium underline underline-offset-4 transition-colors"
                                            >
                                                Se déconnecter et revenir à l'accueil
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* Navigation des Onglets */}
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 mt-2">
                                            <div className="bg-white p-1.5 rounded-full shadow-sm border border-cream-200 inline-flex gap-4">
                                                <motion.button
                                                    onClick={() => setActiveTab("news")}
                                                    animate={activeTab === "news" ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 cursor-pointer ${activeTab === "news"
                                                        ? "text-white shadow-md relative z-10"
                                                        : "!text-charcoal-800 hover:bg-cream-50"
                                                        }`}
                                                    style={activeTab === "news" ? { background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)' } : {}}
                                                >
                                                    Blog
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => setActiveTab("gallery")}
                                                    animate={activeTab === "gallery" ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 cursor-pointer ${activeTab === "gallery"
                                                        ? "text-white shadow-md relative z-10"
                                                        : "!text-charcoal-800 hover:bg-cream-50"
                                                        }`}
                                                    style={activeTab === "gallery" ? { background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)' } : {}}
                                                >
                                                    Galerie Privée 🔒
                                                </motion.button>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* Bouton Gazette visible pour TOUS les utilisateurs authentifiés */}
                                                {gazetteData?.file && (
                                                    <a
                                                        href={gazetteData.file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2.5 !text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-sm"
                                                        style={{ background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)' }}
                                                        title="Lire le Petit Echo du Coeur"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        Le Petit Echo du Coeur 📰
                                                    </a>
                                                )}
                                                {adminMode && (
                                                    <>
                                                        <Link
                                                            href="/admin-users"
                                                            className="flex items-center gap-2 px-3 py-2 bg-charcoal-800 !text-white font-medium rounded-full hover:bg-charcoal-700 transition-colors text-sm"
                                                            title="Gérer les utilisateurs"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                            </svg>
                                                            Utilisateurs
                                                        </Link>
                                                        <a
                                                            href="/admin/#/collections/gazette"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-2 bg-charcoal-800 !text-white font-medium rounded-full hover:bg-charcoal-700 transition-colors text-sm"
                                                            title="Modifier le Petit echo du coeur"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                            </svg>
                                                            Up Echo du coeur
                                                        </a>
                                                        <button
                                                            onClick={handleNotify}
                                                            className="flex items-center gap-2 px-3 py-2 !text-white font-medium rounded-full transition-colors text-sm cursor-pointer"
                                                            style={{ background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)' }}
                                                            title="Envoyer un email aux familles"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                            </svg>
                                                            Notifier
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={handleLogout}
                                                    className="text-sm text-charcoal-500 hover:text-charcoal-800 underline underline-offset-4 cursor-pointer"
                                                >
                                                    Déconnexion
                                                </button>
                                            </div>
                                        </div>

                                        {/* Contenu */}
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {activeTab === "news" ? (
                                                <BlogGrid articles={initialArticles} isAdminUser={adminMode} />
                                            ) : (
                                                <PrivateGallery />
                                            )}
                                        </motion.div>
                                    </>
                                )
                            ) : (
                                // Design Premium pour inviter à se connecter
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="w-full max-w-xl mx-auto mb-8"
                                >
                                    {/* Card simple et propre */}
                                    <div
                                        className="rounded-3xl p-10 shadow-2xl border border-cream-200 dark:border-charcoal-700"
                                        style={{ backgroundColor: 'var(--access-card-bg, #ffffff)' }}
                                    >
                                        {/* Icône cadenas */}
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: 'var(--access-icon-bg, #fef7f5)' }}>
                                            <svg className="w-10 h-10 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>

                                        {/* Titre */}
                                        <h3
                                            className="font-serif text-2xl md:text-3xl mb-4 text-center font-bold"
                                            style={{ color: 'var(--access-title, #1a1a1f)' }}
                                        >
                                            Espace Famille & Agents
                                        </h3>

                                        {/* Description */}
                                        <p
                                            className="text-center mb-3 leading-relaxed"
                                            style={{ color: 'var(--access-text, #4a4a52)' }}
                                        >
                                            Retrouvez les <span className="text-terracotta-600 font-semibold">actualités détaillées</span> et la <span className="text-forest-600 font-semibold">galerie photos privée</span> de l'établissement.
                                        </p>
                                        <p
                                            className="text-sm text-center mb-8"
                                            style={{ color: 'var(--access-subtext, #6a6a72)' }}
                                        >
                                            Connectez-vous ou créez votre compte pour accéder à cet espace exclusif.
                                        </p>

                                        {/* Bouton */}
                                        <motion.button
                                            onClick={() => setShowAuthChoice(true)}
                                            className="w-full px-8 py-4 text-white font-bold rounded-2xl shadow-lg cursor-pointer transition-colors"
                                            style={{ background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)' }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="flex items-center justify-center gap-3">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Accéder à l&apos;Espace Privé
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </span>
                                        </motion.button>

                                        {/* Badges */}
                                        <div
                                            className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-cream-200 dark:border-charcoal-700"
                                        >
                                            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--access-badge, #5a5a62)' }}>
                                                <svg className="w-4 h-4 text-forest-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span>Connexion sécurisée</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--access-badge, #5a5a62)' }}>
                                                <svg className="w-4 h-4 text-terracotta-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                </svg>
                                                <span>Espace privé famille</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <AuthSelectionModal
                isOpen={showAuthChoice}
                onClose={() => setShowAuthChoice(false)}
                onLogin={() => {
                    setShowAuthChoice(false);
                    openLoginWidget('login');
                }}
                onSignup={() => {
                    setShowAuthChoice(false);
                    setShowSignup(true);
                }}
            />

            <SignupModal
                isOpen={showSignup}
                onClose={() => setShowSignup(false)}
                onSignupSuccess={() => {
                    setShowSignup(false);
                    alert("Inscription réussie ! Votre compte est en attente de validation.");
                }}
            />

            {/* Section activités (toujours visible) - Avec fond coloré et vagues */}
            <section className="section-padding relative py-24 md:py-32 bg-cream-100 overflow-hidden">
                <WaveSeparator position="top" className="text-cream-100" />

                {/* Background décoratif (Blobs animated) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0]
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta-200/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"
                    />
                    <motion.div
                        animate={{
                            y: [0, 40, 0],
                            scale: [1, 1.2, 1],
                            rotate: [0, -5, 0]
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-forest-200/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"
                    />
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center mb-12">
                        <span className="text-forest-600 font-bold tracking-wider uppercase text-sm">Animations</span>
                        <h2 className="font-serif text-3xl md:text-5xl text-charcoal-900 mt-3 mb-6">
                            Un programme varié
                        </h2>
                        <p className="text-charcoal-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Notre animatrice propose chaque semaine un programme d&apos;activités
                            adapté aux envies et capacités de chacun.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                ),
                                title: "Musique & Chant",
                                description: "Concerts, karaoké, musicothérapie",
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                ),
                                title: "Arts créatifs",
                                description: "Peinture, dessin, loisirs créatifs",
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ),
                                title: "Rencontres",
                                description: "Visites d'associations, écoliers",
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                title: "Jeux & Loisirs",
                                description: "Jeux de société, loto, quiz",
                            },
                        ].map((activity, index) => (
                            <ActivityCard key={activity.title} activity={activity} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Journée Type */}
            <DayTimeline />

            {/* Modal d'inscription personnalisée - DEPLACÉ DANS LE HEADER */}
        </>
    );
}
