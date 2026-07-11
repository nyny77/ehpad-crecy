"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { EHPAD_INFO } from "@/lib/constants";

interface ServiceData {
    id: string;
    title: string;
    subtitle: string;
    shortDescription: string;
    fullDescription: string;
    highlights: string[];
    image: string;
    detailImage: string;
    detailImage2?: string;
    imagePosition?: string;
    imageAspect?: string;

    skills?: string[];
    quote?: string;
    training?: string;
}

interface ServiceDetailClientProps {
    service: ServiceData;
    prevService: ServiceData | null;
    nextService: ServiceData | null;
}

export default function ServiceDetailClient({ service, prevService, nextService }: ServiceDetailClientProps) {

    return (
        <>
            {/* Hero du service - Design Organique Refondu */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-cream-100 texture-paper">
                {/* Formes organiques d'arrière-plan */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-terracotta-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-forest-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="container-custom relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Contenu */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 text-sm text-charcoal-500 mb-8 font-medium">
                                <Link href="/" className="hover:text-terracotta-500 transition-colors">
                                    Accueil
                                </Link>
                                <span>/</span>
                                <Link href="/equipe" className="hover:text-terracotta-500 transition-colors">
                                    Notre Équipe
                                </Link>
                                <span>/</span>
                                <span className="text-terracotta-500 bg-terracotta-50 px-2 py-1 rounded-md">{service.title}</span>
                            </nav>

                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block text-terracotta-600 font-bold tracking-wider uppercase text-sm mb-3"
                            >
                                {service.subtitle}
                            </motion.span>

                            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal-900 mb-8 leading-[1.1]">
                                {service.title}
                                <span className="block h-2 w-24 bg-terracotta-400 mt-4 rounded-full"></span>
                            </h1>

                            {/* Description complète et compétences remontées ici */}
                            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-charcoal-600 prose-strong:text-terracotta-600 mb-10">
                                {service.fullDescription.split("\n\n").map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className={`leading-relaxed mb-6 text-lg ${index === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:text-terracotta-500 first-letter:mr-3 first-letter:float-left first-letter:leading-[1]" : ""}`}
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {service.skills && (
                                <div className="mb-8">
                                    <h3 className="font-serif text-xl text-charcoal-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-terracotta-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Savoir-faire & Qualités
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {service.skills.map((skill, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-white text-charcoal-700 rounded-full text-sm font-medium border border-cream-200 shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {service.training && (
                                <div className="mb-8">
                                    <h3 className="font-serif text-xl text-charcoal-900 mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-terracotta-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        Formation requise
                                    </h3>
                                    <p className="text-charcoal-700 font-medium">
                                        {service.training}
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        {/* Image - Style "Photo Album" */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 2 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative lg:h-[600px] flex items-start pt-10 justify-center lg:sticky lg:top-24"
                        >
                            {/* Blob d'arrière-plan animé */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-4 bg-terracotta-100 rounded-[3rem] -z-10 rotate-[-4deg]"
                            />

                            {service.detailImage2 ? (
                                <div className="relative w-full max-w-lg aspect-square">
                                    <motion.div 
                                        whileHover={{ scale: 1.05, rotate: -4, zIndex: 30 }}
                                        className="absolute top-0 left-0 w-2/3 aspect-[4/5] p-3 bg-white rounded-2xl shadow-lg -rotate-[6deg] z-10 transition-transform duration-300"
                                    >
                                        <div className="relative w-full h-full rounded-xl overflow-hidden border border-cream-200">
                                            <Image
                                                src={service.detailImage}
                                                alt={service.title}
                                                fill
                                                className={`object-cover ${service.imagePosition || 'object-center'}`}
                                            />
                                            <div className="absolute inset-0 bg-terracotta-500/10 mix-blend-overlay pointer-events-none"></div>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div 
                                        whileHover={{ scale: 1.05, rotate: 2, zIndex: 30 }}
                                        className="absolute bottom-0 right-0 w-2/3 aspect-[4/5] p-3 bg-white rounded-2xl shadow-xl rotate-[4deg] z-20 transition-transform duration-300"
                                    >
                                        <div className="relative w-full h-full rounded-xl overflow-hidden border border-cream-200">
                                            <Image
                                                src={service.detailImage2}
                                                alt={`${service.title} - photo 2`}
                                                fill
                                                className={`object-cover ${service.imagePosition || 'object-center'}`}
                                            />
                                            <div className="absolute inset-0 bg-terracotta-500/10 mix-blend-overlay pointer-events-none"></div>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                <div className={`relative w-full ${service.imageAspect && service.imageAspect !== 'aspect-[4/5]' ? 'max-w-2xl' : 'max-w-md'} ${service.imageAspect || 'aspect-[4/5]'} p-3 bg-white rounded-2xl shadow-xl rotate-[2deg]`}>
                                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent z-20"></div>
                                    <div className="relative w-full h-full rounded-xl overflow-hidden border border-cream-200">
                                        <Image
                                            src={service.detailImage}
                                            alt={service.title}
                                            fill
                                            className={`object-cover ${service.imagePosition || 'object-center'}`}
                                            priority
                                        />
                                        {/* Grain sur l'image */}
                                        <div className="absolute inset-0 bg-terracotta-500/10 mix-blend-overlay pointer-events-none"></div>
                                    </div>
                                </div>
                            )}

                            {/* Éléments décoratifs flottants */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-8 -left-8 w-24 h-24 bg-forest-100 rounded-full blur-xl -z-10"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Citation & Description & Enrichissement */}
            <section className="relative py-20 bg-cream-50 texture-paper">
                <div className="container-custom">

                    {/* Citation */}
                    {service.quote && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto text-center mb-16 relative"
                        >
                            <span className="absolute top-0 left-0 text-6xl text-terracotta-200 font-serif leading-none -translate-x-1/2 -translate-y-1/2">“</span>
                            <blockquote className="font-serif text-3xl md:text-4xl text-terracotta-800 italic leading-snug relative z-10 px-8">
                                {service.quote}
                            </blockquote>
                            <span className="absolute bottom-0 right-0 text-6xl text-terracotta-200 font-serif leading-none translate-x-1/2 translate-y-1/2">”</span>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Colonne Principale : Short Description + Contact */}
                        <div className="lg:col-span-7 space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="font-serif text-3xl text-charcoal-900 mb-6">En bref</h2>
                                <p className="text-xl text-charcoal-700 leading-relaxed mb-10 font-light">
                                    {service.shortDescription}
                                </p>
                                <Link href="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-primary"
                                    >
                                        Nous contacter
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Colonne Latérale : Highlights */}
                        <div className="lg:col-span-5 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-8 border border-cream-200 shadow-sm"
                            >
                                <h3 className="font-serif text-xl text-charcoal-900 mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-terracotta-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Points clés
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {service.highlights.map((highlight, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-4 p-3 rounded-lg bg-cream-50"
                                        >
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <svg className="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className="text-charcoal-800 font-medium leading-tight pt-1">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA de contact */}
            <section className="py-16 bg-gradient-to-br from-terracotta-500 to-terracotta-400">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center text-white"
                    >
                        <h2 className="font-serif text-3xl md:text-4xl mb-4">
                            Une question sur ce service ?
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Notre équipe est à votre écoute pour vous renseigner.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={`tel:${EHPAD_INFO.phone.replace(/\s/g, "")}`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-terracotta-600 rounded-full font-semibold hover:bg-cream-100 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                {EHPAD_INFO.phone}
                            </a>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-terracotta-600 rounded-full font-semibold hover:bg-cream-100 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                Nous écrire
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Navigation entre services */}
            <section className="pt-12 pb-32 bg-cream-100">
                <div className="container-custom">
                    <div className="flex items-center justify-between">
                        {prevService ? (
                            <Link
                                href={`/equipe/${prevService.id}`}
                                className="group flex items-center gap-3 text-charcoal-600 hover:text-terracotta-500 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                <div className="text-left">
                                    <span className="text-sm text-charcoal-400">Précédent</span>
                                    <p className="font-semibold">{prevService.title}</p>
                                </div>
                            </Link>
                        ) : (
                            <div />
                        )}

                        <Link
                            href="/equipe"
                            className="text-charcoal-500 hover:text-terracotta-500 transition-colors"
                        >
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                />
                            </svg>
                        </Link>

                        {nextService ? (
                            <Link
                                href={`/equipe/${nextService.id}`}
                                className="group flex items-center gap-3 text-charcoal-600 hover:text-terracotta-500 transition-colors"
                            >
                                <div className="text-right">
                                    <span className="text-sm text-charcoal-400">Suivant</span>
                                    <p className="font-semibold">{nextService.title}</p>
                                </div>
                                <svg
                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
