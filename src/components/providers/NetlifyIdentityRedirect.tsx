"use client";

import { useEffect } from "react";

export default function NetlifyIdentityRedirect() {
    useEffect(() => {
        // Le code précédent fermait le widget trop tôt lors d'une invitation.
        // On initialise simplement le widget s'il est là.
        if (window.netlifyIdentity) {
            window.netlifyIdentity.init();
        }
    }, []);

    return null;
}
