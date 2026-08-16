"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckSquare, Folder, FolderPlus, ImagePlus, LoaderCircle, Pencil, Save, Trash2, Upload, X } from "lucide-react";
import type { GalleryAlbum, GalleryImage } from "@/lib/gallery";
import { adminFetch } from "@/lib/admin-api";
import { processImage, validateSourceImage } from "@/lib/image-processing";

interface PendingPhoto { id: string; file: File; preview: string; title: string; }

const LEGACY_ALBUM_ID = "legacy";
const bytesToMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
const formatDate = (value: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("Lecture de l’image impossible"));
        reader.readAsDataURL(blob);
    });
}

export default function PhotoManager({ initialPhotos, initialAlbums, initialLegacyAlbumTitle }: { initialPhotos: GalleryImage[]; initialAlbums: GalleryAlbum[]; initialLegacyAlbumTitle: string }) {
    const [photos, setPhotos] = useState<GalleryImage[]>([...initialPhotos].reverse());
    const [albums, setAlbums] = useState<GalleryAlbum[]>(initialAlbums);
    const [legacyAlbumTitle, setLegacyAlbumTitle] = useState(initialLegacyAlbumTitle);
    const [pending, setPending] = useState<PendingPhoto[]>([]);
    const [uploadPreviews, setUploadPreviews] = useState<Record<string, string>>({});
    const [targetAlbumId, setTargetAlbumId] = useState("new");
    const [albumTitle, setAlbumTitle] = useState("");
    const [albumDate, setAlbumDate] = useState(new Date().toISOString().slice(0, 10));
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
    const [albumNameDraft, setAlbumNameDraft] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [editTitle, setEditTitle] = useState("");
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

    const albumSections = useMemo(() => {
        const dated = [...albums].sort((a, b) => b.date.localeCompare(a.date)).map((album) => ({ ...album, photos: photos.filter((photo) => photo.albumId === album.id) }));
        const legacyPhotos = photos.filter((photo) => !photo.albumId || !albums.some((album) => album.id === photo.albumId));
        return legacyPhotos.length ? [...dated, { id: LEGACY_ALBUM_ID, title: legacyAlbumTitle, date: "", createdAt: "", photos: legacyPhotos }] : dated;
    }, [albums, legacyAlbumTitle, photos]);

    useEffect(() => {
        const pendingIds = Object.keys(uploadPreviews);
        if (!pendingIds.length) return;
        const checkPublication = async () => {
            for (const id of pendingIds) {
                const photo = photos.find((item) => item.id === id);
                const url = photo?.thumbSrc || photo?.src;
                if (!url) continue;
                try {
                    const response = await fetch(url, { method: "HEAD", cache: "no-store" });
                    if (!response.ok) continue;
                    setUploadPreviews((current) => {
                        if (!current[id]) return current;
                        URL.revokeObjectURL(current[id]);
                        const next = { ...current };
                        delete next[id];
                        return next;
                    });
                } catch { /* Le prochain contrôle réessaiera après le déploiement. */ }
            }
        };
        void checkPublication();
        const timer = window.setInterval(checkPublication, 15000);
        return () => window.clearInterval(timer);
    }, [photos, uploadPreviews]);

    const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(event.target.files || []);
        const next: PendingPhoto[] = [];
        try {
            for (const file of selected) {
                validateSourceImage(file);
                const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
                next.push({ id: `${file.name}-${file.lastModified}-${Math.random()}`, file, preview: URL.createObjectURL(file), title: baseName });
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
        if (!pending.length) return;
        if (targetAlbumId === "new" && (!albumTitle.trim() || !albumDate)) {
            setMessage({ type: "error", text: "Donnez un nom et une date au nouvel album." });
            return;
        }
        setUploading(true);
        setMessage(null);
        let completed = 0;
        try {
            let albumId = targetAlbumId;
            if (albumId === "new") {
                const result = await adminFetch<{ album: GalleryAlbum }>("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ action: "createAlbum", title: albumTitle, date: albumDate }) });
                albumId = result.album.id;
                setAlbums((current) => current.some((album) => album.id === result.album.id) ? current : [...current, result.album]);
                setTargetAlbumId(albumId);
            }
            for (const item of pending) {
                const processed = await processImage(item.file);
                if (processed.image.size + processed.thumbnail.size > 3.8 * 1024 * 1024) throw new Error(`${item.file.name} reste trop lourde après compression.`);
                const [imageBase64, thumbnailBase64] = await Promise.all([blobToBase64(processed.image), blobToBase64(processed.thumbnail)]);
                const result = await adminFetch<{ photo: GalleryImage }>("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ action: "add", albumId, fileName: item.file.name, title: item.title, imageBase64, thumbnailBase64 }) });
                setPhotos((current) => [result.photo, ...current]);
                setUploadPreviews((current) => ({ ...current, [result.photo.id]: item.preview }));
                completed += 1;
            }
            setPending([]);
            setAlbumTitle("");
            setMessage({ type: "success", text: `${completed} photo${completed > 1 ? "s sont enregistrées" : " est enregistrée"}. Mise en ligne Netlify en cours : comptez environ 2 minutes. L’aperçu reste visible pendant ce délai.` });
        } catch (error) {
            setMessage({ type: "error", text: `${completed} photo(s) enregistrée(s). ${error instanceof Error ? error.message : "Envoi interrompu"}` });
        } finally { setUploading(false); }
    };

    const deletePhotos = async (ids: string[]) => {
        if (!ids.length || !window.confirm(`Supprimer définitivement ${ids.length > 1 ? `ces ${ids.length} photos` : "cette photo"} ? Cette action est irréversible.`)) return;
        setProcessingId(ids.length === 1 ? ids[0] : "bulk");
        try {
            await adminFetch("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ action: "delete", ids }) });
            setPhotos((current) => current.filter((item) => !ids.includes(item.id)));
            setSelectedIds((current) => new Set([...current].filter((id) => !ids.includes(id))));
            setMessage({ type: "success", text: `${ids.length} photo${ids.length > 1 ? "s ont" : " a"} été supprimée${ids.length > 1 ? "s" : ""}.` });
        } catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "Suppression impossible" }); }
        finally { setProcessingId(null); }
    };

    const deleteAlbum = async (album: GalleryAlbum, count: number) => {
        if (!window.confirm(`Supprimer définitivement l’album « ${album.title} » et ses ${count} photo(s) ?`)) return;
        setProcessingId(`album-${album.id}`);
        try {
            await adminFetch("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ action: "deleteAlbum", albumId: album.id }) });
            const ids = photos.filter((photo) => photo.albumId === album.id).map((photo) => photo.id);
            setAlbums((current) => current.filter((item) => item.id !== album.id));
            setPhotos((current) => current.filter((photo) => photo.albumId !== album.id));
            setSelectedIds((current) => new Set([...current].filter((id) => !ids.includes(id))));
            if (targetAlbumId === album.id) setTargetAlbumId("new");
            setMessage({ type: "success", text: `L’album « ${album.title} » a été supprimé.` });
        } catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "Suppression de l’album impossible" }); }
        finally { setProcessingId(null); }
    };

    const saveEdit = async (photo: GalleryImage) => {
        if (!editTitle.trim()) return;
        setProcessingId(photo.id);
        try {
            await adminFetch("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ action: "update", id: photo.id, title: editTitle }) });
            setPhotos((current) => current.map((item) => item.id === photo.id ? { ...item, title: editTitle, alt: "" } : item));
            setEditingId(null);
        } catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "Modification impossible" }); }
        finally { setProcessingId(null); }
    };

    const saveAlbumName = async (album: GalleryAlbum) => {
        const title = albumNameDraft.trim();
        if (!title) {
            setMessage({ type: "error", text: "Le nom de l’album ne peut pas être vide." });
            return;
        }
        setProcessingId(`album-${album.id}`);
        try {
            if (album.id === LEGACY_ALBUM_ID) {
                await adminFetch("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ action: "updateLegacyAlbum", title }) });
                setLegacyAlbumTitle(title);
            } else {
                await adminFetch("/.netlify/functions/admin-gallery", { method: "POST", body: JSON.stringify({ action: "updateAlbum", albumId: album.id, title }) });
                setAlbums((current) => current.map((item) => item.id === album.id ? { ...item, title } : item));
            }
            setEditingAlbumId(null);
            setMessage({ type: "success", text: `L’album s’appelle maintenant « ${title} ».` });
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Renommage de l’album impossible" });
        } finally { setProcessingId(null); }
    };

    const toggleSelection = (ids: string[], select: boolean) => {
        setSelectedIds((current) => {
            const next = new Set(current);
            ids.forEach((id) => select ? next.add(id) : next.delete(id));
            return next;
        });
    };

    return <section className="space-y-8">
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div><h2 className="font-serif text-3xl text-charcoal-900">Ajouter un groupe de photos</h2><p className="text-charcoal-600 mt-1">Créez un album daté, par exemple « Noël 2026 », puis ajoutez toutes ses photos.</p></div>
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-terracotta-600 text-white font-semibold"><ImagePlus size={20} /> Choisir des photos<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectFiles} className="sr-only" /></label>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-cream-50 border border-cream-200">
                <label className="text-sm font-semibold text-charcoal-700">Destination<select value={targetAlbumId} onChange={(event) => setTargetAlbumId(event.target.value)} className="mt-1.5 w-full px-3 py-3 rounded-xl border border-cream-300 bg-white"><option value="new">+ Créer un nouvel album</option>{[...albums].sort((a, b) => b.date.localeCompare(a.date)).map((album) => <option key={album.id} value={album.id}>{album.title} — {formatDate(album.date)}</option>)}</select></label>
                {targetAlbumId === "new" && <><label className="text-sm font-semibold text-charcoal-700">Nom de l’album<input value={albumTitle} onChange={(event) => setAlbumTitle(event.target.value)} placeholder="Ex. Noël 2026" maxLength={120} className="mt-1.5 w-full px-3 py-3 rounded-xl border border-cream-300 bg-white" /></label><label className="text-sm font-semibold text-charcoal-700">Date de l’événement<input type="date" value={albumDate} onChange={(event) => setAlbumDate(event.target.value)} className="mt-1.5 w-full px-3 py-3 rounded-xl border border-cream-300 bg-white" /></label></>}
            </div>
                {pending.length === 0 ? <label className="cursor-pointer min-h-48 rounded-2xl border-2 border-dashed border-cream-300 hover:border-terracotta-300 bg-cream-50 flex flex-col items-center justify-center text-center p-8"><Upload size={36} className="text-terracotta-500 mb-3" /><span className="font-semibold text-charcoal-800">Sélectionner plusieurs photos</span><span className="text-sm text-charcoal-500 mt-1">JPEG, PNG ou WebP · 15 Mo maximum par photo</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectFiles} className="sr-only" /></label> : <div className="space-y-4"><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">{pending.map((item) => <article key={item.id} className="relative rounded-2xl overflow-hidden bg-cream-50 border border-cream-200"><img src={item.preview} alt="Aperçu avant publication" className="w-full aspect-square object-cover" /><button onClick={() => removePending(item.id)} className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-red-700 shadow" aria-label="Retirer cette photo"><X size={17} /></button><div className="p-3"><input value={item.title} onChange={(event) => setPending((current) => current.map((entry) => entry.id === item.id ? { ...entry, title: event.target.value } : entry))} aria-label="Titre de la photo" className="w-full px-2 py-2 text-sm rounded-lg border border-cream-300 bg-white" /><p className="text-xs text-charcoal-500 mt-1">{bytesToMb(item.file.size)}</p></div></article>)}</div><p className="text-xs text-charcoal-500">Ces photos sont illustratives dans la galerie publique. Aucun titre accessible individuel n’est demandé.</p><div className="flex justify-end"><button onClick={uploadAll} disabled={uploading} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta-600 text-white font-bold disabled:opacity-60">{uploading ? <LoaderCircle size={20} className="animate-spin" /> : <FolderPlus size={20} />}{uploading ? "Traitement et envoi…" : `Publier ${pending.length} photo${pending.length > 1 ? "s" : ""}`}</button></div></div>}
        </div>
        {message && <div role={message.type === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-2xl p-4 border ${message.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}>{message.text}</div>}
        <div className="bg-white rounded-2xl p-4 border border-cream-200 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-20 shadow-sm"><span className="font-semibold text-charcoal-900">{selectedIds.size ? `${selectedIds.size} photo(s) sélectionnée(s)` : `${photos.length} photo(s) dans la photothèque`}</span><div className="flex flex-wrap gap-2"><button onClick={() => toggleSelection(photos.map((photo) => photo.id), selectedIds.size !== photos.length)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-terracotta-700 bg-terracotta-50 rounded-full border border-terracotta-200"><CheckSquare size={16} />{selectedIds.size === photos.length && photos.length ? "Tout désélectionner" : "Tout sélectionner"}</button>{selectedIds.size > 0 && <button disabled={processingId === "bulk"} onClick={() => deletePhotos([...selectedIds])} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-full disabled:opacity-50">{processingId === "bulk" ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />} Supprimer la sélection</button>}</div></div>
        <div className="space-y-7"><div><h2 className="font-serif text-3xl text-charcoal-900">Albums de la galerie</h2><p className="text-sm text-charcoal-500 mt-1">Les modifications sont visibles sur le site après sa mise à jour automatique.</p></div>
            {albumSections.map((album) => {
                const ids = album.photos.map((photo) => photo.id);
                const allSelected = ids.length > 0 && ids.every((id) => selectedIds.has(id));
                const isLegacy = album.id === LEGACY_ALBUM_ID;
                return <article key={album.id} className="rounded-3xl bg-white border border-cream-200 shadow-sm overflow-hidden"><header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6 bg-cream-50 border-b border-cream-200"><div className="flex items-center gap-4"><span className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center"><Folder size={24} /></span><div>{editingAlbumId === album.id ? <div className="flex flex-wrap gap-2"><input value={albumNameDraft} onChange={(event) => setAlbumNameDraft(event.target.value)} maxLength={120} autoFocus className="px-3 py-2 rounded-xl border border-cream-300 bg-white font-semibold" aria-label="Nouveau nom de l’album" /><button onClick={() => saveAlbumName(album)} disabled={processingId === `album-${album.id}`} className="p-2 rounded-xl bg-green-50 text-green-700" aria-label="Enregistrer le nom de l’album">{processingId === `album-${album.id}` ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />}</button><button onClick={() => setEditingAlbumId(null)} className="p-2 rounded-xl bg-white text-charcoal-700" aria-label="Annuler le renommage"><X size={17} /></button></div> : <div className="flex flex-wrap items-center gap-2"><h3 className="font-serif text-2xl text-charcoal-900">{album.title}</h3><button onClick={() => { setEditingAlbumId(album.id); setAlbumNameDraft(album.title); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white text-charcoal-700 border border-cream-300 text-sm font-semibold" aria-label={`Renommer l’album ${album.title}`}><Pencil size={15} /> Renommer</button></div>}<p className="text-sm text-charcoal-600 flex items-center gap-1.5 mt-1">{album.date && <><CalendarDays size={15} /> {formatDate(album.date)} · </>}{album.photos.length} photo(s)</p></div></div><div className="flex flex-wrap gap-2"><button onClick={() => toggleSelection(ids, !allSelected)} disabled={!ids.length} className="px-4 py-2 text-sm font-semibold rounded-full bg-white border border-cream-300 text-charcoal-700 disabled:opacity-40">{allSelected ? "Désélectionner" : "Tout sélectionner"}</button>{!isLegacy && <button onClick={() => deleteAlbum(album, album.photos.length)} disabled={processingId === `album-${album.id}`} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-red-50 text-red-700 border border-red-200 disabled:opacity-50">{processingId === `album-${album.id}` ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />} Supprimer l’album</button>}</div></header>
                        {album.photos.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5 md:p-6">{album.photos.map((photo, index) => { const isSelected = selectedIds.has(photo.id); const isPublishing = Boolean(uploadPreviews[photo.id]); return <div key={photo.id} className={`relative rounded-2xl overflow-hidden border transition-colors ${isSelected ? "border-terracotta-500 ring-2 ring-terracotta-500 ring-offset-2" : "border-cream-200"}`}><input type="checkbox" checked={isSelected} onChange={(event) => toggleSelection([photo.id], event.target.checked)} className="absolute top-3 left-3 z-10 w-5 h-5 accent-terracotta-600 cursor-pointer shadow" aria-label={`Sélectionner ${photo.title || `la photo ${index + 1}`}`} /><img src={uploadPreviews[photo.id] || photo.thumbSrc || photo.src} alt="" className="w-full aspect-[4/3] object-cover" />{isPublishing && <span className="absolute top-3 right-3 rounded-full bg-charcoal-900/85 px-3 py-1.5 text-xs font-semibold text-white">Mise en ligne…</span>}<div className="p-4">{editingId === photo.id ? <div className="flex gap-2"><input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="min-w-0 flex-1 px-3 py-2 rounded-xl border border-cream-300" aria-label="Titre" /><button onClick={() => saveEdit(photo)} className="p-2 rounded-xl bg-green-50 text-green-700" aria-label="Enregistrer"><Save size={17} /></button><button onClick={() => setEditingId(null)} className="p-2 rounded-xl bg-cream-100" aria-label="Annuler"><X size={17} /></button></div> : <div className="flex items-center gap-2"><h4 className="font-semibold text-charcoal-900 flex-1 truncate">{photo.title}</h4><button onClick={() => { setEditingId(photo.id); setEditTitle(photo.title || ""); }} className="p-2 rounded-xl bg-cream-100 text-charcoal-700" aria-label="Modifier le titre"><Pencil size={16} /></button><button onClick={() => deletePhotos([photo.id])} className="p-2 rounded-xl bg-red-50 text-red-700" aria-label="Supprimer la photo"><Trash2 size={16} /></button></div>}</div></div>; })}</div> : <p className="p-8 text-center text-charcoal-500">Cet album est vide. Vous pouvez y ajouter des photos avec le formulaire ci-dessus.</p>}
                </article>;
            })}
            {!albumSections.length && <div className="rounded-3xl bg-white border border-cream-200 p-10 text-center text-charcoal-500">Aucun album pour le moment.</div>}
        </div>
    </section>;
}
