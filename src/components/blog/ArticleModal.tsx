"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Article, getCategoryInfo } from "@/lib/articleStorage";
import { getOptimizedImageSrc } from "@/lib/optimized-image";

interface ArticleModalProps {
    article: Article | null;
    onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!article) return;
        closeButtonRef.current?.focus();
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [article, onClose]);

    if (!article) return null;

    const categoryInfo = getCategoryInfo(article.category);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <AnimatePresence>
            {article && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="article-modal-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" // Ajout de flex flex-col
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="relative bg-gray-100 flex-shrink-0 min-h-[200px] flex items-center justify-center">
                            {article.image ? (
                                <img
                                    src={getOptimizedImageSrc(article.image)}
                                    alt={article.title}
                                    className="w-full h-auto max-h-[50vh] object-contain mx-auto"
                                />
                            ) : (
                                <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-terracotta-100 to-forest-100">
                                    <svg className="w-20 h-20 text-terracotta-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            {/* Bouton fermer */}
                            <button
                                ref={closeButtonRef}
                                type="button"
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-charcoal-700 hover:bg-white transition-colors shadow-lg z-10"
                                aria-label="Fermer l’article"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Badge catégorie */}
                            <div className="absolute bottom-4 left-4 z-10">
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${categoryInfo.color} shadow-sm border border-white/20`}>
                                    {categoryInfo.label}
                                </span>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-8 overflow-y-auto flex-1">
                            {/* Date */}
                            <p className="text-terracotta-500 font-medium mb-2">
                                {formatDate(article.date)}
                            </p>

                            {/* Titre */}
                            <h2 id="article-modal-title" className="font-serif text-2xl md:text-3xl text-charcoal-900 mb-6">
                                {article.title}
                            </h2>

                            {/* Contenu */}
                            <div className="prose prose-lg max-w-none text-charcoal-700 leading-relaxed">
                                {article.content.split("\n").map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
