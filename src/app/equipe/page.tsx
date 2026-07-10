"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import BentoGrid from "@/components/team/BentoGrid";

export default function EquipePage() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <>
            {/* Grille Bento des services */}
            <section ref={ref} className="pt-32 md:pt-40 section-padding bg-cream-100 texture-paper relative overflow-hidden">
                {/* Formes organiques d'arrière-plan */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-terracotta-100/40 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-forest-100/30 rounded-full blur-3xl translate-y-1/3 translate-x-1/4 pointer-events-none" />

                <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
                    <BentoGrid />
                </div>
            </section>

            {/* Section recrutement */}
            <section className="section-padding bg-gradient-to-br from-terracotta-500 to-terracotta-400">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="inline-block !text-white font-medium mb-4">
                            Rejoignez-nous
                        </span>

                        <h2 className="font-serif text-3xl md:text-4xl !text-white mb-6">
                            Vous souhaitez rejoindre notre équipe ?
                        </h2>

                        <p className="text-lg !text-white mb-8">
                            L&apos;EHPAD de Crécy est toujours à la recherche de professionnels
                            motivés et bienveillants. Si vous partagez nos valeurs,
                            n&apos;hésitez pas à nous contacter.
                        </p>

                        <motion.a
                            href="/recrutement"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-terracotta-600 rounded-full font-semibold hover:bg-cream-100 transition-colors"
                        >
                            Postuler
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
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </motion.a>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
