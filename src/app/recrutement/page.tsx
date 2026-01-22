"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CAREERS_OFFERS, SPONTANEOUS_APPLICATION } from "@/lib/careers";
import { isAdmin, initNetlifyIdentity, onAuthChange } from "@/lib/netlifyAuth";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";

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
        <main className="pb-20 bg-cream-50 min-h-screen">
            {/* Hero Section */}
            <PageHeader
                title="Rejoignez notre équipe"
                subtitle="Ressources Humaines"
                description="À l'EHPAD de Crécy, nous recherchons des professionnels passionnés et engagés."
            >
                {adminMode && (
                    <div className="mb-8 mt-8">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 bg-charcoal-800 text-white px-6 py-3 rounded-full hover:bg-charcoal-900 transition-colors shadow-lg font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Gérer les offres (CMS)
                        </Link>
                    </div>
                )}
            </PageHeader>

            {/* Postes ouverts */}
            <section className="py-8">
                <div className="container-custom">
                    <h2 className="text-3xl font-serif text-charcoal-900 mb-10 text-center">Nos postes actuellement ouverts</h2>

                    {CAREERS_OFFERS.length === 0 ? (
                        <div className="text-center text-charcoal-500 italic py-10 bg-white rounded-2xl shadow-sm border border-cream-200">
                            Aucun poste ouvert pour le moment.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {CAREERS_OFFERS.map((offer) => (
                                <div key={offer.id} className="bg-white rounded-2xl shadow-warm p-8 border border-cream-200 hover:shadow-lg transition-all relative group h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4 pr-0">
                                        <h3 className="text-xl font-bold text-charcoal-900 leading-snug">{offer.title}</h3>
                                        <span className="bg-terracotta-100 text-terracotta-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-center whitespace-nowrap ml-2 h-fit">
                                            {offer.contract}
                                        </span>
                                    </div>
                                    <p className="text-charcoal-600 mb-6 flex-grow">
                                        {offer.description}
                                    </p>
                                    <ul className="text-sm text-charcoal-600 mb-8 space-y-2">
                                        {offer.requirements.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-forest-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                <span>{item.req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/contact?subject=recrutement"
                                        className="block w-full text-center bg-forest-500 text-white font-medium py-3 rounded-xl hover:bg-forest-600 transition-colors mt-auto"
                                    >
                                        Postuler à ce poste
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Candidature spontanée */}
            <section className="py-16">
                <div className="container-custom text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-serif text-charcoal-900 mb-4">{SPONTANEOUS_APPLICATION.title}</h2>
                    <p className="text-charcoal-600 mb-8 whitespace-pre-line">
                        {SPONTANEOUS_APPLICATION.description}
                    </p>
                    <Link
                        href="/contact?subject=recrutement"
                        className="inline-flex items-center gap-2 bg-white text-forest-600 border-2 border-forest-600 font-semibold py-3 px-8 rounded-full hover:bg-forest-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {SPONTANEOUS_APPLICATION.cta}
                    </Link>
                </div>
            </section>
        </main>
    );
}
