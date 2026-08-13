import { Metadata } from "next";
import { MoveRight } from "lucide-react";
import AdmissionStepsSection from "@/components/admissions/AdmissionStepsSection";
import FinancialAidSection from "@/components/admissions/FinancialAidSection";
import AdmissionChecklists from "@/components/admissions/AdmissionChecklists";
import AdmissionFAQ from "@/components/admissions/AdmissionFAQ";
import { EHPAD_INFO } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Préparer mon entrée | EHPAD de Crécy-la-Chapelle",
    description: "Le guide complet pas-à-pas pour préparer votre admission : aides financières, démarches ViaTrajectoire, documents à fournir et trousseau.",
};

export default function AdmissionsPage() {
    return (
        <main className="pt-32 md:pt-40 bg-cream-100 min-h-screen">
            {/* Hero Section */}
            <section className="container-custom mb-16 text-center">
                <span className="inline-block py-1.5 px-5 rounded-full bg-forest-100 text-forest-700 font-bold tracking-wider uppercase text-sm mb-4 border border-forest-200">
                    Guide complet
                </span>
                <h1 className="font-serif text-5xl md:text-7xl text-charcoal-900 font-bold mb-6">
                    Préparer mon entrée
                </h1>
                <p className="text-charcoal-600 max-w-2xl mx-auto text-xl leading-relaxed">
                    De la simulation financière à la préparation de la valise, découvrez le parcours d'admission pas-à-pas pour une entrée en toute sérénité.
                </p>
            </section>

            {/* Etape 1: S'informer (Tarifs et aides) */}
            <FinancialAidSection />

            {/* Etape 2 et 3: Parcours ViaTrajectoire et Visite */}
            <AdmissionStepsSection />

            {/* Telechargement direct ViaTrajectoire */}
            <section className="py-16 bg-cream-100">
                <div className="container-custom">
                    <div className="bg-gradient-to-r from-terracotta-600 to-terracotta-400 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="font-serif text-3xl md:text-4xl mb-4 !text-white">
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
                                <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
                                    <p className="text-sm text-terracotta-600 uppercase tracking-widest mb-2 font-bold">Information</p>
                                    <p className="mb-0 text-terracotta-600 font-medium">
                                        L'inscription se fait désormais prioritairement en ligne pour simplifier vos démarches.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Etape 4: Checklists et Organisation */}
            <AdmissionChecklists />

            {/* FAQ */}
            <AdmissionFAQ />
        </main >
    );
}
