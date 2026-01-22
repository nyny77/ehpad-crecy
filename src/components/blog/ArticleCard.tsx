"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Article, getCategoryInfo } from "@/lib/articleStorage";
import { getArticleStats, toggleLike, incrementViews, hasLiked } from "@/lib/supabaseClient";

interface ArticleCardProps {
    article: Article;
    onClick?: () => void;
    isAdmin?: boolean;
    onDelete?: () => void;
}

export default function ArticleCard({ article, onClick, isAdmin, onDelete }: ArticleCardProps) {
    const categoryInfo = getCategoryInfo(article.category);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [liked, setLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        // Charger les stats au montage
        const loadStats = async () => {
            try {
                const stats = await getArticleStats(article.id);
                setLikes(stats.likes);
                setViews(stats.views);
                setLiked(hasLiked(article.id));
            } catch (error) {
                console.error('Erreur chargement stats:', error);
            }
        };
        loadStats();
    }, [article.id]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiking) return;

        setIsLiking(true);
        try {
            const result = await toggleLike(article.id);
            setLiked(result.liked);
            setLikes(result.newCount);
        } catch (error) {
            console.error('Erreur like:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleClick = async () => {
        // Incrémenter les vues quand on clique pour lire
        try {
            await incrementViews(article.id);
            setViews(v => v + 1);
        } catch (error) {
            console.error('Erreur vues:', error);
        }
        onClick?.();
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-warm transition-shadow duration-300"
        >
            {/* Image ou placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-terracotta-100 to-forest-100 overflow-hidden">
                {article.image ? (
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-terracotta-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Badge catégorie */}
                <div className="absolute top-4 left-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.label}
                    </span>
                </div>

                {/* Bouton supprimer (admin) */}
                {isAdmin && onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Supprimer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Contenu */}
            <div className="p-5">
                {/* Date et stats */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-charcoal-500">
                        {formatDate(article.date)}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-charcoal-400">
                        {/* Vues */}
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {views}
                        </span>
                    </div>
                </div>

                {/* Titre */}
                <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-2 line-clamp-2 group-hover:text-terracotta-600 transition-colors">
                    {article.title}
                </h3>

                {/* Extrait */}
                <p className="text-charcoal-600 text-sm line-clamp-3 mb-4">
                    {article.excerpt || article.content.substring(0, 120) + "..."}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    {/* Bouton Like */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${liked
                                ? 'bg-red-50 text-red-500'
                                : 'bg-cream-100 text-charcoal-500 hover:bg-red-50 hover:text-red-500'
                            }`}
                    >
                        <motion.svg
                            animate={liked ? { scale: [1, 1.3, 1] } : {}}
                            className="w-5 h-5"
                            fill={liked ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </motion.svg>
                        <span className="text-sm font-medium">{likes}</span>
                    </motion.button>

                    {/* Lire plus */}
                    {onClick && (
                        <button
                            onClick={handleClick}
                            className="text-terracotta-500 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            Lire la suite
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
