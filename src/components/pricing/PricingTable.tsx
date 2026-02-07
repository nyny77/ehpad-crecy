"use client";

import { motion } from "framer-motion";
import { EHPAD_INFO } from "@/lib/constants";

export default function PricingTable() {
    const { pricing } = EHPAD_INFO;

    return (
        <div className="space-y-8">
            {/* Tarifs Hébergement */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-cream-100 relative group"
            >
                {/* Decorative top border */}
                <div className="h-2 w-full bg-gradient-to-r from-terracotta-300 to-terracotta-500" />

                <div className="px-8 pt-8 pb-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest text-terracotta-600 uppercase bg-terracotta-50 rounded-full">
                                Hébergement
                            </span>
                            <h3 className="font-serif text-3xl md:text-4xl text-charcoal-800 font-bold">
                                Tarifs Journaliers
                            </h3>
                        </div>
                        <div className="text-right">
                            <p className="text-charcoal-400 text-sm font-medium">
                                Mise à jour {pricing.lastUpdate}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-cream-100">
                                    <th className="text-left py-6 px-8 font-serif italic text-charcoal-500 font-normal text-lg">
                                        Type de chambre
                                    </th>
                                    <th className="text-center py-6 px-8 font-serif italic text-charcoal-500 font-normal text-lg">
                                        Tarif standard
                                    </th>
                                    <th className="text-center py-6 px-8 font-serif italic text-charcoal-500 font-normal text-lg">
                                        Aide Sociale (ASH)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-50">
                                <tr className="hover:bg-cream-50/50 transition-colors group/row">
                                    <td className="py-8 px-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-cream-50 rounded-2xl flex items-center justify-center text-terracotta-400 border border-cream-100 group-hover/row:scale-105 transition-transform shadow-sm">
                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-serif text-xl font-bold text-charcoal-800 mb-1">
                                                    {pricing.accommodation.singleRoom.label}
                                                </p>
                                                <p className="text-sm text-charcoal-500 font-medium">
                                                    Espace privatif (~20m²)
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8 text-center">
                                        <span className="font-serif text-4xl font-bold text-charcoal-800 block">
                                            {pricing.accommodation.singleRoom.standard.toFixed(2)}€
                                        </span>
                                        <span className="text-charcoal-400 text-xs uppercase tracking-wide font-semibold">/jour</span>
                                    </td>
                                    <td className="py-8 px-8 text-center bg-cream-50/30">
                                        <span className="font-serif text-3xl font-bold text-forest-600/80 block">
                                            {pricing.accommodation.singleRoom.socialAid.toFixed(2)}€
                                        </span>
                                        <span className="text-forest-400 text-xs uppercase tracking-wide font-semibold">/jour</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-cream-50/50 transition-colors group/row">
                                    <td className="py-8 px-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-cream-50 rounded-2xl flex items-center justify-center text-wood-400 border border-cream-100 group-hover/row:scale-105 transition-transform shadow-sm">
                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-serif text-xl font-bold text-charcoal-800 mb-1">
                                                    {pricing.accommodation.doubleRoom.label}
                                                </p>
                                                <p className="text-sm text-charcoal-500 font-medium">
                                                    Pour couples (~30m²)
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8 text-center">
                                        <span className="font-serif text-4xl font-bold text-charcoal-800 block">
                                            {pricing.accommodation.doubleRoom.standard.toFixed(2)}€
                                        </span>
                                        <span className="text-charcoal-400 text-xs uppercase tracking-wide font-semibold">/jour</span>
                                    </td>
                                    <td className="py-8 px-8 text-center bg-cream-50/30">
                                        <span className="font-serif text-3xl font-bold text-forest-600/80 block">
                                            {pricing.accommodation.doubleRoom.socialAid.toFixed(2)}€
                                        </span>
                                        <span className="text-forest-400 text-xs uppercase tracking-wide font-semibold">/jour</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* Tarifs Dépendance GIR */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-16"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-2">
                    <div>
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest text-forest-600 uppercase bg-forest-50 rounded-full">
                            Dépendance
                        </span>
                        <h3 className="font-serif text-3xl md:text-4xl text-charcoal-800 font-bold">
                            Tarifs GIR
                        </h3>
                    </div>
                    <p className="text-charcoal-500 text-sm font-medium max-w-sm text-right italic">
                        Le tarif dépendance est calculé selon le niveau d'autonomie (GIR).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* GIR 1-2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-[2rem] p-8 border border-cream-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-terracotta-400 group-hover:bg-terracotta-500 transition-colors"></div>

                        <div className="flex justify-between items-start mb-8">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Pie Chart Background */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-terracotta-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    {/* Filled Segment (75%) */}
                                    <motion.path
                                        className="text-terracotta-500 drop-shadow-sm"
                                        animate={{ strokeDasharray: ["0, 100", "75, 100", "75, 100", "0, 100"] }}
                                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0 }}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="text-terracotta-600 font-bold text-lg relative z-10">1-2</span>
                            </div>
                            <span className="px-3 py-1 bg-cream-50 text-charcoal-500 text-xs font-bold uppercase rounded-full tracking-wider border border-cream-100 h-fit">Élevé</span>
                        </div>

                        <h4 className="font-serif text-2xl font-bold text-charcoal-800 mb-3">
                            {pricing.dependency.gir1_2.label}
                        </h4>
                        <p className="text-sm text-charcoal-500 mb-8 min-h-[40px] leading-relaxed">
                            {pricing.dependency.gir1_2.description}
                        </p>

                        <div className="pt-6 border-t border-cream-50">
                            <p className="font-serif text-4xl font-bold text-charcoal-800">
                                {pricing.dependency.gir1_2.rate.toFixed(2)}€
                                <span className="text-sm font-sans font-bold text-charcoal-400 ml-1 uppercase text-xs">/jour</span>
                            </p>
                        </div>
                    </motion.div>

                    {/* GIR 3-4 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-[2rem] p-8 border border-cream-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-terracotta-400 group-hover:bg-terracotta-500 transition-colors"></div>

                        <div className="flex justify-between items-start mb-8">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Pie Chart Background */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-terracotta-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    {/* Filled Segment (50%) */}
                                    <motion.path
                                        className="text-terracotta-500 drop-shadow-sm"
                                        animate={{ strokeDasharray: ["0, 100", "50, 100", "50, 100", "0, 100"] }}
                                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.1 }}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="text-terracotta-600 font-bold text-lg relative z-10">3-4</span>
                            </div>
                            <span className="px-3 py-1 bg-cream-50 text-charcoal-500 text-xs font-bold uppercase rounded-full tracking-wider border border-cream-100 h-fit">Moyen</span>
                        </div>

                        <h4 className="font-serif text-2xl font-bold text-charcoal-800 mb-3">
                            {pricing.dependency.gir3_4.label}
                        </h4>
                        <p className="text-sm text-charcoal-500 mb-8 min-h-[40px] leading-relaxed">
                            {pricing.dependency.gir3_4.description}
                        </p>

                        <div className="pt-6 border-t border-cream-50">
                            <p className="font-serif text-4xl font-bold text-charcoal-800">
                                {pricing.dependency.gir3_4.rate.toFixed(2)}€
                                <span className="text-sm font-sans font-bold text-charcoal-400 ml-1 uppercase text-xs">/jour</span>
                            </p>
                        </div>
                    </motion.div>

                    {/* GIR 5-6 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-[2rem] p-8 border border-cream-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-terracotta-400 group-hover:bg-terracotta-500 transition-colors"></div>

                        <div className="flex justify-between items-start mb-8">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Pie Chart Background */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-terracotta-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    {/* Filled Segment (25%) */}
                                    <motion.path
                                        className="text-terracotta-500 drop-shadow-sm"
                                        animate={{ strokeDasharray: ["0, 100", "25, 100", "25, 100", "0, 100"] }}
                                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.2 }}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="text-terracotta-600 font-bold text-lg relative z-10">5-6</span>
                            </div>
                            <span className="px-3 py-1 bg-cream-50 text-charcoal-500 text-xs font-bold uppercase rounded-full tracking-wider border border-cream-100 h-fit">Faible</span>
                        </div>

                        <h4 className="font-serif text-2xl font-bold text-charcoal-800 mb-3">
                            {pricing.dependency.gir5_6.label}
                        </h4>
                        <p className="text-sm text-charcoal-500 mb-8 min-h-[40px] leading-relaxed">
                            {pricing.dependency.gir5_6.description}
                        </p>

                        <div className="pt-6 border-t border-cream-50">
                            <p className="font-serif text-4xl font-bold text-charcoal-800">
                                {pricing.dependency.gir5_6.rate.toFixed(2)}€
                                <span className="text-sm font-sans font-bold text-charcoal-400 ml-1 uppercase text-xs">/jour</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Info aides */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-r from-cream-200 to-cream-100 rounded-3xl p-8"
            >
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                        <svg
                            className="w-8 h-8 text-forest-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-serif text-xl font-semibold text-charcoal-900 mb-2">
                            Aides financières disponibles
                        </h4>
                        <p className="text-charcoal-600 mb-4">
                            Notre établissement est habilité à l&apos;aide sociale à l&apos;hébergement
                            (ASH) et conventionné APL. Nous vous accompagnons dans vos démarches
                            pour obtenir les aides auxquelles vous avez droit.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-forest-600 shadow-soft">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Aide Sociale à l&apos;Hébergement (ASH)
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-forest-600 shadow-soft">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Aide Personnalisée au Logement (APL)
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-forest-600 shadow-soft">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Allocation Personnalisée d&apos;Autonomie (APA)
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
