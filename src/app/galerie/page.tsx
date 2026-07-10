"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { INITIAL_GALLERY, GalleryImage } from "@/lib/gallery";
import { isAdmin, initNetlifyIdentity, onAuthChange } from "@/lib/netlifyAuth";
import { motion, AnimatePresence } from "framer-motion";

import TiltCard from "@/components/ui/TiltCard";



// Individual gallery image with 3D tilt using shared component
function GalleryImageCard({ img, onClick }: { img: GalleryImage, onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <TiltCard className="cursor-pointer" interactive={true}>
                <div
                    onClick={onClick}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 aspect-[4/3] border border-cream-100"
                >
                    <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />

                </div>
            </TiltCard>
        </motion.div>
    );
}

export default function GaleriePage() {
    const images: GalleryImage[] = [...INITIAL_GALLERY].reverse();
    const [adminMode, setAdminMode] = useState(false);
    const [visibleCount, setVisibleCount] = useState(24);

    // Lightbox State
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    useEffect(() => {
        initNetlifyIdentity();
        setAdminMode(isAdmin());

        const unsubscribe = onAuthChange((user) => {
            setAdminMode(!!user && isAdmin());
        });
        return () => unsubscribe();
    }, []);

    return (
        <main className="pt-32 md:pt-40 pb-20 bg-cream-100 min-h-screen">
            {/* Hero */}
            

            {/* Categories - EN DEHORS du PageHeader pour garder l'encadré propre */}
            <section className="container-custom px-4" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
                <div className="text-center mb-6 mt-4">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-terracotta-600 inline-block relative">
                        ✨ Plongez dans nos souvenirs ! ✨
                        <motion.div
                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-terracotta-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 96 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        />
                    </h2>
                </div>

            </section>

            {/* Grid */}
            <section className="container-custom px-4">
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {images.slice(0, visibleCount).map((img) => (
                            <GalleryImageCard
                                key={img.id}
                                img={img}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {visibleCount < images.length && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 24)}
                            className="px-8 py-3 bg-white border-2 border-terracotta-200 text-terracotta-600 rounded-full font-medium hover:bg-terracotta-50 transition-colors shadow-sm hover:scale-105 duration-300"
                        >
                            Voir plus de photos
                        </button>
                    </div>
                )}

                {images.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-cream-200 shadow-sm mx-auto max-w-2xl">
                        <p className="text-charcoal-400 font-medium text-lg">Aucune photo dans cette catégorie pour le moment.</p>
                    </div>
                )}
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-charcoal-900/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-h-[85vh] max-w-[90vw] w-full h-full flex items-center justify-center">
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                sizes="90vw"
                                className="object-contain rounded-lg shadow-2xl"
                                priority
                            />
                        </div>
                        <div className="absolute bottom-8 left-0 right-0 text-center text-white pointer-events-none">
                            <p className="text-2xl font-serif font-bold mb-1">{selectedImage.title}</p>
                            <p className="opacity-80 text-sm uppercase tracking-widest text-cream-200">{selectedImage.category}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
