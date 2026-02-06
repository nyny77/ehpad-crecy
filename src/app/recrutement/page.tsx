"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import Link from "next/link";
import { CAREERS_OFFERS, SPONTANEOUS_APPLICATION } from "@/lib/careers";
import { isAdmin, initNetlifyIdentity, onAuthChange } from "@/lib/netlifyAuth";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";

// Styles for Advantage Cards (reused logic from IntroSection/VieSociale)
const advantageStyles = {
    forest: {
        gradient: "from-emerald-500 via-green-500 to-teal-500",
        bg: "bg-emerald-500",
        glow: "shadow-emerald-500/50",
        ring: "ring-emerald-400/30"
    },
    terracotta: {
        gradient: "from-terracotta-500 via-rose-500 to-red-500",
        bg: "bg-terracotta-500",
        glow: "shadow-terracotta-500/50",
        ring: "ring-terracotta-400/30"
    },
    amber: {
        gradient: "from-amber-400 via-orange-500 to-yellow-500",
        bg: "bg-amber-500",
        glow: "shadow-amber-500/50",
        ring: "ring-amber-400/30"
    },
    blue: {
        gradient: "from-sky-500 via-blue-500 to-indigo-500",
        bg: "bg-blue-500",
        glow: "shadow-blue-500/50",
        ring: "ring-blue-400/30"
    },
    violet: {
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        bg: "bg-violet-500",
        glow: "shadow-violet-500/50",
        ring: "ring-violet-400/30"
    },
    rose: {
        gradient: "from-rose-400 via-pink-500 to-fuchsia-400",
        bg: "bg-rose-500",
        glow: "shadow-rose-500/50",
        ring: "ring-rose-400/30"
    }
};

function AdvantageCard({ advantage, index }: { advantage: any, index: number }) {
    const style = advantageStyles[advantage.style as keyof typeof advantageStyles] || advantageStyles.forest;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.7,
                delay: index * 0.1,
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
                        {advantage.icon}
                    </motion.div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-center mb-3 text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                    {advantage.title}
                </h3>

                {/* Description */}
                <p className="text-center text-sm leading-relaxed text-charcoal-600 font-medium">
                    {advantage.description}
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

const ADVANTAGES = [
    {
        title: "Fonction Publique Hospitalière",
        description: "Sécurité de l'emploi, régime indemnitaire, avancement de carrière et retraite CNRACL.",
        style: "forest",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        )
    },
    {
        title: "Avantages CGOS",
        description: "Chèques vacances, aides aux loisirs, prestations sociales et réductions partenaires.",
        style: "terracotta",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        title: "Postes en 12h",
        description: "Organisation en journées de 12h pour les soins et la cuisine : plus de jours de repos !",
        style: "amber",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        title: "Gare à proximité",
        description: "La gare Transilien de Crécy-la-Chapelle est à 10 min à pied. Ligne P direction Paris Est.",
        style: "blue",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        )
    },
    {
        title: "Salle de pause confortable",
        description: "Espace détente équipé et agréable pour vos pauses, dans une ambiance familiale.",
        style: "violet",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    {
        title: "Équipement ergonomique",
        description: "Lève-malades sur rails au plafond pour préserver votre santé et faciliter les transferts.",
        style: "rose",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        )
    }
];

// Styles for Job Cards based on contract type
const jobStyles = {
    CDI: {
        gradient: "from-emerald-500 via-green-500 to-teal-500",
        bg: "bg-emerald-500",
        lightBg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
        button: "from-emerald-600 to-teal-600"
    },
    CDD: {
        gradient: "from-amber-400 via-orange-500 to-yellow-500",
        bg: "bg-amber-500",
        lightBg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-800 border-amber-200",
        button: "from-amber-500 to-orange-500"
    },
    Vacataire: {
        gradient: "from-sky-500 via-blue-500 to-indigo-500",
        bg: "bg-blue-500",
        lightBg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-800 border-blue-200",
        button: "from-blue-600 to-indigo-600"
    },
    Default: {
        gradient: "from-terracotta-500 via-rose-500 to-red-500",
        bg: "bg-terracotta-500",
        lightBg: "bg-terracotta-50",
        text: "text-terracotta-700",
        border: "border-terracotta-200",
        badge: "bg-terracotta-100 text-terracotta-800 border-terracotta-200",
        button: "from-terracotta-500 to-rose-500"
    }
};

function JobCard({ offer }: { offer: typeof CAREERS_OFFERS[0] }) {
    // Determine style based on contract type (or default)
    const styleKey = Object.keys(jobStyles).find(key => offer.contract.includes(key)) || "Default";
    const style = jobStyles[styleKey as keyof typeof jobStyles];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="h-full group relative"
        >
            {/* Animated gradient background that expands on hover - subtler than advantages */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-105`} />

            <div className="relative h-full bg-white rounded-[2.5rem] p-8 border border-cream-200 shadow-lg group-hover:shadow-2xl group-hover:border-transparent transition-all duration-300 flex flex-col overflow-hidden">

                {/* Top colored accent line */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${style.gradient}`} />

                <div className="flex justify-between items-start mb-6 mt-2">
                    <h3 className="text-2xl font-serif font-bold text-charcoal-900 leading-snug group-hover:text-terracotta-700 transition-colors">
                        {offer.title}
                    </h3>
                    <span className={`text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider text-center whitespace-nowrap ml-3 border ${style.badge} shadow-sm`}>
                        {offer.contract}
                    </span>
                </div>

                <p className="text-charcoal-600 mb-8 flex-grow leading-relaxed font-medium">
                    {offer.description}
                </p>

                <div className={`p-6 rounded-2xl ${style.lightBg} mb-8 border ${style.border}`}>
                    <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${style.text} flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Profil recherché
                    </h4>
                    <ul className="space-y-3">
                        {offer.requirements.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-700">
                                <div className={`rounded-full p-1 mt-0.5 text-white shrink-0 ${style.bg} shadow-sm`}>
                                    <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span>{item.req}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Link
                    href={`/contact?subject=Candidature - ${offer.title}`}
                    className={`block w-full text-center bg-gradient-to-r ${style.button} text-white font-bold py-4 rounded-xl hover:brightness-110 hover:scale-[1.02] transition-all shadow-md hover:shadow-lg active:scale-95`}
                >
                    Postuler maintenant
                </Link>
            </div>
        </motion.div>
    );
}

export default function RecrutementPage() {
    const [adminMode, setAdminMode] = useState(false);

    useEffect(() => {
        initNetlifyIdentity();
        setAdminMode(isAdmin());

        const unsubscribe = onAuthChange((user) => {
            setAdminMode(!!user && isAdmin());
        });

        return () => unsubscribe();
    }, []);

    return (
        <main className="pb-20 bg-cream-100 min-h-screen">
            {/* Hero Section */}
            <PageHeader
                title="Une équipe qui a du cœur"
                subtitle="Nous recrutons"
                description="Établissement public de la Fonction Publique Hospitalière, nous cherchons des professionnels passionnés pour accompagner nos résidents au quotidien."
            />

            {/* Admin Button - EN DEHORS du PageHeader */}
            {adminMode && (
                <section className="container-custom px-4 -mt-8 mb-8 text-center">
                    <Link
                        href="/admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-charcoal-800 text-white px-6 py-3 rounded-full hover:bg-charcoal-700 transition-colors shadow-lg font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Gérer les offres (CMS)
                    </Link>
                </section>
            )}

            {/* Pourquoi nous rejoindre - Section Avantages */}
            <section className="py-24 bg-cream-50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <span className="text-forest-500 font-bold uppercase tracking-wider text-sm">Vos avantages</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-charcoal-900 mt-2 mb-6">
                            Pourquoi nous rejoindre ?
                        </h2>
                        <p className="text-charcoal-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            L'EHPAD de Crécy est un établissement <strong>public</strong> rattaché à la Fonction Publique Hospitalière,
                            offrant un cadre de travail privilégié en milieu rural.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {ADVANTAGES.map((advantage, index) => (
                            <AdvantageCard key={advantage.title} advantage={advantage} index={index} />
                        ))}
                    </div>

                    {/* Badge cadre rural */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 text-center"
                    >
                        <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full border border-forest-100 shadow-md">
                            <svg className="w-6 h-6 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span className="text-forest-700 font-semibold text-lg">
                                Cadre rural en Seine-et-Marne · 45 min de Paris · 15 min de Disneyland Paris
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Postes ouverts */}
            <section className="py-12 bg-cream-100">
                <div className="container-custom">
                    <h2 className="text-3xl font-serif text-charcoal-900 mb-12 text-center">Nos postes actuellement ouverts</h2>

                    {CAREERS_OFFERS.length === 0 ? (
                        <div className="text-center text-charcoal-500 italic py-16 bg-white rounded-3xl shadow-sm border border-cream-200 max-w-2xl mx-auto">
                            Aucun poste ouvert pour le moment.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {CAREERS_OFFERS.map((offer) => (
                                <JobCard key={offer.id} offer={offer} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Candidature spontanée */}
            <section className="py-20 bg-cream-200/50">
                <div className="container-custom text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-serif text-charcoal-900 mb-6">{SPONTANEOUS_APPLICATION.title}</h2>
                    <p className="text-charcoal-700 mb-10 whitespace-pre-line text-lg leading-relaxed">
                        {SPONTANEOUS_APPLICATION.description}
                    </p>
                    <Link
                        href="/contact?subject=recrutement"
                        className="inline-flex items-center gap-2 bg-white text-terracotta-600 border-2 border-terracotta-500 font-bold py-3 px-8 rounded-full hover:bg-terracotta-50 transition-colors shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {SPONTANEOUS_APPLICATION.cta}
                    </Link>
                </div>
            </section>
        </main>
    );
}
