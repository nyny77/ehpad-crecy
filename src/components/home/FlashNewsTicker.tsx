"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import flashData from "../../../content/flash.json"; // Import direct du JSON modifié par le CMS

export default function FlashNewsTicker() {
    if (!flashData.active) return null;

    return (
        <div className="bg-gradient-to-r from-terracotta-500 to-terracotta-400 text-white overflow-hidden py-3 relative z-50 shadow-md">
            <div className="flex whitespace-nowrap">
                {/* Animation de défilement infinie */}
                <motion.div
                    className="flex gap-16 min-w-full"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20, // Vitesse de défilement
                        ease: "linear",
                    }}
                >
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="font-bold bg-cream-50 text-terracotta-500 text-xs px-2 py-0.5 rounded uppercase tracking-wider">
                                Flash Info
                            </span>
                            {flashData.link ? (
                                <Link
                                    href={flashData.link}
                                    className="hover:underline text-lg font-bold !text-white"
                                    style={{ color: 'white' }}
                                >
                                    {flashData.message}
                                </Link>
                            ) : (
                                <span
                                    className="text-lg font-bold !text-white"
                                    style={{ color: 'white' }}
                                >
                                    {flashData.message}
                                </span>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
