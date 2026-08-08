"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Paperclip, FileText } from "lucide-react";
import Link from "next/link";

interface EventWidgetProps {
    files: string[];
}

export default function EventWidget({ files }: EventWidgetProps) {
    // Filtrer ghef1.png si on le reçoit, car on le remplace par la vidéo
    const filteredFiles = files.filter(f => !f.toLowerCase().includes('ghef'));
    const remainingFile = filteredFiles[0];

    return (
        <div className="w-full flex flex-row overflow-x-auto snap-x snap-mandatory items-center gap-6 px-6 mt-12 pb-16 xl:contents z-20 relative pointer-events-auto xl:pointer-events-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            
            {/* Widget 1 : L'affiche restante (livret) sur la gauche */}
            {remainingFile && (
                <div className="flex-none w-[85vw] max-w-sm snap-center relative xl:w-auto xl:absolute xl:left-8 xl:top-1/2 xl:-translate-y-1/2 pointer-events-none flex justify-center py-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50, rotate: 0 }}
                        animate={{ opacity: 1, x: 0, rotate: -3 }}
                        transition={{ duration: 0.8, delay: 2.5, type: "spring" }}
                        className="pointer-events-auto relative bg-white p-4 pb-12 rounded-sm shadow-2xl hover:shadow-3xl transition-shadow w-full md:w-96 -rotate-3"
                        whileHover={{ scale: 1.1, rotate: 0, zIndex: 50 }}
                    >
                        {/* Trombone (Paperclip) */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-charcoal-500/80 rotate-12 z-30">
                            <Paperclip size={40} />
                        </div>
                        
                        {remainingFile.toLowerCase().endsWith('.pdf') ? (
                            <Link href={`/evenements/${remainingFile}`} target="_blank" className="block relative aspect-[3/4] bg-cream-50 border-2 border-dashed border-cream-200 flex flex-col items-center justify-center group overflow-hidden">
                                <FileText className="w-20 h-20 text-terracotta-400 group-hover:scale-110 transition-transform mb-6" />
                                <span className="text-charcoal-700 font-bold text-center px-4 group-hover:text-terracotta-500 transition-colors text-lg">
                                    Ouvrir le document (PDF)
                                </span>
                            </Link>
                        ) : (
                            <Link href={`/evenements/${remainingFile}`} target="_blank" className="block relative overflow-hidden border border-cream-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`/evenements/${remainingFile}`}
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
            )}

            {/* Widget 2 : La vidéo smartphone sur la droite */}
            <div className="flex-none w-[85vw] max-w-xs snap-center relative xl:w-auto xl:absolute xl:right-8 xl:top-1/2 xl:-translate-y-1/2 pointer-events-none flex justify-center py-6">
                <Link href="/histoire#videos" className="pointer-events-auto block cursor-pointer">
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotate: 0 }}
                        animate={{ opacity: 1, x: 0, rotate: 3 }}
                        transition={{ duration: 0.8, delay: 2.7, type: "spring" }}
                        className="relative bg-white p-2 border-[4px] border-cream-200 rounded-[2.5rem] shadow-2xl hover:shadow-3xl transition-shadow w-full md:w-72 rotate-3 group aspect-[9/16] overflow-hidden"
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
                    >
                        {/* Encoche "Notch" */}
                        <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
                            <div className="w-24 h-5 bg-cream-200 rounded-b-2xl pointer-events-none"></div>
                        </div>
                        
                        {/* Vidéo */}
                        <div className="relative w-full h-full bg-charcoal-900 rounded-[2rem] overflow-hidden">
                            <video 
                                src="/videos/balade-crecy.mp4"
                                className="w-full h-full object-cover pointer-events-none"
                                autoPlay
                                muted
                                loop
                                playsInline
                            ></video>
                        </div>

                        {/* Overlay sombre au survol pour inviter au clic */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10 rounded-[2rem] flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                                <svg className="w-6 h-6 text-terracotta-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>

                        <div className="absolute bottom-4 left-0 right-0 z-20 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="bg-white/95 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-charcoal-800 shadow-lg border border-white/50">
                                Voir avec le son
                            </span>
                        </div>
                    </motion.div>
                </Link>
            </div>
            
        </div>
    );
}
