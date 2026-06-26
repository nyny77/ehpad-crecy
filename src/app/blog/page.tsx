import { getAllPosts } from "@/lib/blog";
import BlogClient from "./BlogClient";

export const metadata = {
    title: "Blog | EHPAD de Crécy-la-Chapelle",
    description: "Découvrez les articles et actualités de notre établissement.",
};

export default function BlogPage() {
    const articles = getAllPosts();

    return <BlogClient initialArticles={articles} />;
}
