"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, EHPAD_INFO } from "@/lib/constants";
import {
    isAuthenticated,
    isAdmin,
    logout,
    openLoginWidget,
    onAuthChange,
    initNetlifyIdentity,
    getCurrentUser,
    NetlifyUser
} from "@/lib/netlifyAuth";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<NetlifyUser | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isAdminUser, setIsAdminUser] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        // Init Auth
        initNetlifyIdentity();
        setUser(getCurrentUser());
        setIsAdminUser(isAdmin());

        const unsubscribe = onAuthChange((currentUser) => {
            setUser(currentUser);
            setIsAdminUser(isAdmin());
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            unsubscribe();
        };
    }, []);

    const handleLogin = () => {
        openLoginWidget("login");
        setIsMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
        setIsAdminUser(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
                : "bg-cream-100/80 backdrop-blur-sm py-4"
                }`}
        >
            <div className="container-custom">
                <nav className="flex items-center justify-between">
                    {/* Logo + Nom */}
                    <Link href="/" className="group flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative flex-shrink-0 overflow-hidden rounded-full shadow-md"
                            style={{ width: isScrolled ? 55 : 70, height: isScrolled ? 55 : 70 }}
                        >
                            <Image
                                src="/images/logo.png"
                                alt="EHPAD de Crécy"
                                fill
                                className="object-cover object-center transition-all duration-300"
                                priority
                            />
                        </motion.div>
                        <div className={`hidden sm:flex flex-col transition-all duration-300 ${isScrolled ? 'opacity-0 w-0' : 'opacity-100'}`}>
                            <span className="font-serif text-xl md:text-2xl font-semibold text-charcoal-900 leading-tight">
                                {EHPAD_INFO.name}
                            </span>
                            <span className="text-xs text-terracotta-500 font-medium tracking-wide">
                                {EHPAD_INFO.address.region}
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Desktop */}
                    <div className="hidden lg:flex items-center gap-6">
                        {NAV_LINKS.filter(link => link.href !== '/contact').map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative text-charcoal-700 hover:text-terracotta-500 font-medium transition-colors duration-300 group text-sm whitespace-nowrap"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta-500 transition-all duration-300 group-hover:w-full rounded-full" />
                            </Link>
                        ))}

                        {/* Login / User Menu Button */}
                        <div className="relative">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 px-4 py-2 bg-cream-200 text-charcoal-800 rounded-full hover:bg-cream-300 transition-colors text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Mon Compte</span>
                                        <svg className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-cream-200 overflow-hidden py-1 z-50"
                                            >
                                                <div className="px-4 py-2 border-b border-cream-100">
                                                    <p className="text-xs text-charcoal-500">Connecté en tant que</p>
                                                    <p className="text-sm font-semibold text-charcoal-900 truncate">{user.user_metadata?.full_name || user.email}</p>
                                                </div>

                                                <Link
                                                    href="/vie-sociale"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-cream-50 hover:text-terracotta-600"
                                                >
                                                    Accéder à la Vie Sociale
                                                </Link>

                                                {isAdminUser && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-cream-50 hover:text-terracotta-600"
                                                    >
                                                        Administration (CMS)
                                                    </Link>
                                                )}

                                                <div className="border-t border-cream-100 mt-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleLogout();
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                                    >
                                                        Déconnexion
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="flex items-center gap-2 px-4 py-2 border border-charcoal-200 text-charcoal-700 rounded-full hover:border-terracotta-500 hover:text-terracotta-500 transition-colors text-sm font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Espace Famille & Admin
                                </button>
                            )}
                            {/* Overlay to close user menu when clicking outside */}
                            {isUserMenuOpen && (
                                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                            )}
                        </div>

                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(193, 119, 103, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary text-sm px-5 py-2.5"
                            >
                                Nous rencontrer
                            </motion.button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/50 rounded-full"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menu"
                    >
                        <motion.span
                            animate={{
                                rotate: isMobileMenuOpen ? 45 : 0,
                                y: isMobileMenuOpen ? 8 : 0,
                            }}
                            className="w-5 h-0.5 bg-charcoal-900 rounded-full origin-center"
                        />
                        <motion.span
                            animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                            className="w-5 h-0.5 bg-charcoal-900 rounded-full"
                        />
                        <motion.span
                            animate={{
                                rotate: isMobileMenuOpen ? -45 : 0,
                                y: isMobileMenuOpen ? -8 : 0,
                            }}
                            className="w-5 h-0.5 bg-charcoal-900 rounded-full origin-center"
                        />
                    </button>
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden bg-white/95 backdrop-blur-md border-t border-cream-200 mt-2"
                    >
                        <div className="container-custom py-6 flex flex-col gap-3">
                            {NAV_LINKS.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-3 px-4 text-lg font-medium text-charcoal-700 hover:text-terracotta-500 hover:bg-cream-100 rounded-xl transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile Auth Button */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: NAV_LINKS.length * 0.08 }}
                                className="px-4 py-2"
                            >
                                {user ? (
                                    <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-terracotta-100 rounded-full flex items-center justify-center text-terracotta-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-charcoal-900 text-sm">{user.user_metadata?.full_name || user.email}</p>
                                                <p className="text-xs text-charcoal-500">Connecté</p>
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Link href="/vie-sociale" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-center bg-white border border-charcoal-200 rounded-lg text-charcoal-700 font-medium text-sm">
                                                Vie Sociale
                                            </Link>
                                            {isAdminUser && (
                                                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-center bg-terracotta-100 text-terracotta-700 rounded-lg font-medium text-sm">
                                                    Administration
                                                </Link>
                                            )}
                                            <button onClick={handleLogout} className="w-full py-2 text-center text-red-500 font-medium text-sm">
                                                Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleLogin}
                                        className="w-full py-3 border border-charcoal-300 rounded-xl flex items-center justify-center gap-2 text-charcoal-700 font-medium hover:bg-charcoal-50 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Connexion Famille & Admin
                                    </button>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (NAV_LINKS.length + 1) * 0.08 }}
                                className="pt-2"
                            >
                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="btn-primary w-full text-lg py-4">
                                        Nous rencontrer
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
