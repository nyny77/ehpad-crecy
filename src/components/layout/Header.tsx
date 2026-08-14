"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "@/components/ui/OptimizedImage";
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
                <nav className="flex items-center justify-between lg:justify-center gap-2 lg:gap-4">
                    {/* Logo with enhanced shadow */}
                    <Link href="/" className="group flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.08, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative flex-shrink-0 overflow-hidden rounded-full transition-all duration-500 shadow-lg ring-2 ring-white/50 dark:ring-charcoal-700/50 ${isScrolled ? "shadow-md" : "shadow-xl"
                                }`}
                            style={{ width: isScrolled ? 40 : 55, height: isScrolled ? 40 : 55 }}
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

                    {/* Desktop Navigation - Modern dropdown style */}
                    <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                        {NAV_LINKS.map((item) => {
                            const isActive = item.href ? isActiveLink(item.href) : item.subLinks?.some(sub => isActiveLink(sub.href));
                            return (
                                <div key={item.label} className="relative group">
                                    {item.href ? (
                                        <Link href={item.href} className="relative group">
                                            <motion.div
                                                className={`relative px-2 xl:px-3 py-1.5 rounded-full text-[12px] xl:text-[13px] font-medium transition-all duration-300 ${isActive
                                                    ? "text-white"
                                                    : "text-charcoal-700 hover:text-white"
                                                    }`}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span
                                                    className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive
                                                        ? ""
                                                        : "opacity-0 group-hover:opacity-100"
                                                        }`}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)'
                                                    }}
                                                />
                                                <span className="relative z-10 whitespace-nowrap">
                                                    {item.label}
                                                </span>
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
                                    ) : (
                                        <div className="relative group/btn cursor-default py-2">
                                            <motion.div
                                                className={`relative px-2 xl:px-3 py-1.5 rounded-full text-[12px] xl:text-[13px] font-medium transition-all duration-300 ${isActive
                                                    ? "text-white"
                                                    : "text-charcoal-700 hover:text-white"
                                                    }`}
                                                whileHover={{ y: -2 }}
                                            >
                                                <span
                                                    className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive
                                                        ? ""
                                                        : "opacity-0 group-hover:opacity-100"
                                                        }`}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)'
                                                    }}
                                                />
                                                <span className="relative z-10 whitespace-nowrap flex items-center gap-1">
                                                    {item.label}
                                                    <svg className="w-3 h-3 transition-transform duration-300 group-hover/btn:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                                {isActive && (
                                                    <motion.span
                                                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-terracotta-500 rounded-full"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>

                                            {/* Dropdown Menu */}
                                            {item.subLinks && (
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 min-w-[220px]">
                                                    <div className="bg-white/98 backdrop-blur-md rounded-xl shadow-xl border border-cream-100 overflow-hidden py-2 flex flex-col">
                                                        {item.subLinks.map(sub => (
                                                            <Link key={sub.href} href={sub.href} className={`px-4 py-2.5 text-[13px] xl:text-sm transition-colors hover:bg-cream-50 ${isActiveLink(sub.href) ? 'text-terracotta-600 bg-cream-50 font-bold' : 'text-charcoal-700'}`}>
                                                                {sub.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Admin Link - Text */}
                        <Link 
                            href="/administration"
                            className="ml-2 text-charcoal-500 hover:text-terracotta-600 transition-colors px-3 py-1.5 rounded-full hover:bg-cream-100 dark:hover:bg-charcoal-800 text-[12px] xl:text-[13px] font-medium flex items-center gap-1.5 border border-cream-200" 
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Administration
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

            {/* Mobile Menu - Accordion style */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-cream-50/98 dark:bg-charcoal-900/98 backdrop-blur-xl shadow-2xl border-t border-cream-200/50 dark:border-charcoal-700/50"
                    >
                        <div className="container-custom py-6 flex flex-col gap-2 max-h-[75vh] overflow-y-auto">
                            {NAV_LINKS.map((item, index) => {
                                const isActive = item.href ? isActiveLink(item.href) : item.subLinks?.some(sub => isActiveLink(sub.href));
                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        className="flex flex-col"
                                    >
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 py-3.5 px-5 text-lg font-medium rounded-xl transition-all duration-300 ${isActive
                                                    ? "bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-600 dark:text-terracotta-400"
                                                    : "text-charcoal-700 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-800"
                                                    }`}
                                            >
                                                {isActive && (
                                                    <span className="w-2 h-2 bg-terracotta-500 rounded-full" />
                                                )}
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <div className="flex flex-col">
                                                <div className={`font-serif text-xl font-bold py-3 text-charcoal-900 dark:text-cream-50 border-b border-cream-200/50 dark:border-charcoal-700/50 ${index > 0 ? "mt-4" : ""}`}>
                                                    {item.label}
                                                </div>
                                                <div className="flex flex-col gap-1 mt-2 pl-2 border-l-2 border-terracotta-100 dark:border-terracotta-900/50">
                                                    {item.subLinks?.map((sub) => (
                                                        <Link
                                                            key={sub.href}
                                                            href={sub.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={`py-2 px-3 text-base rounded-lg transition-colors ${isActiveLink(sub.href) ? "bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-600 dark:text-terracotta-400 font-medium" : "text-charcoal-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-charcoal-800"}`}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}

                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (NAV_LINKS.length) * 0.05 + 0.1, duration: 0.3 }}
                                className="pt-4 mt-2 border-t border-cream-200/50 dark:border-charcoal-700/50"
                            >
                                <div className="mt-2 flex justify-center">
                                    <Link 
                                        href="/administration"
                                        className="text-sm text-charcoal-400 hover:text-terracotta-600 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cream-100" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        ⚙️ Administration
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
