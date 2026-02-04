"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import WaveSeparator from "@/components/ui/WaveSeparator";

export default function FeaturesSection() {
    return (
        <section className="relative py-24 bg-white dark:bg-charcoal-900 overflow-hidden">
            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Texte Narratif */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-terracotta-500 font-bold uppercase tracking-wider text-sm">
                            Notre Établissement
                        </span>
                        <h2 className="font-serif text-3xl md:text-5xl text-charcoal-900 dark:text-cream-100 mt-3 mb-8">
                            Un lieu de vie <br /><span className="text-forest-600 dark:text-forest-400">chaleureux & adapté</span>
                        </h2>

                        <div className="space-y-6 text-lg text-charcoal-600 dark:text-cream-200 leading-relaxed font-light">
                            <p>
                                Situé dans un cadre verdoyant, L'Ehpad de Crécy accueille
                                <strong className="font-semibold text-charcoal-800 dark:text-cream-100"> 63 résidents</strong>.
                                Nous proposons <strong className="font-semibold text-charcoal-800 dark:text-cream-100">43 chambres simples</strong> (environ 16m²)
                                et <strong className="font-semibold text-charcoal-800 dark:text-cream-100">10 chambres doubles</strong> (25m²).
                                L'établissement propose également de l'<strong className="font-semibold text-charcoal-800 dark:text-cream-100">accueil séquentiel</strong>.
                            </p>
                            <p>
                                Votre santé est notre priorité : une équipe complète veille sur vous jour et nuit
                                (infirmière de nuit, aides-soignants 24h/24, psychologue, kinésithérapeute).
                            </p>
                            <p>
                                Au quotidien, profitez d'une <strong className="font-semibold text-charcoal-800 dark:text-cream-100">cuisine savoureuse préparée sur place</strong>.
                                Vous pourrez également vous détendre dans notre <strong className="font-semibold text-charcoal-800 dark:text-cream-100">jardin</strong> arboré, participer aux animations variées,
                                ou prendre soin de vous au salon de coiffure.
                            </p>
                        </div>

                        {/* Infos Pratiques Box */}
                        <div className="mt-10 p-6 bg-cream-50 dark:bg-charcoal-800 rounded-2xl border border-terracotta-100 dark:border-charcoal-700 relative">
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-terracotta-500 text-white text-xs font-bold uppercase rounded-full tracking-wide shadow-sm">
                                Infos Pratiques
                            </div>
                            <div className="space-y-2 text-sm md:text-base">
                                <p className="text-charcoal-700 dark:text-cream-200">
                                    <span className="font-bold text-terracotta-600 dark:text-terracotta-400">Tarif hébergement :</span> ~69€ / jour (chambre simple, indicatif)
                                </p>
                                <p className="text-charcoal-700 dark:text-cream-200">
                                    <span className="font-bold text-forest-600 dark:text-forest-400">Aides acceptées :</span> Habilité Aide Sociale (ASH), APA, APL/ALS.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, rotate: 1 }}
                        whileInView={{ opacity: 1, x: 0, rotate: -2 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative h-[500px] w-full hidden lg:block"
                    >
                        {/* Blob Background for Image */}
                        <div className="absolute inset-0 bg-terracotta-100 rounded-[3rem] rotate-3 scale-95 opacity-50 blur-xl translate-y-4" />

                        <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
                            <Image
                                src="/images/facade-photo.jpg"
                                alt="Façade de l'EHPAD de Crécy"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent opacity-60" />

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
