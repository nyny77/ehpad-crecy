// Utilitaires d'authentification Netlify Identity pour le blog Vie Sociale

declare global {
    interface Window {
        netlifyIdentity?: {
            on: (event: string, callback: (user?: NetlifyUser) => void) => void;
            off: (event: string, callback?: (user?: NetlifyUser) => void) => void;
            open: (tab?: "signup" | "login") => void;
            close: () => void;
            logout: () => Promise<void>;
            currentUser: () => NetlifyUser | null;
            init: () => void;
            gotrue?: any; // Exposing gotrue instance for custom calls
        };
    }
}

export interface NetlifyUser {
    id: string;
    email: string;
    user_metadata?: {
        full_name?: string;
        avatar_url?: string;
    };
    app_metadata?: {
        roles?: string[];
    };
    token?: {
        access_token: string;
        expires_at: number;
    };
}

// Vérifie si l'utilisateur est connecté
export function isAuthenticated(): boolean {
    if (typeof window === "undefined" || !window.netlifyIdentity) return false;
    return window.netlifyIdentity.currentUser() !== null;
}

// Récupère l'utilisateur courant
export function getCurrentUser(): NetlifyUser | null {
    if (typeof window === "undefined" || !window.netlifyIdentity) return null;
    return window.netlifyIdentity.currentUser();
}

// Vérifie si l'utilisateur est admin (basé sur les rôles Netlify Identity)
export function isAdmin(): boolean {
    const user = getCurrentUser();
    if (!user) return false;
    const roles = user.app_metadata?.roles || [];
    return roles.includes("admin");
}

// Vérifie si l'utilisateur est autorisé (admin ou a un rôle validé)
export function isAuthorized(): boolean {
    const user = getCurrentUser();
    if (!user) return false;
    const roles = user.app_metadata?.roles || [];
    // Strict : Doit avoir au moins un rôle
    return roles.length > 0;
}

// Vérifie si l'utilisateur est connecté mais en attente de validation (pas de rôle)
export function isPendingValidation(): boolean {
    const user = getCurrentUser();
    if (!user) return false;
    const roles = user.app_metadata?.roles || [];
    return roles.length === 0;
}

// Ouvre le widget d'authentification
export function openLoginWidget(tab: "signup" | "login" = "login"): void {
    if (typeof window !== "undefined" && window.netlifyIdentity) {
        window.netlifyIdentity.open(tab);
    }
}

// Ferme le widget
export function closeWidget(): void {
    if (typeof window !== "undefined" && window.netlifyIdentity) {
        window.netlifyIdentity.close();
    }
}

// Déconnexion
export async function logout(): Promise<void> {
    if (typeof window !== "undefined" && window.netlifyIdentity) {
        await window.netlifyIdentity.logout();
    }
}

// S'abonner aux événements d'authentification
export function onAuthChange(callback: (user: NetlifyUser | null) => void): () => void {
    if (typeof window === "undefined" || !window.netlifyIdentity) {
        return () => { };
    }

    const handleLogin = (user?: NetlifyUser) => callback(user || null);
    const handleLogout = () => callback(null);

    window.netlifyIdentity.on("login", handleLogin);
    window.netlifyIdentity.on("logout", handleLogout);

    // Retourne une fonction de nettoyage
    return () => {
        window.netlifyIdentity?.off("login");
        window.netlifyIdentity?.off("logout");
    };
}

// Initialise le widget (à appeler une fois au chargement)
export function initNetlifyIdentity(): void {
    if (typeof window !== "undefined" && window.netlifyIdentity) {
        window.netlifyIdentity.init();
    }
}
