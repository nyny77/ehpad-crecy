// Type definitions for global extensions

interface NetlifyUser {
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

export { };

declare global {
    interface Window {
        pannellum: any;
        netlifyIdentity?: {
            on: (event: string, callback: (user?: NetlifyUser) => void) => void;
            off: (event: string, callback?: (user?: NetlifyUser) => void) => void;
            open: (tab?: "signup" | "login") => void;
            close: () => void;
            logout: () => Promise<void>;
            currentUser: () => NetlifyUser | null;
            init: () => void;
            gotrue?: any;
        };
    }
}
