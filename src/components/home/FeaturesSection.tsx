"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import WaveSeparator from "@/components/ui/WaveSeparator";

export default function FeaturesSection() {
    return (
        <section className="relative py-24 bg-cream-100 text-charcoal-900 overflow-hidden">
            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    {/* Texte Narratif */}
                    <motion.div
                        className="lg:col-span-5"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-terracotta-500 font-bold uppercase tracking-wider text-sm">
                            Notre Établissement
                        </span>
                        <h2 className="font-serif text-3xl md:text-5xl text-charcoal-900 mt-3 mb-8">
                            Un lieu de vie <br /><span className="bg-gradient-to-r from-terracotta-500 to-terracotta-400 bg-clip-text text-transparent font-semibold">chaleureux & sécurisant</span>
                        </h2>

                        {/* Texte principal - Utilisation de classes CSS personnalisées pour contourner les conflits Tailwind */}
                        <div className="space-y-6 text-lg leading-relaxed section-features-text">
                            <p className="font-medium">
                                Situé dans un cadre verdoyant, L'Ehpad de Crécy accueille
                                <strong className="font-bold"> 63 résidents</strong>.
                                Nous proposons <strong className="font-bold">43 chambres simples</strong> (environ 16m²)
                                et <strong className="font-bold">10 chambres doubles</strong> (25m²).
                                L'établissement propose également de l'<strong className="font-bold">accueil séquentiel</strong>.
                            </p>
                            <p className="font-medium">
                                Votre santé est notre priorité : une équipe complète veille sur vous jour et nuit
                                (infirmière de nuit, aides-soignants 24h/24, psychologue, kinésithérapeute).
                            </p>
                            <p className="font-medium">
                                Au quotidien, profitez d'une <strong className="font-bold">cuisine savoureuse préparée sur place</strong>.
                                Vous pourrez également vous détendre dans notre <strong className="font-bold">jardin</strong> arboré, participer aux animations variées,
                                ou prendre soin de vous au salon de coiffure.
                            </p>
                        </div>

                        {/* Infos Pratiques Box */}
                        <div className="mt-10 p-6 rounded-2xl relative bg-cream-50 border border-terracotta-100 shadow-sm">
                            <div className="absolute -left-1.5 top-6 bottom-6 w-1 bg-gradient-to-b from-terracotta-500 to-terracotta-400 rounded-full"></div>

                            <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-terracotta-500 to-terracotta-400 text-white text-xs font-bold uppercase rounded-full tracking-wide shadow-sm">
                                Infos Pratiques
                            </div>
                            <div className="space-y-2 text-sm md:text-base">
                                <p>
                                    <span className="font-bold text-terracotta-500">Tarif hébergement :</span> ~69€ / jour (chambre simple, indicatif)
                                </p>
                                <p>
                                    <span className="font-bold text-forest-600">Aides acceptées :</span> Habilité Aide Sociale (ASH), APA, APL/ALS.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, rotate: 2 }}
                        whileInView={{ opacity: 1, x: 0, rotate: -2 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block lg:col-span-7 scale-[1.35] translate-x-16 -translate-y-12 z-20"
                    >
                        {/* Blob Background for Image */}
                        <div className="absolute inset-0 bg-terracotta-100 rounded-[3rem] rotate-3 scale-95 opacity-50 blur-xl translate-y-4" />

                        <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/Image1.png"
                                alt="Façade de l'EHPAD de Crécy"
                                className="w-full h-auto hover:scale-105 transition-transform duration-700 block"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent opacity-60 pointer-events-none" />

                            <div className="absolute bottom-8 left-8 text-white max-w-xs">
                                <p className="font-serif italic text-xl">"Une maison où il fait bon vivre"</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
