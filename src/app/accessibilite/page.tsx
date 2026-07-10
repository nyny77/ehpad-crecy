import { Metadata } from "next";
import { EHPAD_INFO } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Accessibilité | EHPAD de Crécy-la-Chapelle",
    description: "Déclaration d'accessibilité et engagements de l'EHPAD de Crécy-la-Chapelle pour l'accès à tous.",
};

export default function AccessibilitePage() {
    return (
        <main className="pt-32 md:pt-40 min-h-screen bg-cream-100">
            
            <section className="section-padding">
                <div className="container-custom max-w-4xl">
                    <div className="space-y-12">
                        {/* Introduction */}
                        <div className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                Déclaration d'accessibilité
                            </h2>
                            <p className="text-charcoal-600 mb-4">
                                L'<strong>EHPAD de Crécy-la-Chapelle</strong> s'engage à rendre son site internet accessible conformément à l'article 47 de la loi n°2005-102 du 11 février 2005.
                            </p>
                            <p className="text-charcoal-600">
                                Cette déclaration d'accessibilité s'applique au site <strong>ehpad-crecy.netlify.app</strong>.
                            </p>
                        </div>

                        {/* État de conformité */}
                        <div className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                État de conformité
                            </h2>
                            <div className="bg-terracotta-50 border-l-4 border-terracotta-500 p-4 rounded-r-lg">
                                <p className="text-charcoal-700">
                                    Ce site est en <strong>conformité partielle</strong> avec le référentiel général d'amélioration de l'accessibilité (RGAA) version 4.1.
                                </p>
                            </div>
                        </div>

                        {/* Résultats des tests */}
                        <div className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                Mesures d'accessibilité mises en place
                            </h2>
                            <ul className="space-y-3">
                                {[
                                    "Mode accessibilité avec polices agrandies et contraste élevé activable via le bouton en bas à gauche",
                                    "Navigation au clavier possible avec indicateurs de focus visibles",
                                    "Textes alternatifs sur les images",
                                    "Structure de titres hiérarchique (H1, H2, H3...)",
                                    "Liens explicites et boutons cliquables",
                                    "Contrastes de couleurs respectés",
                                    "Site responsive adapté aux différents appareils",
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-charcoal-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contenus non accessibles */}
                        <div className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                Contenus non accessibles
                            </h2>
                            <p className="text-charcoal-600 mb-4">
                                Certains contenus peuvent ne pas être pleinement accessibles :
                            </p>
                            <ul className="list-disc list-inside text-charcoal-600 space-y-2 pl-4">
                                <li>Certaines images historiques peuvent avoir des descriptions alternatives incomplètes</li>
                                <li>Les animations visuelles ne peuvent pas être désactivées individuellement (mais le mode accessibilité réduit les effets)</li>
                                <li>Le contenu vidéo tiers peut ne pas disposer de sous-titres</li>
                            </ul>
                        </div>

                        {/* Technologies utilisées */}
                        <div className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                Technologies utilisées
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {["HTML5", "CSS3", "JavaScript", "React", "Next.js", "Tailwind CSS"].map((tech) => (
                                    <span key={tech} className="px-4 py-2 bg-cream-100 text-charcoal-700 rounded-full text-sm font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Retour d'information et contact */}
                        <div className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                Retour d'information et contact
                            </h2>
                            <p className="text-charcoal-600 mb-4">
                                Si vous n'arrivez pas à accéder à un contenu ou un service, vous pouvez nous contacter pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.
                            </p>
                            <div className="bg-cream-50 rounded-xl p-6 border border-cream-200">
                                <p className="text-charcoal-700 mb-2">
                                    <strong>Contact :</strong>
                                </p>
                                <p className="text-charcoal-600">
                                    EHPAD de Crécy-la-Chapelle<br />
                                    {EHPAD_INFO.address.full}<br />
                                    Téléphone : <a href={`tel:${EHPAD_INFO.phone.replace(/\s/g, "")}`} className="text-terracotta-500 hover:underline">{EHPAD_INFO.phone}</a><br />
                                    Email : <a href={`mailto:${EHPAD_INFO.email}`} className="text-terracotta-500 hover:underline">{EHPAD_INFO.email}</a>
                                </p>
                            </div>
                        </div>

                        {/* Voies de recours */}
                        <div className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                Voie de recours
                            </h2>
                            <p className="text-charcoal-600 mb-4">
                                Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="https://formulaire.defenseurdesdroits.fr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal-800 text-white rounded-full hover:bg-charcoal-700 transition-colors"
                                >
                                    Contacter le Défenseur des droits
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="text-center text-charcoal-500 text-sm">
                            <p>Cette déclaration a été établie le 3 février 2026.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
