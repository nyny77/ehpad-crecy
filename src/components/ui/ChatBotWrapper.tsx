"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ChatBot = dynamic(() => import("@/components/ui/ChatBot"), { ssr: false });

export default function ChatBotWrapper() {
    const [isActivated, setIsActivated] = useState(false);

    if (isActivated) return <ChatBot initiallyOpen />;

    return (
        <div className="fixed bottom-24 right-4 z-[999] font-sans sm:bottom-6 sm:right-6">
            {/* Spotlight Banner on load */}
            <div className="absolute bottom-16 right-0 mb-2 w-64 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border-2 border-terracotta-300 text-charcoal-800 text-xs flex items-center justify-between gap-2 animate-fade-in">
                <button
                    type="button"
                    onClick={() => setIsActivated(true)}
                    className="flex items-center gap-2 text-left hover:text-terracotta-600 focus:outline-none focus:underline"
                    aria-label="Ouvrir l'assistant : Une question ? Posez-la ici !"
                >
                    <span className="text-xl" aria-hidden="true">💬</span>
                    <span><strong>Une question ?</strong> Je suis là pour vous renseigner !</span>
                </button>
            </div>

            {/* Spotlight FAB */}
            <button
                type="button"
                onClick={() => setIsActivated(true)}
                className="relative z-50 flex h-14 px-4 items-center gap-2.5 rounded-full bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 text-white border-2 border-white/60 shadow-2xl transition-all hover:scale-106 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-terracotta-400"
                aria-label="Ouvrir l'assistant virtuel Bonjour Crécy"
            >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg" aria-hidden="true">
                    💬
                </div>
                <div className="text-left">
                    <span className="block text-xs font-bold leading-tight">Une question ?</span>
                    <span className="block text-[10px] text-cream-100 leading-tight">En ligne</span>
                </div>

                {/* Ping badge */}
                <span className="absolute -top-1 -right-1 flex h-4 w-4" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-forest-500 border-2 border-white"></span>
                </span>
            </button>
        </div>
    );
}
