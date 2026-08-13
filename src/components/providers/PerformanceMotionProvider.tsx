"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

export default function PerformanceMotionProvider({ children }: { children: React.ReactNode }) {
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const mobileQuery = window.matchMedia("(max-width: 767px)");
        const preferenceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updatePreference = () => setReduceMotion(mobileQuery.matches || preferenceQuery.matches);

        updatePreference();
        mobileQuery.addEventListener("change", updatePreference);
        preferenceQuery.addEventListener("change", updatePreference);

        return () => {
            mobileQuery.removeEventListener("change", updatePreference);
            preferenceQuery.removeEventListener("change", updatePreference);
        };
    }, []);

    return (
        <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
            {children}
        </MotionConfig>
    );
}
