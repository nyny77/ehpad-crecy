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

                        {/* Visite du Jardin */}
                        <div className="h-[500px] w-full bg-cream-100 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                            <PanoramaViewer
                                imagePath="/images/jardin-360.jpg"
                                title="Le petit jardin en hiver"
                            />
                        </div>
                    </div>



                </div>
            </Section>
        </main>
    );
}
