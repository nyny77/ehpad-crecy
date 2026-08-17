"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ChatBot = dynamic(() => import("@/components/ui/ChatBot"), { ssr: false });

export default function ChatBotWrapper() {
    const [isActivated, setIsActivated] = useState(false);

    if (isActivated) return <ChatBot initiallyOpen />;

    return (
        <div className="fixed bottom-6 right-6 z-40 font-sans">
            <button
                type="button"
                onClick={() => setIsActivated(true)}
                className="relative z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-terracotta-500 to-terracotta-400 text-white shadow-lg transition-transform hover:scale-105 hover:brightness-110"
                aria-label="Ouvrir l’assistant"
            >
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-forest-500" aria-hidden="true" />
            </button>
        </div>
    );
}
