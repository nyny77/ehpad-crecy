// Types pour les articles du blog
// Note: Le stockage local est remplacé par le CMS (fichiers Markdown) via src/lib/blog.ts

export interface Article {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    image: string | null;
    category: "activite" | "evenement" | "sortie" | "fete" | "autre";
    date: string;
    createdAt?: number;
    updatedAt?: number;
}

// Catégories disponibles
export const CATEGORIES = [
    { value: "activite", label: "Activité", color: "bg-blue-100 text-blue-700" },
    { value: "evenement", label: "Événement", color: "bg-purple-100 text-purple-700" },
    { value: "sortie", label: "Sortie", color: "bg-green-100 text-green-700" },
    { value: "fete", label: "Fête", color: "bg-yellow-100 text-yellow-700" },
    { value: "autre", label: "Autre", color: "bg-gray-100 text-gray-700" },
] as const;

export function getCategoryInfo(category: string) {
    const defaultCategory = CATEGORIES[4]; // Autre
    if (!category) return defaultCategory;
    return CATEGORIES.find(c => c.value === category) || defaultCategory;
}

// Les fonctions de localStorage sont conservées temporairement pour éviter de casser le build
// si d'autres composants les utilisent encore, mais elles ne devraient plus être utilisées.
export function getArticles(): Article[] { return []; }
export function saveArticles(articles: Article[]): void { }
export function addArticle(article: any): any { return article; }
export function updateArticle(id: string, updates: any): any { return null; }
export function deleteArticle(id: string): boolean { return true; }
export function getArticleById(id: string): Article | null { return null; }
