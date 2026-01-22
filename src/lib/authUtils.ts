// Utilitaires d'authentification pour le blog Vie Sociale

// Configuration
export const AUTH_CONFIG = {
    familyPassword: "famille2026",
    adminPassword: "admin2026",
    storageKey: "ehpad_blog_auth",
    adminEmail: "atodaro77@gmail.com",
    formspreeEndpoint: "https://formspree.io/f/mlgggpzq",
};

export type AuthLevel = "none" | "family" | "admin";

interface AuthState {
    level: AuthLevel;
    timestamp: number;
}

// Vérifie le mot de passe et retourne le niveau d'accès
export function checkPassword(password: string): AuthLevel {
    if (password === AUTH_CONFIG.adminPassword) {
        return "admin";
    }
    if (password === AUTH_CONFIG.familyPassword) {
        return "family";
    }
    return "none";
}

// Sauvegarde l'état d'authentification
export function saveAuth(level: AuthLevel): void {
    if (typeof window === "undefined") return;

    const state: AuthState = {
        level,
        timestamp: Date.now(),
    };
    localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(state));
}

// Récupère l'état d'authentification
export function getAuth(): AuthLevel {
    if (typeof window === "undefined") return "none";

    try {
        const stored = localStorage.getItem(AUTH_CONFIG.storageKey);
        if (!stored) return "none";

        const state: AuthState = JSON.parse(stored);

        // Session expire après 7 jours
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - state.timestamp > sevenDays) {
            logout();
            return "none";
        }

        return state.level;
    } catch {
        return "none";
    }
}

// Vérifie si l'utilisateur est authentifié
export function isAuthenticated(): boolean {
    return getAuth() !== "none";
}

// Vérifie si l'utilisateur est admin
export function isAdmin(): boolean {
    return getAuth() === "admin";
}

// Déconnexion
export function logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_CONFIG.storageKey);
}

// Connexion avec mot de passe
export function login(password: string): { success: boolean; level: AuthLevel; message: string } {
    const level = checkPassword(password);

    if (level === "none") {
        return {
            success: false,
            level: "none",
            message: "Code d'accès incorrect. Veuillez réessayer.",
        };
    }

    saveAuth(level);

    return {
        success: true,
        level,
        message: level === "admin"
            ? "Bienvenue ! Vous avez accès aux fonctions d'administration."
            : "Bienvenue ! Vous pouvez maintenant consulter la galerie.",
    };
}
