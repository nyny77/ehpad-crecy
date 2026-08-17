"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const IDENTITY_ROUTES = ["/administration", "/admin-users", "/galerie", "/recrutement"];
const AUTH_HASH_PATTERN = /(?:invite_token|confirmation_token|recovery_token|access_token)=/;

export default function NetlifyIdentityLoader() {
    const pathname = usePathname();
    const [hasAuthHash, setHasAuthHash] = useState(false);

    useEffect(() => {
        setHasAuthHash(AUTH_HASH_PATTERN.test(window.location.hash));
    }, []);

    const routeNeedsIdentity = IDENTITY_ROUTES.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    );
    if (!routeNeedsIdentity && !hasAuthHash) return null;

    return (
        <Script
            src="https://identity.netlify.com/v1/netlify-identity-widget.js"
            strategy="afterInteractive"
            onLoad={() => {
                window.netlifyIdentity?.init();
                window.dispatchEvent(new Event("netlify-identity-ready"));
            }}
        />
    );
}
