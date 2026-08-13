"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

const adminDocs = [
    "Livret de famille ou carte d'identité",
    "Carte Vitale et attestation de droits",
    "Carte de mutuelle",
    "Dernier avis d'imposition",
    "Justificatifs de pensions et de retraites",
    "RIB (Relevé d'Identité Bancaire)",
    "Copie du jugement si mesure de protection (tutelle/curatelle)",
    "Ordonnances récentes et dossier médical"
];

const suitcaseItems = [
    "Vêtements de jour confortables et adaptés",
    "Linge de nuit (pyjamas, chemises de nuit)",
    "Chaussons fermés et chaussures confortables",
    "Nécessaire de toilette (brosse à dents, dentifrice, savon, shampoing, rasoir)",
    "Eau de toilette ou parfum habituel",
    "Lunettes, prothèses auditives ou dentaires (avec leurs boîtes)",
    "Petits objets de décoration (photos, bibelots) pour personnaliser la chambre"
];

export default function AdmissionChecklists() {
    return (
        <section className="py-16 bg-white relative">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block py-1.5 px-5 rounded-full bg-forest-100 text-forest-700 font-bold tracking-wider uppercase text-sm mb-4"
                    >
                        Organisation
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-3xl md:text-5xl text-charcoal-900 font-bold mb-4"
                    >
                        Les listes pour ne rien oublier
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-charcoal-600 max-w-2xl mx-auto text-lg"
                    >
                        Pour que l'entrée se passe dans la plus grande sérénité, voici les éléments à préparer à l'avance.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Colonne 1: Documents */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-cream-50 rounded-3xl p-8 border border-cream-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="w-14 h-14 bg-forest-100 text-forest-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                            📂
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-6">Le dossier administratif</h3>
                        <ul className="space-y-4">
                            {adminDocs.map((doc, idx) => (
                                <motion.li 
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-6 h-6 text-forest-500 shrink-0" />
                                    <span className="text-charcoal-700">{doc}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Colonne 2: Valise */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-cream-50 rounded-3xl p-8 border border-cream-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="w-14 h-14 bg-terracotta-100 text-terracotta-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                            🧳
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-6">Le Trousseau (La valise)</h3>
                        
                        <div className="bg-white border-l-4 border-forest-400 p-4 rounded-r-xl mb-6 flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-forest-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-charcoal-700">
                                <p className="font-bold text-charcoal-900 mb-1">Entretien du linge</p>
                                <p>L'entretien du linge personnel est inclus. Pour éviter toute perte en blanchisserie, les vêtements doivent être marqués. <strong>Bonne nouvelle : notre équipe peut se charger du marquage pour vous</strong> lors de l'admission !</p>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {suitcaseItems.map((item, idx) => (
                                <motion.li 
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-6 h-6 text-terracotta-500 shrink-0" />
                                    <span className="text-charcoal-700">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                        
                        <div className="mt-8 pt-6 border-t border-cream-200 flex items-start gap-3 text-sm text-charcoal-600">
                            <div className="text-xl">🛏️</div>
                            <p><strong>Note :</strong> L'EHPAD fournit le lit médicalisé, le linge de lit (draps, couvertures) ainsi que le linge de toilette.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
