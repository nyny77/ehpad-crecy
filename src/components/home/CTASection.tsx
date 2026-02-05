"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { EHPAD_INFO } from "@/lib/constants";
import WaveSeparator from "@/components/ui/WaveSeparator";

export default function CTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="section-padding relative pt-24 md:pt-32">
            {/* Wave top (transition from Team) */}
            <WaveSeparator position="top" className="text-terracotta-500" showBorder={false} />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Background décoratif */}
                <div className="absolute inset-0 bg-gradient-to-b from-terracotta-500 to-terracotta-400">

                </div>

                {/* Formes décoratives */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-forest-500/20 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-cream-200 font-medium mb-4"
                    >
                        Prêt à nous rencontrer ?
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6"
                    >
                        Venez découvrir notre établissement
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-cream-100 mb-10 max-w-2xl mx-auto"
                    >
                        Nous serons ravis de vous accueillir pour une visite personnalisée
                        et répondre à toutes vos questions.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-terracotta-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                Programmer une visite
                                <svg
                                    className="ml-2 w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </motion.button>
                        </Link>

                        <a href={`tel:${EHPAD_INFO.phone.replace(/\s/g, "")}`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-300"
                            >
                                <svg
                                    className="mr-2 w-5 h-5"
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
                            </motion.button>
                        </a>
                    </motion.div>


                </div>
            </div>
        </section>
    );
}
