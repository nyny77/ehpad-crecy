"use client";

import { motion } from "framer-motion";
import { Home, Users } from "lucide-react";
import { EHPAD_INFO } from "@/lib/constants";

// Style configurations for room types
const roomStyles = [
    {
        gradient: "from-terracotta-400 to-terracotta-600",
        bg: "bg-terracotta-500",
        glow: "shadow-terracotta-500/50",
        textColor: "text-terracotta-600",
        labelColor: "text-terracotta-400/30",
        icon: Home,
    },
    {
        gradient: "from-forest-400 to-forest-600",
        bg: "bg-forest-500",
        glow: "shadow-forest-500/50",
        textColor: "text-forest-600",
        labelColor: "text-forest-400/30",
        icon: Users,
    },
];

function RoomCard({
    room,
    index,
    style
}: {
    room: { label: string; standard: number; socialAid: number; size: string; subtitle: string };
    index: number;
    style: typeof roomStyles[0];
}) {
    const Icon = style.icon;

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
            <div className="relative h-full bg-gradient-to-br from-white via-cream-50 to-cream-100 rounded-3xl p-8 border-2 border-cream-200 shadow-xl group-hover:border-terracotta-200 group-hover:shadow-2xl transition-all duration-500 overflow-hidden">

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
                            <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                        </motion.div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-1">
                        {room.label}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-sm text-charcoal-500 mb-6">
                        {room.subtitle} ({room.size})
                    </p>

                    {/* Prices */}
                    <div className="space-y-4">
                        <div className="flex items-end justify-between p-4 bg-cream-50/50 rounded-2xl">
                            <span className="text-sm font-medium text-charcoal-600">Tarif standard</span>
                            <div className="text-right">
                                <span className="font-serif text-3xl font-bold text-charcoal-800">
                                    {room.standard.toFixed(2)}€
                                </span>
                                <span className="text-charcoal-400 text-xs uppercase tracking-wide font-semibold ml-1">/jour</span>
                            </div>
                        </div>

                        <div className="flex items-end justify-between p-4 bg-forest-50/30 rounded-2xl border border-forest-100/50">
                            <span className="text-sm font-medium text-forest-700">Aide Sociale (ASH)</span>
                            <div className="text-right">
                                <span className="font-serif text-2xl font-bold text-forest-600">
                                    {room.socialAid.toFixed(2)}€
                                </span>
                                <span className="text-forest-400 text-xs uppercase tracking-wide font-semibold ml-1">/jour</span>
                            </div>
                        </div>
                    </div>
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

export default function PricingTable() {
    const { pricing } = EHPAD_INFO;

    const rooms = [
        {
            label: pricing.accommodation.singleRoom.label,
            standard: pricing.accommodation.singleRoom.standard,
            socialAid: pricing.accommodation.singleRoom.socialAid,
            size: "~20m²",
            subtitle: "Espace privatif",
        },
        {
            label: pricing.accommodation.doubleRoom.label,
            standard: pricing.accommodation.doubleRoom.standard,
            socialAid: pricing.accommodation.doubleRoom.socialAid,
            size: "~30m²",
            subtitle: "Pour couples",
        },
    ];

    return (
        <div className="space-y-16">
            {/* Section Header */}
            <div className="text-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-block py-1 px-3 rounded-full bg-terracotta-50 text-terracotta-600 text-sm font-bold tracking-wider mb-4 border border-terracotta-100"
                >
                    HÉBERGEMENT
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="font-serif text-3xl md:text-5xl text-charcoal-900 mt-2 mb-4"
                >
                    Tarifs Journaliers
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-charcoal-500 text-sm"
                >
                    Mise à jour {pricing.lastUpdate}
                </motion.p>
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {rooms.map((room, index) => (
                    <RoomCard
                        key={room.label}
                        room={room}
                        index={index}
                        style={roomStyles[index]}
                    />
                ))}
            </div>

            {/* Tarifs Dépendance GIR */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block py-1 px-3 rounded-full bg-forest-50 text-forest-600 text-sm font-bold tracking-wider mb-4 border border-forest-100"
                    >
                        DÉPENDANCE
                    </motion.span>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-3xl md:text-4xl text-charcoal-900 mt-2 mb-4"
                    >
                        Tarifs GIR
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-charcoal-500 text-sm italic max-w-md mx-auto"
                    >
                        Le tarif dépendance est calculé selon le niveau d&apos;autonomie (GIR).
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* GIR Cards */}
                    {[
                        { gir: "1-2", level: "Élevé", data: pricing.dependency.gir1_2, percent: 75, color: "terracotta" },
                        { gir: "3-4", level: "Moyen", data: pricing.dependency.gir3_4, percent: 50, color: "amber" },
                        { gir: "5-6", level: "Faible", data: pricing.dependency.gir5_6, percent: 25, color: "forest" },
                    ].map((item, index) => (
                        <motion.div
                            key={item.gir}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                                type: "spring",
                                stiffness: 100,
                            }}
                            whileHover={{
                                scale: 1.03,
                                y: -5,
                                transition: { duration: 0.3 },
                            }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-105`} />

                            <div className="relative bg-gradient-to-br from-white via-cream-50 to-cream-100 rounded-3xl p-8 border-2 border-cream-200 shadow-xl group-hover:shadow-2xl transition-all duration-500 overflow-hidden">

                                <div className="flex justify-between items-start mb-6">
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        {/* Animated Pie Chart */}
                                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <path
                                                className={`text-${item.color}-100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            />
                                            <motion.path
                                                className={`text-${item.color}-500 drop-shadow-sm`}
                                                animate={{ strokeDasharray: [`0, 100`, `${item.percent}, 100`, `${item.percent}, 100`, `0, 100`] }}
                                                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.1 * index }}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className={`text-${item.color}-600 font-bold text-lg relative z-10`}>{item.gir}</span>
                                    </div>
                                    <span className={`px-3 py-1 bg-${item.color}-50 text-${item.color}-600 text-xs font-bold uppercase rounded-full tracking-wider border border-${item.color}-100`}>
                                        {item.level}
                                    </span>
                                </div>

                                <h4 className="font-serif text-xl font-bold text-charcoal-800 mb-2">
                                    {item.data.label}
                                </h4>
                                <p className="text-sm text-charcoal-500 mb-6 leading-relaxed min-h-[48px]">
                                    {item.data.description}
                                </p>

                                <div className="pt-4 border-t border-cream-100">
                                    <p className="font-serif text-3xl font-bold text-charcoal-800">
                                        {item.data.rate.toFixed(2)}€
                                        <span className="text-sm font-sans font-semibold text-charcoal-400 ml-1 uppercase">/jour</span>
                                    </p>
                                </div>

                                {/* Bottom accent */}
                                <motion.div
                                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-b-3xl`}
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.4 }}
                                    style={{ originX: 0 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Info aides - Simple improved version */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.01 }}
                className="relative group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-forest-400 to-terracotta-400 rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500" />

                <div className="relative bg-gradient-to-br from-cream-50 via-white to-cream-100 rounded-3xl p-8 border-2 border-cream-200 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <motion.div
                            className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </motion.div>
                        <div className="flex-1">
                            <h4 className="font-serif text-2xl font-bold text-charcoal-900 mb-3">
                                Aides financières disponibles
                            </h4>
                            <p className="text-charcoal-600 mb-6 leading-relaxed">
                                Notre établissement est habilité à l&apos;aide sociale à l&apos;hébergement
                                (ASH) et conventionné APL. Nous vous accompagnons dans vos démarches
                                pour obtenir les aides auxquelles vous avez droit.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { acronym: "ASH", name: "Aide Sociale à l'Hébergement", color: "forest" },
                                    { acronym: "APL", name: "Aide Personnalisée au Logement", color: "terracotta" },
                                    { acronym: "APA", name: "Allocation Personnalisée d'Autonomie", color: "violet" },
                                ].map((aid, i) => (
                                    <motion.span
                                        key={aid.acronym}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.1 * i }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className={`inline-flex items-center gap-2 px-4 py-2 bg-${aid.color}-50 rounded-full text-sm font-bold text-${aid.color}-600 shadow-sm border border-${aid.color}-100 cursor-default`}
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {aid.name}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
