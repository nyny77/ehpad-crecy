"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import gazetteData from "@/lib/data/gazette.json";
import { Calendar } from "lucide-react";
import GazetteRenderer from "@/components/gazette/GazetteRenderer";

export default function EchoDuCoeurPage() {
    // Support backward compatibility
    const allGazettes = (gazetteData as any).gazettes || ((gazetteData as any).file ? [{ title: "Dernière parution", file: (gazetteData as any).file, date: (gazetteData as any).date }] : []);
    
    const [selectedGazette, setSelectedGazette] = useState<any>(allGazettes[0] || null);

    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-12 bg-cream-100 print:bg-white print:pt-0 print:pb-0">
            <div className="w-full px-4 md:px-8 max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 print:px-0 print:gap-0">
                {/* Main View */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-grow bg-charcoal-900 rounded-3xl p-2 md:p-3 shadow-2xl border border-charcoal-700 lg:h-[calc(100vh-10rem)] overflow-y-auto print:shadow-none print:border-none print:bg-white print:h-auto print:overflow-visible print:p-0"
                >
                    {selectedGazette ? (
                        selectedGazette.type === "generated" ? (
                            <div className="w-full min-h-full bg-cream-50 rounded-2xl p-4 md:p-8 print:bg-white print:p-0">
                                <GazetteRenderer 
                                    title={selectedGazette.title}
                                    date={selectedGazette.date}
                                    blocks={selectedGazette.content}
                                />
                            </div>
                        ) : (
                            <iframe
                                src={selectedGazette.file}
                                className="w-full h-full rounded-2xl border-none bg-white min-h-[600px] lg:min-h-0 print:hidden"
                                title="Le Petit Echo du Coeur PDF"
                            />
                        )
                    ) : (
                        <div className="w-full h-full min-h-[400px] rounded-2xl bg-charcoal-800 flex items-center justify-center text-charcoal-400 print:hidden">
                            Aucune gazette publiée pour le moment.
                        </div>
                    )}
                </motion.div>
                
                {/* Archives Sidebar */}
                {allGazettes.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full lg:w-80 flex-shrink-0 bg-white rounded-3xl p-6 shadow-sm border border-cream-200 h-fit print:hidden"
                    >
                        <h2 className="font-serif text-2xl text-charcoal-900 mb-6">Anciens numéros</h2>
                        <ul className="space-y-3">
                            {allGazettes.map((g: any, i: number) => {
                                const isSelected = selectedGazette && (
                                    (g.type === "generated" && selectedGazette.id === g.id) || 
                                    (g.type !== "generated" && selectedGazette.file === g.file)
                                );
                                
                                return (
                                    <li key={i}>
                                        <button
                                            onClick={() => setSelectedGazette(g)}
                                            className={`w-full text-left px-4 py-4 rounded-2xl transition-all border ${
                                                isSelected 
                                                ? 'bg-terracotta-600 text-white border-terracotta-600 shadow-md transform scale-[1.02]' 
                                                : 'bg-white hover:bg-cream-50 text-charcoal-700 border-cream-200 hover:border-cream-300'
                                            }`}
                                        >
                                            <div 
                                                className="font-semibold text-lg flex items-center gap-2 rich-text-content-inline"
                                                dangerouslySetInnerHTML={{ __html: g.title || `Gazette ${i + 1}` }}
                                            />
                                            {g.date && (
                                                <div className={`text-sm mt-2 flex items-center gap-1.5 ${isSelected ? 'text-terracotta-100' : 'text-charcoal-500'}`}>
                                                    <Calendar size={14} />
                                                    <span>{new Date(g.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                                                </div>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
