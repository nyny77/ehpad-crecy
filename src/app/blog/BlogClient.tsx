"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import gazetteData from "@/lib/data/gazette.json";
import { motion } from "framer-motion";
import WaveSeparator from "@/components/ui/WaveSeparator";
import PageHeader from "@/components/layout/PageHeader";
import BlogGrid from "@/components/blog/BlogGrid";
import DayTimeline from "@/components/social/DayTimeline";
import { BlogPost } from "@/lib/blog";
import { isAuthenticated, isAdmin, logout, onAuthChange } from "@/lib/netlifyAuth";

interface BlogClientProps {
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
                title="Blog"
                subtitle="Le cœur battant de notre maison"
                description="Découvrez tous les moments de partage et actualités qui rythment le quotidien des résidents."
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
                                            <a
                                                href="/admin/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 bg-violet-600 !text-white font-medium rounded-full hover:bg-violet-700 transition-colors text-sm"
                                                title="Gérer le contenu du site (CMS)"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                CMS
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
