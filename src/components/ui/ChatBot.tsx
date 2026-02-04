"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CHAT_KNOWLEDGE_BASE, DEFAULT_RESPONSE, GREETINGS, ChatRule } from "@/lib/chatbot-data";

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
    links?: { text: string; url: string }[];
    timestamp: Date;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    // Initial greeting
    useEffect(() => {
        if (!hasInitialized.current) {
            const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
            setMessages([{
                id: "init",
                text: randomGreeting,
                sender: "bot",
                timestamp: new Date()
            }]);
            hasInitialized.current = true;
        }
    }, []);

    // Auto-scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        const newMessage: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate network delay
        setTimeout(() => {
            const lowerInput = userText.toLowerCase();
            let matchedRule: ChatRule | undefined;

            // Find matching rule
            for (const rule of CHAT_KNOWLEDGE_BASE) {
                if (rule.keywords.some(kw => lowerInput.includes(kw))) {
                    matchedRule = rule;
                    break;
                }
            }

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: matchedRule ? matchedRule.response : DEFAULT_RESPONSE,
                sender: "bot",
                links: matchedRule?.links,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4 font-sans">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="chatbot-window"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-[350px] max-w-[calc(100vw-48px)] h-[500px] max-h-[70vh] bg-white dark:bg-charcoal-800 rounded-2xl shadow-2xl border border-cream-200 dark:border-charcoal-600 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-terracotta-500 p-4 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Assistant EHPAD</h3>
                                    <span className="text-xs text-terracotta-100 flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        En ligne
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream-50 dark:bg-charcoal-900 scroll-smooth">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === "user"
                                        ? "bg-terracotta-500 text-white rounded-br-none"
                                        : "bg-white dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-100 rounded-bl-none border border-cream-100 dark:border-charcoal-600"
                                        }`}>
                                        <p className="leading-relaxed">{msg.text}</p>

                                        {/* Action Links */}
                                        {msg.links && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {msg.links.map((link, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={link.url}
                                                        className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${msg.sender === "user"
                                                            ? "bg-white/20 hover:bg-white/30 text-white"
                                                            : "bg-terracotta-50 text-terracotta-600 hover:bg-terracotta-100 dark:bg-charcoal-600 dark:text-terracotta-300 dark:hover:bg-charcoal-500"
                                                            }`}
                                                    >
                                                        {link.text}
                                                        <ChevronRight className="w-3 h-3" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        <span className={`text-[10px] block mt-1 opacity-70 ${msg.sender === "user" ? "text-right" : "text-left"
                                            }`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-charcoal-700 p-3 rounded-2xl rounded-bl-none border border-cream-100 dark:border-charcoal-600">
                                        <div className="flex gap-1">
                                            <motion.span
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            />
                                            <motion.span
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            />
                                            <motion.span
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-charcoal-800 border-t border-cream-200 dark:border-charcoal-600 shrink-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Posez votre question..."
                                    className="flex-1 px-4 py-2.5 bg-cream-50 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 text-charcoal-800 dark:text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="p-2.5 bg-terracotta-500 text-white rounded-xl hover:bg-terracotta-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${isOpen
                    ? "bg-charcoal-800 text-white"
                    : "bg-terracotta-500 text-white hover:bg-terracotta-600"
                    }`}
            >
                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-cream-50 rounded-full" />
                )}

                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <MessageCircle className="w-7 h-7" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
