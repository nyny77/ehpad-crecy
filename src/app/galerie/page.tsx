"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { INITIAL_GALLERY, GalleryImage } from "@/lib/gallery";
import { isAdmin, initNetlifyIdentity, onAuthChange } from "@/lib/netlifyAuth";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";

const CATEGORIES = [
    { id: "all", label: "Tout voir" },
    { id: "chamber", label: "Chambres" },
    { id: "lounge", label: "Salons & Vie Sociale" },
    { id: "garden", label: "Extérieurs" },
    { id: "restaurant", label: "Restauration" },
];

export default function GaleriePage() {
    const images: GalleryImage[] = INITIAL_GALLERY;
    const [filter, setFilter] = useState("all");
    const [adminMode, setAdminMode] = useState(false);

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

    const filteredImages = filter === "all"
        ? images
        : images.filter(img => img.category === filter);

    return (
        <main className="pb-20 bg-cream-100 min-h-screen">
            {/* Hero */}
            <PageHeader
                title="Découvrez nos espaces de vie"
                subtitle="Visite Virtuelle"
                description="Une architecture pensée pour le bien-être, alliant confort hôtelier, sécurité médicale et convivialité."
            >
                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 mb-10 mt-8">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat.id
                                ? "bg-terracotta-500 text-white shadow-md scale-105"
                                : "bg-white border border-cream-300 text-charcoal-600 hover:bg-cream-50 hover:border-terracotta-300"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Admin Button */}
                {adminMode && (
                    <div className="mb-0">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 bg-charcoal-800 text-white px-6 py-3 rounded-full hover:bg-charcoal-700 shadow-lg font-bold transition-transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Gérer la galerie (CMS)
                        </Link>
                    </div>
                )}
            </PageHeader>

            {/* Grid */}
            <section className="container-custom px-4">
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredImages.map((img) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={img.id}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer aspect-[4/3] border border-cream-100"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white font-serif font-bold text-xl mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h3>
                                    <span className="text-cream-100 text-sm capitalize font-medium tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">{img.category}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredImages.length === 0 && (
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
                        <motion.img
                            layoutId={selectedImage.id}
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className="max-h-[85vh] max-w-full rounded-lg shadow-2xl object-contain"
                        />
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
