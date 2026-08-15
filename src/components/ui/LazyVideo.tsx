import React, { useState } from "react";
import { Play } from "lucide-react";
import Image from "@/components/ui/OptimizedImage";

interface LazyVideoProps {
    type: "iframe" | "local";
    src?: string;
    iframeSrc?: string;
    poster: string;
    title: string;
    className?: string;
}

export default function LazyVideo({ type, src, iframeSrc, poster, title, className = "" }: LazyVideoProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div 
            className={`relative w-full h-full bg-charcoal-900 overflow-hidden flex justify-center items-center cursor-pointer group ${className}`}
            onClick={() => setIsLoaded(true)}
        >
            {!isLoaded ? (
                <>
                    <Image
                        src={poster}
                        alt={title}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-terracotta-500/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-2" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {type === "iframe" && iframeSrc && (
                        <iframe 
                            src={iframeSrc}
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
                            className="w-full h-full object-cover absolute inset-0 z-10"
                            controls
                            autoPlay
                            playsInline
                        >
                            Votre navigateur ne supporte pas la balise vidéo.
                        </video>
                    )}
                </>
            )}
        </div>
    );
}
