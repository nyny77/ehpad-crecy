"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Article, CATEGORIES, addArticle } from "@/lib/articleStorage";

interface ArticleEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (article: Article) => void;
}

// Fonction pour compresser l'image
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Redimensionner si trop grand
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Convertir en JPEG compressé
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function ArticleEditor({ isOpen, onClose, onSave }: ArticleEditorProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState<Article["category"]>("activite");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [image, setImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsCompressing(true);
            try {
                const compressedImage = await compressImage(file);
                setImage(compressedImage);
            } catch (error) {
                console.error('Erreur compression:', error);
                alert('Erreur lors du traitement de l\'image');
            } finally {
                setIsCompressing(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsSubmitting(true);

        try {
            const newArticle = addArticle({
                title: title.trim(),
                content: content.trim(),
                excerpt: content.trim().substring(0, 150),
                image,
                category,
                date,
            });

            onSave(newArticle);

            // Reset form
            setTitle("");
            setContent("");
            setCategory("activite");
            setDate(new Date().toISOString().split("T")[0]);
            setImage(null);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (title || content) {
            if (confirm("Êtes-vous sûr de vouloir fermer ? Les modifications seront perdues.")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-cream-200">
                            <h2 className="font-serif text-2xl text-charcoal-900">
                                Nouvel Article
                            </h2>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-charcoal-600 hover:bg-cream-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                    Titre de l&apos;article *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Atelier peinture du mercredi"
                                    className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* Date et Catégorie */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                        Catégorie
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as Article["category"])}
                                        className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 outline-none transition-all"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Contenu */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                    Contenu de l&apos;article *
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Décrivez l'activité, l'événement..."
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 outline-none transition-all resize-none"
                                    required
                                />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                    Photo (optionnel)
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                {image ? (
                                    <div className="relative">
                                        <img
                                            src={image}
                                            alt="Aperçu"
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setImage(null)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-terracotta-500 text-white rounded-full flex items-center justify-center hover:bg-terracotta-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : isCompressing ? (
                                    <div className="w-full h-32 border-2 border-dashed border-terracotta-300 rounded-xl flex flex-col items-center justify-center text-terracotta-500">
                                        <div className="w-8 h-8 border-3 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin mb-2" />
                                        <span className="text-sm">Compression en cours...</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-32 border-2 border-dashed border-cream-300 rounded-xl flex flex-col items-center justify-center text-charcoal-500 hover:border-terracotta-400 hover:text-terracotta-500 transition-colors"
                                    >
                                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm">Cliquez pour ajouter une photo</span>
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-cream-200 bg-cream-50">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-3 rounded-full text-charcoal-600 font-medium hover:bg-cream-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !title.trim() || !content.trim()}
                                className="px-6 py-3 rounded-full bg-terracotta-500 text-white font-medium hover:bg-terracotta-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Publication...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Publier
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
