"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { VALUES } from "@/lib/constants";

const iconMap: { [key: string]: React.ReactNode } = {
    heart: (
        <div className="relative w-full h-full">
            <Image
                src="/images/values/bienveillance.png"
                alt="Bienveillance"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    ),
    star: (
        <div className="relative w-full h-full">
            <Image
                src="/images/values/professionnalisme.png"
                alt="Professionnalisme"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    ),
    eye: (
        <div className="relative w-full h-full">
            <Image
                src="/images/values/transparence.png"
                alt="Transparence"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    ),
    users: (
        <div className="relative w-full h-full">
            <Image
                src="/images/values/vie-sociale.png"
                alt="Vie Sociale"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    ),
};

export default function IntroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="section-padding bg-white">
            <div className="container-custom">
                {/* Introduction */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-terracotta-500 font-medium mb-4"
                    >
                        Bienvenue chez nous
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6"
                    >
                        Un lieu de vie, pas un hôpital
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-charcoal-600 leading-relaxed"
                    >
                        L&apos;EHPAD de Crécy-la-Chapelle est bien plus qu&apos;un simple établissement : c&apos;est un véritable lieu de vie chaleureux, niché au cœur de la Seine-et-Marne.
                        <br /><br />
                        Dans une ambiance familiale et bienveillante, nous avons à cœur d&apos;offrir à nos 63 résidents un quotidien serein, rythmé par l&apos;écoute, le respect et la joie de vivre. Ici, chacun trouve sa place et se sent chez soi.
                    </motion.p>
                </div>

                {/* Valeurs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {VALUES.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                            className="group"
                        >
                            <div className="card-warm p-8 h-full flex flex-col items-center text-center hover:bg-cream-50/50 transition-colors">
                                <div className="relative w-48 h-48 mb-6 group-hover:scale-105 transition-transform duration-300">
                                    {iconMap[value.icon]}
                                </div>
                                <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-charcoal-600">
                                    {value.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Citation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-16 relative"
                >
                    <div className="bg-gradient-to-r from-terracotta-50 via-cream-100 to-forest-50 rounded-3xl p-10 md:p-14 text-center">
                        <svg
                            className="w-12 h-12 text-terracotta-300 mx-auto mb-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <blockquote className="font-serif text-2xl md:text-3xl text-charcoal-800 italic mb-6 max-w-3xl mx-auto">
                            Chaque résident est unique. Notre mission est de l&apos;accompagner
                            avec dignité, respect et beaucoup d&apos;affection.
                        </blockquote>
                        <p className="text-charcoal-600 font-medium">
                            — L&apos;équipe de l&apos;EHPAD de Crécy
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
