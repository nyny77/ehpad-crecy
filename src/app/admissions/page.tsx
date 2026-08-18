import { Metadata } from "next";
import { MoveRight } from "lucide-react";
import AdmissionStepsSection from "@/components/admissions/AdmissionStepsSection";
import FinancialAidSection from "@/components/admissions/FinancialAidSection";
import AdmissionChecklists from "@/components/admissions/AdmissionChecklists";
import AdmissionFAQ from "@/components/admissions/AdmissionFAQ";
import { EHPAD_INFO } from "@/lib/constants";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
    title: "Préparer mon entrée | EHPAD de Crécy-la-Chapelle",
    description: "Le guide complet pas-à-pas pour préparer votre admission : aides financières, démarches ViaTrajectoire, documents à fournir et trousseau.",
    alternates: {
        canonical: "/admissions",
    },
};

const ADMISSION_FAQS = [
    {
        question: "Puis-je apporter mes propres meubles ?",
        answer: "Oui ! Nous encourageons fortement les résidents à personnaliser leur espace pour se sentir chez eux. Vous pouvez apporter des petits meubles (fauteuil, commode, petite télévision, cadres photos, etc.), sous réserve que l'espace permette une circulation sécurisée pour le personnel soignant. Le lit médicalisé est quant à lui fourni par nos soins.",
    },
    {
        question: "Comment est géré le linge ?",
        answer: "Le linge plat (draps, serviettes, gants de toilette) est fourni et entretenu par l'établissement. L'entretien des vêtements personnels est également inclus. Afin d'éviter toute perte en blanchisserie, les vêtements doivent être étiquetés au nom du résident. Bonne nouvelle : notre équipe peut se charger du marquage pour vous lors de l'admission !",
    },
    {
        question: "Quelles sont les heures de visite ?",
        answer: "Les visites sont libres, généralement conseillées de 11h à 19h pour respecter le rythme de vie, les repas et les soins des résidents. Les familles et proches sont toujours les bienvenus.",
    },
    {
        question: "Mon animal de compagnie peut-il me rendre visite ?",
        answer: "Oui, les animaux de compagnie tenus en laisse et à jour de leurs vaccins sont les bienvenus pour rendre visite à leur maître. Toutefois, ils ne peuvent pas résider de manière permanente avec vous.",
    },
    {
        question: "Puis-je manger avec ma famille à l'EHPAD ?",
        answer: "Tout à fait. Une « table invités » peut être réservée pour déjeuner avec vos proches. Il suffit de prévenir l'accueil au moins 48h à l'avance pour que les repas supplémentaires soient préparés par notre chef.",
    },
];

export default function AdmissionsPage() {
    return (
        <main className="pt-32 md:pt-40 bg-cream-100 min-h-screen">
            <BreadcrumbJsonLd
                items={[
                    { name: "Accueil", url: "/" },
                    { name: "Préparer mon entrée", url: "/admissions" },
                ]}
            />
            <FaqJsonLd items={ADMISSION_FAQS} />
            {/* Hero Section */}
            <section className="container-custom mb-16 text-center">
                <ScrollReveal direction="up">
                    <span className="inline-block py-1.5 px-5 rounded-full bg-forest-100 text-forest-700 font-bold tracking-wider uppercase text-sm mb-4 border border-forest-200">
                        Guide complet
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl text-charcoal-900 font-bold mb-6">
                        Préparer mon entrée
                    </h1>
                    <p className="text-charcoal-600 max-w-2xl mx-auto text-xl leading-relaxed">
                        De la simulation financière à la préparation de la valise, découvrez le parcours d'admission pas-à-pas pour une entrée en toute sérénité.
                    </p>
                </ScrollReveal>
            </section>

            {/* Etape 1: S'informer (Tarifs et aides) */}
            <ScrollReveal direction="up" delay={0.1}>
                <FinancialAidSection />
            </ScrollReveal>

            {/* Etape 2 et 3: Parcours ViaTrajectoire et Visite */}
            <ScrollReveal direction="up" delay={0.2}>
                <AdmissionStepsSection />
            </ScrollReveal>

            {/* Telechargement direct ViaTrajectoire */}
            <section className="py-16 bg-cream-100">
                <div className="container-custom">
                    <ScrollReveal direction="up">
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
                    </ScrollReveal>
                </div>
            </section>

            {/* Etape 4: Checklists et Organisation */}
            <ScrollReveal direction="up">
                <AdmissionChecklists />
            </ScrollReveal>

            {/* FAQ */}
            <ScrollReveal direction="up">
                <AdmissionFAQ />
            </ScrollReveal>
        </main >
    );
}
