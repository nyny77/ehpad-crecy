import { getAllPosts } from "@/lib/blog";
import BlogClient from "./BlogClient";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
    title: "Actualités & Vie de l'établissement | EHPAD de Crécy-la-Chapelle",
    description: "Découvrez les animations, sorties, événements et actualités de l'EHPAD de Crécy-la-Chapelle.",
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Actualités | EHPAD de Crécy-la-Chapelle",
        description: "Découvrez les animations, sorties, événements et actualités de notre établissement.",
        url: "/blog",
        images: ["/images/global-hero.jpg"],
    },
};

export default function BlogPage() {
    const articles = getAllPosts();

    const articleSchemas = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: articles.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "BlogPosting",
                headline: post.title,
                description: post.excerpt,
                datePublished: post.date,
                image: post.image
                    ? post.image.startsWith("http")
                        ? post.image
                        : `https://ehpadcrecy.netlify.app${post.image}`
                    : "https://ehpadcrecy.netlify.app/images/global-hero.jpg",
                author: {
                    "@type": "Organization",
                    name: "EHPAD de Crécy-la-Chapelle",
                },
            },
        })),
    };

    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: "Accueil", url: "/" },
                    { name: "Actualités", url: "/blog" },
                ]}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchemas) }}
            />
            <BlogClient initialArticles={articles} />
        </>
    );
}
