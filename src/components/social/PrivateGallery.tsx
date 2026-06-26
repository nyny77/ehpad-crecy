"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import privateGalleryData from "@/lib/data/private-gallery.json";

interface PrivatePhoto {
    id: string;
    src: string;
    alt: string;
    title: string;
    category: string;
}

export default function PrivateGallery() {
    const images: PrivatePhoto[] = [...privateGalleryData.photos].reverse();
    const [selectedImage, setSelectedImage] = useState<PrivatePhoto | null>(null);

    return (
        <section className="py-12">
            <div className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm">
                <div className="text-center mb-10">
                    <h2 className="font-serif text-3xl text-charcoal-800 mb-4">Galerie Photos - Souvenirs de Vie</h2>
                    <p className="text-charcoal-600 max-w-2xl mx-auto">
                        Retrouvez ici les photos des anniversaires, des sorties et des moments de convivialité partagés au quotidien.
                    </p>
                </div>

                {images.length === 0 ? (
                    <div className="text-center py-12 bg-cream-50 rounded-xl">
                        <p className="text-charcoal-500">Aucune photo privée disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={img.id}
                                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-100"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-charcoal-900/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.img
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className="max-h-[90vh] max-w-full rounded shadow-2xl object-contain"
                        />
                        <button
                            className="absolute top-4 right-4 text-white text-opacity-70 hover:text-opacity-100 p-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
