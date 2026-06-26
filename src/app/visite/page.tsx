"use client";

import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";
import PanoramaViewer from "@/components/virtual-tour/PanoramaViewer";

export default function VisitePage() {
    return (
        <main className="min-h-screen bg-cream-100">
            <PageHeader
                title="Visite Virtuelle"
                subtitle="Découvrez notre établissement comme si vous y étiez (Espace en cours de test bêta)"
                description="Faites un tour dans notre jardin et visualisez les espaces de vie. (Ceci est une démonstration)"
                image="/images/global-hero.jpg"
            />

            <Section className="pt-12 pb-32">
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
                        <div className="h-[500px] w-full bg-cream-100 rounded-2xl border-4 border-white shadow-xl overflow-hidden mb-16">
                            <PanoramaViewer
                                imagePath="/images/jardin-360.jpg"
                                title="Le petit jardin en hiver"
                                initialYaw={0}
                            />
                        </div>

                        {/* Photos de l'établissement */}
                        <div className="pt-12 border-t border-cream-200">
                            <h3 className="text-2xl font-serif text-charcoal-900 mb-8 text-center">Quelques vues de la maison</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {require('@/lib/data/visite-gallery.json').photos.map((img: any) => (
                                    <div key={img.id} className="relative group bg-white rounded-2xl overflow-hidden shadow-sm aspect-[4/3] border border-cream-100">
                                        <img
                                            src={img.src}
                                            alt={img.alt || img.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-white font-serif font-bold">{img.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            </div>
                        </div>
                    </div>
            </Section>
        </main>
    );
}
