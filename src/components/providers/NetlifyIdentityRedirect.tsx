"use client";

import { useEffect } from "react";

export default function NetlifyIdentityRedirect() {
    useEffect(() => {
        // Ecouteur global pour fermer automatiquement le widget après connexion
        const handleLogin = () => {
            console.log("Login detected, closing widget in 1s...");
            setTimeout(() => {
                window.netlifyIdentity?.close();
            }, 1000);
        };

        // Polling pour attendre que netlifyIdentity soit chargé
        const checkInterval = setInterval(() => {
            if (window.netlifyIdentity) {
                console.log("NetlifyIdentity found, attaching auto-close listener");
                window.netlifyIdentity.init();
                window.netlifyIdentity.on("login", handleLogin);
                clearInterval(checkInterval);
            }
        }, 100);

        // Cleanup
        return () => {
            clearInterval(checkInterval);
            if (window.netlifyIdentity) {
                window.netlifyIdentity.off("login", handleLogin);
            }
        };
    }, []);

    return null;
}
