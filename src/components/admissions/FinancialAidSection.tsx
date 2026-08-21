"use client";

import { motion } from "framer-motion";
import { Euro, Heart, Home, Users, MoveRight } from "lucide-react";

// Style configurations for each aid type
const aidStyles = [
    {
        gradient: "from-forest-400 to-forest-600",
        bg: "bg-forest-500",
        glow: "shadow-forest-500/50",
        textColor: "text-forest-600",
        linkColor: "text-forest-700 hover:text-forest-800",
        acronymColor: "text-forest-400/30",
    },
    {
        gradient: "from-terracotta-400 to-terracotta-600",
        bg: "bg-terracotta-500",
        glow: "shadow-terracotta-500/50",
        textColor: "text-terracotta-600",
        linkColor: "text-terracotta-700 hover:text-terracotta-800",
        acronymColor: "text-terracotta-400/30",
    },
    {
        gradient: "from-violet-500 to-purple-600",
        bg: "bg-violet-500",
        glow: "shadow-violet-500/50",
        textColor: "text-violet-600",
        linkColor: "text-violet-700 hover:text-violet-800",
        acronymColor: "text-violet-400/30",
    },
];

const aids = [
    {
        acronym: "APA",
        title: "Allocation Personnalisée d'Autonomie",
        description: "Destinée aux personnes de plus de 60 ans en perte d'autonomie. Son montant dépend du niveau de dépendance (GIR) et des revenus.",
        link: "https://www.pour-les-personnes-agees.gouv.fr/preserver-son-autonomie-s-informer-et-anticiper/perte-d-autonomie-evaluation-et-droits/l-allocation-personnalisee-d-autonomie-apa",
        linkText: "En savoir plus",
        icon: Heart,
    },
    {
        acronym: "APL",
        title: "Aide Personnalisée au Logement",
        description: "Attribuée par la CAF en fonction des ressources pour aider à payer la redevance hébergement. Notre établissement est conventionné.",
        link: "https://www.caf.fr",
        linkText: "Simuler vos droits (CAF)",
        icon: Home,
    },
    {
        acronym: "ASH",
        title: "Aide Sociale à l'Hébergement",
        description: "Si les revenus sont insuffisants, le département peut prendre en charge une partie des frais d'hébergement (récupérable sur succession).",
        link: "https://www.service-public.fr/particuliers/vosdroits/F2444",
        linkText: "En savoir plus (Service Public)",
        icon: Users,
    },
];

function AidCard({ aid, index }: { aid: typeof aids[0]; index: number }) {
    const style = aidStyles[index];
    const Icon = aid.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.7,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
            }}
            whileHover={{
                scale: 1.03,
                y: -8,
                transition: { duration: 0.3 },
            }}
            className="relative group cursor-pointer"
        >
            {/* Animated gradient background on hover */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-110`}
            />

            {/* Main card */}
            <div className="relative h-full bg-gradient-to-br from-white via-cream-50 to-cream-100 rounded-3xl p-8 border-2 border-cream-200 shadow-xl group-hover:border-terracotta-200 group-hover:shadow-2xl transition-all duration-500">
                {/* Large acronym in background */}
                <div
                    className={`absolute top-4 right-6 text-6xl font-bold ${style.acronymColor} select-none pointer-events-none transition-colors duration-300`}
                >
                    {aid.acronym}
                </div>

                <div className="relative z-10">
                    {/* Icon with rotating particles */}
                    <div className="relative flex mb-6 w-16 h-16">
                        {/* Rotating particles */}
                        <motion.div
                            className="absolute inset-0 w-16 h-16"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <motion.div
                                className={`absolute w-2 h-2 ${style.bg} rounded-full`}
                                style={{ top: "-4px", left: "50%", marginLeft: "-4px" }}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                            <motion.div
                                className={`absolute w-1.5 h-1.5 ${style.bg} rounded-full opacity-60`}
                                style={{ bottom: "-4px", left: "50%", marginLeft: "-3px" }}
                                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                            />
                            <motion.div
                                className={`absolute w-1.5 h-1.5 ${style.bg} rounded-full opacity-70`}
                                style={{ top: "50%", left: "-4px", marginTop: "-3px" }}
                                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 0.9, repeat: Infinity, delay: 0.6 }}
                            />
                            <motion.div
                                className={`absolute w-2 h-2 ${style.bg} rounded-full opacity-80`}
                                style={{ top: "50%", right: "-4px", marginTop: "-4px" }}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 1.1, repeat: Infinity, delay: 0.2 }}
                            />
                        </motion.div>

                        {/* Icon background */}
                        <motion.div
                            className={`relative w-16 h-16 bg-gradient-to-br ${style.gradient} rounded-2xl flex items-center justify-center shadow-2xl ${style.glow} group-hover:shadow-3xl transition-shadow duration-500`}
                            whileHover={{
                                scale: 1.1,
                                rotate: 10,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <Euro className="w-8 h-8 text-white" strokeWidth={2} />
                        </motion.div>
                    </div>

                    {/* Title */}
                    <motion.h3
                        className="font-serif text-2xl font-bold text-charcoal-900 mb-2"
                        whileHover={{ scale: 1.02 }}
                    >
                        {aid.acronym}
                    </motion.h3>

                    {/* Subtitle */}
                    <div className={`text-xs font-bold ${style.textColor} mb-4 uppercase tracking-widest`}>
                        {aid.title}
                    </div>

                    {/* Description */}
                    <p className="text-charcoal-600 mb-6 leading-relaxed text-sm">
                        {aid.description}
                    </p>

                    {/* Link */}
                    <motion.a
                        href={aid.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 ${style.linkColor} font-bold transition-all`}
                        whileHover={{ x: 5 }}
                    >
                        {aid.linkText}
                        <MoveRight className="w-4 h-4" />
                    </motion.a>
                </div>

                {/* Bottom accent line */}
                <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient} rounded-b-3xl`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ originX: 0 }}
                />
            </div>
        </motion.div>
    );
}

export default function FinancialAidSection() {
    return (
        <section id="aides-financieres" className="relative scroll-mt-24 overflow-hidden bg-cream-100 py-14 md:py-24">
            <div className="container-custom relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block py-1 px-3 rounded-full bg-forest-50 text-forest-600 text-sm font-bold tracking-wider mb-4 border border-forest-100"
                    >
                        BUDGET & FINANCEMENT
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-3xl md:text-5xl text-charcoal-900 mt-2 mb-6"
                    >
                        Les aides financières
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-charcoal-600 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        L&apos;EHPAD de Crécy-la-Chapelle est habilité à l&apos;aide sociale.
                        Plusieurs dispositifs peuvent vous aider à financer votre séjour.
                    </motion.p>
                </div>

                {/* Aids Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {aids.map((aid, index) => (
                        <AidCard key={aid.acronym} aid={aid} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
