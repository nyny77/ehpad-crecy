"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAT_RULES, FALLBACK_MESSAGE, ChatRule } from "@/lib/chatbot-data";
import Link from "next/link";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
    links?: { label: string; url: string }[];
    timestamp: Date;
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            text: "Bonjour ! 👋 Je suis l'assistant virtuel de l'EHPAD. Comment puis-je vous aider aujourd'hui ?",
            sender: "bot",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Analyze logic
        setTimeout(() => {
            const lowerText = userText.toLowerCase();
            let matchedRule: ChatRule | undefined;

            // Simple keyword matching
            matchedRule = CHAT_RULES.find(rule =>
                rule.keywords.some(keyword => lowerText.includes(keyword))
            );

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: matchedRule ? matchedRule.response : FALLBACK_MESSAGE,
                sender: "bot",
                links: matchedRule?.relatedLinks,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1200); // Simulate "thinking" time
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 font-sans">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="chatbot-container absolute bottom-20 right-0 w-[350px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-terracotta-500 p-4 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    🤖
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Assistant EHPAD</h3>
                                    <p className="text-xs text-terracotta-100">En ligne</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="chatbot-messages-area flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] bg-gray-50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.sender === "user"
                                            ? "bg-terracotta-500 text-white rounded-br-none"
                                            : "chatbot-message-bot bg-white rounded-bl-none border"
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        {msg.links && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {msg.links.map((link, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={link.url}
                                                        className="chatbot-link text-xs px-2 py-1 rounded-md transition-colors font-medium border"
                                                    >
                                                        {link.label} →
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        <p className={`text-[10px] mt-1 text-right ${msg.sender === "user" ? "text-terracotta-100" : "chatbot-timestamp"}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-charcoal-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-charcoal-100 dark:border-charcoal-600">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-charcoal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                            <span className="w-2 h-2 bg-charcoal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                            <span className="w-2 h-2 bg-charcoal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-charcoal-800 border-t border-charcoal-100 dark:border-charcoal-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Posez votre question..."
                                    className="flex-1 px-4 py-2 rounded-full border border-charcoal-200 dark:border-charcoal-600 bg-cream-50 dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-100 focus:outline-none focus:border-terracotta-400 focus:ring-1 focus:ring-terracotta-400 text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="p-2 bg-terracotta-500 text-white rounded-full hover:bg-terracotta-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors relative z-50 ${isOpen ? "bg-charcoal-800 text-white" : "bg-terracotta-500 text-white hover:bg-terracotta-600"
                    }`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}

                {/* Notification Badge if closed and not interacted ? Optional */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-forest-500 rounded-full border-2 border-white"></span>
                )}
            </motion.button>
        </div>
    );
}
