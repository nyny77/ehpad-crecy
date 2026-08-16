"use client";

import { motion } from "framer-motion";
import BlogGrid from "@/components/blog/BlogGrid";
import { BlogPost } from "@/lib/blog";

interface BlogClientProps {
    initialArticles: BlogPost[];
}

export default function BlogClient({ initialArticles }: BlogClientProps) {
    return (
        <main className="pt-32 md:pt-40 py-8 pb-16 bg-cream-100 min-h-screen">
            <div className="container-custom">
                <h1 className="font-serif text-4xl font-bold text-charcoal-900 md:text-5xl">Actualités de l’EHPAD</h1>
                <div className="relative mt-8">
                    {/* Contenu */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <BlogGrid articles={initialArticles} />
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
