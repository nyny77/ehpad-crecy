"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { INITIAL_GALLERY, GalleryImage } from "@/lib/gallery";
import { isAdmin, initNetlifyIdentity, onAuthChange } from "@/lib/netlifyAuth";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";

const CATEGORIES = [
    { id: "all", label: "Tout voir" },
    { id: "chamber", label: "Chambres" },
    { id: "lounge", label: "Salons & Vie Sociale" },
    { id: "garden", label: "Extérieurs" },
    { id: "restaurant", label: "Restauration" },
    { id: "history", label: "Histoire" },
];

// Individual gallery image with 3D tilt
function GalleryImageCard({ img, onClick }: { img: GalleryImage, onClick: () => void }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 100, damping: 10 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 10 });

    const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <div
                ref={cardRef}
                style={{ perspective: "1000px" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
                className="cursor-pointer"
            >
                <motion.div
                    style={{ rotateX, rotateY }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-white font-serif font-bold text-xl mb-1 drop-shadow-lg">{img.title}</h3>
                        <span className="text-white/90 text-sm capitalize font-medium tracking-wide drop-shadow-md">{img.category}</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

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
                title="Galerie Photos"
                subtitle="Découverte des lieux"
                description="Explorez notre établissement à travers une sélection de photos : vues aériennes, jardins, façades et images historiques du début du XXe siècle."
            />

            {/* Categories - EN DEHORS du PageHeader pour garder l'encadré propre */}
            <section className="container-custom px-4" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
                <div className="flex flex-wrap justify-center gap-3">
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
                    <div className="text-center mt-3">
                        <Link
                            href="/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-charcoal-800 text-white px-6 py-3 rounded-full hover:bg-charcoal-700 shadow-lg font-bold transition-transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Gérer la galerie (CMS)
                        </Link>
                    </div>
                )}
            </section>

            {/* Grid */}
            <section className="container-custom px-4">
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredImages.map((img) => (
                            <GalleryImageCard
                                key={img.id}
                                img={img}
                                onClick={() => setSelectedImage(img)}
                            />
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
