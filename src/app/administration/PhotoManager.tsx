"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Pencil, RotateCcw, Save, Trash2, Upload, X } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery";
import { adminFetch } from "@/lib/admin-api";
import { processImage, validateSourceImage } from "@/lib/image-processing";

interface PendingPhoto {
    id: string;
    file: File;
    preview: string;
    title: string;
    alt: string;
}

const bytesToMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} Mo`;

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("Lecture de l’image impossible"));
        reader.readAsDataURL(blob);
    });
}

export default function PhotoManager({ initialPhotos }: { initialPhotos: GalleryImage[] }) {
    const [photos, setPhotos] = useState<GalleryImage[]>([...initialPhotos].reverse());
    const [pending, setPending] = useState<PendingPhoto[]>([]);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState({ title: "", alt: "" });
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const activeCount = useMemo(() => photos.filter((photo) => !photo.deletedAt).length, [photos]);

    const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(event.target.files || []);
        const next: PendingPhoto[] = [];
        try {
            for (const file of selected) {
                validateSourceImage(file);
                const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
                next.push({ id: `${file.name}-${file.lastModified}-${Math.random()}`, file, preview: URL.createObjectURL(file), title: baseName, alt: baseName });
            }
            setPending((current) => [...current, ...next]);
            setMessage(null);
        } catch (error) {
            next.forEach((item) => URL.revokeObjectURL(item.preview));
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Fichier invalide" });
        }
        event.target.value = "";
    };

    const removePending = (id: string) => {
        setPending((current) => {
            const item = current.find((candidate) => candidate.id === id);
            if (item) URL.revokeObjectURL(item.preview);
            return current.filter((candidate) => candidate.id !== id);
        });
    };

    const uploadAll = async () => {
        if (pending.some((item) => !item.title.trim() || !item.alt.trim())) {
            setMessage({ type: "error", text: "Un titre et une description sont nécessaires pour chaque photo." });
            return;
        }
        setUploading(true);
        setMessage(null);
        let completed = 0;
        try {
            for (const item of pending) {
                const processed = await processImage(item.file);
                if (processed.image.size + processed.thumbnail.size > 3.8 * 1024 * 1024) throw new Error(`${item.file.name} reste trop lourde après compression.`);
                const [imageBase64, thumbnailBase64] = await Promise.all([blobToBase64(processed.image), blobToBase64(processed.thumbnail)]);
                const result = await adminFetch<{ photo: GalleryImage }>("/.netlify/functions/admin-gallery", {
                    method: "POST",
                    body: JSON.stringify({ action: "add", fileName: item.file.name, title: item.title, alt: item.alt, imageBase64, thumbnailBase64 }),
                });
                setPhotos((current) => [result.photo, ...current]);
                completed += 1;
            }
            pending.forEach((item) => URL.revokeObjectURL(item.preview));
            setPending([]);
            setMessage({ type: "success", text: `${completed} photo${completed > 1 ? "s" : ""} enregistrée${completed > 1 ? "s" : ""}. Netlify va actualiser le site.` });
        } catch (error) {
            setMessage({ type: "error", text: `${completed} photo(s) enregistrée(s). ${error instanceof Error ? error.message : "Envoi interrompu"}` });
        } finally {
            setUploading(false);
        }
    };

    const photoAction = async (photo: GalleryImage, action: "trash" | "restore" | "permanent") => {
        const prompt = action === "permanent" ? "Supprimer définitivement cette photo ? Cette action est irréversible." : action === "trash" ? "Placer cette photo dans la corbeille ?" : null;
        if (prompt && !window.confirm(prompt)) return;
        setProcessingId(photo.id);
        try {
            await adminFetch("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ id: photo.id, action }) });
            if (action === "permanent") setPhotos((current) => current.filter((item) => item.id !== photo.id));
            else setPhotos((current) => {
                const updated = current.map((item) => item.id === photo.id ? { ...item, deletedAt: action === "trash" ? new Date().toISOString() : undefined } : item);
                return [...updated.filter((item) => !item.deletedAt), ...updated.filter((item) => item.deletedAt)];
            });
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Action impossible" });
        } finally {
            setProcessingId(null);
        }
    };

    const saveEdit = async (photo: GalleryImage) => {
        setProcessingId(photo.id);
        try {
            await adminFetch("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ action: "update", id: photo.id, ...editValues }) });
            setPhotos((current) => current.map((item) => item.id === photo.id ? { ...item, ...editValues } : item));
            setEditingId(null);
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Modification impossible" });
        } finally {
            setProcessingId(null);
        }
    };

    const movePhoto = async (photo: GalleryImage, direction: -1 | 1) => {
        const active = photos.filter((item) => !item.deletedAt);
        const index = active.findIndex((item) => item.id === photo.id);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= active.length) return;
        setProcessingId(photo.id);
        [active[index], active[target]] = [active[target], active[index]];
        const previous = photos;
        setPhotos([...active, ...photos.filter((item) => item.deletedAt)]);
        try {
            await adminFetch("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ action: "reorder", ids: active.map((item) => item.id) }) });
        } catch (error) {
            setPhotos(previous);
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Réorganisation impossible" });
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <section className="space-y-8">
            <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div><h2 className="font-serif text-3xl text-charcoal-900">Ajouter des photos publiques</h2><p className="text-charcoal-600 mt-1">JPEG, PNG ou WebP · 15 Mo maximum · compression automatique</p></div>
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-terracotta-600 text-white font-semibold"><ImagePlus size={20} /> Choisir des photos<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectFiles} className="sr-only" /></label>
                </div>
                {pending.length === 0 ? (
                    <label className="cursor-pointer min-h-48 rounded-2xl border-2 border-dashed border-cream-300 hover:border-terracotta-300 bg-cream-50 flex flex-col items-center justify-center text-center p-8"><Upload size={36} className="text-terracotta-500 mb-3" /><span className="font-semibold text-charcoal-800">Sélectionner plusieurs photos</span><span className="text-sm text-charcoal-500 mt-1">Elles seront compressées puis enregistrées dans GitHub.</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectFiles} className="sr-only" /></label>
                ) : (
                    <div className="space-y-4">
                        {pending.map((item) => (
                            <article key={item.id} className="grid md:grid-cols-[160px_1fr_auto] gap-4 p-4 rounded-2xl bg-cream-50 border border-cream-200">
                                <img src={item.preview} alt="Aperçu avant publication" className="w-full h-32 object-cover rounded-xl" />
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <label className="text-sm font-medium text-charcoal-700">Titre<input value={item.title} onChange={(e) => setPending((current) => current.map((entry) => entry.id === item.id ? { ...entry, title: e.target.value } : entry))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-cream-300 bg-white" /></label>
                                    <label className="text-sm font-medium text-charcoal-700">Description accessible<input value={item.alt} onChange={(e) => setPending((current) => current.map((entry) => entry.id === item.id ? { ...entry, alt: e.target.value } : entry))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-cream-300 bg-white" /></label>
                                    <p className="text-xs text-charcoal-500 sm:col-span-2">Original : {bytesToMb(item.file.size)}</p>
                                </div>
                                <button onClick={() => removePending(item.id)} className="self-start p-2 rounded-full text-charcoal-500 hover:bg-red-50 hover:text-red-600" aria-label="Retirer"><Trash2 size={19} /></button>
                            </article>
                        ))}
                        <div className="flex justify-end"><button onClick={uploadAll} disabled={uploading} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta-600 text-white font-bold disabled:opacity-60">{uploading ? <LoaderCircle size={20} className="animate-spin" /> : <Upload size={20} />}{uploading ? "Traitement et envoi…" : `Publier ${pending.length} photo${pending.length > 1 ? "s" : ""}`}</button></div>
                    </div>
                )}
            </div>
            {message && <div className={`rounded-2xl p-4 border ${message.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}>{message.text}</div>}
            <div>
                <div className="flex items-center justify-between mb-4"><h2 className="font-serif text-3xl text-charcoal-900">Photothèque publique</h2><span className="text-sm text-charcoal-500">{activeCount} photo(s) active(s)</span></div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {photos.map((photo) => {
                        const activeIndex = photos.filter((item) => !item.deletedAt).findIndex((item) => item.id === photo.id);
                        return <article key={photo.id} className={`bg-white rounded-2xl overflow-hidden border shadow-sm ${photo.deletedAt ? "opacity-60 border-red-200" : "border-cream-200"}`}>
                            <img src={photo.thumbSrc || photo.src} alt={photo.alt} className="w-full aspect-[4/3] object-cover" />
                            <div className="p-4">
                                {editingId === photo.id ? <div className="space-y-2">
                                    <input value={editValues.title} onChange={(e) => setEditValues((current) => ({ ...current, title: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-cream-300" aria-label="Titre" />
                                    <input value={editValues.alt} onChange={(e) => setEditValues((current) => ({ ...current, alt: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-cream-300" aria-label="Description" />
                                    <div className="flex gap-2"><button onClick={() => saveEdit(photo)} className="flex-1 inline-flex justify-center items-center gap-1.5 py-2 rounded-xl bg-green-50 text-green-700"><Save size={16} /> Enregistrer</button><button onClick={() => setEditingId(null)} className="p-2 rounded-xl bg-cream-100 text-charcoal-600"><X size={17} /></button></div>
                                </div> : <>
                                    <h3 className="font-semibold text-charcoal-900">{photo.title}</h3>
                                    {photo.deletedAt ? <div className="flex gap-2 mt-4"><button disabled={processingId === photo.id} onClick={() => photoAction(photo, "restore")} className="flex-1 inline-flex justify-center items-center gap-1.5 py-2 rounded-xl bg-green-50 text-green-700 disabled:opacity-50"><RotateCcw size={16} /> Restaurer</button><button disabled={processingId === photo.id} onClick={() => photoAction(photo, "permanent")} className="p-2 rounded-xl bg-red-50 text-red-700 disabled:opacity-50" title="Suppression définitive"><Trash2 size={17} /></button></div> :
                                    <div className="grid grid-cols-[auto_auto_1fr_auto] gap-2 mt-4"><button disabled={activeIndex === 0 || processingId === photo.id} onClick={() => movePhoto(photo, -1)} className="p-2 rounded-xl bg-cream-100 text-charcoal-700 disabled:opacity-30" title="Monter">{processingId === photo.id ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowUp size={16} />}</button><button disabled={activeIndex === activeCount - 1 || processingId === photo.id} onClick={() => movePhoto(photo, 1)} className="p-2 rounded-xl bg-cream-100 text-charcoal-700 disabled:opacity-30" title="Descendre">{processingId === photo.id ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowDown size={16} />}</button><button disabled={processingId === photo.id} onClick={() => { setEditingId(photo.id); setEditValues({ title: photo.title || "", alt: photo.alt }); }} className="inline-flex justify-center items-center gap-1.5 py-2 rounded-xl bg-cream-100 text-charcoal-700 disabled:opacity-50"><Pencil size={16} /> Modifier</button><button disabled={processingId === photo.id} onClick={() => photoAction(photo, "trash")} className="p-2 rounded-xl bg-red-50 text-red-700 disabled:opacity-50" title="Mettre à la corbeille">{processingId === photo.id ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}</button></div>}
                                </>}
                            </div>
                        </article>;
                    })}
                </div>
            </div>
        </section>
    );
}
