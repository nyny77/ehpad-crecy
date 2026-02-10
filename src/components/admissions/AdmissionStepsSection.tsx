"use client";

import { motion } from "framer-motion";
import { FileText, Eye, Users, DoorOpen } from "lucide-react";

// Style configurations for each step
const stepStyles = [
    {
        gradient: "from-terracotta-400 to-terracotta-600",
        bg: "bg-terracotta-500",
        glow: "shadow-terracotta-500/50",
        ring: "ring-terracotta-400/30",
        numberColor: "text-terracotta-400/40 group-hover:text-terracotta-500/50",
        barGradient: "from-terracotta-400 to-terracotta-600",
    },
    {
        gradient: "from-forest-400 to-forest-600",
        bg: "bg-forest-500",
        glow: "shadow-forest-500/50",
        ring: "ring-forest-400/30",
        numberColor: "text-forest-400/40 group-hover:text-forest-500/50",
        barGradient: "from-forest-400 to-forest-600",
    },
    {
        gradient: "from-amber-400 to-orange-500",
        bg: "bg-amber-500",
        glow: "shadow-amber-500/50",
        ring: "ring-amber-400/30",
        numberColor: "text-amber-400/40 group-hover:text-amber-500/50",
        barGradient: "from-amber-400 to-orange-500",
    },
    {
        gradient: "from-violet-500 to-purple-600",
        bg: "bg-violet-500",
        glow: "shadow-violet-500/50",
        ring: "ring-violet-400/30",
        numberColor: "text-violet-400/40 group-hover:text-violet-500/50",
        barGradient: "from-violet-500 to-purple-600",
    },
];

const steps = [
    {
        number: 1,
        title: "La Demande",
        description: "Faites votre demande directement en ligne sur ViaTrajectoire (méthode rapide et recommandée).",
        icon: FileText,
    },
    {
        number: 2,
        title: "La Visite",
        description: "Rencontre avec la direction et visite des lieux pour découvrir l'ambiance.",
        icon: Eye,
    },
    {
        number: 3,
        title: "La Commission",
        description: "Validation de votre dossier par l'équipe médicale et la direction.",
        icon: Users,
    },
    {
        number: 4,
        title: "L'Entrée",
        description: "Accueil personnalisé et installation dans votre nouvelle chambre.",
        icon: DoorOpen,
    },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
    const style = stepStyles[index];
    const Icon = step.icon;

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
            {/* Animated gradient background that expands on hover */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-110`}
            />

            {/* Main card */}
            <div className="relative h-full bg-gradient-to-br from-white via-cream-50 to-cream-100 rounded-3xl p-6 border-2 border-cream-200 shadow-xl group-hover:border-terracotta-200 group-hover:shadow-2xl transition-all duration-500">
                {/* Large number in background - repositionné pour éviter le rognage */}
                <div
                    className={`absolute top-2 right-4 text-7xl font-bold ${style.numberColor} select-none pointer-events-none transition-colors duration-300 opacity-60`}
                >
                    {step.number}
                </div>

                <div className="relative z-10">
                    {/* Icon container with rotating particles */}
                    <div className="relative flex mb-5 w-20 h-20">
                        {/* Rotating particles around icon */}
                        <motion.div
                            className="absolute inset-0 w-20 h-20"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 3,
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

                        {/* Second rotating ring - opposite direction */}
                        <motion.div
                            className="absolute inset-0 w-20 h-20"
                            animate={{ rotate: -360 }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <motion.div
                                className={`absolute w-1 h-1 ${style.bg} rounded-full opacity-50`}
                                style={{ top: "10%", left: "10%" }}
                            />
                            <motion.div
                                className={`absolute w-1 h-1 ${style.bg} rounded-full opacity-50`}
                                style={{ bottom: "10%", right: "10%" }}
                            />
                        </motion.div>

                        {/* Icon background with gradient */}
                        <motion.div
                            className={`relative w-20 h-20 bg-gradient-to-br ${style.gradient} rounded-2xl flex items-center justify-center shadow-2xl ${style.glow} group-hover:shadow-3xl transition-shadow duration-500`}
                            whileHover={{
                                scale: 1.1,
                                rotate: 10,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                        </motion.div>
                    </div>

                    {/* Title */}
                    <motion.h3
                        className="font-serif text-xl font-bold text-charcoal-900 mb-3"
                        whileHover={{ scale: 1.02 }}
                    >
                        {step.title}
                    </motion.h3>

                    {/* Description */}
                    <p className="text-sm text-charcoal-600 leading-relaxed">
                        {step.description.includes("ViaTrajectoire") ? (
                            <>
                                Faites votre demande directement en ligne sur{" "}
                                <strong>ViaTrajectoire</strong> (méthode rapide et recommandée).
                            </>
                        ) : (
                            step.description
                        )}
                    </p>
                </div>

                {/* Bottom accent line that animates on hover */}
                <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${style.barGradient}`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ originX: 0 }}
                />
            </div>
        </motion.div>
    );
}

export default function AdmissionStepsSection() {
    return (
        <section className="py-16 md:py-24 bg-cream-100 relative overflow-hidden">
            <div className="container-custom relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-terracotta-500 font-medium mb-4"
                    >
                        Votre parcours
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-3xl md:text-4xl text-charcoal-900 mb-4"
                    >
                        Votre parcours d&apos;admission
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-charcoal-600"
                    >
                        4 étapes simples vers votre nouvelle vie
                    </motion.p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <StepCard key={step.number} step={step} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
