"use client";

import { motion } from "framer-motion";
import PdfViewer from "@/components/ui/PdfViewer";

export default function LivretAccueilPage() {
  return (
    <main className="mb-12 h-[100dvh] overflow-hidden bg-cream-100 px-2 pb-2 pt-36 sm:mb-16 md:mb-20 md:px-4 md:pb-3 md:pt-44">
      <div className="mx-auto h-full w-full max-w-[1600px]">
        <h1 className="sr-only">Livret d’accueil</h1>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full rounded-3xl border border-charcoal-700 bg-charcoal-900 p-2 shadow-2xl md:p-3"
        >
            <PdfViewer
                src="/documents/livret-accueil.pdf?v=2"
                title="Livret d’accueil — version PDF"
                className="h-full w-full"
            />
        </motion.div>
      </div>
    </main>
  );
}
