"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogIn, UserPlus, LogOut } from "lucide-react";
import { NAV_LINKS, EHPAD_INFO } from "@/lib/constants";
import { openLoginWidget, logout, initNetlifyIdentity, isAuthenticated, onAuthChange, NetlifyUser } from "@/lib/netlifyAuth";
import SignupModal from "@/components/auth/SignupModal";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<NetlifyUser | null>(null);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    useEffect(() => {
        initNetlifyIdentity();
        const cleanup = onAuthChange((currentUser) => {
            setUser(currentUser);
        });

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            cleanup();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled
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
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </motion.div>
                        </Link>

                        {/* Navigation Desktop */}
                        <div className="hidden lg:flex items-center gap-6">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative text-charcoal-700 hover:text-terracotta-500 font-medium transition-colors duration-300 group text-sm whitespace-nowrap"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta-500 transition-all duration-300 group-hover:w-full rounded-full" />
                                </Link>
                            ))}

                            {/* Auth Controls */}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                {user ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                                            {user.user_metadata?.full_name || user.email}
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="p-2 text-gray-500 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-full transition-all"
                                            title="Se déconnecter"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => openLoginWidget("login")}
                                            className="text-sm font-medium text-gray-600 hover:text-terracotta-600 transition-colors flex items-center gap-2"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Connexion
                                        </button>
                                        <button
                                            onClick={() => setIsSignupOpen(true)}
                                            className="text-sm font-medium px-4 py-2 bg-terracotta-100 text-terracotta-700 rounded-full hover:bg-terracotta-200 transition-colors flex items-center gap-2"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Inscription
                                        </button>
                                    </>
                                )}
                            </div>

                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(193, 119, 103, 0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap"
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
                            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-cream-200 mt-2 overflow-hidden"
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

                                {/* Mobile Auth */}
                                <div className="border-t border-gray-100 pt-4 mt-2 grid grid-cols-2 gap-3">
                                    {user ? (
                                        <button
                                            onClick={handleLogout}
                                            className="col-span-2 py-3 px-4 text-center rounded-xl bg-gray-100 text-gray-700 font-medium"
                                        >
                                            Se déconnecter
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    openLoginWidget("login");
                                                }}
                                                className="py-3 px-4 text-center rounded-xl bg-gray-50 text-gray-700 font-medium border border-gray-200"
                                            >
                                                Connexion
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    setIsSignupOpen(true);
                                                }}
                                                className="py-3 px-4 text-center rounded-xl bg-terracotta-100 text-terracotta-800 font-medium"
                                            >
                                                Inscription
                                            </button>
                                        </>
                                    )}
                                </div>

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

            <SignupModal
                isOpen={isSignupOpen}
                onClose={() => setIsSignupOpen(false)}
                onSignupSuccess={() => {
                    setIsSignupOpen(false);
                    // Optionally open login widget or show success message
                    // For now, let's open the login widget or just let them confirm email
                    alert("Inscription réussie ! Veuillez vérifier vos emails pour valider votre compte.");
                }}
            />
        </>
    );
}
