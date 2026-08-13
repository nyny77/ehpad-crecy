"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "@/components/ui/OptimizedImage";

const SPLASH_SESSION_KEY = "ehpad-crecy-splash-seen";
const SPLASH_DURATION_MS = 600;

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            if (sessionStorage.getItem(SPLASH_SESSION_KEY)) return;
            sessionStorage.setItem(SPLASH_SESSION_KEY, "true");
        } catch {
            // The short splash remains harmless if storage is unavailable.
        }

        setIsVisible(true);
        document.body.style.overflow = "hidden";

        const timeout = window.setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = "unset";
        }, SPLASH_DURATION_MS);

        return () => {
            window.clearTimeout(timeout);
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-cream-50"
                    aria-hidden="true"
                >
                    <div className="relative flex h-40 w-40 items-center justify-center md:h-48 md:w-48">
                        <motion.div
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ duration: 0.55, ease: "easeInOut" }}
                            className="relative z-10 h-28 w-28 overflow-hidden rounded-full border-2 border-white bg-white shadow-xl md:h-32 md:w-32"
                        >
                            <Image
                                src="/images/logo.png"
                                alt=""
                                fill
                                className="object-cover"
                                priority
                                sizes="128px"
                            />
                        </motion.div>

                        <svg className="absolute inset-0 z-20 h-full w-full -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="48" fill="transparent" stroke="#E7E5E4" strokeWidth="1.5" />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="48"
                                fill="transparent"
                                stroke="#C80040"
                                strokeWidth="2.5"
                                strokeDasharray="302"
                                initial={{ strokeDashoffset: 302 }}
                                animate={{ strokeDashoffset: 0 }}
                                transition={{ duration: 0.55, ease: "linear" }}
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
