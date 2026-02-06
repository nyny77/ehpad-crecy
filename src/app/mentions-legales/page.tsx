import { Metadata } from "next";
import { EHPAD_INFO } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Mentions Légales | EHPAD de Crécy",
    description: "Mentions légales et informations juridiques de l'EHPAD de Crécy-la-Chapelle.",
};

export default function MentionsLegalesPage() {
    return (
        <main className="min-h-screen bg-cream-100 pt-32 pb-20">
            <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900 mb-8">
                        Mentions Légales
                    </h1>

                    <div className="prose prose-lg max-w-none text-charcoal-700 space-y-8">
                        {/* Éditeur */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                1. Éditeur du site
                            </h2>
                            <p className="mb-4">
                                Le présent site est édité par :
                            </p>
                            <ul className="list-none space-y-2">
                                <li><strong>Raison sociale :</strong> {EHPAD_INFO.fullName}</li>
                                <li><strong>Statut :</strong> Établissement public médico-social</li>
                                <li><strong>Adresse :</strong> {EHPAD_INFO.address.full}</li>
                                <li><strong>Téléphone :</strong> {EHPAD_INFO.phone}</li>
                                <li><strong>Email :</strong> {EHPAD_INFO.email}</li>
                            </ul>
                        </section>

                        {/* Directeur de publication */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                2. Directeur de la publication
                            </h2>
                            <p>
                                Le directeur de la publication est la Directrice de l&apos;établissement.
                            </p>
                        </section>

                        {/* Hébergement */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                3. Hébergement
                            </h2>
                            <p className="mb-4">
                                Ce site est hébergé par :
                            </p>
                            <ul className="list-none space-y-2">
                                <li><strong>Netlify, Inc.</strong></li>
                                <li>512 2nd Street, Suite 200</li>
                                <li>San Francisco, CA 94107</li>
                                <li>États-Unis</li>
                                <li>Site web : <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="text-terracotta-600 hover:underline">www.netlify.com</a></li>
                            </ul>
                        </section>

                        {/* Propriété intellectuelle */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                4. Propriété intellectuelle
                            </h2>
                            <p className="mb-4">
                                L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.)
                                est la propriété exclusive de l&apos;{EHPAD_INFO.fullName}, à l&apos;exception des
                                marques, logos ou contenus appartenant à d&apos;autres sociétés partenaires ou auteurs.
                            </p>
                            <p>
                                Toute reproduction, distribution, modification, adaptation, retransmission ou publication,
                                même partielle, de ces différents éléments est strictement interdite sans l&apos;accord
                                exprès par écrit de l&apos;{EHPAD_INFO.name}.
                            </p>
                        </section>

                        {/* Responsabilité */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                5. Limitation de responsabilité
                            </h2>
                            <p className="mb-4">
                                L&apos;{EHPAD_INFO.name} s&apos;efforce d&apos;assurer au mieux de ses possibilités
                                l&apos;exactitude et la mise à jour des informations diffusées sur ce site.
                                Toutefois, l&apos;{EHPAD_INFO.name} ne peut garantir l&apos;exactitude, la précision
                                ou l&apos;exhaustivité des informations mises à disposition sur ce site.
                            </p>
                            <p>
                                En conséquence, l&apos;{EHPAD_INFO.name} décline toute responsabilité pour
                                toute imprécision, inexactitude ou omission portant sur des informations disponibles
                                sur ce site.
                            </p>
                        </section>

                        {/* Liens hypertextes */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                6. Liens hypertextes
                            </h2>
                            <p>
                                Le site peut contenir des liens hypertextes vers d&apos;autres sites.
                                L&apos;{EHPAD_INFO.name} n&apos;exerce aucun contrôle sur ces sites et n&apos;assume
                                aucune responsabilité quant à leur contenu ou aux pratiques de confidentialité
                                de ces sites tiers.
                            </p>
                        </section>

                        {/* Droit applicable */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                7. Droit applicable
                            </h2>
                            <p>
                                Les présentes mentions légales sont soumises au droit français.
                                En cas de litige, les tribunaux français seront seuls compétents.
                            </p>
                        </section>

                        {/* Crédits */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                8. Crédits
                            </h2>
                            <ul className="list-none space-y-2">
                                <li><strong>Conception et développement :</strong> TODARO Anthony</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
