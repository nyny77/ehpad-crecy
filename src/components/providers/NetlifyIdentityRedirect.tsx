"use client";

import { useEffect } from "react";

export default function NetlifyIdentityRedirect() {
    useEffect(() => {
        // Simple and robust login listener with polling
        const handleLogin = () => {
            console.log("Login detected in Redirect, reloading...");
            window.location.href = "/";
        };

        // Poll for netlifyIdentity availability
        const checkInterval = setInterval(() => {
            if (window.netlifyIdentity) {
                console.log("NetlifyIdentity found, attaching listener");
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
