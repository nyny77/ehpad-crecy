"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";

export default function LivretAccueilPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-12 bg-cream-100">
      <div className="w-full px-4 md:px-8 max-w-[1600px] mx-auto">
        <h1 className="mb-6 font-serif text-4xl font-bold text-charcoal-900 md:text-5xl">Livret d’accueil</h1>
        {/* Le lecteur beaucoup plus grand (90vh de haut, fond gris très clair) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-charcoal-900 rounded-3xl p-2 md:p-3 shadow-2xl border border-charcoal-700 h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)]"
        >
            <iframe 
                src="/documents/livret-accueil.pdf?v=2" 
                className="w-full h-full rounded-2xl border-none bg-white"
                title="Livret d'Accueil PDF"
            />
        </motion.div>
      </div>
    </main>
  );
}
