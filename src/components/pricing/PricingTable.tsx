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
                className="card-warm overflow-hidden"
            >
                <div className="bg-gradient-to-r from-terracotta-500 to-terracotta-400 px-6 py-4">
                    <h3 className="font-serif text-xl md:text-2xl text-white">
                        Tarifs d&apos;hébergement
                    </h3>
                    <p className="text-terracotta-100 text-sm mt-1">
                        Tarifs journaliers - Mise à jour {pricing.lastUpdate}
                    </p>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-cream-200">
                                    <th className="text-left py-4 px-4 font-semibold text-charcoal-700">
                                        Type de chambre
                                    </th>
                                    <th className="text-center py-4 px-4 font-semibold text-charcoal-700">
                                        Tarif standard
                                    </th>
                                    <th className="text-center py-4 px-4 font-semibold text-charcoal-700">
                                        <span className="inline-flex items-center gap-2">
                                            Tarif aide sociale
                                            <span className="inline-block w-5 h-5 bg-forest-100 text-forest-600 rounded-full text-xs flex items-center justify-center">
                                                ASH
                                            </span>
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-terracotta-100 rounded-xl flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-terracotta-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-charcoal-900">
                                                    {pricing.accommodation.singleRoom.label}
                                                </p>
                                                <p className="text-sm text-charcoal-500">
                                                    Chambre individuelle
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className="text-2xl font-bold text-charcoal-900">
                                            {pricing.accommodation.singleRoom.standard.toFixed(2)}€
                                        </span>
                                        <span className="text-charcoal-500 text-sm">/jour</span>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className="text-2xl font-bold text-forest-600">
                                            {pricing.accommodation.singleRoom.socialAid.toFixed(2)}€
                                        </span>
                                        <span className="text-charcoal-500 text-sm">/jour</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-cream-50 transition-colors">
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-wood-100 rounded-xl flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-wood-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-charcoal-900">
                                                    {pricing.accommodation.doubleRoom.label}
                                                </p>
                                                <p className="text-sm text-charcoal-500">
                                                    Pour couple ou sur demande
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className="text-2xl font-bold text-charcoal-900">
                                            {pricing.accommodation.doubleRoom.standard.toFixed(2)}€
                                        </span>
                                        <span className="text-charcoal-500 text-sm">/jour</span>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className="text-2xl font-bold text-forest-600">
                                            {pricing.accommodation.doubleRoom.socialAid.toFixed(2)}€
                                        </span>
                                        <span className="text-charcoal-500 text-sm">/jour</span>
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
                className="card-warm overflow-hidden"
            >
                <div className="bg-gradient-to-r from-forest-500 to-forest-400 px-6 py-4">
                    <h3 className="font-serif text-xl md:text-2xl text-white">
                        Tarifs dépendance (GIR)
                    </h3>
                    <p className="text-forest-100 text-sm mt-1">
                        Tarif journalier selon le niveau d&apos;autonomie
                    </p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* GIR 1-2 */}
                        <div className="bg-cream-50 rounded-2xl p-6 text-center border border-cream-200">
                            <div className="w-14 h-14 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-terracotta-500 font-bold">1-2</span>
                            </div>
                            <h4 className="font-semibold text-charcoal-900 mb-1">
                                {pricing.dependency.gir1_2.label}
                            </h4>
                            <p className="text-sm text-charcoal-500 mb-4">
                                {pricing.dependency.gir1_2.description}
                            </p>
                            <p className="text-3xl font-bold text-charcoal-900">
                                {pricing.dependency.gir1_2.rate.toFixed(2)}€
                                <span className="text-base font-normal text-charcoal-500">/jour</span>
                            </p>
                        </div>

                        {/* GIR 3-4 */}
                        <div className="bg-cream-50 rounded-2xl p-6 text-center border border-cream-200">
                            <div className="w-14 h-14 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-wood-600 font-bold">3-4</span>
                            </div>
                            <h4 className="font-semibold text-charcoal-900 mb-1">
                                {pricing.dependency.gir3_4.label}
                            </h4>
                            <p className="text-sm text-charcoal-500 mb-4">
                                {pricing.dependency.gir3_4.description}
                            </p>
                            <p className="text-3xl font-bold text-charcoal-900">
                                {pricing.dependency.gir3_4.rate.toFixed(2)}€
                                <span className="text-base font-normal text-charcoal-500">/jour</span>
                            </p>
                        </div>

                        {/* GIR 5-6 */}
                        <div className="bg-cream-50 rounded-2xl p-6 text-center border border-cream-200">
                            <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-forest-600 font-bold">5-6</span>
                            </div>
                            <h4 className="font-semibold text-charcoal-900 mb-1">
                                {pricing.dependency.gir5_6.label}
                            </h4>
                            <p className="text-sm text-charcoal-500 mb-4">
                                {pricing.dependency.gir5_6.description}
                            </p>
                            <p className="text-3xl font-bold text-charcoal-900">
                                {pricing.dependency.gir5_6.rate.toFixed(2)}€
                                <span className="text-base font-normal text-charcoal-500">/jour</span>
                            </p>
                        </div>
                    </div>
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
