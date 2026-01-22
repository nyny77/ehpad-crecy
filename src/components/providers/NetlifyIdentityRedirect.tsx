"use client";

import { useEffect } from "react";

export default function NetlifyIdentityRedirect() {
    useEffect(() => {
        // Gestion de la redirection après login (pour les SPA)
        if (typeof window !== "undefined" && window.netlifyIdentity) {
            window.netlifyIdentity.on("init", (user) => {
                if (!user) {
                    window.netlifyIdentity?.on("login", () => {
                        document.location.href = "/";
                    });
                }
            });
        }
    }, []);

    return null;
}
