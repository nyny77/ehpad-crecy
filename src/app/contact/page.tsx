"use client";

import { motion } from "framer-motion";
import ConversationalForm from "@/components/contact/ConversationalForm";
import { EHPAD_INFO } from "@/lib/constants";

export default function ContactPage() {
    return (
        <>
            {/* Hero compact */}
            
            {/* Section Contact */}
            <section className="pt-32 md:pt-40 section-padding bg-cream-100">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Informations de contact */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-1"
                        >
                            <h2 className="font-serif text-2xl md:text-3xl text-charcoal-900 mb-6">
                                Nos coordonnées
                            </h2>

                            <div className="space-y-6">
                                {/* Adresse */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-terracotta-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-6 h-6 text-terracotta-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-charcoal-900 mb-1">Adresse</h3>
                                        <p className="text-charcoal-600">
                                            {EHPAD_INFO.address.street}
                                            <br />
                                            {EHPAD_INFO.address.postalCode} {EHPAD_INFO.address.city}
                                            <br />
                                            <span className="text-charcoal-500">Seine-et-Marne, Île-de-France</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Téléphone */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-6 h-6 text-forest-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-charcoal-900 mb-1">Téléphone</h3>
                                        <a
                                            href={`tel:${EHPAD_INFO.phone.replace(/\s/g, "")}`}
                                            className="text-terracotta-500 hover:text-terracotta-600 transition-colors text-lg font-medium"
                                        >
                                            {EHPAD_INFO.phone}
                                        </a>
                                    </div>
                                </div>

                                {/* Horaires */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-wood-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-6 h-6 text-wood-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-charcoal-900 mb-1">Accueil Administratif</h3>
                                        <p className="text-charcoal-600">
                                            {EHPAD_INFO.officeHours.main}
                                        </p>
                                        <p className="text-terracotta-500 font-medium mt-1">
                                            {EHPAD_INFO.officeHours.thursday}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Carte */}
                            <div className="mt-8">
                                <div className="relative h-48 bg-cream-200 rounded-2xl overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2629.5!2d2.9137!3d48.8575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e61287a1c1be67%3A0x9c95b4a3b0e6a7d!2s18%20Rue%20de%20la%20Chapelle%2C%2077580%20Cr%C3%A9cy-la-Chapelle!5e0!3m2!1sfr!2sfr!4v1707239400000"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 pointer-events-none border-2 border-white/50 rounded-2xl" />
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        EHPAD_INFO.address.full
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-4 text-terracotta-500 hover:text-terracotta-600 font-medium"
                                >
                                    Voir sur Google Maps
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>

                        {/* Formulaire */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-2"
                        >
                            <ConversationalForm />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ rapide */}
            <section className="section-padding bg-cream-100">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <span className="text-forest-500 font-medium">FAQ</span>
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 mt-2 mb-4">
                            Questions fréquentes
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                question: "Comment programmer une visite ?",
                                answer:
                                    "Utilisez le formulaire ci-dessus en cochant la case 'Je souhaite programmer une visite' ou appelez-nous directement.",
                            },
                            {
                                question: "Quels documents pour un dossier d'admission ?",
                                answer:
                                    "L'inscription se fait désormais exclusivement en ligne via le portail national ViaTrajectoire. Le site vous guidera pour téléverser les justificatifs nécessaires.",
                            },
                            {
                                question: "L'établissement est-il habilité à l'aide sociale ?",
                                answer:
                                    "Oui, nous sommes habilités ASH et conventionnés APL. Nous vous accompagnons dans vos démarches.",
                            },
                            {
                                question: "Puis-je apporter les meubles personnels ?",
                                answer:
                                    "Oui, les résidents peuvent personnaliser leur chambre avec photos, petits meubles et objets personnels.",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="card-warm p-6"
                            >
                                <h3 className="font-semibold text-charcoal-900 mb-2 flex items-start gap-3">
                                    <span className="w-6 h-6 bg-terracotta-100 text-terracotta-500 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                        ?
                                    </span>
                                    {item.question}
                                </h3>
                                <p className="text-charcoal-600 text-sm pl-9">{item.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
