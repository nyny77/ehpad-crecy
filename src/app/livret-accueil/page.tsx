"use client";

import { motion } from "framer-motion";
import PdfViewer from "@/components/ui/PdfViewer";

export default function LivretAccueilPage() {
  return (
    <main className="mb-12 min-h-[100dvh] bg-cream-100 px-2 pb-4 pt-36 sm:mb-16 md:mb-20 md:px-4 md:pb-3 md:pt-44 lg:h-[100dvh] lg:overflow-hidden">
      <div className="mx-auto min-h-[560px] w-full max-w-[1600px] lg:h-full lg:min-h-0">
        <h1 className="sr-only">Livret d’accueil</h1>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="min-h-[560px] rounded-3xl border border-charcoal-700 bg-charcoal-900 p-2 shadow-2xl md:p-3 lg:h-full lg:min-h-0"
        >
            <PdfViewer
                src="/documents/livret-accueil.pdf?v=2"
                title="Livret d’accueil — version PDF"
                className="min-h-[540px] w-full lg:h-full lg:min-h-0"
            />
        </motion.div>
      </div>
    </main>
  );
}
