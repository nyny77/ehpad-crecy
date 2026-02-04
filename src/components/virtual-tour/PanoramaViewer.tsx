"use client";

import { useEffect, useRef } from "react";

// On étend l'interface Window existante sans la redéclarer de zéro
declare global {
    interface Window {
        pannellum: any;
    }
}

interface PanoramaViewerProps {
    imagePath: string;
    previewPath?: string;
    title?: string;
    autoLoad?: boolean;
}

export default function PanoramaViewer({
    imagePath,
    previewPath,
    title = "Visite Virtuelle",
    autoLoad = true,
}: PanoramaViewerProps) {
    const viewerRef = useRef<HTMLDivElement>(null);
    const viewerInstance = useRef<any>(null);

    useEffect(() => {
        // Import dynamique pour éviter les erreurs SSR
        const initPannellum = async () => {
            // On s'assure que le composant est monté
            if (!viewerRef.current) return;

            // @ts-ignore - Pannellum does not have a proper ESM module
            const pannellum = (await import("pannellum")).default;

            // Nettoyage de l'instance précédente si elle existe
            if (viewerInstance.current) {
                // Pannellum n'a pas de méthode destroy facile, on vide le div
                if (viewerRef.current) viewerRef.current.innerHTML = "";
            }

            try {
                // @ts-ignore - Les types Pannellum sont parfois capricieux
                viewerInstance.current = (window as any).pannellum.viewer(viewerRef.current, {
                    type: "equirectangular",
                    panorama: imagePath,
                    preview: previewPath,
                    autoLoad: autoLoad,
                    autoRotate: -2,
                    compass: true,
                    title: title,
                    author: "EHPAD de Crécy",
                    hfov: 110,
                    pitch: 10,
                    yaw: 180,
                    showZoomCtrl: false,
                    mouseZoom: false,
                    keyboardZoom: false,
                    draggable: true,
                    showControls: true,
                });
            } catch (err) {
                console.error("Erreur initialisation Pannellum:", err);
            }
        };

        // On charge le CSS de pannellum dynamiquement ou via globals
        // Pour l'instant on suppose que le CSS est géré par l'import global ou ajouté au composant

        // Délai pour s'assurer que le DOM est prêt
        const timer = setTimeout(() => {
            // Solution de secours : utiliser window.pannellum si chargé via CDN, sinon import
            if (typeof window !== 'undefined') {
                // @ts-ignore
                if (window.pannellum) {
                    initPannellum();
                } else {
                    // Fallback si pas en global
                    initPannellum();
                }
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            // Cleanup logique si nécessaire
        };
    }, [imagePath, autoLoad, title, previewPath]);

    return (
        <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <div ref={viewerRef} className="w-full h-full absolute inset-0 bg-charcoal-100" />

            {/* Overlay instruction */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm z-10 flex items-center gap-2">
                <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Glissez pour visiter
            </div>
        </div>
    );
}
