"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Info, ChevronDown, ChevronUp, Utensils, Bed, Shirt, ShieldPlus, HeartPulse, Sparkles, Calculator } from "lucide-react";
import {
    PRICING_DATA,
    PRICING_EXCLUDES,
    PRICING_DATE,
    UNDER_60_PRICING,
    calculateMonthlyPricing,
    RoomType
} from "@/lib/pricing-data";

const INCLUDED_FEATURES = [
    { text: "Restauration sur place (Matin, Midi, Goûter, Soir)", icon: Utensils, color: "text-orange-500", bg: "bg-orange-100" },
    { text: "Linge de lit et de toilette fourni et entretenu", icon: Bed, color: "text-blue-500", bg: "bg-blue-100" },
    { text: "Entretien du linge personnel", icon: Shirt, color: "text-purple-500", bg: "bg-purple-100" },
    { text: "Soins (Infirmiers, aides-soignantes, Accompagnants Éducatifs et Sociaux, médecin co., psychologue)", icon: HeartPulse, color: "text-terracotta-500", bg: "bg-terracotta-100" },
    { text: "Fourniture des protections d'incontinence", icon: ShieldPlus, color: "text-emerald-500", bg: "bg-emerald-100" },
    { text: "Animations quotidiennes et vie sociale", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-100" },
];

export default function PricingSection({
    externalRoomType,
    onExternalRoomChange
}: {
    externalRoomType?: RoomType;
    onExternalRoomChange?: (room: RoomType) => void;
} = {}) {
    const [internalRoomType, setInternalRoomType] = useState<RoomType>("simple");
    const [showDetails, setShowDetails] = useState(false);
    
    // Simulator states
    const [selectedGir, setSelectedGir] = useState<number>(0); // 0 = GIR 1-2, 1 = GIR 3-4, 2 = GIR 5-6
    const [hasApa, setHasApa] = useState<boolean>(true);

    const roomType = externalRoomType || internalRoomType;
    const setRoomType = onExternalRoomChange || setInternalRoomType;

    const currentPricing = PRICING_DATA[roomType];
    const { dailyHebergement, dailyDependance, totalDaily, estimatedMonthly } =
        calculateMonthlyPricing(roomType, selectedGir, hasApa);

    return (
        <section className="relative scroll-mt-24 overflow-hidden bg-cream-100 py-14 md:py-24" id="tarifs">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-terracotta-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-sage-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container-custom relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-terracotta-600 font-bold tracking-wider uppercase text-sm mb-4 block">
                        Simulateur de Tarifs
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl text-charcoal-900 mb-6">
                        Estimez votre coût d'hébergement
                    </h2>
                    <p className="text-charcoal-600 text-lg">
                        En tant qu'établissement public, notre facturation est divisée en deux parties : l'hébergement et la dépendance. Utilisez ce simulateur pour estimer votre reste à charge.
                        <br />
                        <span className="inline-block mt-4 bg-white border border-cream-200 px-4 py-2 rounded-full text-sm font-bold text-forest-700 shadow-sm">
                            Tarifs en vigueur : {PRICING_DATE}
                        </span>
                    </p>
                </div>

                {/* Room Type Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="relative inline-flex p-[3px] rounded-full overflow-hidden shadow-lg" role="group" aria-label="Type de chambre">
                        <motion.div 
                            className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_280deg,#C80040_360deg)] opacity-90 origin-center"
                            style={{ x: '-50%', y: '-50%' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="bg-white p-1.5 rounded-full inline-flex relative z-10 w-full h-full">
                            <button
                                type="button"
                                onClick={() => setRoomType("simple")}
                                aria-pressed={roomType === "simple"}
                                className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors ${roomType === "simple" ? "text-white" : "text-charcoal-600 hover:text-charcoal-900"}`}
                            >
                                Chambre Simple
                            </button>
                            <button
                                type="button"
                                onClick={() => setRoomType("double")}
                                aria-pressed={roomType === "double"}
                                className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors ${roomType === "double" ? "text-white" : "text-charcoal-600 hover:text-charcoal-900"}`}
                            >
                                Chambre Double
                            </button>
                            <motion.div
                                className="absolute inset-y-1.5 w-1/2 bg-[#C80040] rounded-full z-0 shadow-sm"
                                initial={false}
                                animate={{
                                    left: roomType === "simple" ? "0.375rem" : "50%",
                                    width: roomType === "simple" ? "calc(50% - 0.375rem)" : "calc(50% - 0.375rem)",
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    <motion.div
                        key={roomType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-cream-200"
                    >
                        {/* THE SIMULATOR & PRICE */}
                        <div className="grid lg:grid-cols-2">
                            {/* Left: Inputs */}
                            <div className="p-8 md:p-12 bg-cream-50 border-b lg:border-b-0 lg:border-r border-cream-200">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-forest-100 text-forest-600 rounded-xl flex items-center justify-center">
                                        <Calculator className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                                        Votre situation
                                    </h3>
                                </div>

                                <div className="space-y-8">
                                    {/* GIR Selection */}
                                    <fieldset>
                                        <legend className="block text-sm font-bold text-charcoal-800 mb-3">
                                            1. Niveau d'autonomie (GIR)
                                        </legend>
                                        <div className="grid grid-cols-3 gap-2">
                                            {currentPricing.dependanceRates.map((rate, idx) => (
                                                <button
                                                    type="button"
                                                    key={idx}
                                                    onClick={() => setSelectedGir(idx)}
                                                    aria-pressed={selectedGir === idx}
                                                    className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 ${
                                                        selectedGir === idx 
                                                        ? 'bg-forest-50 border-forest-500 text-forest-700 shadow-sm' 
                                                        : 'bg-white border-transparent text-charcoal-600 hover:border-cream-300 shadow-sm'
                                                    }`}
                                                >
                                                    {rate.gir}
                                                </button>
                                            ))}
                                        </div>
                                    </fieldset>

                                    {/* APA Selection */}
                                    <fieldset>
                                        <legend className="block text-sm font-bold text-charcoal-800 mb-3">
                                            2. Êtes-vous éligible à l'APA ?
                                        </legend>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setHasApa(true)}
                                                aria-pressed={hasApa}
                                                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${
                                                    hasApa 
                                                    ? 'bg-forest-50 border-forest-500 text-forest-700 shadow-sm' 
                                                    : 'bg-white border-transparent text-charcoal-600 hover:border-cream-300 shadow-sm'
                                                }`}
                                            >
                                                Oui (Cas le plus fréquent)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setHasApa(false)}
                                                aria-pressed={!hasApa}
                                                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${
                                                    !hasApa 
                                                    ? 'bg-forest-50 border-forest-500 text-forest-700 shadow-sm' 
                                                    : 'bg-white border-transparent text-charcoal-600 hover:border-cream-300 shadow-sm'
                                                }`}
                                            >
                                                Non
                                            </button>
                                        </div>
                                        <p className="text-xs text-charcoal-500 mt-3 italic">
                                            L'APA couvre la majeure partie du tarif dépendance pour les GIR 1 à 4.
                                        </p>
                                    </fieldset>
                                </div>
                            </div>

                            {/* Right: Price Result */}
                            <div className="bg-charcoal-900 text-white p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                
                                <h4 className="text-white/80 font-medium mb-2 relative z-10 text-center">
                                    Estimation du Reste à charge ({currentPricing.name})
                                </h4>
                                
                                <div className="text-center relative z-10 mb-8 mt-4" aria-live="polite" aria-atomic="true">
                                    <motion.div 
                                        key={`${roomType}-${selectedGir}-${hasApa}`}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex items-baseline justify-center gap-2"
                                    >
                                        <span className="text-6xl md:text-7xl font-bold tracking-tight">
                                            {estimatedMonthly.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </span>
                                        <span className="text-xl text-white/80">€ / mois*</span>
                                    </motion.div>
                                    <p className="text-white/50 text-xs mt-2">*Basé sur un mois de 31 jours, hors aides au logement (APL/ASH).</p>
                                </div>

                                {/* Visual Breakdown Bar */}
                                <div className="relative z-10">
                                    <div className="flex justify-between text-xs text-white/80 mb-2">
                                        <span>Hébergement ({dailyHebergement}€/j)</span>
                                        <span>Dépendance ({dailyDependance}€/j)</span>
                                    </div>
                                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
                                        <motion.div 
                                            className="h-full bg-forest-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(dailyHebergement / totalDaily) * 100}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                        <motion.div 
                                            className="h-full bg-terracotta-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(dailyDependance / totalDaily) * 100}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PACKAGE INCLUDES (Visual Grid) */}
                        <div className="p-8 md:p-12 bg-white">
                            <h4 className="font-serif text-2xl mb-8 text-center text-charcoal-900">
                                Votre formule "Tout Compris"
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {INCLUDED_FEATURES.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-cream-50 hover:bg-cream-100 transition-colors border border-cream-200 shadow-sm">
                                        <div className={`w-12 h-12 rounded-full ${feature.bg} ${feature.color} flex items-center justify-center shrink-0`}>
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-bold text-charcoal-800 leading-snug mt-1">
                                            {feature.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Exclus */}
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                                <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                                    <X className="w-5 h-5 text-red-500" />
                                    Ne sont pas inclus dans le tarif :
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {PRICING_EXCLUDES.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-red-800/80">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Details Accordion */}
                            <div className="border-t border-cream-200 pt-8 mt-12">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="flex items-center justify-between w-full text-left font-bold text-charcoal-800 hover:text-terracotta-600 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Info className="w-5 h-5 text-terracotta-500" />
                                        Détail officiel des tarifs par GIR (pour information)
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
                                            <div className="pt-6">
                                                <div className="overflow-x-auto rounded-xl border border-cream-200">
                                                    <table className="w-full text-left border-collapse bg-white">
                                                        <thead>
                                                            <tr className="border-b border-cream-200 text-sm text-charcoal-500 bg-cream-50">
                                                                <th className="py-3 px-4 font-bold text-charcoal-900">Niveau d'autonomie</th>
                                                                <th className="py-3 px-4 font-bold text-charcoal-900 text-right">Tarif Dépendance brut</th>
                                                                <th className="py-3 px-4 font-bold text-charcoal-900 text-right">Prise en charge APA maxi*</th>
                                                                <th className="py-3 px-4 font-bold text-charcoal-900 text-right">Ticket Modérateur</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentPricing.dependanceRates.map((rate, idx) => (
                                                                <tr key={idx} className="border-b border-cream-100 last:border-0">
                                                                    <td className="py-4 px-4 font-bold text-charcoal-800">{rate.gir}</td>
                                                                    <td className="py-4 px-4 text-right text-charcoal-600">{rate.dependance} € / j</td>
                                                                    <td className="py-4 px-4 text-right text-green-600 font-medium">
                                                                        {rate.apa > 0 ? `-${rate.apa} € / j` : "-"}
                                                                    </td>
                                                                    <td className="py-4 px-4 text-right font-bold text-terracotta-600">
                                                                        {currentPricing.ticketModerateur} € / j
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* Under 60 info card */}
                    <div className="mt-8 bg-sage-50 border border-sage-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm max-w-3xl mx-auto">
                        <Info className="w-6 h-6 text-sage-600 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="font-bold text-charcoal-900 mb-1">
                                Résidents de moins de 60 ans ou handicapés avant 60 ans
                            </h5>
                            <p className="text-charcoal-600 text-sm">
                                Le tarif d'hébergement pour cette catégorie est de <strong>{UNDER_60_PRICING.parJour} € par jour</strong> (soit {UNDER_60_PRICING.parMois} € pour un mois de 31 jours).
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
