"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import gazetteData from "@/lib/data/gazette.json";
import { Calendar } from "lucide-react";
import GazetteRenderer from "@/components/gazette/GazetteRenderer";
import Link from "next/link";
import PdfViewer from "@/components/ui/PdfViewer";

export default function EchoDuCoeurPage() {
    // Support backward compatibility
    const allGazettes = (gazetteData as any).gazettes || ((gazetteData as any).file ? [{ title: "Dernière parution", file: (gazetteData as any).file, date: (gazetteData as any).date }] : []);
    
    const [selectedGazette, setSelectedGazette] = useState<any>(allGazettes[0] || null);

    return (
        <main className="mb-12 min-h-screen bg-cream-100 px-2 pb-2 pt-36 sm:mb-16 md:mb-20 md:px-4 md:pb-3 md:pt-44 lg:h-[100dvh] lg:overflow-hidden print:mb-0 print:h-auto print:overflow-visible print:bg-white print:pt-0 print:pb-0">
            <h1 className="sr-only">Le Petit Écho du Cœur</h1>
            <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-3 lg:flex-row print:gap-0 print:px-0">
                {/* Main View */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="min-h-[650px] flex-grow overflow-y-auto rounded-3xl border border-charcoal-700 bg-charcoal-900 p-2 shadow-2xl md:p-3 lg:h-full lg:min-h-0 print:h-auto print:overflow-visible print:border-none print:bg-white print:p-0 print:shadow-none"
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
                            <div className="flex h-full min-h-[600px] flex-col gap-3 print:hidden">
                                {selectedGazette.accessibleUrl && (
                                    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 text-charcoal-700 sm:flex-row sm:items-center sm:justify-between">
                                        <p>Ce numéro PDF est également proposé dans une version textuelle compatible avec les lecteurs d’écran.</p>
                                        <Link href={selectedGazette.accessibleUrl} className="inline-flex shrink-0 justify-center rounded-full bg-terracotta-600 px-5 py-2.5 font-semibold text-white hover:bg-terracotta-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900">
                                            Lire la version accessible
                                        </Link>
                                    </div>
                                )}
                                <PdfViewer
                                    src={selectedGazette.file}
                                    className="w-full flex-1"
                                    title={`Le Petit Écho du Cœur — ${selectedGazette.title}`}
                                />
                            </div>
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
                        className="h-fit w-full flex-shrink-0 rounded-3xl border border-cream-200 bg-white p-4 shadow-sm lg:w-72 print:hidden"
                    >
                        <h2 className="mb-3 font-serif text-xl text-charcoal-900">Le Petit Écho du Cœur</h2>
                        <p className="mb-4 text-sm text-charcoal-600">Le journal de la vie de l’établissement.</p>
                        <h3 className="mb-3 font-semibold text-charcoal-900">Anciens numéros</h3>
                        <ul className="space-y-3">
                            {allGazettes.map((g: any, i: number) => {
                                const isSelected = selectedGazette && (
                                    (g.type === "generated" && selectedGazette.id === g.id) || 
                                    (g.type !== "generated" && selectedGazette.file === g.file)
                                );
                                
                                return (
                                    <li key={i}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedGazette(g)}
                                            aria-pressed={isSelected}
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
