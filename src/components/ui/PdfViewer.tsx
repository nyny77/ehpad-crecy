"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";

interface PdfViewerProps {
    src: string;
    title: string;
    className?: string;
}

export default function PdfViewer({ src, title, className = "" }: PdfViewerProps) {
    const [isAppleMobile, setIsAppleMobile] = useState<boolean | null>(null);
    const viewerSrc = src.includes("#") ? src : `${src}#view=Fit`;

    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent)
            || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        setIsAppleMobile(isIOS);
    }, []);

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

            {isAppleMobile === null ? (
                <div role="status" className="flex flex-1 items-center justify-center p-8 text-center text-charcoal-600">
                    Préparation du lecteur PDF…
                </div>
            ) : isAppleMobile ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-cream-50 p-8 text-center">
                    <div aria-hidden="true" className="text-6xl">📄</div>
                    <div className="max-w-xl">
                        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Consulter toutes les pages sur iPhone ou iPad</h2>
                        <p className="mt-3 text-charcoal-700">
                            Sur iPhone et iPad, les navigateurs peuvent afficher seulement une partie des PDF intégrés. Ouvrez le document en plein écran pour parcourir toutes ses pages.
                        </p>
                    </div>
                    <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta-600 px-6 py-3 font-bold text-white shadow-lg"
                    >
                        <ExternalLink aria-hidden="true" className="h-5 w-5" />
                        Afficher toutes les pages
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
