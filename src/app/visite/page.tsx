"use client";

import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";
import PanoramaViewer from "@/components/virtual-tour/PanoramaViewer";
import { useState, useEffect } from "react";
import visiteData from "@/lib/data/visite-gallery.json";

export default function VisitePage() {
    const photos = visiteData.photos;
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    const handleClose = () => setSelectedPhotoIndex(null);

    const handleNext = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
        }
    };

    const handlePrev = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return;
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhotoIndex]);

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
                                {photos.map((img: any, index: number) => (
                                    <div 
                                        key={img.id} 
                                        className="relative group bg-white rounded-2xl overflow-hidden shadow-sm aspect-[4/3] border border-cream-100 cursor-pointer"
                                        onClick={() => setSelectedPhotoIndex(index)}
                                    >
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

            {/* Lightbox Modal */}
            {selectedPhotoIndex !== null && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-all"
                    onClick={handleClose}
                >
                    <button 
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50 transition-colors"
                        onClick={handleClose}
                        aria-label="Fermer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button 
                        className="absolute left-4 md:left-8 text-white/70 hover:text-white p-2 z-50 transition-colors hidden sm:block"
                        onClick={handlePrev}
                        aria-label="Photo précédente"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={photos[selectedPhotoIndex].src} 
                            alt={photos[selectedPhotoIndex].alt || photos[selectedPhotoIndex].title}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <p className="text-white text-center mt-6 text-xl font-serif tracking-wide">
                            {photos[selectedPhotoIndex].title}
                        </p>
                        
                        {/* Mobile controls */}
                        <div className="flex sm:hidden justify-between w-full mt-4 px-4">
                            <button 
                                className="text-white/70 hover:text-white p-2"
                                onClick={handlePrev}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                className="text-white/70 hover:text-white p-2"
                                onClick={handleNext}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button 
                        className="absolute right-4 md:right-8 text-white/70 hover:text-white p-2 z-50 transition-colors hidden sm:block"
                        onClick={handleNext}
                        aria-label="Photo suivante"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </main>
    );
}
