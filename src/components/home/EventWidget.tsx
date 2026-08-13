"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "@/components/ui/OptimizedImage";
import { FileText, Paperclip } from "lucide-react";
import Link from "next/link";
import { getOptimizedImageSrc } from "@/lib/optimized-image";

interface EventWidgetProps {
    files: string[];
}

export default function EventWidget({ files }: EventWidgetProps) {
    const filteredFiles = files.filter((file) => !file.toLowerCase().includes("ghef"));
    const remainingFile = filteredFiles[0];
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    return (
        <div className="relative z-20 mt-12 flex w-full snap-x snap-mandatory flex-row items-center gap-6 overflow-x-auto px-6 pb-16 pointer-events-auto xl:contents xl:pointer-events-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {remainingFile && (
                <div className="pointer-events-none relative flex w-[85vw] max-w-sm flex-none snap-center justify-center py-6 xl:absolute xl:left-8 xl:top-1/2 xl:w-auto xl:-translate-y-1/2">
                    <motion.div
                        initial={{ opacity: 0, x: -50, rotate: 0 }}
                        animate={{ opacity: 1, x: 0, rotate: -3 }}
                        transition={{ duration: 0.8, delay: 2.5, type: "spring" }}
                        className="pointer-events-auto relative w-full -rotate-3 rounded-sm bg-white p-4 pb-12 shadow-2xl transition-shadow hover:shadow-3xl md:w-96"
                        whileHover={{ scale: 1.1, rotate: 0, zIndex: 50 }}
                    >
                        <div className="absolute -top-5 left-1/2 z-30 -translate-x-1/2 rotate-12 text-charcoal-500/80">
                            <Paperclip size={40} />
                        </div>

                        {remainingFile.toLowerCase().endsWith(".pdf") ? (
                            <Link href={`/evenements/${remainingFile}`} target="_blank" className="group relative flex aspect-[3/4] flex-col items-center justify-center overflow-hidden border-2 border-dashed border-cream-200 bg-cream-50">
                                <FileText className="mb-6 h-20 w-20 text-terracotta-400 transition-transform group-hover:scale-110" />
                                <span className="px-4 text-center text-lg font-bold text-charcoal-700 transition-colors group-hover:text-terracotta-500">
                                    Ouvrir le document (PDF)
                                </span>
                            </Link>
                        ) : (
                            <Link href={`/evenements/${remainingFile}`} target="_blank" className="block overflow-hidden border border-cream-100">
                                <img
                                    src={getOptimizedImageSrc(`/evenements/${remainingFile}`)}
                                    alt="Événement EHPAD"
                                    loading="lazy"
                                    className="h-auto w-full object-contain transition-transform duration-500 hover:scale-105"
                                />
                            </Link>
                        )}

                        <div className="absolute bottom-3 left-0 w-full text-center">
                            <span className="font-serif text-base italic text-charcoal-500">À la une</span>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="pointer-events-none relative flex w-[85vw] max-w-xs flex-none snap-center justify-center py-6 xl:absolute xl:right-8 xl:top-1/2 xl:w-auto xl:-translate-y-1/2">
                <motion.div
                    initial={{ opacity: 0, x: 50, rotate: 0 }}
                    animate={{ opacity: 1, x: 0, rotate: 3 }}
                    transition={{ duration: 0.8, delay: 2.7, type: "spring" }}
                    className="group pointer-events-auto relative aspect-[9/16] w-full rotate-3 overflow-hidden rounded-[2.5rem] border-[4px] border-cream-200 bg-white p-2 shadow-2xl transition-shadow hover:shadow-3xl md:w-72"
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
                >
                    <div className="absolute inset-x-0 top-0 z-20 flex h-5 justify-center">
                        <div className="h-5 w-24 rounded-b-2xl bg-cream-200" />
                    </div>

                    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-charcoal-900">
                        {isVideoPlaying ? (
                            <video
                                src="/videos/balade-crecy.mp4"
                                className="h-full w-full object-cover"
                                autoPlay
                                controls
                                playsInline
                                preload="metadata"
                            >
                                Votre navigateur ne supporte pas la vidéo.
                            </video>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsVideoPlaying(true)}
                                className="relative h-full w-full cursor-pointer"
                                aria-label="Lire la balade vidéo avec le son"
                            >
                                <Image
                                    src="/images/history/canal.jpg"
                                    alt="Aperçu de la balade à Crécy-la-Chapelle"
                                    fill
                                    sizes="(max-width: 768px) 85vw, 288px"
                                    className="object-cover"
                                />
                                <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform group-hover:scale-110">
                                        <svg className="ml-1 h-8 w-8 text-terracotta-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </span>
                                </span>
                                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-charcoal-800 shadow-lg">
                                    Lire avec le son
                                </span>
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
