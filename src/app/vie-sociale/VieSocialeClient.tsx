"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import gazetteData from "@/lib/data/gazette.json";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import PrivateGallery from "@/components/social/PrivateGallery";
import BlogGrid from "@/components/blog/BlogGrid";
import DayTimeline from "@/components/social/DayTimeline";
import { BlogPost } from "@/lib/blog";
import { isAuthenticated, isAdmin, logout, onAuthChange, openLoginWidget } from "@/lib/netlifyAuth";
import AuthSelectionModal from "@/components/auth/AuthSelectionModal";
import SignupModal from "@/components/auth/SignupModal";

interface VieSocialeClientProps {
    initialArticles: BlogPost[];
}

export default function VieSocialeClient({ initialArticles }: VieSocialeClientProps) {
    const [authenticated, setAuthenticated] = useState(false);
    const [adminMode, setAdminMode] = useState(false);
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
            setIsLoading(false);
        };

        checkAuth();

        // Subscribe to changes
        const unsubscribe = onAuthChange((user) => {
            checkAuth();
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        logout();
        setAuthenticated(false);
        setAdminMode(false);
        setActiveTab("news"); // Reset tab on logout
    };

    return (
        <>
            <PageHeader
                title="Vie Sociale"
                subtitle="Le cœur battant de notre maison"
                image="/images/hero-v2.jpg"
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
                                <>
                                    {/* Navigation des Onglets */}
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 mt-2">
                                        <div className="bg-white p-1.5 rounded-full shadow-sm border border-cream-200 inline-flex">
                                            <motion.button
                                                onClick={() => setActiveTab("news")}
                                                animate={activeTab === "news" ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${activeTab === "news"
                                                    ? "bg-terracotta-500 text-white shadow-md"
                                                    : "text-charcoal-600 hover:bg-cream-50"
                                                    }`}
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
                                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${activeTab === "gallery"
                                                    ? "bg-terracotta-500 text-white shadow-md"
                                                    : "text-charcoal-600 hover:bg-cream-50"
                                                    }`}
                                            >
                                                Galerie Privée 🔒
                                            </motion.button>
                                            <motion.a
                                                href={gazetteData.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                animate={{ scale: [1, 1.05, 1] }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 text-charcoal-600 hover:bg-cream-50 flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Petit echo du coeur
                                            </motion.a>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {adminMode && (
                                                <a
                                                    href="/admin/#/collections/gazette"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 bg-charcoal-800 text-white font-medium rounded-full hover:bg-charcoal-700 transition-colors text-sm"
                                                    title="Modifier le Petit echo du coeur"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                    Modifier gazette
                                                </a>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="text-sm text-charcoal-500 hover:text-charcoal-800 underline underline-offset-4"
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
                            ) : (
                                // Design Premium pour inviter à se connecter
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="w-full max-w-xl mx-auto mb-8"
                                >
                                    {/* Card avec effet glassmorphism et bordure animée */}
                                    <div className="relative group">
                                        {/* Bordure animée gradient */}
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-terracotta-400 via-forest-400 to-terracotta-400 rounded-3xl opacity-60 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200 animate-gradient-x"></div>

                                        {/* Contenu principal */}
                                        <div className="relative bg-gradient-to-br from-white via-cream-50 to-white rounded-3xl p-10 shadow-2xl">
                                            {/* Éléments décoratifs flottants */}
                                            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-terracotta-200/30 to-transparent rounded-full blur-xl"></div>
                                            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-forest-200/30 to-transparent rounded-full blur-xl"></div>

                                            {/* Icône animée avec effet de pulsation */}
                                            <motion.div
                                                className="relative w-24 h-24 mx-auto mb-6"
                                                animate={{
                                                    y: [0, -8, 0],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                {/* Cercles de fond animés */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-br from-terracotta-200 to-forest-200 rounded-full"
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                />
                                                <motion.div
                                                    className="absolute inset-2 bg-gradient-to-tr from-cream-100 to-white rounded-full shadow-inner"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <motion.svg
                                                        className="w-10 h-10 text-terracotta-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        animate={{ rotate: [0, 5, -5, 0] }}
                                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </motion.svg>
                                                </div>
                                            </motion.div>

                                            {/* Titre avec effet de gradient */}
                                            <h3 className="font-serif text-2xl md:text-3xl bg-gradient-to-r from-charcoal-800 via-terracotta-600 to-charcoal-800 bg-clip-text text-transparent mb-4 text-center font-bold">
                                                Espace Famille Sécurisé
                                            </h3>

                                            {/* Description améliorée */}
                                            <p className="text-charcoal-600 text-center mb-3 leading-relaxed">
                                                Retrouvez les <span className="text-terracotta-600 font-semibold">actualités détaillées</span> et la <span className="text-forest-600 font-semibold">galerie photos privée</span> de votre proche.
                                            </p>
                                            <p className="text-charcoal-500 text-sm text-center mb-8">
                                                Connectez-vous ou créez votre compte famille pour accéder à cet espace exclusif.
                                            </p>

                                            {/* Bouton premium avec effet de brillance */}
                                            <motion.button
                                                onClick={() => setShowAuthChoice(true)}
                                                className="relative w-full overflow-hidden px-8 py-4 bg-gradient-to-r from-terracotta-500 via-terracotta-400 to-terracotta-500 text-white font-bold rounded-2xl shadow-lg cursor-pointer group/btn"
                                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(180, 83, 62, 0.4)" }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {/* Effet de brillance qui passe */}
                                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"></span>

                                                <span className="relative flex items-center justify-center gap-3">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Accéder à l&apos;Espace Famille
                                                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </span>
                                            </motion.button>

                                            {/* Badges de confiance */}
                                            <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-cream-200">
                                                <div className="flex items-center gap-2 text-xs text-charcoal-500">
                                                    <svg className="w-4 h-4 text-forest-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Connexion sécurisée</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-charcoal-500">
                                                    <svg className="w-4 h-4 text-terracotta-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Espace privé famille</span>
                                                </div>
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

            {/* Timeline Journée Type */}
            <DayTimeline />

            {/* Section activités (toujours visible) */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <span className="text-forest-500 font-medium">Animations</span>
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 mt-2 mb-4">
                            Un programme varié
                        </h2>
                        <p className="text-charcoal-600 max-w-2xl mx-auto">
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
                            <motion.div
                                key={activity.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="card-warm p-6 text-center"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-terracotta-100 to-forest-100 rounded-2xl flex items-center justify-center text-terracotta-500 mx-auto mb-4">
                                    {activity.icon}
                                </div>
                                <h3 className="font-serif text-lg font-semibold text-charcoal-900 mb-2">
                                    {activity.title}
                                </h3>
                                <p className="text-sm text-charcoal-600">{activity.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal d'inscription personnalisée - DEPLACÉ DANS LE HEADER */}
        </>
    );
}
