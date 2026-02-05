"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, EHPAD_INFO } from "@/lib/constants";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        // Détection du mode sombre
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
        };
        checkDarkMode();

        // Observer les changements de classe sur <html>
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 py-4 ${isScrolled ? "py-2" : "py-4"}`}
        >
            {/* Unified Background Layer */}
            <div
                className={`absolute inset-0 z-[-1] transition-all duration-500 backdrop-blur-md shadow-sm ${isScrolled ? "bg-white/95 shadow-lg" : "bg-cream-100/80"
                    }`}
                style={{
                    // This creates the "single block" effect by extending the background area
                    // The wave below is just a visual extension of this block
                }}
            >
                {/* Visual Wave Extension - Only visible when not scrolled or explicitly requested */}
                <div
                    className={`absolute bottom-0 left-0 w-full translate-y-[99%] overflow-hidden transition-opacity duration-500 ${isScrolled ? "opacity-0" : "opacity-100"}`}
                    style={{ height: '5rem' }} // Fixed height container for the wave
                >
                    {/* 
                       We use the exact same background color for the wave fill.
                       Because the parent has opacity, we need to be careful. 
                       Actually, to get a true "single block" with transparency, the best way 
                       is to NOT have the wave separate.
                       BUT, since we are using Tailwind classes like bg-cream-100/80, 
                       we can simulate continuity by using the same color.
                       
                       However, to avoid the overlap line, we will use the "Negative Margin" 
                       trick with a slightly overlapping SVG but filled with the SAME CURRENT COLOR 
                       (calculated or hardcoded). 
                       
                       Wait, if parent is bg-cream-100/80, it has alpha. 
                       If child is fill-current (which is cream-100/80), 
                       Overlap = Darker.
                       
                       FIX: We use an opaque fill here, but that won't match the parent's alpha.
                       
                       BETTER FIX implemented below: 
                       The parent (Unified Layer above) should be TRANSPARENT background.
                       It should contain TWO children: Rect and Wave.
                       Both children are OPAQUE.
                       The PARENT has opacity 0.8.
                    */}
                </div>
            </div>

            {/* REAL IMPLEMENTATION RE-WRITE BELOW TO MATCH THE LOGIC DESCRIBED */}

            <div className={`absolute inset-0 z-[-1] transition-all duration-500 ${isScrolled ? "shadow-lg" : ""}`}>
                {/* Opacity Wrapper */}
                <div className={`w-full h-full relative transition-all duration-500 opacity-100`}>

                    {/* Main Header Rect - OPAQUE */}
                    <div className={`absolute inset-0 ${isScrolled ? "bg-white" : "bg-cream-100"}`} />

                    {/* Wave - OPAQUE */}
                    <div className={`absolute bottom-0 left-0 w-full translate-y-[98%] transition-opacity duration-500 opacity-100`}>
                        <svg
                            className="w-full h-12 sm:h-16 md:h-20"
                            viewBox="0 0 1440 100"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                style={{ fill: isDarkMode ? "#252529" : (isScrolled ? "#FFFFFF" : "#FDF7F0") }}
                                className="transition-colors duration-500"
                                d="M0,0 L0,50 Q360,100 720,50 T1440,50 L1440,0 L0,0 Z"
                            />
                            {/* Raspberry Red Border - Bottom Only */}
                            <path
                                fill="none"
                                stroke="#C80040"
                                strokeWidth="4"
                                d="M0,50 Q360,100 720,50 T1440,50"
                            />
                        </svg>
                    </div>
                </div>

                {/* Separate Blur Layer (optional, hard to mask perfectly, applying to rect only for now or global if possible) 
                    If we want blur on the wave, it's complex. Let's stick to the color block first.
                */}
                <div className="absolute inset-0 backdrop-blur-sm -z-20 pointer-events-none" />
            </div>
            <div className="container-custom">
                <nav className="flex items-center justify-between lg:justify-center gap-4 lg:gap-16">
                    {/* Logo + Nom */}
                    <Link href="/" className="group flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative flex-shrink-0 overflow-hidden rounded-full shadow-md transition-all duration-500"
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
                                className="relative text-charcoal-700 dark:text-cream-100 hover:text-terracotta-500 dark:hover:text-terracotta-400 font-medium transition-colors duration-300 group text-sm whitespace-nowrap"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta-500 dark:bg-terracotta-400 transition-all duration-300 group-hover:w-full rounded-full" />
                            </Link>
                        ))}

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
