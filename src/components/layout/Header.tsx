"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
        };
        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    const isActiveLink = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? "py-1" : "py-2"}`}>
            {/* Background with enhanced glassmorphism */}
            <div className={`absolute inset-0 z-[-1] transition-all duration-500 ${isScrolled ? "shadow-xl" : ""}`}>
                <div className="w-full h-full relative">
                    {/* Main Header Background - SOLID CREAM */}
                    <div
                        className={`absolute inset-0 transition-all duration-500 backdrop-blur-md ${isScrolled
                            ? "bg-[#FDF7F0]"
                            : "bg-[#FDF7F0]"
                            }`}
                    />

                    {/* Wave decoration */}
                    <div className={`absolute bottom-0 left-0 w-full translate-y-[98%] transition-all duration-500 ${isScrolled ? "opacity-0 scale-y-0" : "opacity-100 scale-y-100"}`}>
                        <svg
                            className="w-full h-10 sm:h-14 md:h-16"
                            viewBox="0 0 1440 100"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="headerWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#85002A" />
                                    <stop offset="50%" stopColor="#C80040" />
                                    <stop offset="100%" stopColor="#FF85A3" />
                                </linearGradient>
                            </defs>
                            <path
                                style={{ fill: isDarkMode ? "#252529" : "#FDF7F0" }}
                                className="transition-colors duration-500"
                                d="M0,0 L0,50 Q360,100 720,50 T1440,50 L1440,0 L0,0 Z"
                            />
                            <motion.path
                                key={pathname}
                                fill="none"
                                stroke="url(#headerWaveGradient)"
                                strokeWidth="30"
                                d="M0,50 Q360,100 720,50 T1440,50"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 2.5,
                                    ease: "easeInOut"
                                }}
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="container-custom">
                <nav className="flex items-center justify-between lg:justify-center gap-4 lg:gap-8">
                    {/* Logo with enhanced shadow */}
                    <Link href="/" className="group flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.08, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative flex-shrink-0 overflow-hidden rounded-full transition-all duration-500 shadow-lg ring-2 ring-white/50 dark:ring-charcoal-700/50 ${isScrolled ? "shadow-md" : "shadow-xl"
                                }`}
                            style={{ width: isScrolled ? 50 : 65, height: isScrolled ? 50 : 65 }}
                        >
                            <Image
                                src="/images/logo.png"
                                alt="EHPAD de Crécy"
                                fill
                                className="object-cover object-center transition-all duration-300"
                                priority
                                sizes="80px"
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation - Modern pill style */}
                    <div className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = isActiveLink(link.href);
                            return (
                                <Link key={link.href} href={link.href} className="relative group">
                                    <motion.div
                                        className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                            ? "text-white"
                                            : "text-charcoal-700 hover:text-white"
                                            }`}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {/* Hover/Active background - pill style with gradient */}
                                        <span
                                            className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive
                                                ? ""
                                                : "opacity-0 group-hover:opacity-100"
                                                }`}
                                            style={{
                                                background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)'
                                            }}
                                        />

                                        {/* Link text */}
                                        <span className="relative z-10 whitespace-nowrap">
                                            {link.label}
                                        </span>

                                        {/* Active indicator dot */}
                                        {isActive && (
                                            <motion.span
                                                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-terracotta-500 rounded-full"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}

                        {/* CTA Button - Enhanced with gradient and animation */}
                        <Link href="/contact" className="ml-3">
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 8px 30px rgba(200, 0, 64, 0.35)'
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="relative overflow-hidden px-6 py-2.5 rounded-full text-sm font-semibold text-white shadow-lg transition-all duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)',
                                }}
                            >
                                {/* Animated shine effect */}
                                <motion.span
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "200%" }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                        ease: "easeInOut"
                                    }}
                                />
                                <span className="relative z-10 whitespace-nowrap">Nous rencontrer</span>
                            </motion.button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button - Enhanced */}
                    <motion.button
                        className={`lg:hidden relative w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-full transition-all duration-300 ${isMobileMenuOpen
                            ? "bg-terracotta-500 shadow-lg"
                            : "bg-cream-50/80 dark:bg-charcoal-800/80 shadow-md hover:shadow-lg"
                            }`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Menu"
                    >
                        <motion.span
                            animate={{
                                rotate: isMobileMenuOpen ? 45 : 0,
                                y: isMobileMenuOpen ? 7 : 0,
                                backgroundColor: isMobileMenuOpen ? "#ffffff" : "#1a1a1a",
                            }}
                            className="w-5 h-0.5 rounded-full origin-center"
                        />
                        <motion.span
                            animate={{
                                opacity: isMobileMenuOpen ? 0 : 1,
                                scaleX: isMobileMenuOpen ? 0 : 1,
                            }}
                            className="w-5 h-0.5 bg-charcoal-900 dark:bg-cream-100 rounded-full"
                        />
                        <motion.span
                            animate={{
                                rotate: isMobileMenuOpen ? -45 : 0,
                                y: isMobileMenuOpen ? -7 : 0,
                                backgroundColor: isMobileMenuOpen ? "#ffffff" : "#1a1a1a",
                            }}
                            className="w-5 h-0.5 rounded-full origin-center"
                        />
                    </motion.button>
                </nav>
            </div>

            {/* Mobile Menu - Enhanced */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-cream-50/98 dark:bg-charcoal-900/98 backdrop-blur-xl shadow-2xl border-t border-cream-200/50 dark:border-charcoal-700/50"
                    >
                        <div className="container-custom py-6 flex flex-col gap-2">
                            {NAV_LINKS.map((link, index) => {
                                const isActive = isActiveLink(link.href);
                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 py-3.5 px-5 text-lg font-medium rounded-xl transition-all duration-300 ${isActive
                                                ? "bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-600 dark:text-terracotta-400"
                                                : "text-charcoal-700 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-800"
                                                }`}
                                        >
                                            {isActive && (
                                                <span className="w-2 h-2 bg-terracotta-500 rounded-full" />
                                            )}
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (NAV_LINKS.length) * 0.05 + 0.1, duration: 0.3 }}
                                className="pt-4 mt-2 border-t border-cream-200/50 dark:border-charcoal-700/50"
                            >
                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button
                                        className="w-full py-4 rounded-xl text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                                        style={{
                                            background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)',
                                        }}
                                    >
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
