"use client";

import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";
import PanoramaViewer from "@/components/virtual-tour/PanoramaViewer";

export default function VisitePage() {
    return (
        <main className="min-h-screen bg-cream-50">
            <PageHeader
                title="Visite Virtuelle"
                subtitle="Découvrez notre établissement comme si vous y étiez"
                description="Faites un tour dans notre jardin et visualisez les espaces de vie. (Ceci est une démonstration)"
                image="/images/global-hero.jpg"
            />

            <Section className="py-12">
                <div className="container-custom space-y-12">

                    {/* Section Grand Salon */}
                    <div className="space-y-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-serif text-charcoal-900 mb-2">Notre Établissement</h2>
                                <p className="text-charcoal-600 max-w-2xl">
                                    Nous mettons tout en œuvre pour vous offrir prochainement une immersion complète.
                                </p>
                            </div>
                            <div className="hidden md:block text-sm text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-100">
                                Vue à 360°
                            </div>
                        </div>

                        {/* Placeholder Prochainement */}
                        <div className="h-[400px] w-full bg-cream-100 rounded-2xl border-4 border-white shadow-inner flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 bg-charcoal-100 rounded-full flex items-center justify-center mb-4 text-charcoal-400">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-serif text-charcoal-800 mb-2">Prochainement : Panorama 360°</h3>
                            <p className="text-charcoal-600">
                                Nous préparons une visite immersive de ce lieu.
                                <br />
                                Revenez bientôt pour le découvrir !
                            </p>
                        </div>
                    </div>



                </div>
            </Section>
        </main>
    );
}
