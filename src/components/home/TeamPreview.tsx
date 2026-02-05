"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import WaveSeparator from "@/components/ui/WaveSeparator";

export default function TeamPreview() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="section-padding bg-cream-50 overflow-hidden">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Colonne Image - Composition */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        {/* Image principale */}
                        <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl rotate-[-2deg] border-4 border-white">
                            <Image
                                src="/images/history/canal.jpg"
                                alt="Le Grand Morin à Crécy-la-Chapelle"
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover sepia-[0.2]"
                            />
                        </div>

                        {/* Image secondaire (Collégiale) */}
                        <div className="absolute -bottom-12 -right-12 z-20 w-3/5 rounded-2xl overflow-hidden shadow-xl rotate-[3deg] border-4 border-white">
                            <Image
                                src="/images/history/collegiale.png"
                                alt="La Collégiale Notre-Dame"
                                width={400}
                                height={300}
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Élément décoratif d'arrière-plan */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-terracotta-100/30 to-terracotta-50/30 rounded-full blur-[60px] -z-10" />
                    </motion.div>

                    {/* Colonne Texte */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/2 pt-12 lg:pt-0 pl-0 lg:pl-10"
                    >
                        <span className="text-terracotta-500 font-bold tracking-widest uppercase text-sm mb-3 block">
                            Patrimoine & Histoire
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6 leading-tight">
                            Histoire de <br />
                            <span className="bg-gradient-to-r from-terracotta-500 to-terracotta-400 bg-clip-text text-transparent italic font-semibold">Crécy-la-Chapelle</span>
                        </h2>

                        <div className="space-y-6 text-charcoal-700 text-lg leading-relaxed font-light">
                            <p>
                                Celle que l’on appelle <span className="font-medium text-terracotta-600">« la Venise Briarde »</span> doit son surnom au fait que l’eau est un élément indissociable des lieux : Crécy-la-Chapelle est bordée par le Grand Morin qui lui donne toute son originalité.
                            </p>

                            <div className="bg-white/60 p-6 rounded-2xl border border-terracotta-100 shadow-sm relative">
                                <div className="absolute -left-3 top-6 w-1 h-12 bg-gradient-to-r from-terracotta-500 to-terracotta-400 rounded-full"></div>
                                <p className="italic text-charcoal-800 font-medium">
                                    « En 1868, une portion de terrain sise à Montplaisir sera annexée à Crécy-en-Brie pour y construire l’Hospice. »
                                </p>
                            </div>

                            <p>
                                C&apos;est sur ces terres chargées d&apos;histoire que notre établissement continue aujourd&apos;hui d&apos;écrire une histoire de soin et d&apos;accompagnement, perpétuant une tradition d&apos;accueil au cœur de la Brie.
                            </p>
                        </div>

                        <div className="mt-10">
                            <Link href="/histoire">
                                <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-terracotta-500 to-terracotta-400 text-white rounded-full font-medium shadow-lg hover:brightness-110 transition-all hover:scale-105">
                                    Découvrir toute l&apos;histoire
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
