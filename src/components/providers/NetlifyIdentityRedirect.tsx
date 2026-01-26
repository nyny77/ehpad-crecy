"use client";

import { useEffect } from "react";

export default function NetlifyIdentityRedirect() {
    useEffect(() => {
        // Simple and robust login listener
        const handleLogin = () => {
            console.log("Login detected in Redirect, reloading...");
            window.location.href = "/";
        };

        if (window.netlifyIdentity) {
            window.netlifyIdentity.on("login", handleLogin);
        }

        return () => {
            window.netlifyIdentity?.off("login", handleLogin);
        };
    }, []);

    return null;
}
