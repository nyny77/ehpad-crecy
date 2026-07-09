"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import WaveSeparator from "@/components/ui/WaveSeparator";
import DayTimeline from "@/components/social/DayTimeline";

const activityStyles = {
    heart: { // Musique & Chant
        gradient: "from-rose-500 via-terracotta-500 to-rose-600",
        bg: "bg-rose-500",
        glow: "shadow-rose-500/50",
        ring: "ring-rose-400/30"
    },
    star: { // Rencontres
        gradient: "from-amber-400 via-yellow-500 to-orange-500",
        bg: "bg-amber-500",
        glow: "shadow-amber-500/50",
        ring: "ring-amber-400/30"
    },
    eye: { // Jeux & Loisirs
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        bg: "bg-emerald-500",
        glow: "shadow-emerald-500/50",
        ring: "ring-emerald-400/30"
    },
    users: { // Arts créatifs
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        bg: "bg-violet-500",
        glow: "shadow-violet-500/50",
        ring: "ring-violet-400/30"
    },
};

function ActivityCard({ activity, index }: { activity: any, index: number }) {
    // Map activity title to style
    let styleKey = "heart";
    if (activity.title.includes("Arts")) styleKey = "users";
    else if (activity.title.includes("Rencontres")) styleKey = "star";
    else if (activity.title.includes("Jeux")) styleKey = "eye";

    const style = activityStyles[styleKey as keyof typeof activityStyles];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.7,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
            }}
            className="relative group cursor-pointer h-full"
        >
            {/* Animated gradient background that expands on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-110`} />

            {/* Main card */}
            <div className="relative h-full rounded-[2rem] px-6 py-8 flex flex-col items-center transition-all duration-500 bg-white border-2 border-cream-200 shadow-xl group-hover:border-transparent group-hover:shadow-2xl">

                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                    <motion.div
                        className={`absolute w-2 h-2 ${style.bg} rounded-full opacity-40`}
                        animate={{
                            x: [0, 100, 200, 100, 0],
                            y: [0, -50, 0, 50, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.5
                        }}
                        style={{ top: "20%", left: "10%" }}
                    />
                    <motion.div
                        className={`absolute w-3 h-3 ${style.bg} rounded-full opacity-25`}
                        animate={{
                            x: [0, -80, 0, 80, 0],
                            y: [0, 60, 0, -60, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.3
                        }}
                        style={{ top: "60%", right: "20%" }}
                    />
                </div>

                {/* Icon container with pulse animation */}
                <div className="relative flex justify-center mb-6">
                    {/* Outer pulsing ring */}
                    <motion.div
                        className={`absolute inset-0 w-20 h-20 mx-auto rounded-full ${style.ring} ring-8 opacity-50`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.2, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.25
                        }}
                    />

                    {/* Icon background with gradient */}
                    <motion.div
                        className={`relative w-20 h-20 bg-gradient-to-br ${style.gradient} rounded-full flex items-center justify-center shadow-lg ${style.glow} group-hover:shadow-xl transition-shadow duration-500 text-white`}
                        whileHover={{
                            scale: 1.15,
                            rotate: 360,
                            transition: { duration: 0.6 }
                        }}
                    >
                        {activity.icon}
                    </motion.div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-center mb-3 text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                    {activity.title}
                </h3>

                {/* Description */}
                <p className="text-center text-sm leading-relaxed text-charcoal-600 font-medium">
                    {activity.description}
                </p>

                {/* Bottom accent line */}
                <motion.div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r ${style.gradient} rounded-full mb-1`}
                    initial={{ width: "30%" }}
                    whileHover={{ width: "60%" }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </motion.div>
    );
}

export default function AnimationPage() {
    return (
        <main className="min-h-screen bg-cream-50">
            <PageHeader
                title="Coordinatrice de la vie sociale"
                subtitle="Au cœur de la vie de l'EHPAD"
                description="Découvrez nos activités quotidiennes, nos événements festifs et les moments de partage qui rythment la vie de nos résidents."
                image="/images/global-hero.jpg"
                alt="Animation et vie sociale à l'EHPAD"
            />

            {/* Section activités (toujours visible) - Avec fond coloré et vagues */}
            <section className="section-padding relative py-24 md:py-32 bg-cream-100 overflow-hidden">
                <WaveSeparator position="top" className="text-cream-100" />

                {/* Background décoratif (Blobs animated) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0]
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta-200/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"
                    />
                    <motion.div
                        animate={{
                            y: [0, 40, 0],
                            scale: [1, 1.2, 1],
                            rotate: [0, -5, 0]
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-forest-200/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"
                    />
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center mb-12">
                        <span className="text-forest-600 font-bold tracking-wider uppercase text-sm">Animations</span>
                        <h2 className="font-serif text-3xl md:text-5xl text-charcoal-900 mt-3 mb-6">
                            Un programme varié
                        </h2>
                        <p className="text-charcoal-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Notre animatrice propose chaque semaine un programme d&apos;activités
                            adapté aux envies et capacités de chacun.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                ),
                                title: "Musique & Chant",
                                description: "Concerts, karaoké, musicothérapie",
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                ),
                                title: "Arts créatifs",
                                description: "Peinture, dessin, loisirs créatifs",
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ),
                                title: "Rencontres",
                                description: "Visites d'associations, écoliers",
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                title: "Jeux & Loisirs",
                                description: "Jeux de société, loto, quiz",
                            },
                        ].map((activity, index) => (
                            <ActivityCard key={activity.title} activity={activity} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Journée Type */}
            <DayTimeline />

        </main>
    );
}
