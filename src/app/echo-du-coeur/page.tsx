"use client";

import { motion } from "framer-motion";
import gazetteData from "@/lib/data/gazette.json";

export default function EchoDuCoeurPage() {
    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-12 bg-cream-100">
            <div className="w-full px-4 md:px-8 max-w-[1600px] mx-auto">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-3xl md:text-4xl text-charcoal-900">Le Petit Echo du Coeur</h1>
                        <p className="text-charcoal-600 mt-2">Notre gazette interne pour suivre la vie de l&apos;EHPAD.</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-charcoal-900 rounded-3xl p-2 md:p-3 shadow-2xl border border-charcoal-700 h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)]"
                >
                    {gazetteData.file ? (
                        <iframe
                            src={`${gazetteData.file}?v=${Date.now()}`}
                            className="w-full h-full rounded-2xl border-none bg-white"
                            title="Le Petit Echo du Coeur PDF"
                        />
                    ) : (
                        <div className="w-full h-full rounded-2xl bg-charcoal-800 flex items-center justify-center text-charcoal-400">
                            Aucune gazette publiée pour le moment.
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
