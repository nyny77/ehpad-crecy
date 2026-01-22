import { getAllPosts } from "@/lib/blog";
import VieSocialeClient from "./VieSocialeClient";

export const metadata = {
    title: "Vie Sociale | EHPAD de Crécy-la-Chapelle",
    description: "Découvrez les activités et actualités de notre établissement.",
};

export default function VieSocialePage() {
    const articles = getAllPosts();

    return <VieSocialeClient initialArticles={articles} />;
}
