"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CAREERS_OFFERS, JOB_FACILITIES, SPONTANEOUS_APPLICATION, type JobOffer } from "@/lib/careers";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";


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
                    <div className={`absolute inset-0 ${style.bg} blur-md opacity-20 rounded-full animate-pulse`} />
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center ${style.glow} transform -rotate-6 group-hover:rotate-0 transition-transform duration-500 text-white`}>
                        {advantage.icon}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-charcoal-800 mb-3 text-center">
                    {advantage.title}
                </h3>

                {/* Description */}
                <p className="text-charcoal-600 text-center font-medium leading-relaxed">
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
        description: "Organisation en journées de 12h pour les postes AS et IDE : plus de jours de repos !",
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

// Une identité visuelle propre à chaque établissement de la direction commune.
const jobStyles = {
    crecy: {
        gradient: "from-red-600 via-rose-600 to-red-500",
        bg: "bg-red-600",
        lightBg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        badge: "bg-red-100 text-red-800 border-red-200",
        button: "from-red-600 to-rose-600"
    },
    "le-marais": {
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
        bg: "bg-orange-500",
        lightBg: "bg-amber-50",
        text: "text-orange-800",
        border: "border-orange-200",
        badge: "bg-orange-100 text-orange-800 border-orange-200",
        button: "from-orange-500 to-amber-500"
    },
    "saint-aile": {
        gradient: "from-violet-600 via-purple-600 to-fuchsia-500",
        bg: "bg-violet-600",
        lightBg: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200",
        badge: "bg-violet-100 text-violet-800 border-violet-200",
        button: "from-violet-600 to-purple-600"
    },
    "pierre-comby": {
        gradient: "from-emerald-600 via-green-600 to-teal-500",
        bg: "bg-emerald-600",
        lightBg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
        button: "from-emerald-600 to-green-600"
    }
};

function JobCard({ offer, index, onOpen }: { offer: JobOffer, index: number, onOpen: (offer: JobOffer) => void }) {
    const style = jobStyles[offer.facilityId];
    const facility = JOB_FACILITIES.find((item) => item.id === offer.facilityId);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full group relative"
        >
            {/* Animated gradient background that expands on hover - subtler than advantages */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-105`} />

            <div className="relative h-full bg-white rounded-[2.5rem] p-8 border border-cream-200 shadow-lg group-hover:shadow-2xl group-hover:border-transparent transition-all duration-300 flex flex-col overflow-hidden">

                {/* Top colored accent line */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${style.gradient}`} />

                <p className="mb-3 mt-2 text-xs font-bold uppercase tracking-wide text-terracotta-700">
                    {facility?.name || offer.facilityName} · {facility?.city || offer.city}
                </p>
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-serif font-bold text-charcoal-900 leading-snug group-hover:text-terracotta-700 transition-colors" style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)" }}>
                        {offer.title}
                    </h3>
                    <span className={`text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider text-center whitespace-nowrap ml-3 border ${style.badge} shadow-sm`}>
                        {offer.contract}
                    </span>
                </div>

                <p className="line-clamp-4 text-charcoal-600 mb-8 flex-grow leading-relaxed font-medium">
                    {offer.description}
                </p>

                {offer.deadline && <p className="mb-5 text-sm font-semibold text-charcoal-600">Candidature avant le {new Date(`${offer.deadline}T12:00:00`).toLocaleDateString("fr-FR")}</p>}

                {offer.requirements.length > 0 && <div className={`p-6 rounded-2xl ${style.lightBg} mb-8 border ${style.border}`}>
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
                </div>}

                <div className="grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => onOpen(offer)}
                        className={`w-full rounded-xl border-2 ${style.border} bg-white px-4 py-3.5 font-bold ${style.text} transition-all hover:bg-cream-100 active:scale-95`}
                    >
                        Voir l&apos;annonce
                    </button>
                    <Link
                        href={`/contact?subject=recrutement&offer=${encodeURIComponent(offer.id)}`}
                        className={`block w-full text-center bg-gradient-to-r ${style.button} text-white font-bold px-4 py-4 rounded-xl hover:brightness-110 hover:scale-[1.02] transition-all shadow-md hover:shadow-lg active:scale-95`}
                    >
                        Postuler
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

function JobOfferModal({ offer, onClose }: { offer: JobOffer | null, onClose: () => void }) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!offer) return;
        closeButtonRef.current?.focus();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = previousOverflow;
        };
    }, [offer, onClose]);

    return (
        <AnimatePresence>
            {offer && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="job-offer-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal-900/65 p-3 backdrop-blur-sm sm:p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.97 }}
                        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="relative border-b border-cream-200 bg-cream-100 px-5 py-5 pr-16 sm:px-8 sm:py-6 sm:pr-20">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-terracotta-700">
                                {offer.facilityName} · {offer.city}
                            </p>
                            <h2 id="job-offer-title" className="break-words font-serif text-2xl font-bold leading-tight text-charcoal-900 sm:text-3xl">
                                {offer.title}
                            </h2>
                            <button
                                ref={closeButtonRef}
                                type="button"
                                onClick={onClose}
                                aria-label="Fermer l’annonce"
                                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal-700 shadow-md transition-colors hover:bg-cream-200 sm:right-6 sm:top-6"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </header>

                        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
                            <div className="mb-6 flex flex-wrap gap-2 text-sm font-semibold">
                                <span className="rounded-full bg-terracotta-100 px-3 py-1.5 text-terracotta-800">{offer.contract}</span>
                                {offer.publishedAt && <span className="rounded-full bg-cream-200 px-3 py-1.5 text-charcoal-700">Publiée le {new Date(offer.publishedAt).toLocaleDateString("fr-FR")}</span>}
                                {offer.deadline && <span className="rounded-full bg-cream-200 px-3 py-1.5 text-charcoal-700">Candidature avant le {new Date(`${offer.deadline}T12:00:00`).toLocaleDateString("fr-FR")}</span>}
                            </div>
                            <h3 className="mb-3 font-serif text-xl font-bold text-charcoal-900">Description du poste</h3>
                            <p className="whitespace-pre-line text-base leading-7 text-charcoal-700">{offer.description}</p>

                            {offer.requirements.length > 0 && (
                                <div className="mt-7 rounded-2xl bg-cream-100 p-5">
                                    <h3 className="mb-3 font-bold text-charcoal-900">Profil recherché</h3>
                                    <ul className="list-disc space-y-2 pl-5 text-charcoal-700">
                                        {offer.requirements.map((item, index) => <li key={index}>{item.req}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <footer className="grid gap-3 border-t border-cream-200 bg-white p-4 sm:grid-cols-2 sm:p-6">
                            {offer.sourceUrl ? (
                                <a
                                    href={offer.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-h-12 items-center justify-center rounded-xl border-2 border-terracotta-200 px-4 py-3 text-center font-bold text-terracotta-700 transition-colors hover:bg-terracotta-50"
                                >
                                    Voir l&apos;annonce complète sur la FHF
                                </a>
                            ) : <span className="hidden sm:block" />}
                            <Link
                                href={`/contact?subject=recrutement&offer=${encodeURIComponent(offer.id)}`}
                                className="flex min-h-12 items-center justify-center rounded-xl bg-terracotta-600 px-5 py-3 text-center font-bold text-white shadow-md transition-colors hover:bg-terracotta-700"
                            >
                                Postuler à cette offre
                            </Link>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function RecrutementPage() {
    const [selectedFacility, setSelectedFacility] = useState<string>("all");
    const [offers, setOffers] = useState(CAREERS_OFFERS);
    const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
    const visibleOffers = selectedFacility === "all" ? offers : offers.filter((offer) => offer.facilityId === selectedFacility);

    useEffect(() => {
        fetch("/.netlify/functions/jobs", { cache: "no-store" })
            .then((response) => response.ok ? response.json() : Promise.reject(new Error("Offres indisponibles")))
            .then((data: { offers?: JobOffer[] }) => {
                if (!Array.isArray(data.offers)) return setOffers(CAREERS_OFFERS);
                setOffers(data.offers.map((offer) => {
                    const bundledOffer = CAREERS_OFFERS.find((candidate) => candidate.id === offer.id);
                    if (!bundledOffer || bundledOffer.description.length <= offer.description.length) return offer;
                    return {
                        ...offer,
                        description: bundledOffer.description,
                        sourceUrl: offer.sourceUrl || bundledOffer.sourceUrl,
                    };
                }));
            })
            .catch(() => setOffers(CAREERS_OFFERS));
    }, []);

    return (
        <main className="pt-32 md:pt-40 pb-20 bg-cream-100 min-h-screen">
            {/* Pourquoi nous rejoindre - Section Avantages */}
            <section className="py-24 bg-cream-100 texture-paper relative overflow-hidden">
                {/* Formes organiques d'arrière-plan */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-forest-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-terracotta-100/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="container-custom relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-forest-600 font-bold uppercase tracking-wider text-sm">Vos avantages</span>
                        <h1 className="text-3xl md:text-5xl font-serif text-charcoal-900 mt-2 mb-6">
                            Pourquoi nous rejoindre ?
                        </h1>
                        <p className="text-charcoal-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            L&apos;EHPAD de Crécy est un établissement <strong>public</strong> rattaché à la Fonction Publique Hospitalière,
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
                            <span className="text-forest-700 font-semibold text-lg flex items-center gap-2">
                                Cadre rural en Seine-et-Marne · 45 min de Paris · 15 min de Disneyland Paris
                                <div className="relative w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform text-black">
                                    <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                                        <circle cx="12" cy="14" r="5.5" />
                                        <circle cx="5" cy="7" r="4" />
                                        <circle cx="19" cy="7" r="4" />
                                    </svg>
                                </div>
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Postes ouverts */}
            <section className="py-12 bg-cream-100">
                <div className="container-custom">
                    <div className="mb-8 text-center">
                        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-terracotta-600">Direction commune</p>
                        <h2 className="font-serif text-charcoal-900" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)" }}>Les offres de nos quatre EHPAD</h2>
                    </div>

                    <div className="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrer les offres par établissement">
                        <button onClick={() => setSelectedFacility("all")} aria-pressed={selectedFacility === "all"} className={`rounded-full px-4 py-2 text-sm font-bold ${selectedFacility === "all" ? "bg-charcoal-900 text-white" : "bg-white text-charcoal-700 border border-cream-300"}`}>Tous les EHPAD</button>
                        {JOB_FACILITIES.map((facility) => (
                            <button key={facility.id} onClick={() => setSelectedFacility(facility.id)} aria-pressed={selectedFacility === facility.id} className={`rounded-full px-4 py-2 text-sm font-bold ${selectedFacility === facility.id ? "bg-terracotta-600 text-white" : "bg-white text-charcoal-700 border border-cream-300"}`}>
                                {facility.name} — {facility.city}
                            </button>
                        ))}
                    </div>

                    {visibleOffers.length === 0 ? (
                        <div className="text-center text-charcoal-500 italic py-16 bg-white rounded-3xl shadow-sm border border-cream-200 max-w-2xl mx-auto">
                            Aucun poste publié actuellement pour cette sélection.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {visibleOffers.map((offer, index) => (
                                <JobCard key={offer.id} offer={offer} index={index} onOpen={setSelectedOffer} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Candidature spontanée */}
            <section className="py-20 bg-cream-100">
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
            <JobOfferModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
        </main>
    );
}
