// Stockage des articles du blog dans localStorage

export interface Article {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    image: string | null;
    category: "activite" | "evenement" | "sortie" | "fete" | "autre";
    date: string;
    createdAt: number;
    updatedAt: number;
}

const STORAGE_KEY = "ehpad_blog_articles";

// Articles de démonstration
const DEMO_ARTICLES: Article[] = [
    {
        id: "demo-1",
        title: "Galette des Rois 2026",
        content: "Une belle après-midi gourmande pour célébrer l'Épiphanie ! Nos résidents ont partagé de délicieuses galettes préparées par notre chef. Les couronnes étaient de mise et la bonne humeur au rendez-vous.",
        excerpt: "Une belle après-midi gourmande pour célébrer l'Épiphanie !",
        image: null,
        category: "fete",
        date: "2026-01-06",
        createdAt: Date.now() - 11 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now() - 11 * 24 * 60 * 60 * 1000,
    },
    {
        id: "demo-2",
        title: "Atelier Peinture du Mercredi",
        content: "Notre atelier peinture hebdomadaire a permis à nos artistes de s'exprimer sur le thème de l'hiver. De magnifiques paysages enneigés ont vu le jour !",
        excerpt: "Nos artistes s'expriment sur le thème de l'hiver.",
        image: null,
        category: "activite",
        date: "2026-01-15",
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
        id: "demo-3",
        title: "Visite des Écoliers",
        content: "Les enfants de l'école primaire de Crécy sont venus rendre visite à nos résidents. Un moment d'échange intergénérationnel riche en émotions et en sourires.",
        excerpt: "Un moment d'échange intergénérationnel riche en émotions.",
        image: null,
        category: "evenement",
        date: "2026-01-10",
        createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
];

// Récupère tous les articles
export function getArticles(): Article[] {
    if (typeof window === "undefined") return DEMO_ARTICLES;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            // Initialiser avec les articles de démo
            saveArticles(DEMO_ARTICLES);
            return DEMO_ARTICLES;
        }
        return JSON.parse(stored);
    } catch {
        return DEMO_ARTICLES;
    }
}

// Sauvegarde tous les articles
export function saveArticles(articles: Article[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

// Ajoute un nouvel article
export function addArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">): Article {
    const articles = getArticles();

    const newArticle: Article = {
        ...article,
        id: `article-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    articles.unshift(newArticle); // Ajouter au début
    saveArticles(articles);

    return newArticle;
}

// Met à jour un article
export function updateArticle(id: string, updates: Partial<Article>): Article | null {
    const articles = getArticles();
    const index = articles.findIndex(a => a.id === id);

    if (index === -1) return null;

    articles[index] = {
        ...articles[index],
        ...updates,
        updatedAt: Date.now(),
    };

    saveArticles(articles);
    return articles[index];
}

// Supprime un article
export function deleteArticle(id: string): boolean {
    const articles = getArticles();
    const filtered = articles.filter(a => a.id !== id);

    if (filtered.length === articles.length) return false;

    saveArticles(filtered);
    return true;
}

// Récupère un article par ID
export function getArticleById(id: string): Article | null {
    const articles = getArticles();
    return articles.find(a => a.id === id) || null;
}

// Catégories disponibles
export const CATEGORIES = [
    { value: "activite", label: "Activité", color: "bg-blue-100 text-blue-700" },
    { value: "evenement", label: "Événement", color: "bg-purple-100 text-purple-700" },
    { value: "sortie", label: "Sortie", color: "bg-green-100 text-green-700" },
    { value: "fete", label: "Fête", color: "bg-yellow-100 text-yellow-700" },
    { value: "autre", label: "Autre", color: "bg-gray-100 text-gray-700" },
] as const;

export function getCategoryInfo(category: Article["category"]) {
    return CATEGORIES.find(c => c.value === category) || CATEGORIES[4];
}
