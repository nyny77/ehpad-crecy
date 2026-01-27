"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import gazetteData from "@/lib/data/gazette.json";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import PrivateGallery from "@/components/social/PrivateGallery";
import BlogGrid from "@/components/blog/BlogGrid";
import DayTimeline from "@/components/social/DayTimeline";
import SignupModal from "@/components/auth/SignupModal";
import { BlogPost } from "@/lib/blog";
import { isAuthenticated, isAdmin, openLoginWidget, logout, onAuthChange } from "@/lib/netlifyAuth";

interface VieSocialeClientProps {
    initialArticles: BlogPost[];
}

export default function VieSocialeClient({ initialArticles }: VieSocialeClientProps) {
    const [authenticated, setAuthenticated] = useState(false);
    const [adminMode, setAdminMode] = useState(false);
    const [pendingValidation, setPendingValidation] = useState(false); // Used for UI feedback if needed
    const [isLoading, setIsLoading] = useState(true);
    const [showSignupModal, setShowSignupModal] = useState(false);

    // Onglet actif : 'news' ou 'gallery'
    const [activeTab, setActiveTab] = useState<"news" | "gallery">("news");

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

    const handleLogin = () => {
        openLoginWidget("login");
    };

    const handleSignup = () => {
        setShowSignupModal(true);
    };

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
                                                animate={activeTab === "news" ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${activeTab === "news"
                                                    ? "bg-terracotta-500 text-white shadow-md"
                                                    : "text-charcoal-600 hover:bg-cream-50"
                                                    }`}
                                            >
                                                Actualités
                                            </motion.button>
                                            <motion.button
                                                onClick={() => setActiveTab("gallery")}
                                                animate={activeTab === "gallery" ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                                transition={{
                                                    duration: 2,
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
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <a
                                                href={gazetteData.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-white text-forest-600 border border-forest-200 font-medium rounded-full hover:bg-forest-50 transition-colors text-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Gazette
                                            </a>

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
                                // Message d'accueil et boutons de connexion/inscription
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full max-w-md mx-auto mb-8"
                                >
                                    <div className="bg-white rounded-2xl shadow-warm p-5 max-w-md mx-4 text-center">
                                        {/* Icône */}
                                        <div className="w-12 h-12 bg-gradient-to-br from-terracotta-400 to-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>

                                        <h2 className="font-serif text-xl text-charcoal-900 mb-1">
                                            Espace Famille
                                        </h2>
                                        <p className="text-sm text-charcoal-600 mb-4">
                                            Accédez aux photos et actualités
                                        </p>

                                        {/* Bouton Connexion */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleLogin}
                                            className="w-full py-3 bg-terracotta-500 text-white font-semibold rounded-lg hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-2 mb-2 text-sm"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Se connecter
                                        </motion.button>

                                        {/* Séparateur */}
                                        <div className="flex items-center my-2">
                                            <div className="flex-1 h-px bg-cream-200" />
                                            <span className="px-3 text-xs text-charcoal-400">ou</span>
                                            <div className="flex-1 h-px bg-cream-200" />
                                        </div>

                                        {/* Bouton Inscription */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSignup}
                                            className="w-full py-3 border-2 border-forest-500 text-forest-600 font-semibold rounded-lg hover:bg-forest-50 transition-colors flex items-center justify-center gap-2 text-sm"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Créer un compte famille
                                        </motion.button>

                                        {/* Mention RGPD compacte */}
                                        <p className="text-xs text-charcoal-400 mt-3 flex items-center justify-center gap-1">
                                            <svg className="w-3 h-3 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Données protégées (RGPD)
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </section>

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

            {/* Modal d'inscription personnalisée */}
            <SignupModal
                isOpen={showSignupModal}
                onClose={() => setShowSignupModal(false)}
                onSignupSuccess={() => {
                    setShowSignupModal(false);
                    // L'utilisateur devra confirmer son email puis se connecter
                    alert("Inscription réussie ! Votre compte est en attente de validation par l'équipe technique.");
                }}
            />
        </>
    );
}
