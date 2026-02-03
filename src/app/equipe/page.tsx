"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import BentoGrid from "@/components/team/BentoGrid";

export default function EquipePage() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <>
            {/* Hero compact */}
            <PageHeader
                title="Des professionnels passionnés"
                subtitle="Notre équipe"
                description="Découvrez les différents services et métiers qui font la richesse de notre établissement. Chaque membre de notre équipe contribue au bien-être quotidien de nos résidents."
            />

            {/* Grille Bento des services */}
            <section ref={ref} className="section-padding bg-cream-100">
                <div className="container-custom">
                    <BentoGrid />
                </div>
            </section>

            {/* Section recrutement */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="inline-block text-forest-500 font-medium mb-4">
                            Rejoignez-nous
                        </span>

                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 mb-6">
                            Vous souhaitez rejoindre notre équipe ?
                        </h2>

                        <p className="text-lg text-charcoal-600 mb-8">
                            L&apos;EHPAD de Crécy est toujours à la recherche de professionnels
                            motivés et bienveillants. Si vous partagez nos valeurs,
                            n&apos;hésitez pas à nous contacter.
                        </p>

                        <motion.a
                            href="/recrutement"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary inline-flex items-center gap-2"
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
