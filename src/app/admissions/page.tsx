import { Metadata } from "next";
import Link from "next/link";
import { MoveRight, FileText, Eye, Users, DoorOpen, Download, Euro } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { EHPAD_INFO } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Admissions | EHPAD de Crécy-la-Chapelle",
    description: "Tout savoir sur les démarches d'admission via ViaTrajectoire, les tarifs et les aides financières (APA, APL, ASH).",
};

export default function AdmissionsPage() {
    return (
        <main className="bg-cream-100 min-h-screen">
            {/* Hero Section */}
            <PageHeader
                title={
                    <>
                        Admissions & <span className="text-terracotta-500 italic">Tarifs</span>
                    </>
                }
                subtitle="Démarches simplifiées"
                description="Nous vous accompagnons à chaque étape. Faites votre demande en ligne simplement via ViaTrajectoire."
            />

            {/* Timeline Section */}
            <section className="py-16 md:py-24 bg-white relative overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 mb-4">
                            Votre parcours d'admission
                        </h2>
                        <p className="text-charcoal-600">4 étapes simples vers votre nouvelle vie</p>
                    </div>

                    <div className="relative">
                        {/* Line connecting steps (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-cream-200 w-3/4 mx-auto -z-10" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
                            {/* Step 1 */}
                            <div className="relative flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white border-4 border-cream-200 rounded-full flex items-center justify-center mb-6 group-hover:border-terracotta-500 transition-colors duration-300 shadow-warm">
                                    <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center text-terracotta-500 group-hover:bg-terracotta-50 group-hover:text-terracotta-600 transition-colors">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">1. La Demande</h3>
                                <p className="text-sm text-charcoal-600 px-4">
                                    Faites votre demande directement en ligne sur <strong>ViaTrajectoire</strong> (méthode rapide et recommandée).
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white border-4 border-cream-200 rounded-full flex items-center justify-center mb-6 group-hover:border-forest-500 transition-colors duration-300 shadow-warm">
                                    <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center text-forest-500 group-hover:bg-forest-50 group-hover:text-forest-600 transition-colors">
                                        <Eye className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">2. La Visite</h3>
                                <p className="text-sm text-charcoal-600 px-4">
                                    Rencontre avec la direction et visite des lieux pour découvrir l'ambiance.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white border-4 border-cream-200 rounded-full flex items-center justify-center mb-6 group-hover:border-terracotta-500 transition-colors duration-300 shadow-warm">
                                    <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center text-terracotta-500 group-hover:bg-terracotta-50 group-hover:text-terracotta-600 transition-colors">
                                        <Users className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">3. La Commission</h3>
                                <p className="text-sm text-charcoal-600 px-4">
                                    Validation de votre dossier par le médecin coordonnateur et la direction.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="relative flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white border-4 border-cream-200 rounded-full flex items-center justify-center mb-6 group-hover:border-forest-500 transition-colors duration-300 shadow-warm">
                                    <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center text-forest-500 group-hover:bg-forest-50 group-hover:text-forest-600 transition-colors">
                                        <DoorOpen className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">4. L'Entrée</h3>
                                <p className="text-sm text-charcoal-600 px-4">
                                    Accueil personnalisé et installation dans votre nouvelle chambre.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Downloads Section */}
            <section className="py-16 bg-cream-50">
                <div className="container-custom">
                    <div className="bg-terracotta-500 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="font-serif text-3xl md:text-4xl mb-4 text-white">
                                    Faire une demande
                                </h2>
                                <p className="text-white/90 text-lg mb-8">
                                    La méthode la plus simple et la plus rapide est d'utiliser le service public <strong>ViaTrajectoire</strong>.
                                    C'est sécurisé, gratuit, et vous pouvez suivre votre dossier en temps réel.
                                </p>
                                <a
                                    href={EHPAD_INFO.viaTrajectoireUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-terracotta-600 rounded-full font-bold text-lg hover:bg-cream-100 transition-colors shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Faire ma demande sur ViaTrajectoire
                                    <MoveRight className="w-5 h-5" />
                                </a>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20 mb-4">
                                    <p className="text-sm text-white/80 uppercase tracking-widest mb-2 font-medium">Information</p>
                                    <p className="mb-0 text-white/90">
                                        L'inscription se fait désormais prioritairement en ligne pour simplifier vos démarches.
                                    </p>
                                </div>

                                <a href="#" className="group flex items-center justify-between bg-white text-charcoal-900 p-5 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-cream-100 text-terracotta-500 rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-lg">Pièces à fournir</div>
                                            <div className="text-sm text-charcoal-500">Liste des documents obligatoires</div>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 text-charcoal-400 group-hover:text-terracotta-500 transition-colors" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Financial Aid Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <span className="text-forest-500 font-medium">Budget & Financement</span>
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 mt-2">
                            Les aides financières
                        </h2>
                        <p className="text-charcoal-600 max-w-2xl mx-auto mt-4">
                            L'EHPAD de Crécy-la-Chapelle est habilité à l'aide sociale.
                            Plusieurs dispositifs peuvent vous aider à financer votre séjour.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* APA */}
                        <div className="bg-cream-50 rounded-2xl p-8 border border-cream-100 hover:border-forest-200 transition-colors duration-300">
                            <div className="w-14 h-14 bg-forest-100 rounded-xl flex items-center justify-center text-forest-600 mb-6">
                                <Euro className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-3">APA</h3>
                            <div className="text-sm font-semibold text-forest-600 mb-4 uppercase tracking-wider">Allocation Personnalisée d'Autonomie</div>
                            <p className="text-charcoal-600 mb-6 leading-relaxed">
                                Destinée aux personnes de plus de 60 ans en perte d'autonomie.
                                Son montant dépend du niveau de dépendance (GIR) et des revenus.
                            </p>
                            <a
                                href="https://www.seine-et-marne.fr/fr/allocation-personnalisee-dautonomie-apa-domicile-et-etablissement"
                                target="_blank"
                                className="text-forest-600 font-medium hover:underline flex items-center gap-1 group"
                            >
                                En savoir plus (77)
                                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        {/* APL */}
                        <div className="bg-cream-50 rounded-2xl p-8 border border-cream-100 hover:border-terracotta-200 transition-colors duration-300">
                            <div className="w-14 h-14 bg-terracotta-100 rounded-xl flex items-center justify-center text-terracotta-600 mb-6">
                                <Euro className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-3">APL</h3>
                            <div className="text-sm font-semibold text-terracotta-600 mb-4 uppercase tracking-wider">Aide Personnalisée au Logement</div>
                            <p className="text-charcoal-600 mb-6 leading-relaxed">
                                Attribuée par la CAF en fonction des ressources pour aider à payer
                                la redevance hébergement. Notre établissement est conventionné.
                            </p>
                            <a
                                href="https://www.caf.fr"
                                target="_blank"
                                className="text-terracotta-600 font-medium hover:underline flex items-center gap-1 group"
                            >
                                Simuler vos droits (CAF)
                                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        {/* ASH */}
                        <div className="bg-cream-50 rounded-2xl p-8 border border-cream-100 hover:border-charcoal-200 transition-colors duration-300">
                            <div className="w-14 h-14 bg-charcoal-100 rounded-xl flex items-center justify-center text-charcoal-600 mb-6">
                                <Euro className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-3">ASH</h3>
                            <div className="text-sm font-semibold text-charcoal-600 mb-4 uppercase tracking-wider">Aide Sociale à l'Hébergement</div>
                            <p className="text-charcoal-600 mb-6 leading-relaxed">
                                Si les revenus sont insuffisants, le département peut prendre en charge
                                une partie des frais d'hébergement (récupérable sur succession).
                            </p>
                            <a
                                href="https://www.seine-et-marne.fr/fr/aide-sociale-lhebergement-ash-pour-personnes-agees"
                                target="_blank"
                                className="text-charcoal-700 font-medium hover:underline flex items-center gap-1 group"
                            >
                                Infos Département 77
                                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    );
}
