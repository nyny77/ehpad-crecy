import React, { useState } from "react";
import { Play } from "lucide-react";
import Image from "@/components/ui/OptimizedImage";

interface LazyVideoProps {
    type: "iframe" | "local";
    src?: string;
    iframeSrc?: string;
    poster: string;
    title: string;
    captionsSrc?: string;
    className?: string;
}

export default function LazyVideo({ type, src, iframeSrc, poster, title, captionsSrc, className = "" }: LazyVideoProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative w-full h-full bg-charcoal-900 overflow-hidden flex justify-center items-center group ${className}`}>
            {!isLoaded ? (
                <button
                    type="button"
                    onClick={() => setIsLoaded(true)}
                    aria-label={`Lire la vidéo : ${title}`}
                    className="absolute inset-0 z-10 w-full cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-terracotta-400 focus-visible:ring-inset"
                >
                    <Image
                        src={poster}
                        alt=""
                        fill
                        className="object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-300"
                    />
                    <span className="absolute inset-0 flex items-center justify-center z-10" aria-hidden="true">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-terracotta-500/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-2" />
                        </div>
                    </span>
                </button>
            ) : (
                <>
                    {type === "iframe" && iframeSrc && (
                        <iframe 
                            src={iframeSrc}
                            title={title}
                            width="100%" 
                            height="100%" 
                            style={{ border: "none", overflow: "hidden" }} 
                            scrolling="no" 
                            frameBorder="0" 
                            allowFullScreen={true} 
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            className="w-full h-full absolute inset-0 z-10"
                        ></iframe>
                    )}
                    {type === "local" && src && (
                        <video 
                            src={src}
                            aria-label={title}
                            className="w-full h-full object-cover absolute inset-0 z-10"
                            controls
                            autoPlay
                            playsInline
                        >
                            {captionsSrc && (
                                <track kind="captions" src={captionsSrc} srcLang="fr" label="Français" default />
                            )}
                            Votre navigateur ne supporte pas la balise vidéo.
                        </video>
                    )}
                </>
            )}
        </div>
    );
}
