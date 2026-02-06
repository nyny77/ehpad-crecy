"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import PricingTable from "@/components/pricing/PricingTable";
import TiltCard from "@/components/ui/TiltCard";
import { EHPAD_INFO } from "@/lib/constants";

const roomFeatures = [
    { icon: "bed", label: "Lit médicalisé" },
    { icon: "bathroom", label: "Salle de bain privative" },
    { icon: "bell", label: "Appel malade 24h/24" },
    { icon: "tv", label: "Prise TV" },
    { icon: "phone", label: "Prise téléphonique" },
    { icon: "furniture", label: "Mobilier de qualité" },
];

const iconComponents: { [key: string]: React.ReactNode } = {
    bed: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 12v6m0-6V6a2 2 0 012-2h14a2 2 0 012 2v6M3 18v2m18-2v2M5 12v-2a2 2 0 012-2h10a2 2 0 012 2v2" />
        </svg>
    ),
    bathroom: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V6a2 2 0 012-2h1M4 8h16M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8M20 8V6a2 2 0 00-2-2h-1M9 20v2m6-2v2" />
        </svg>
    ),
    bell: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    ),
    tv: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    phone: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    furniture: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
};

// Feature card with 3D tilt using shared component
function FeatureCard({ feature, index }: { feature: typeof roomFeatures[0], index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <TiltCard interactive={true} intensity={10}>
                <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-terracotta-500 shadow-soft">
                        {iconComponents[feature.icon]}
                    </div>
                    <span className="text-sm font-medium text-charcoal-700">
                        {feature.label}
                    </span>
                </div>
            </TiltCard>
        </motion.div>
    );
}

export default function HebergementPage() {
    return (
        <>
            {/* Hero compact */}
            <PageHeader
                title="Hébergement & Tarifs"
                subtitle="Votre futur chez-vous"
                description={`${EHPAD_INFO.capacity.description} dans un cadre chaleureux et confortable. Découvrez nos tarifs transparents et les aides disponibles.`}
            />

            {/* Section Chambres */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Images */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="relative h-48 rounded-2xl overflow-hidden">
                                        <Image
                                            src="/images/hebergement/chambre1.png"
                                            alt="Chambre simple"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative h-32 rounded-2xl overflow-hidden">
                                        <Image
                                            src="/images/hebergement/detail.png"
                                            alt="Détail chambre"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="relative h-40 rounded-2xl overflow-hidden">
                                        <Image
                                            src="/images/hebergement/chambre2.png"
                                            alt="Chambre double"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative h-48 rounded-2xl overflow-hidden">
                                        <Image
                                            src="/images/hebergement/sdb.png"
                                            alt="Salle de bain"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Badge décoratif */}
                            <div className="absolute -bottom-6 -right-6 bg-terracotta-500 text-white rounded-2xl px-6 py-4 shadow-warm">
                                <p className="text-3xl font-bold">{EHPAD_INFO.capacity.total}</p>
                                <p className="text-sm">lits disponibles</p>
                            </div>
                        </motion.div>

                        {/* Contenu */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-forest-500 font-medium">Nos chambres</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 mt-2 mb-6">
                                Un espace de vie personnalisé
                            </h2>
                            <p className="text-charcoal-600 mb-8 leading-relaxed">
                                Chaque chambre est conçue pour offrir confort et sérénité.
                                Nos résidents peuvent personnaliser leur espace avec leurs effets
                                personnels et souvenirs, pour se sentir véritablement chez eux.
                            </p>

                            {/* Features avec 3D */}
                            <div className="grid grid-cols-2 gap-4">
                                {roomFeatures.map((feature, index) => (
                                    <FeatureCard key={feature.label} feature={feature} index={index} />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section Tarifs */}
            <section className="section-padding bg-cream-100">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <span className="text-terracotta-500 font-medium">Transparence</span>
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 mt-2 mb-4">
                            Nos tarifs en toute clarté
                        </h2>
                        <p className="text-charcoal-600 max-w-2xl mx-auto">
                            En tant qu&apos;établissement public, nous nous engageons à vous fournir
                            une information claire et transparente sur nos tarifs.
                        </p>
                    </div>

                    <PricingTable />
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-forest-500 to-forest-600 rounded-3xl p-10 md:p-14 text-center text-white"
                    >
                        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-4">
                            Prêt à nous rejoindre ?
                        </h2>
                        <p className="text-forest-100 text-lg mb-8 max-w-2xl mx-auto">
                            Faites votre demande d&apos;admission en ligne via le portail ViaTrajectoire ou
                            contactez-nous pour toute question.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={EHPAD_INFO.viaTrajectoireUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta-500 text-white font-semibold rounded-full shadow-lg hover:bg-terracotta-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Faire une demande (ViaTrajectoire)
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </motion.button>
                            </a>
                            <Link href="/admissions">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest-600 font-semibold rounded-full shadow-lg"
                                >
                                    En savoir plus sur l&apos;admission
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </motion.button>
                            </Link>
                        </div>
                        <p className="text-forest-200 text-sm mt-6">
                            Ou appelez-nous directement au <a href={`tel:${EHPAD_INFO.phone.replace(/\s/g, "")}`} className="underline hover:text-white">{EHPAD_INFO.phone}</a>
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
