"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Article } from "@/lib/articleStorage";
import ArticleCard from "./ArticleCard";
import ArticleModal from "./ArticleModal";

interface BlogGridProps {
    isAdminUser?: boolean;
    articles?: Article[];
}

export default function BlogGrid({ isAdminUser = false, articles = [] }: BlogGridProps) {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    return (
        <>
            {/* Header avec lien admin */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-charcoal-900">
                        Actualités
                    </h2>
                    <p className="text-charcoal-600 mt-1">
                        Découvrez les moments partagés à l&apos;EHPAD
                    </p>
                </div>

                {isAdminUser && (
                    <Link
                        href="/admin/#/collections/blog/new"
                        className="flex items-center gap-2 px-5 py-3 bg-terracotta-500 !text-white font-medium rounded-full shadow-warm hover:bg-terracotta-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nouvel article CMS
                    </Link>
                )}
            </div>

            {/* Grille d'articles */}
            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <ArticleCard
                                article={article}
                                onClick={() => setSelectedArticle(article)}
                                isAdmin={false} // On désactive l'édition directe sur la carte
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <p className="text-charcoal-600">Aucun article pour le moment</p>
                    {isAdminUser && (
                        <Link
                            href="/admin/#/collections/blog/new"
                            className="mt-4 text-terracotta-500 font-medium hover:underline inline-block"
                        >
                            Créer le premier article
                        </Link>
                    )}
                </div>
            )}

            {/* Modal article */}
            <ArticleModal
                article={selectedArticle}
                onClose={() => setSelectedArticle(null)}
            />
        </>
    );
}
