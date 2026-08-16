"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Puis-je apporter mes propres meubles ?",
        answer: "Oui ! Nous encourageons fortement les résidents à personnaliser leur espace pour se sentir chez eux. Vous pouvez apporter des petits meubles (fauteuil, commode, petite télévision, cadres photos, etc.), sous réserve que l'espace permette une circulation sécurisée pour le personnel soignant. Le lit médicalisé est quant à lui fourni par nos soins."
    },
    {
        question: "Comment est géré le linge ?",
        answer: "Le linge plat (draps, serviettes, gants de toilette) est fourni et entretenu par l'établissement. L'entretien des vêtements personnels est également inclus. Afin d'éviter toute perte en blanchisserie, les vêtements doivent être étiquetés au nom du résident. Bonne nouvelle : notre équipe peut se charger du marquage pour vous lors de l'admission !"
    },
    {
        question: "Quelles sont les heures de visite ?",
        answer: "Les visites sont libres, généralement conseillées de 11h à 19h pour respecter le rythme de vie, les repas et les soins des résidents. Les familles et proches sont toujours les bienvenus."
    },
    {
        question: "Mon animal de compagnie peut-il me rendre visite ?",
        answer: "Oui, les animaux de compagnie tenus en laisse et à jour de leurs vaccins sont les bienvenus pour rendre visite à leur maître. Toutefois, ils ne peuvent pas résider de manière permanente avec vous."
    },
    {
        question: "Puis-je manger avec ma famille à l'EHPAD ?",
        answer: "Tout à fait. Une « table invités » peut être réservée pour déjeuner avec vos proches. Il suffit de prévenir l'accueil au moins 48h à l'avance pour que les repas supplémentaires soient préparés par notre chef."
    }
];

export default function AdmissionFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 md:py-24 bg-cream-100">
            <div className="container-custom max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block py-1.5 px-5 rounded-full bg-terracotta-100 text-terracotta-700 font-bold tracking-wider uppercase text-sm mb-4"
                    >
                        FAQ
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-3xl md:text-5xl text-charcoal-900 font-bold mb-4"
                    >
                        Questions Fréquentes
                    </motion.h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                type="button"
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-answer-${index}`}
                                id={`faq-question-${index}`}
                                className="w-full flex items-center justify-between p-6 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-terracotta-400"
                            >
                                <span className="font-serif text-xl font-bold text-charcoal-900 pr-8">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="shrink-0 text-terracotta-500 bg-terracotta-50 rounded-full p-2"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        id={`faq-answer-${index}`}
                                        role="region"
                                        aria-labelledby={`faq-question-${index}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-charcoal-600 leading-relaxed border-t border-cream-100 mt-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
