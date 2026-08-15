import { useState, useEffect } from "react";
import { Users, UserPlus, KeyRound, Trash2, RefreshCw, LoaderCircle } from "lucide-react";
import type { Resident } from "../../../../netlify/functions/admin-residents";
import { adminFetch } from "@/lib/admin-api";

export default function ResidentManager() {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Add form state
    const [newName, setNewName] = useState("");
    const [newRoom, setNewRoom] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchResidents = async () => {
        setLoading(true);
        try {
            const data = await adminFetch<{ residents: Resident[] }>("/.netlify/functions/admin-residents");
            setResidents(data.residents || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setIsAdding(true);
        try {
            const data = await adminFetch<{ residents: Resident[] }>("/.netlify/functions/admin-residents", {
                method: "POST",
                body: JSON.stringify({ action: "add", name: newName, room: newRoom })
            });
            setResidents(data.residents);
            setNewName("");
            setNewRoom("");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Voulez-vous vraiment supprimer le dossier de ${name} et son code d'accès ?`)) return;
        try {
            await adminFetch("/.netlify/functions/admin-residents", {
                method: "POST",
                body: JSON.stringify({ action: "delete", id })
            });
            setResidents(residents.filter(r => r.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const handleRegenerateCode = async (id: string, name: string) => {
        if (!confirm(`Voulez-vous générer un nouveau code pour ${name} ? L'ancien ne fonctionnera plus.`)) return;
        try {
            const data = await adminFetch<{ residents: Resident[] }>("/.netlify/functions/admin-residents", {
                method: "POST",
                body: JSON.stringify({ action: "update", id, resetCode: true })
            });
            setResidents(data.residents);
        } catch (err) {
            alert("Erreur lors de la mise à jour");
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-cream-200 overflow-hidden">
            <div className="bg-charcoal-50 p-6 md:p-8 border-b border-cream-200">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-charcoal-800 shadow-sm">
                        <Users size={32} />
                    </div>
                    <div className="text-center md:text-left flex-grow">
                        <h2 className="font-serif text-2xl text-charcoal-900">Résidents & Familles</h2>
                        <p className="text-charcoal-600">Gérez les codes d'accès secrets du Postier Numérique.</p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8">
                {/* Add Form */}
                <form onSubmit={handleAdd} className="mb-8 flex flex-col md:flex-row gap-4 bg-cream-50 p-4 rounded-2xl border border-cream-200 items-end">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">Nom du résident</label>
                        <input 
                            type="text" 
                            value={newName} 
                            onChange={e => setNewName(e.target.value)}
                            placeholder="Ex: Marie Dupont" 
                            className="w-full px-4 py-2 border border-cream-300 rounded-xl"
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">Chambre</label>
                        <input 
                            type="text" 
                            value={newRoom} 
                            onChange={e => setNewRoom(e.target.value)}
                            placeholder="N°" 
                            className="w-full px-4 py-2 border border-cream-300 rounded-xl"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!newName.trim() || isAdding}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 h-10 bg-terracotta-600 text-white font-semibold rounded-xl hover:bg-terracotta-700 disabled:opacity-50"
                    >
                        {isAdding ? <LoaderCircle className="animate-spin" size={20} /> : <><UserPlus size={20} /> Ajouter</>}
                    </button>
                </form>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

                {/* List */}
                {loading ? (
                    <div className="py-12 flex justify-center"><LoaderCircle className="animate-spin text-terracotta-500" size={32} /></div>
                ) : residents.length === 0 ? (
                    <div className="text-center py-12 text-charcoal-500">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucun résident enregistré pour le moment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-cream-200">
                                    <th className="py-3 px-4 text-charcoal-900 font-semibold">Résident</th>
                                    <th className="py-3 px-4 text-charcoal-900 font-semibold">Chambre</th>
                                    <th className="py-3 px-4 text-charcoal-900 font-semibold">Code Secret (à transmettre)</th>
                                    <th className="py-3 px-4 text-charcoal-900 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {residents.map(r => (
                                    <tr key={r.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-charcoal-900">{r.name}</td>
                                        <td className="py-3 px-4 text-charcoal-600">{r.room || "-"}</td>
                                        <td className="py-3 px-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta-50 text-terracotta-700 font-mono font-bold rounded-lg tracking-wider border border-terracotta-100">
                                                <KeyRound size={14} />
                                                {r.secretCode}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleRegenerateCode(r.id, r.name)}
                                                    className="p-2 text-charcoal-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-colors"
                                                    title="Générer un nouveau code"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(r.id, r.name)}
                                                    className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
