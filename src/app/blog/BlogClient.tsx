"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import gazetteData from "@/lib/data/gazette.json";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import BlogGrid from "@/components/blog/BlogGrid";
import { BlogPost } from "@/lib/blog";
import { isAuthenticated, isAdmin, logout, onAuthChange } from "@/lib/netlifyAuth";

interface BlogClientProps {
    initialArticles: BlogPost[];
}



export default function BlogClient({ initialArticles }: BlogClientProps) {
    const [authenticated, setAuthenticated] = useState(false);
    const [adminMode, setAdminMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    const handleLogout = async () => {
        await logout();
        setAuthenticated(false);
        setAdminMode(false);
    };



    return (
        <>
            <PageHeader
                title="Blog"
                subtitle="Actualités de l'établissement"
                description="Retrouvez ici toutes les dernières nouvelles, nos projets et les événements de la vie de l'EHPAD."
                image="/images/global-hero.jpg"
                alt="Blog de l'EHPAD"
            />

            <section className="py-8 pb-16 bg-cream-100">
                <div className="container-custom">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                                                <div className="relative">
                            {/* Navigation des Boutons (Echo et Admin) */}
                            <div className="flex flex-col md:flex-row items-center justify-end gap-6 mb-8 mt-2">
                                <div className="flex items-center gap-3">
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
                                        </>
                                    )}

                                    {authenticated && (
                                        <button
                                            onClick={handleLogout}
                                            className="text-sm text-charcoal-500 hover:text-charcoal-800 underline underline-offset-4 cursor-pointer"
                                        >
                                            Déconnexion
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Contenu */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <BlogGrid articles={initialArticles} isAdminUser={adminMode} />
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>


            {/* Modal d'inscription personnalisée - DEPLACÉ DANS LE HEADER */}

        </>
    );
}
