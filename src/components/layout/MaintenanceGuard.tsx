"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { initNetlifyIdentity, onAuthChange, openLoginWidget, logout, isAuthenticated, isAuthorized, NetlifyUser } from "@/lib/netlifyAuth";
import { EHPAD_INFO } from "@/lib/constants";

import SignupModal from "@/components/blog/SignupModal";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<NetlifyUser | null>(null);
    const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    useEffect(() => {
        console.log("MaintenanceGuard: Mounted");

        // Init Netlify Identity
        initNetlifyIdentity();

        // Check initial state
        let currentUser = null;
        let isAuth = false;

        try {
            if (isAuthenticated()) {
                currentUser = (window.netlifyIdentity?.currentUser() as NetlifyUser) || null;
                isAuth = isAuthorized();
            }
        } catch (e) {
            console.error("MaintenanceGuard: Error checking auth state", e);
        }

        console.log("MaintenanceGuard: Initial State", { currentUser, isAuth });

        setUser(currentUser);
        setIsAuthorizedUser(isAuth);
        setIsLoading(false);

        // Listen for changes
        const unsubscribe = onAuthChange((newUser) => {
            console.log("MaintenanceGuard: Auth Changed", newUser);
            setUser(newUser);
            const isNowAuthorized = !!newUser && isAuthorized();
            setIsAuthorizedUser(isNowAuthorized);
            setIsLoading(false);

            // Si l'utilisateur vient de se connecter, on ferme la modale
            if (newUser) {
                setIsSignupOpen(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-forest-200 border-t-forest-600"></div>
            </div>
        );
    }

    // Si l'utilisateur est autorisé (admin ou famille validée), on affiche le site
    if (isAuthorizedUser) {
        return <>{children}</>;
    }

    // Sinon, page de maintenance
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-cream-50 p-4 text-center font-sans">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-warm border border-cream-200">
                <div className="mb-6 relative w-24 h-24 mx-auto rounded-full overflow-hidden shadow-md">
                    <Image
                        src="/images/logo.png"
                        alt="Logo EHPAD"
                        fill
                        className="object-cover"
                    />
                </div>

                <h1 className="text-3xl font-serif text-charcoal-900 mb-2">Espace Privé</h1>
                <p className="text-terracotta-600 font-medium mb-6 uppercase tracking-widest text-sm">Accès Restreint</p>

                <div className="space-y-4 text-charcoal-600 mb-8">
                    <p>
                        L&apos;accès au site de l&apos;<strong>{EHPAD_INFO.fullName}</strong> est actuellement limité.
                    </p>
                    <p>
                        Veuillez vous identifier pour accéder au portail.
                    </p>
                </div>

                <div className="pt-6 border-t border-cream-100 flex flex-col gap-3">
                    {user ? (
                        <>
                            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-2">
                                Connecté en tant que <strong>{user.email}</strong>
                                <br />
                                <span className="text-xs opacity-75">(Compte en attente de validation Admin)</span>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="w-full py-2 px-4 border border-charcoal-200 text-charcoal-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                Se déconnecter
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => openLoginWidget("login")}
                                className="flex-1 py-2 px-4 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors shadow-sm font-medium"
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => setIsSignupOpen(true)}
                                className="flex-1 py-2 px-4 bg-white border border-forest-600 text-forest-600 rounded-lg hover:bg-forest-50 transition-colors font-medium"
                            >
                                Inscription
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <footer className="mt-8 text-charcoal-400 text-sm">
                &copy; 2025 {EHPAD_INFO.name}
            </footer>

            {/* Modale d'inscription personnalisée */}
            <SignupModal
                isOpen={isSignupOpen}
                onClose={() => setIsSignupOpen(false)}
                onSuccess={() => {
                    // Optionnel : afficher un message ou laisser la modale gérer son état "success"
                }}
            />
        </main>
    );
}
