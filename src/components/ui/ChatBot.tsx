"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAT_RULES, FALLBACK_MESSAGE, SUGGESTED_QUESTIONS, ChatRule } from "@/lib/chatbot-data";
import Link from "next/link";

type MessageLink = { label: string; url: string };

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
    links?: MessageLink[];
    timestamp: Date;
};

let msgSequence = 0;
function createUniqueId(): string {
    msgSequence += 1;
    return `msg_${msgSequence}_${Math.random().toString(36).slice(2, 6)}`;
}

export default function ChatBot({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(initiallyOpen);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            text: "Bonjour ! 👋 Je suis l’assistant virtuel de l’EHPAD de Crécy. Comment puis-je vous renseigner aujourd’hui ?",
            sender: "bot",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showSpotlightPrompt, setShowSpotlightPrompt] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    // Accessibility: Focus trap & Escape key
    useEffect(() => {
        if (!isOpen) return;
        setShowSpotlightPrompt(false);
        inputRef.current?.focus();
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                toggleRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    // Process verified rule-based response
    const processMessage = async (userText: string) => {
        setIsTyping(true);

        const lower = userText.toLowerCase();
        const matchedRule: ChatRule | undefined = CHAT_RULES.find(rule =>
            rule.keywords.some(keyword => lower.includes(keyword))
        );
        const botReplyText = matchedRule ? matchedRule.response : FALLBACK_MESSAGE;
        const botLinks = matchedRule?.relatedLinks;

        setTimeout(() => {
            const msgId = createUniqueId();
            const botResponse: Message = {
                id: msgId,
                text: botReplyText,
                sender: "bot",
                links: botLinks,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 350);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        const userMessage: Message = {
            id: createUniqueId(),
            text: userText,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        await processMessage(userText);
    };

    const handleSuggestionClick = async (question: string) => {
        const userMessage: Message = {
            id: createUniqueId(),
            text: question,
            sender: "user",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        await processMessage(question);
    };

    return (
        <div className="fixed bottom-24 right-4 z-[999] font-sans sm:bottom-6 sm:right-6">
            {/* Spotlight Banner on load (clickable prompt) */}
            <AnimatePresence>
                {!isOpen && showSpotlightPrompt && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: 1, duration: 0.4 }}
                        className="absolute bottom-16 right-0 mb-2 w-64 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border-2 border-terracotta-300 text-charcoal-800 text-xs flex items-center justify-between gap-2"
                    >
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="flex items-center gap-2 text-left hover:text-terracotta-600 focus:outline-none focus:underline"
                            aria-label="Ouvrir l'assistant : Une question ? Posez-la ici !"
                        >
                            <span className="text-xl">💬</span>
                            <span><strong>Une question ?</strong> Je suis là pour vous renseigner !</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowSpotlightPrompt(false)}
                            className="p-1 text-charcoal-400 hover:text-charcoal-700 rounded-full"
                            aria-label="Fermer la bulle d’information"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="assistant-ehpad"
                        role="dialog"
                        aria-modal="false"
                        aria-labelledby="assistant-ehpad-title"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="chatbot-container absolute bottom-20 right-0 w-[360px] sm:w-[410px] bg-cream-50 rounded-3xl shadow-2xl border-2 border-terracotta-200 overflow-hidden flex flex-col max-h-[580px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-terracotta-400 p-4 flex items-center justify-between text-white shrink-0 shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
                                    💬
                                </div>
                                <div>
                                    <h3 id="assistant-ehpad-title" className="font-serif font-bold text-base text-white">
                                        Bonjour Crécy
                                    </h3>
                                    <p className="text-xs text-cream-100 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-forest-400 inline-block animate-pulse"></span>
                                        Assistant en ligne
                                    </p>
                                </div>
                            </div>
                            
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                                aria-label="Fermer l’assistant"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="chatbot-messages-area flex-1 overflow-y-auto p-4 space-y-4 min-h-[280px] max-h-[380px] bg-cream-100/60" aria-live="polite" aria-relevant="additions">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm relative ${msg.sender === "user"
                                            ? "bg-terracotta-500 text-white rounded-br-none"
                                            : "chatbot-message-bot bg-white text-charcoal-800 rounded-bl-none border border-cream-300"
                                            }`}
                                    >
                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        
                                        {msg.links && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {msg.links.map((link, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={link.url}
                                                        className="chatbot-link text-xs px-3 py-1.5 rounded-lg transition-all font-semibold bg-terracotta-50 text-terracotta-700 hover:bg-terracotta-500 hover:text-white border border-terracotta-200 shadow-2xs"
                                                    >
                                                        {link.label} →
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        <p className={`text-[10px] mt-1.5 text-right ${msg.sender === "user" ? "text-terracotta-100" : "text-charcoal-400"}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Suggested Questions Pills (displayed if only welcome message) */}
                            {messages.length === 1 && (
                                <div className="pt-2 space-y-2">
                                    <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider px-1">
                                        💡 Questions fréquentes :
                                    </p>
                                    <div className="flex flex-col gap-1.5">
                                        {SUGGESTED_QUESTIONS.map((q, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleSuggestionClick(q)}
                                                className="text-left text-xs bg-white hover:bg-terracotta-50 text-charcoal-700 hover:text-terracotta-700 p-2.5 rounded-xl border border-cream-300 hover:border-terracotta-300 transition-all shadow-2xs flex items-center justify-between group"
                                            >
                                                <span>{q}</span>
                                                <span className="text-terracotta-400 group-hover:translate-x-1 transition-transform">→</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-cream-300 flex items-center gap-2">
                                        <span className="text-xs text-charcoal-500 font-medium">L'assistant répond...</span>
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                            <span className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                            <span className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-cream-200">
                            <div className="flex items-center gap-2">
                                <label htmlFor="assistant-question" className="sr-only">Votre question pour l’assistant</label>
                                <input
                                    id="assistant-question"
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Écrivez votre question..."
                                    className="flex-1 bg-cream-50 border border-cream-300 rounded-2xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:bg-white transition-all placeholder:text-charcoal-400"
                                />

                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="p-2.5 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white rounded-2xl hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                                    aria-label="Envoyer la question"
                                >
                                    <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button (FAB) */}
            <motion.button
                ref={toggleRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className={`h-14 px-4 rounded-full shadow-2xl flex items-center gap-2.5 transition-all relative z-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-terracotta-400 ${isOpen
                    ? "bg-charcoal-900 text-white"
                    : "bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 text-white border-2 border-white/60 hover:shadow-terracotta-500/40"
                    }`}
                aria-expanded={isOpen}
                aria-controls="assistant-ehpad"
                aria-label={isOpen ? "Fermer l’assistant virtuel" : "Ouvrir l’assistant virtuel Bonjour Crécy"}
            >
                {isOpen ? (
                    <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-xs font-bold font-sans">Fermer</span>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                            💬
                        </div>
                        <div className="text-left">
                            <span className="block text-xs font-bold leading-tight">Une question ?</span>
                            <span className="block text-[10px] text-cream-100 leading-tight">En ligne</span>
                        </div>
                    </>
                )}

                {/* Pulsing indicator badge */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-forest-500 border-2 border-white"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
}
