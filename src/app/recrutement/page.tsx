"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import Link from "next/link";
import { CAREERS_OFFERS, SPONTANEOUS_APPLICATION } from "@/lib/careers";
import { isAdmin, initNetlifyIdentity, onAuthChange } from "@/lib/netlifyAuth";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";

// Job card with 3D tilt
function JobCard({ offer }: { offer: typeof CAREERS_OFFERS[0] }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 100, damping: 10 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 10 });

    const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div
            ref={cardRef}
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="h-full"
        >
            <motion.div
                style={{ rotateX, rotateY }}
                className="h-full"
            >
                <div className="bg-white rounded-3xl shadow-warm p-8 border border-cream-200 hover:shadow-xl transition-all duration-300 relative group h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6 pr-0">
                        <h3 className="text-2xl font-serif font-bold text-charcoal-900 leading-snug">{offer.title}</h3>
                        <span className="bg-terracotta-100 text-terracotta-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider text-center whitespace-nowrap ml-2 h-fit border border-terracotta-200">
                            {offer.contract}
                        </span>
                    </div>
                    <p className="text-charcoal-600 mb-8 flex-grow leading-relaxed">
                        {offer.description}
                    </p>
                    <ul className="text-sm text-charcoal-600 mb-8 space-y-3">
                        {offer.requirements.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <div className="bg-cream-200 rounded-full p-1 mt-0.5 text-terracotta-600 shrink-0">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-charcoal-700">{item.req}</span>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/contact?subject=recrutement"
                        className="block w-full text-center bg-gradient-to-r from-terracotta-500 to-terracotta-400 text-white font-medium py-3.5 rounded-xl hover:brightness-110 transition-all mt-auto shadow-md hover:shadow-lg"
                    >
                        Postuler à ce poste
                    </Link>
                </div>
            </motion.div>
        </div>
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
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <span className="text-forest-500 font-medium">Vos avantages</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900 mt-2 mb-4">
                            Pourquoi nous rejoindre ?
                        </h2>
                        <p className="text-charcoal-600 max-w-2xl mx-auto">
                            L'EHPAD de Crécy est un établissement <strong>public</strong> rattaché à la Fonction Publique Hospitalière,
                            offrant un cadre de travail privilégié en milieu rural.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* FPH */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0 }}
                            className="bg-gradient-to-br from-forest-50 to-forest-100 rounded-2xl p-6 border border-forest-200"
                        >
                            <div className="w-14 h-14 bg-forest-500 text-white rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">Fonction Publique Hospitalière</h3>
                            <p className="text-charcoal-600 text-sm">
                                Sécurité de l'emploi, régime indemnitaire, avancement de carrière et retraite CNRACL.
                            </p>
                        </motion.div>

                        {/* CGOS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-terracotta-50 to-terracotta-100 rounded-2xl p-6 border border-terracotta-200"
                        >
                            <div className="w-14 h-14 bg-terracotta-500 text-white rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">Avantages CGOS</h3>
                            <p className="text-charcoal-600 text-sm">
                                Chèques vacances, aides aux loisirs, prestations sociales et réductions partenaires.
                            </p>
                        </motion.div>

                        {/* 12h */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-wood-50 to-wood-100 rounded-2xl p-6 border border-wood-200"
                        >
                            <div className="w-14 h-14 bg-wood-500 text-white rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">Postes en 12h</h3>
                            <p className="text-charcoal-600 text-sm">
                                Organisation en journées de 12h pour les soins et la cuisine : plus de jours de repos !
                            </p>
                        </motion.div>

                        {/* Gare */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-cream-100 to-cream-200 rounded-2xl p-6 border border-cream-300"
                        >
                            <div className="w-14 h-14 bg-charcoal-700 text-white rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">Gare à proximité</h3>
                            <p className="text-charcoal-600 text-sm">
                                La gare Transilien de Crécy-la-Chapelle est à 10 min à pied. Ligne P direction Paris Est.
                            </p>
                        </motion.div>

                        {/* Salle de pause */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-forest-50 to-cream-100 rounded-2xl p-6 border border-forest-100"
                        >
                            <div className="w-14 h-14 bg-forest-600 text-white rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">Salle de pause confortable</h3>
                            <p className="text-charcoal-600 text-sm">
                                Espace détente équipé et agréable pour vos pauses, dans une ambiance familiale.
                            </p>
                        </motion.div>

                        {/* Rails lève-malade */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-br from-terracotta-50 to-cream-100 rounded-2xl p-6 border border-terracotta-100"
                        >
                            <div className="w-14 h-14 bg-terracotta-600 text-white rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">Équipement ergonomique</h3>
                            <p className="text-charcoal-600 text-sm">
                                Lève-malades sur rails au plafond pour préserver votre santé et faciliter les transferts.
                            </p>
                        </motion.div>
                    </div>

                    {/* Badge cadre rural */}
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-3 bg-forest-50 px-6 py-3 rounded-full border border-forest-200">
                            <svg className="w-5 h-5 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span className="text-forest-700 font-medium">
                                Cadre rural en Seine-et-Marne · 45 min de Paris · 15 min de Disneyland Paris
                            </span>
                        </div>
                    </div>
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
