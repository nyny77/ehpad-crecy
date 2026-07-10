"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Info, ChevronDown, ChevronUp } from "lucide-react";
import {
    PRICING_DATA,
    PRICING_INCLUDES,
    PRICING_EXCLUDES,
    PRICING_DATE,
    UNDER_60_PRICING,
    RoomType
} from "@/lib/pricing-data";

export default function PricingSection() {
    const [roomType, setRoomType] = useState<RoomType>("simple");
    const [showDetails, setShowDetails] = useState(false);

    const currentPricing = PRICING_DATA[roomType];

    return (
        <section className="py-24 bg-cream-50 relative overflow-hidden" id="tarifs">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-terracotta-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-sage-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container-custom relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-terracotta-600 font-bold tracking-wider uppercase text-sm mb-4 block">
                        Nos Tarifs
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl text-charcoal-900 mb-6">
                        Transparence et accompagnement
                    </h2>
                    <p className="text-charcoal-600 text-lg">
                        Découvrez nos tarifs clairs, incluant l'hébergement et la prise en charge.
                        <br />
                        <span className="inline-block mt-2 bg-cream-200 px-3 py-1 rounded-full text-sm font-medium text-charcoal-800">
                            Tarifs en vigueur à partir de : {PRICING_DATE}
                        </span>
                    </p>
                </div>

                {/* Room Type Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1.5 rounded-full shadow-md inline-flex relative">
                        <button
                            onClick={() => setRoomType("simple")}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors ${roomType === "simple" ? "text-white" : "text-charcoal-600 hover:text-charcoal-900"
                                }`}
                        >
                            Chambre Simple
                        </button>
                        <button
                            onClick={() => setRoomType("double")}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors ${roomType === "double" ? "text-white" : "text-charcoal-600 hover:text-charcoal-900"
                                }`}
                        >
                            Chambre Double
                        </button>
                        {/* Animated slider */}
                        <motion.div
                            className="absolute inset-y-1.5 w-1/2 bg-terracotta-500 rounded-full z-0 shadow-sm"
                            initial={false}
                            animate={{
                                left: roomType === "simple" ? "0.375rem" : "50%",
                                width: roomType === "simple" ? "calc(50% - 0.375rem)" : "calc(50% - 0.375rem)",
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Main Pricing Card */}
                    <motion.div
                        key={roomType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-cream-200"
                    >
                        <div className="bg-charcoal-900 text-white p-8 md:p-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                            <h3 className="font-serif text-3xl mb-2 relative z-10">{currentPricing.name}</h3>
                            <p className="text-white/80 mb-8 relative z-10">Reste à charge mensuel estimé*</p>
                            
                            <div className="flex items-baseline justify-center gap-2 relative z-10">
                                <span className="text-6xl md:text-7xl font-bold tracking-tight">
                                    {currentPricing.mensualite.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-xl text-white/80">€ / mois</span>
                            </div>
                            <p className="text-white/60 text-sm mt-4 relative z-10">
                                *Mensualité après déduction APA maximale
                            </p>
                        </div>

                        <div className="p-8 md:p-12 bg-white">
                            {/* Inclus / Exclus */}
                            <div className="grid md:grid-cols-2 gap-12 mb-12">
                                <div>
                                    <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-charcoal-900">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check className="w-5 h-5 text-green-600" />
                                        </div>
                                        Ce tarif comprend
                                    </h4>
                                    <ul className="space-y-4">
                                        {PRICING_INCLUDES.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-charcoal-600">
                                                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-charcoal-900">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                            <X className="w-5 h-5 text-red-600" />
                                        </div>
                                        Ne comprend pas
                                    </h4>
                                    <ul className="space-y-4">
                                        {PRICING_EXCLUDES.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-charcoal-600">
                                                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Details Accordion */}
                            <div className="border-t border-cream-200 pt-8">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="flex items-center justify-between w-full text-left font-bold text-charcoal-800 hover:text-terracotta-600 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Info className="w-5 h-5 text-terracotta-500" />
                                        Détail du calcul et tarifs par GIR
                                    </span>
                                    {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                                
                                <AnimatePresence>
                                    {showDetails && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-6 space-y-6">
                                                <div className="grid grid-cols-2 gap-4 bg-cream-50 p-6 rounded-2xl">
                                                    <div>
                                                        <p className="text-sm text-charcoal-500 mb-1">Tarif Hébergement Journalier</p>
                                                        <p className="font-bold text-xl text-charcoal-900">{currentPricing.hebergementParJour} €</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-charcoal-500 mb-1">Tarif Hébergement Mensuel</p>
                                                        <p className="font-bold text-xl text-charcoal-900">{currentPricing.hebergementParMois} €</p>
                                                    </div>
                                                </div>

                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="border-b border-cream-200 text-sm text-charcoal-500">
                                                                <th className="py-3 font-medium">Niveau d'autonomie</th>
                                                                <th className="py-3 font-medium text-right">Tarif Dépendance</th>
                                                                <th className="py-3 font-medium text-right">Prise en charge APA*</th>
                                                                <th className="py-3 font-medium text-right">Ticket Modérateur</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentPricing.dependanceRates.map((rate, idx) => (
                                                                <tr key={idx} className="border-b border-cream-100 last:border-0">
                                                                    <td className="py-4 font-bold text-charcoal-800">{rate.gir}</td>
                                                                    <td className="py-4 text-right text-charcoal-600">{rate.dependance} € / j</td>
                                                                    <td className="py-4 text-right text-green-600 font-medium">
                                                                        {rate.apa > 0 ? `-${rate.apa} € / j` : "-"}
                                                                    </td>
                                                                    <td className="py-4 text-right font-bold text-terracotta-600">
                                                                        {currentPricing.ticketModerateur} € / j
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <p className="text-xs text-charcoal-500 italic">
                                                    * L'APA (Allocation Personnalisée d'Autonomie) est attribuée en fonction de l'état d'autonomie du résident (GIR 1-4) et de ses ressources. Le ticket modérateur (correspondant au tarif GIR 5-6) reste toujours à la charge du résident.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* Under 60 info card */}
                    <div className="mt-8 bg-sage-50 border border-sage-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                        <Info className="w-6 h-6 text-sage-600 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="font-bold text-charcoal-900 mb-1">
                                Résidents de moins de 60 ans ou handicapés avant 60 ans
                            </h5>
                            <p className="text-charcoal-600 text-sm">
                                Le tarif d'hébergement pour cette catégorie est de <strong>{UNDER_60_PRICING.parJour} € par jour</strong> (soit {UNDER_60_PRICING.parMois} € pour 31 jours).
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
