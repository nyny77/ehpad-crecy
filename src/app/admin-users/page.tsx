"use client";

import { useEffect, useState } from "react";
import { isAdmin, openLoginWidget } from "@/lib/netlifyAuth";
import PageHeader from "@/components/layout/PageHeader";
import { motion } from "framer-motion";

interface NetlifyUser {
    id: string;
    email: string;
    full_name?: string;
    user_metadata?: {
        full_name?: string;
    };
    app_metadata?: {
        roles?: string[];
    };
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<NetlifyUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [adminCheck, setAdminCheck] = useState(false);

    useEffect(() => {
        // Simple client-side check first
        if (!isAdmin()) {
            setLoading(false);
            return;
        }
        setAdminCheck(true);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = window.netlifyIdentity?.currentUser()?.token?.access_token;
            if (!token) throw new Error("Not authenticated");

            const res = await fetch("/.netlify/functions/admin-list-users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                if (res.status === 403) throw new Error("Accès refusé (Admin uniquement)");
                throw new Error("Erreur lors du chargement des utilisateurs");
            }

            const data = await res.json();
            // Ensure data is array
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                setUsers([]); // Fallback or handle error
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        if (!confirm("Voulez-vous valider cet utilisateur et lui envoyer un email ?")) return;

        setActionLoading(userId);
        try {
            const token = window.netlifyIdentity?.currentUser()?.token?.access_token;
            if (!token) throw new Error("Not authenticated");

            const res = await fetch("/.netlify/functions/admin-approve-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erreur lors de la validation");
            }

            alert(data.message || "Utilisateur validé avec succès !");
            fetchUsers(); // Refresh list

        } catch (err: any) {
            alert("Erreur: " + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    if (!adminCheck && !loading) {
        return (
            <div className="min-h-screen pt-32 text-center container-custom">
                <h1 className="text-2xl font-bold text-charcoal-900 mb-4">Accès Restreint</h1>
                <p className="mb-4">Cette page est réservée aux administrateurs.</p>
                <button
                    onClick={() => openLoginWidget()}
                    className="px-6 py-2 bg-terracotta-500 text-white rounded-full font-bold"
                >
                    Se connecter
                </button>
            </div>
        );
    }

    const pendingUsers = users.filter(u => !u.app_metadata?.roles?.length);
    const approvedUsers = users.filter(u => u.app_metadata?.roles?.length);

    return (
        <>
            <PageHeader
                title="Administration des Utilisateurs"
                subtitle="Gestion des accès"
                description="Validez les nouvelles inscriptions et gérez les accès à l'espace Vie Sociale."
                image="/images/global-hero.jpg"
                alt="Admin"
            />

            <section className="py-12 bg-cream-50 min-h-[50vh]">
                <div className="container-custom">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-serif font-bold text-charcoal-900">
                            Utilisateurs ({users.length})
                        </h2>
                        <button
                            onClick={fetchUsers}
                            className="text-sm font-medium text-terracotta-600 hover:underline"
                        >
                            Rafraîchir la liste
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-200">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-12 h-12 border-4 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin mx-auto" />
                            <p className="mt-4 text-charcoal-500">Chargement...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* PENDING USERS */}
                            <div>
                                <h3 className="text-lg font-bold text-amber-600 mb-4 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                                    En attente de validation ({pendingUsers.length})
                                </h3>

                                <div className="space-y-4">
                                    {pendingUsers.length === 0 ? (
                                        <p className="text-charcoal-400 italic">Aucune demande en attente.</p>
                                    ) : (
                                        pendingUsers.map(user => (
                                            <motion.div
                                                key={user.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white p-5 rounded-xl shadow-sm border border-amber-200"
                                            >
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h4 className="font-bold text-charcoal-900">
                                                            {user.user_metadata?.full_name || user.email}
                                                        </h4>
                                                        <p className="text-sm text-charcoal-500">{user.email}</p>
                                                        <p className="text-xs text-charcoal-400 mt-1">
                                                            Inscrit le {new Date(user.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleApprove(user.id)}
                                                        disabled={!!actionLoading}
                                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {actionLoading === user.id ? (
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                        Valider
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* APPROVED USERS */}
                            <div>
                                <h3 className="text-lg font-bold text-forest-600 mb-4 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-forest-500" />
                                    Validés / Membres ({approvedUsers.length})
                                </h3>

                                <div className="space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                                    {approvedUsers.map(user => (
                                        <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-cream-200 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium text-charcoal-900">
                                                    {user.user_metadata?.full_name || user.email}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-cream-100 text-charcoal-600 rounded-full">
                                                        {user.app_metadata?.roles?.join(", ")}
                                                    </span>
                                                    <span className="text-xs text-charcoal-400">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
