"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
    {
        id: 1,
        content: "Maman a retrouvé le sourire depuis son arrivée. L'équipe est d'une bienveillance rare, toujours à l'écoute. On sent une véritable ambiance familiale.",
        author: "Sophie D.",
        role: "Fille d'une résidente",
        rating: 5,
    },
    {
        id: 2,
        content: "La cuisine est excellente, faite sur place, ce qui change tout ! Les animations sont variées, mon père ne s'ennuie jamais.",
        author: "Marc L.",
        role: "Fils d'un résident",
        rating: 5,
    },
    {
        id: 3,
        content: "Une transition en douceur grâce à un accompagnement formidable. Les espaces sont lumineux, propres et chaleureux. Un grand merci.",
        author: "Isabelle M.",
        role: "Nièce d'une résidente",
        rating: 5,
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-24 bg-cream-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-terracotta-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-forest-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-terracotta-500 font-medium tracking-wide uppercase text-sm"
                    >
                        Confiance & Sérénité
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-3xl md:text-5xl text-charcoal-900 mt-3 mb-6"
                    >
                        Paroles de familles
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-charcoal-600 max-w-2xl mx-auto text-lg"
                    >
                        Parce que ce sont eux qui en parlent le mieux. Découvrez les retours d'expérience des familles qui nous font confiance.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-2xl shadow-card border border-cream-100 flex flex-col h-full relative group"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-8 text-cream-200 group-hover:text-terracotta-100 transition-colors duration-300">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                                </svg>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-6 text-terracotta-400">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-charcoal-700 italic text-lg leading-relaxed flex-grow mb-6 relative z-10 font-serif">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-cream-100">
                                <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-600 font-bold text-sm">
                                    {testimonial.author.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-charcoal-900">{testimonial.author}</span>
                                    <span className="text-xs text-charcoal-500 uppercase tracking-wide">{testimonial.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
