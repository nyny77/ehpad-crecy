"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";

interface PdfViewerProps {
    src: string;
    title: string;
    className?: string;
}

export default function PdfViewer({ src, title, className = "" }: PdfViewerProps) {
    const [mobilePlatform, setMobilePlatform] = useState<"ios" | "android" | "other" | null>(null);
    const viewerSrc = src.includes("#") ? src : `${src}#view=Fit`;

    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent)
            || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isTouchScreen = window.matchMedia("(pointer: coarse)").matches;
        const isNarrowScreen = window.matchMedia("(max-width: 1024px)").matches;

        setMobilePlatform(isIOS ? "ios" : isAndroid ? "android" : isTouchScreen && isNarrowScreen ? "other" : null);
    }, []);

    const isMobile = mobilePlatform !== null;
    const deviceLabel = mobilePlatform === "ios" ? "iPhone ou iPad" : mobilePlatform === "android" ? "téléphone ou tablette Android" : "appareil mobile";

    return (
        <section className={`flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white ${className}`} aria-label={title}>
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-charcoal-200 bg-white px-3 py-2">
                <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta-600 px-4 py-2 text-sm font-semibold text-white"
                >
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    Ouvrir le PDF complet
                </a>
                <a
                    href={src}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-charcoal-600 bg-white px-4 py-1.5 text-sm font-semibold text-charcoal-700"
                >
                    <Download aria-hidden="true" className="h-4 w-4" />
                    Télécharger
                </a>
            </div>

            {isMobile ? (
                <div className="flex min-h-[430px] flex-1 flex-col items-center justify-center gap-5 bg-cream-50 p-5 text-center sm:p-8">
                    <div aria-hidden="true" className="text-5xl sm:text-6xl">📄</div>
                    <div className="max-w-xl">
                        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Lire le document sur votre {deviceLabel}</h2>
                        <p className="mt-3 text-charcoal-700">
                            L’aperçu intégré est désactivé sur mobile car il peut masquer des pages. Ouvrez le PDF directement pour utiliser le lecteur complet de votre appareil.
                        </p>
                        {mobilePlatform === "android" && (
                            <p className="mt-2 text-sm text-charcoal-600">Si le document est téléchargé, ouvrez-le depuis la notification ou le dossier Téléchargements.</p>
                        )}
                    </div>
                    <a
                        href={src}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta-600 px-6 py-3 font-bold text-white shadow-lg"
                    >
                        <ExternalLink aria-hidden="true" className="h-5 w-5" />
                        Lire toutes les pages
                    </a>
                    <a href={src} download className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-charcoal-600 bg-white px-6 py-2.5 font-semibold text-charcoal-700">
                        <Download aria-hidden="true" className="h-5 w-5" />
                        Télécharger le PDF
                    </a>
                </div>
            ) : (
                <iframe
                    src={viewerSrc}
                    className="min-h-[500px] w-full flex-1 border-none bg-white md:min-h-0"
                    title={title}
                />
            )}
        </section>
    );
}
