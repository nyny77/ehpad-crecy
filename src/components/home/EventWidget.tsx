"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Paperclip, FileText } from "lucide-react";
import Link from "next/link";

interface EventWidgetProps {
    files: string[];
}

export default function EventWidget({ files }: EventWidgetProps) {
    if (!files || files.length === 0) return null;

    return (
        <div className="w-full flex flex-col items-center gap-16 mt-16 pb-24 xl:contents xl:mt-0 xl:pb-0 z-20 relative">
            {files.slice(0, 2).map((file, index) => {
                const isPdf = file.toLowerCase().endsWith('.pdf');
                // The first file goes on the left, the second on the right
                const sideClass = index === 0 ? "xl:left-8" : "xl:right-8";
                const rotationClass = index === 0 ? "-rotate-3" : "rotate-3";
                const rotationValue = index === 0 ? -3 : 3;
                const delay = 2.5 + (index * 0.2);

                return (
                    <div key={file} className={`flex flex-col relative xl:absolute ${sideClass} xl:top-1/2 xl:-translate-y-1/2 pointer-events-none`}>
                        <motion.div
                            initial={{ opacity: 0, x: index === 0 ? -50 : 50, rotate: 0 }}
                            animate={{ opacity: 1, x: 0, rotate: rotationValue }}
                            transition={{ duration: 0.8, delay, type: "spring" }}
                            className={`pointer-events-auto relative bg-white p-4 pb-12 rounded-sm shadow-2xl hover:shadow-3xl transition-shadow w-80 md:w-96 ${rotationClass}`}
                            whileHover={{ scale: 1.1, rotate: 0, zIndex: 50 }}
                        >
                            {/* Trombone (Paperclip) */}
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-charcoal-500/80 rotate-12 z-30">
                                <Paperclip size={40} />
                            </div>
                            
                            {isPdf ? (
                                <Link href={`/evenements/${file}`} target="_blank" className="block relative aspect-[3/4] bg-cream-50 border-2 border-dashed border-cream-200 flex flex-col items-center justify-center group overflow-hidden">
                                    <FileText className="w-20 h-20 text-terracotta-400 group-hover:scale-110 transition-transform mb-6" />
                                    <span className="text-charcoal-700 font-bold text-center px-4 group-hover:text-terracotta-500 transition-colors text-lg">
                                        Ouvrir le document (PDF)
                                    </span>
                                </Link>
                            ) : (
                                <Link href={`/evenements/${file}`} target="_blank" className="block relative overflow-hidden border border-cream-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`/evenements/${file}`}
                                        alt="Événement EHPAD"
                                        className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                            )}
                            <div className="absolute bottom-3 left-0 w-full text-center">
                                <span className="font-serif italic text-charcoal-500 text-base">À la une</span>
                            </div>
                        </motion.div>
                    </div>
                );
            })}
        </div>
    );
}
