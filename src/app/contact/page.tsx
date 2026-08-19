"use client";

import ConversationalForm from "@/components/contact/ConversationalForm";
import { EHPAD_INFO } from "@/lib/constants";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="bg-cream-100 min-h-screen pt-36 md:pt-44 pb-16 font-sans">
            <div className="container-custom max-w-5xl">
                {/* En-tête de page sobre et bien proportionné */}
                <div className="mb-6">
                    <p className="text-xs font-semibold text-terracotta-600 uppercase tracking-wide mb-1">
                        Nous contacter
                    </p>
                    <h1
                        className="!font-sans font-bold text-charcoal-900 mb-1.5 tracking-tight"
                        style={{ fontSize: "26px", lineHeight: "1.3" }}
                    >
                        Contactez l’EHPAD de Crécy
                    </h1>
                    <p className="text-sm text-charcoal-600 max-w-xl leading-relaxed">
                        Une question sur un hébergement, une visite ou un renseignement ? Nos équipes sont à votre écoute.
                    </p>
                </div>

                {/* Grille principale : Coordonnées (gauche) + Formulaire (droite) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Colonne gauche : Coordonnées & Plan (5 colonnes) */}
                    <div className="lg:col-span-5 space-y-3.5">
                        {/* Bloc Téléphone */}
                        <div className="bg-white rounded-xl p-4 shadow-2xs border border-cream-300 flex items-start gap-3.5">
                            <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Phone className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-0.5">
                                    Téléphone direct
                                </p>
                                <a
                                    href={`tel:${EHPAD_INFO.phone.replace(/\s/g, "")}`}
                                    className="text-base font-bold text-charcoal-900 hover:text-terracotta-600 transition-colors"
                                >
                                    {EHPAD_INFO.phone}
                                </a>
                                <p className="text-xs text-charcoal-500 mt-0.5">
                                    Standard d&apos;accueil de l&apos;établissement
                                </p>
                            </div>
                        </div>

                        {/* Bloc Horaires */}
                        <div className="bg-white rounded-xl p-4 shadow-2xs border border-cream-300 flex items-start gap-3.5">
                            <div className="w-9 h-9 rounded-lg bg-wood-50 text-wood-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-0.5">
                                    Horaires d&apos;accueil
                                </p>
                                <p className="text-xs text-charcoal-800 font-medium leading-relaxed">
                                    {EHPAD_INFO.officeHours.main}
                                </p>
                                <p className="text-xs text-terracotta-600 font-medium mt-0.5">
                                    {EHPAD_INFO.officeHours.thursday}
                                </p>
                            </div>
                        </div>

                        {/* Bloc Adresse */}
                        <div className="bg-white rounded-xl p-4 shadow-2xs border border-cream-300 flex items-start gap-3.5">
                            <div className="w-9 h-9 rounded-lg bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0 mt-0.5">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-0.5">
                                    Adresse postale
                                </p>
                                <p className="text-xs text-charcoal-800 font-medium leading-relaxed">
                                    {EHPAD_INFO.address.street}
                                    <br />
                                    {EHPAD_INFO.address.postalCode} {EHPAD_INFO.address.city}
                                </p>
                            </div>
                        </div>

                        {/* Plan d'accès */}
                        <div className="bg-white rounded-xl p-2.5 shadow-2xs border border-cream-300">
                            <div className="relative h-40 rounded-lg overflow-hidden bg-cream-200">
                                <iframe
                                    title="Localisation de l’EHPAD de Crécy-la-Chapelle"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2629.5!2d2.9137!3d48.8575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e61287a1c1be67%3A0x9c95b4a3b0e6a7d!2s18%20Rue%20de%20la%20Chapelle%2C%2077580%20Cr%C3%A9cy-la-Chapelle!5e0!3m2!1sfr!2sfr!4v1707239400000"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                            <div className="pt-2 px-1.5 flex justify-between items-center text-xs">
                                <span className="text-charcoal-500">Crécy-la-Chapelle</span>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        EHPAD_INFO.address.full
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-terracotta-600 hover:text-terracotta-700 font-semibold"
                                >
                                    Itinéraire
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite : Formulaire (7 colonnes) */}
                    <div className="lg:col-span-7">
                        <ConversationalForm />
                    </div>
                </div>

                {/* FAQ compacte */}
                <div className="mt-10 pt-8 border-t border-cream-300">
                    <div className="mb-4">
                        <h2
                            className="!font-sans font-bold text-charcoal-900 mb-0.5"
                            style={{ fontSize: "18px", lineHeight: "1.4" }}
                        >
                            Questions fréquentes
                        </h2>
                        <p className="text-xs text-charcoal-500">
                            Quelques réponses utiles avant votre prise de contact
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {[
                            {
                                question: "Comment programmer une visite ?",
                                answer: "Sélectionnez 'Programmer une visite' dans le formulaire ou contactez directement l'accueil pour convenir d'un rendez-vous."
                            },
                            {
                                question: "Quels documents pour un dossier d'admission ?",
                                answer: "Les dossiers d'admission se déposent via le portail national ViaTrajectoire. Notre secrétariat vous accompagne si besoin."
                            },
                            {
                                question: "L'établissement est-il habilité à l'aide sociale ?",
                                answer: "Oui, l'EHPAD de Crécy est habilité ASH (Aide Sociale à l'Hébergement) et conventionné pour les aides au logement (APL/ALS)."
                            },
                            {
                                question: "Puis-je apporter des meubles personnels ?",
                                answer: "Oui, chaque résident peut personnaliser son espace privatif avec tableaux, petits meubles et objets familiers."
                            }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl p-3.5 border border-cream-200 shadow-2xs"
                            >
                                <h3
                                    className="!font-sans font-semibold text-charcoal-900 mb-1 flex items-center gap-2"
                                    style={{ fontSize: "13px", lineHeight: "1.4" }}
                                >
                                    <span className="w-4 h-4 rounded-full bg-terracotta-100 text-terracotta-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                        ?
                                    </span>
                                    {item.question}
                                </h3>
                                <p className="text-xs text-charcoal-600 pl-6 leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
