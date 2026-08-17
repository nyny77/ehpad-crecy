import React, { useState, useEffect } from 'react';
import { adminFetchBlob } from '@/lib/admin-api';

interface AdminImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    photoUrl: string;
    onUrlLoaded?: (url: string) => void;
}

export default function AdminImage({ photoUrl, onUrlLoaded, ...props }: AdminImageProps) {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;
        
        // Rétro-compatibilité : ancienne URL publique
        if (photoUrl.startsWith('/')) {
            setObjectUrl(photoUrl);
            if (onUrlLoaded) onUrlLoaded(photoUrl);
            return;
        }

        const load = async () => {
            try {
                // Fetch image via admin API (includes auth token)
                const res = await adminFetchBlob(`/.netlify/functions/admin-get-image?key=${encodeURIComponent(photoUrl)}`, undefined);
                if (active) {
                    const url = URL.createObjectURL(res);
                    setObjectUrl(url);
                    if (onUrlLoaded) onUrlLoaded(url);
                }
            } catch (err) {
                if (active) setError(true);
            }
        };
        
        load();

        return () => {
            active = false;
            if (objectUrl && !objectUrl.startsWith('/')) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [photoUrl, onUrlLoaded]);

    if (error) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cream-400 bg-cream-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <span className="text-xs font-medium text-center px-2">Erreur<br/>de chargement</span>
            </div>
        );
    }

    if (!objectUrl) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-50">
                <div className="w-6 h-6 border-2 border-terracotta-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <img src={objectUrl} {...props} />;
}
