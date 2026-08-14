"use client";

import { ChangeEvent, useState } from "react";
import { FileUp, LoaderCircle } from "lucide-react";
import { adminFetch } from "@/lib/admin-api";
import gazetteData from "@/lib/data/gazette.json";

function encodeBlobBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
        reader.readAsDataURL(blob);
    });
}

export default function GazetteManager() {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const [title, setTitle] = useState("");
    
    // Support backward compatibility if gazetteData is in old format
    const initialGazettes = (gazetteData as any).gazettes || ((gazetteData as any).file ? [{ title: "Dernière parution", file: (gazetteData as any).file }] : []);
    const [gazettes, setGazettes] = useState<any[]>(initialGazettes);

    const selectFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (file.type !== "application/pdf") {
            setMessage({ type: "error", text: "Veuillez sélectionner un fichier PDF." });
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: "error", text: "Le fichier ne doit pas dépasser 10 Mo." });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            const fileBase64 = await encodeBlobBase64(file);
            const result = await adminFetch<{ path: string }>("/.netlify/functions/admin-gazette", {
                method: "POST",
                body: JSON.stringify({ fileName: file.name, fileBase64, title: title || "Nouvelle gazette" }),
            });
            setGazettes([{ title: title || "Nouvelle gazette", file: result.path }, ...gazettes]);
            setTitle("");
            setMessage({ type: "success", text: "Gazette publiée avec succès. La mise à jour sera visible d'ici 2 à 3 minutes." });
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Envoi impossible" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <section className="space-y-8">
            <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="font-serif text-3xl text-charcoal-900">Le Petit Echo du Coeur</h2>
                        <p className="text-charcoal-600 mt-1">Format PDF uniquement · 10 Mo maximum</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Titre (ex: Janvier 2026)"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            disabled={uploading}
                            className="px-4 py-3 rounded-full border border-cream-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white min-w-[200px]"
                        />
                        <label className={`cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold transition-colors ${uploading ? 'bg-cream-300 text-charcoal-500' : 'bg-terracotta-600 text-white hover:bg-terracotta-700'}`}>
                            {uploading ? <LoaderCircle size={20} className="animate-spin" /> : <FileUp size={20} />}
                            {uploading ? "Publication en cours…" : "Publier"}
                            <input disabled={uploading} type="file" accept="application/pdf" onChange={selectFile} className="sr-only" />
                        </label>
                    </div>
                </div>

                {message && <div className={`rounded-xl p-4 border mb-6 ${message.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}>{message.text}</div>}

                <div className="mt-8">
                    <h3 className="font-semibold text-charcoal-900 mb-4">Gazettes actuellement en ligne</h3>
                    {gazettes.length > 0 ? (
                        <div className="space-y-3">
                            {gazettes.map((g, i) => (
                                <div key={i} className="bg-cream-50 rounded-2xl p-4 border border-cream-200 flex items-center justify-between gap-4">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-charcoal-900 font-medium truncate">{g.title}</span>
                                        <span className="text-charcoal-500 text-sm truncate">{g.file.split('/').pop()}</span>
                                    </div>
                                    <a href={g.file} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm bg-white border border-cream-300 rounded-full hover:bg-cream-100 text-charcoal-700 font-semibold flex-shrink-0">Consulter</a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-charcoal-500 italic">Aucune gazette en ligne.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
