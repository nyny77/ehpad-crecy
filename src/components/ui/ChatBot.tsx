"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
    isAudioPlaying?: boolean;
};

// Helper to parse markdown links like [Texte](/url) from AI output
function parseMarkdownLinks(text: string): { cleanText: string; links: MessageLink[] } {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links: MessageLink[] = [];
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
        links.push({ label: match[1], url: match[2] });
    }
    const cleanText = text.replace(linkRegex, "$1").trim();
    return { cleanText, links };
}

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
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(false);
    const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
    const [showSpotlightPrompt, setShowSpotlightPrompt] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const recognitionRef = useRef<any>(null);
    const sendVoiceRef = useRef<(text: string) => void>(() => {});

    // Check Speech Recognition & Speech Synthesis support
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRec) {
                setSpeechSupported(true);
                try {
                    const recognition = new SpeechRec();
                    recognition.continuous = false;
                    recognition.interimResults = false;
                    recognition.lang = "fr-FR";

                    recognition.onresult = (event: any) => {
                        const transcript = event.results[0]?.[0]?.transcript;
                        if (transcript) {
                            setInputValue(transcript);
                            setIsListening(false);
                            // Auto submit after voice capture
                            setTimeout(() => {
                                sendVoiceRef.current(transcript);
                            }, 300);
                        }
                    };

                    recognition.onerror = () => {
                        setIsListening(false);
                    };

                    recognition.onend = () => {
                        setIsListening(false);
                    };

                    recognitionRef.current = recognition;
                } catch {
                    setSpeechSupported(false);
                }
            }
        }
    }, []);

    // Text-to-Speech handler
    const speakText = useCallback((text: string, msgId: string) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

        window.speechSynthesis.cancel();

        if (currentlySpeakingId === msgId) {
            setCurrentlySpeakingId(null);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to pick a French voice
        const voices = window.speechSynthesis.getVoices();
        const frenchVoice = voices.find(v => v.lang.startsWith("fr"));
        if (frenchVoice) utterance.voice = frenchVoice;

        utterance.onstart = () => setCurrentlySpeakingId(msgId);
        utterance.onend = () => setCurrentlySpeakingId(null);
        utterance.onerror = () => setCurrentlySpeakingId(null);

        window.speechSynthesis.speak(utterance);
    }, [currentlySpeakingId]);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    // Accessibility: Focus trap & Escape key
    useEffect(() => {
        if (!isOpen) {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                setCurrentlySpeakingId(null);
            }
            return;
        }
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

    // Toggle speech recognition
    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch {
                setIsListening(false);
            }
        }
    };

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

            // Auto-read aloud if TTS enabled
            if (ttsEnabled) {
                setTimeout(() => {
                    speakText(botReplyText, msgId);
                }, 200);
            }
        }, 400);
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

    const handleSendVoiceMessage = async (voiceText: string) => {
        const userMessage: Message = {
            id: createUniqueId(),
            text: voiceText,
            sender: "user",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        await processMessage(voiceText);
    };

    useEffect(() => {
        sendVoiceRef.current = handleSendVoiceMessage;
    });

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
        <div className="fixed bottom-6 right-6 z-40 font-sans">
            {/* Spotlight Prompt (Visible once on load when closed) */}
            <AnimatePresence>
                {!isOpen && showSpotlightPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
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
                            
                            <div className="flex items-center gap-1">
                                {/* Toggle auto speech */}
                                <button
                                    type="button"
                                    onClick={() => setTtsEnabled(!ttsEnabled)}
                                    className={`p-2 rounded-xl text-xs font-medium transition-all ${ttsEnabled ? "bg-white text-terracotta-700 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"}`}
                                    title={ttsEnabled ? "Désactiver la lecture vocale automatique" : "Activer la lecture vocale automatique"}
                                    aria-label={ttsEnabled ? "Désactiver la lecture vocale automatique" : "Activer la lecture vocale automatique"}
                                >
                                    {ttsEnabled ? "🔊 Voix ON" : "🔇 Voix OFF"}
                                </button>

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
                                        
                                        {/* Audio Playback button for bot messages */}
                                        {msg.sender === "bot" && (
                                            <button
                                                type="button"
                                                onClick={() => speakText(msg.text, msg.id)}
                                                className="mt-2 inline-flex items-center gap-1.5 text-xs text-terracotta-600 hover:text-terracotta-700 bg-cream-100 hover:bg-cream-200 px-2.5 py-1 rounded-full border border-terracotta-200 font-medium transition-colors"
                                                aria-label={currentlySpeakingId === msg.id ? "Arrêter la lecture" : "Écouter la réponse"}
                                            >
                                                {currentlySpeakingId === msg.id ? "⏹️ Arrêter" : "🔊 Écouter"}
                                            </button>
                                        )}

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
                                        <span className="text-xs text-charcoal-500 font-medium">L'assistant réfléchit...</span>
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

                        {/* Listening Indicator */}
                        {isListening && (
                            <div className="px-4 py-2 bg-terracotta-50 border-t border-terracotta-200 flex items-center justify-between text-xs text-terracotta-700 animate-pulse">
                                <span className="flex items-center gap-2 font-bold">
                                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                                    🎙️ Écoute en cours... Parlez maintenant
                                </span>
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className="font-bold underline text-terracotta-800"
                                >
                                    Annuler
                                </button>
                            </div>
                        )}

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
                                    className="flex-1 px-4 py-2.5 rounded-2xl border border-charcoal-200 bg-cream-50 text-charcoal-900 focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-200 text-sm placeholder:text-charcoal-400"
                                />

                                {/* Speech-to-Text Button */}
                                {speechSupported && (
                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={`p-2.5 rounded-2xl transition-all ${isListening ? "bg-red-500 text-white animate-bounce shadow-md" : "bg-cream-100 text-charcoal-700 hover:bg-terracotta-50 hover:text-terracotta-600 border border-charcoal-200"}`}
                                        title={isListening ? "Arrêter l'écoute" : "Poser une question à la voix (micro)"}
                                        aria-label={isListening ? "Arrêter l'écoute vocale" : "Parler au micro pour poser votre question"}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </button>
                                )}

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

            {/* Toggle Button (FAB with Spotlight Style) */}
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
