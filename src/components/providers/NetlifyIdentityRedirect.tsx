"use client";

import { useEffect } from "react";

export default function NetlifyIdentityRedirect() {
    useEffect(() => {
        // La redirection globale est désactivée pour laisser chaque page gérer son état.
        // Les composants comme VieSocialeClient écoutent déjà les événements de connexion via onAuthChange.
    }, []);

    return null;
}
