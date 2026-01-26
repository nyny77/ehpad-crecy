"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { VALUES } from "@/lib/constants";

const iconMap: { [key: string]: React.ReactNode } = {
    heart: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    star: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    ),
    eye: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    users: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
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
                            <div className="card-warm p-8 h-full flex flex-col items-center text-center">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-terracotta-100 to-forest-100 text-terracotta-500 mb-6 group-hover:scale-110 transition-transform duration-300">
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
