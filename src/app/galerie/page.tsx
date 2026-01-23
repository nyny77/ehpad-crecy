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
        <main className="pb-20 bg-cream-50 min-h-screen">
            {/* Hero */}
            <PageHeader
                title="Découvrez nos espaces de vie"
                subtitle="Visite Virtuelle"
                description="Une architecture pensée pour le bien-être, alliant confort hôtelier, sécurité médicale et convivialité."
            >
                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 mb-8 mt-6">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === cat.id
                                ? "bg-forest-600 text-white shadow-lg scale-105"
                                : "bg-white border border-gray-200 text-charcoal-600 hover:bg-forest-50"
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
                            className="inline-flex items-center gap-2 bg-charcoal-800 text-white px-6 py-3 rounded-full hover:bg-charcoal-900 shadow-lg font-bold transition-transform hover:scale-105"
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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredImages.map((img) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={img.id}
                                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer aspect-[4/3]"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <h3 className="text-white font-bold text-lg">{img.title}</h3>
                                    <span className="text-white/80 text-sm capitalize">{img.category}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredImages.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        Aucune photo dans cette catégorie pour le moment.
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
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.img
                            layoutId={selectedImage.id}
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className="max-h-[90vh] max-w-full rounded-lg shadow-2xl object-contain"
                        />
                        <div className="absolute bottom-8 left-0 right-0 text-center text-white pointer-events-none">
                            <p className="text-xl font-bold">{selectedImage.title}</p>
                            <p className="opacity-75 text-sm uppercase tracking-wide">{selectedImage.category}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
