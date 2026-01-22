import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://btxgjdmugbkfnpsvddid.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0eGdqZG11Z2JrZm5wc3ZkZGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MTQzNjksImV4cCI6MjA4NDE5MDM2OX0.HgO4RbiqRYTscbB9JWC0gm6XQr83Nzl1nzSGQhdU0WQ';

// Note: La clé anon est publique et sécurisée par Row Level Security (RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les stats d'articles
export interface ArticleStats {
    article_id: string;
    likes: number;
    views: number;
}

// Cache local pour les likes (évite les doublons)
const LIKED_KEY = 'ehpad_liked_articles';

function getLikedArticles(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveLikedArticles(articles: string[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LIKED_KEY, JSON.stringify(articles));
}

export function hasLiked(articleId: string): boolean {
    return getLikedArticles().includes(articleId);
}

// Récupérer les stats d'un article
export async function getArticleStats(articleId: string): Promise<ArticleStats> {
    const { data, error } = await supabase
        .from('article_stats')
        .select('*')
        .eq('article_id', articleId)
        .single();

    if (error || !data) {
        // Si pas de stats, créer une entrée
        return { article_id: articleId, likes: 0, views: 0 };
    }

    return data;
}

// Incrémenter les vues
export async function incrementViews(articleId: string): Promise<void> {
    // D'abord, essayer d'incrémenter
    const { error } = await supabase.rpc('increment_views', { p_article_id: articleId });

    if (error) {
        // Si erreur, créer l'entrée puis réessayer
        await supabase
            .from('article_stats')
            .upsert({ article_id: articleId, likes: 0, views: 1 });
    }
}

// Toggle like (ajouter ou retirer)
export async function toggleLike(articleId: string): Promise<{ liked: boolean; newCount: number }> {
    const likedArticles = getLikedArticles();
    const alreadyLiked = likedArticles.includes(articleId);

    if (alreadyLiked) {
        // Retirer le like
        const { data } = await supabase.rpc('decrement_likes', { p_article_id: articleId });
        saveLikedArticles(likedArticles.filter(id => id !== articleId));
        return { liked: false, newCount: data || 0 };
    } else {
        // Ajouter le like
        const { data, error } = await supabase.rpc('increment_likes', { p_article_id: articleId });

        if (error) {
            // Créer l'entrée si elle n'existe pas
            await supabase
                .from('article_stats')
                .upsert({ article_id: articleId, likes: 1, views: 0 });
            saveLikedArticles([...likedArticles, articleId]);
            return { liked: true, newCount: 1 };
        }

        saveLikedArticles([...likedArticles, articleId]);
        return { liked: true, newCount: data || 1 };
    }
}
