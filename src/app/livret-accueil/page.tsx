"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";

export default function LivretAccueilPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-12 bg-cream-100">
      <div className="w-full px-4 md:px-8 max-w-[1600px] mx-auto">
        {/* Le lecteur beaucoup plus grand (90vh de haut, fond gris très clair) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-charcoal-900 rounded-3xl p-2 md:p-3 shadow-2xl border border-charcoal-700"
        >
            <iframe 
                src="/documents/livret-accueil.pdf?v=2" 
                className="w-full h-[90vh] md:h-[1200px] rounded-2xl border-none bg-white"
                title="Livret d'Accueil PDF"
            />
        </motion.div>
      </div>
    </main>
  );
}
