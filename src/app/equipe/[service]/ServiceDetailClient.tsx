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
}

interface ServiceDetailClientProps {
    service: ServiceData;
    prevService: ServiceData | null;
    nextService: ServiceData | null;
}

export default function ServiceDetailClient({ service, prevService, nextService }: ServiceDetailClientProps) {

    return (
        <>
            {/* Hero du service */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-cream-200 to-cream-100 overflow-hidden">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Contenu */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 text-sm text-charcoal-500 mb-6">
                                <Link href="/" className="hover:text-terracotta-500 transition-colors">
                                    Accueil
                                </Link>
                                <span>/</span>
                                <Link href="/equipe" className="hover:text-terracotta-500 transition-colors">
                                    Notre Équipe
                                </Link>
                                <span>/</span>
                                <span className="text-terracotta-500">{service.title}</span>
                            </nav>

                            <span className="inline-block text-terracotta-500 font-medium mb-4">
                                {service.subtitle}
                            </span>

                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal-900 mb-6">
                                {service.title}
                            </h1>

                            <p className="text-lg text-charcoal-600 leading-relaxed mb-8">
                                {service.shortDescription}
                            </p>

                            {/* Points clés */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {service.highlights.map((highlight, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-4 h-4 text-terracotta-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-charcoal-700 font-medium">{highlight}</span>
                                    </motion.div>
                                ))}
                            </div>

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

                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src={service.detailImage}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            {/* Décoration */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-terracotta-200 rounded-full -z-10" />
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-forest-200 rounded-full -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Description complète */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="prose prose-lg max-w-none"
                        >
                            {service.fullDescription.split("\n\n").map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-charcoal-600 leading-relaxed mb-6 text-lg"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA de contact */}
            <section className="py-16 bg-gradient-to-r from-terracotta-500 to-terracotta-600">
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
                                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
                            >
                                Nous écrire
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Navigation entre services */}
            <section className="py-12 bg-cream-100">
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
