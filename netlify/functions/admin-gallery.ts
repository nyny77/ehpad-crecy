import type { Handler } from "@netlify/functions";
import { logFunctionError } from "./_shared/technical-log";
import { randomUUID } from "node:crypto";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { commitChanges, readRepositoryText, type GitChange } from "./_shared/github";
import { parseJsonObject, validateImage, validationStatus } from "./_shared/request-security";

interface GalleryPhoto {
    id: string;
    src: string;
    thumbSrc?: string;
    alt: string;
    category: string;
    title?: string;
    albumId?: string;
}

interface GalleryAlbum {
    id: string;
    title: string;
    date: string;
    createdAt: string;
}

interface GalleryData {
    photos: GalleryPhoto[];
    albums?: GalleryAlbum[];
    legacyAlbumTitle?: string;
    lastPublishedAt?: string;
}

const GALLERY_PATH = "src/lib/data/gallery.json";
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function safeBaseName(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "").slice(0, 60) || "photo";
}

function repositoryPath(publicPath: string): string {
    if (!publicPath.startsWith("/images/")) throw new Error("Chemin d’image invalide");
    return `public${publicPath}`;
}

export function galleryCommitMessage(message: string, skipNetlify: boolean): string {
    return skipNetlify ? `${message} [skip netlify]` : message;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const body = parseJsonObject(event.body, 12 * 1024 * 1024);
        const data = JSON.parse(await readRepositoryText(GALLERY_PATH)) as GalleryData;
        data.albums ||= [];
        data.legacyAlbumTitle ||= "Photos précédentes";
        const action = body.action || "add";
        const changes: GitChange[] = [];
        let resultPhoto: GalleryPhoto | undefined;

        if (action === "add") {
            const image = (await validateImage(body.imageBase64, { maxBytes: MAX_IMAGE_BYTES, maxWidth: 2_000, maxHeight: 2_000, formats: ["webp"] })).buffer;
            const thumbnail = (await validateImage(body.thumbnailBase64, { maxBytes: 1 * 1024 * 1024, maxWidth: 700, maxHeight: 700, formats: ["webp"] })).buffer;
            const title = String(body.title || "").trim();
            const albumId = String(body.albumId || "").trim();
            if (!title) return json(400, { error: "Titre obligatoire" });
            if (!albumId || !data.albums.some((album) => album.id === albumId)) return json(400, { error: "Album introuvable" });
            const id = randomUUID();
            const name = `${Date.now()}-${safeBaseName(String(body.fileName || "photo"))}.webp`;
            const src = `/images/gallery/${albumId}/${name}`;
            const thumbSrc = `/images/gallery/${albumId}/thumbnails/${name}`;
            resultPhoto = { id, src, thumbSrc, title: title.slice(0, 160), alt: "", category: "autre", albumId };
            data.photos.push(resultPhoto);
            changes.push(
                { path: repositoryPath(src), content: image.toString("base64"), encoding: "base64" },
                { path: repositoryPath(thumbSrc), content: thumbnail.toString("base64"), encoding: "base64" },
            );
        } else if (action === "createAlbum") {
            const title = String(body.title || "").trim();
            const date = String(body.date || "").trim();
            if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return json(400, { error: "Nom et date de l’album obligatoires" });
            const existingAlbum = data.albums.find((album) => album.date === date && album.title.localeCompare(title, "fr", { sensitivity: "base" }) === 0);
            if (existingAlbum) return json(200, { success: true, album: existingAlbum, alreadyExists: true });
            const album: GalleryAlbum = { id: randomUUID(), title: title.slice(0, 120), date, createdAt: new Date().toISOString() };
            data.albums.push(album);
            changes.push({ path: GALLERY_PATH, content: JSON.stringify(data, null, 2) + "\n" });
            await commitChanges(galleryCommitMessage(`Galerie : création de l’album ${album.title}`, body.skipNetlify === true), changes);
            return json(200, { success: true, album });
        } else if (action === "publishBatch") {
            data.lastPublishedAt = new Date().toISOString();
        } else if (action === "deleteAlbum") {
            const albumId = String(body.albumId || "");
            const album = data.albums.find((item) => item.id === albumId);
            if (!album) return json(404, { error: "Album introuvable" });
            const toDelete = data.photos.filter((photo) => photo.albumId === albumId);
            data.photos = data.photos.filter((photo) => photo.albumId !== albumId);
            data.albums = data.albums.filter((item) => item.id !== albumId);
            for (const photo of toDelete) {
                changes.push({ path: repositoryPath(photo.src), content: null });
                if (photo.thumbSrc) changes.push({ path: repositoryPath(photo.thumbSrc), content: null });
            }
        } else if (action === "updateAlbum") {
            const albumId = String(body.albumId || "");
            const title = String(body.title || "").trim();
            if (!title) return json(400, { error: "Nom de l’album obligatoire" });
            const album = data.albums.find((item) => item.id === albumId);
            if (!album) return json(404, { error: "Album introuvable" });
            album.title = title.slice(0, 120);
        } else if (action === "updateLegacyAlbum") {
            const title = String(body.title || "").trim();
            if (!title) return json(400, { error: "Nom du dossier obligatoire" });
            data.legacyAlbumTitle = title.slice(0, 120);
        } else if (action === "reorder") {
            const orderedIds = Array.isArray(body.ids) ? body.ids.map(String) : [];
            const byId = new Map(data.photos.map((photo) => [photo.id, photo]));
            if (orderedIds.length !== data.photos.length || orderedIds.some((id: string) => !byId.has(id))) {
                return json(400, { error: "Ordre des photos invalide" });
            }
            data.photos = orderedIds.reverse().map((id: string) => byId.get(id)!);
        } else if (action === "delete") {
            const idsToDelete = Array.isArray(body.ids) ? body.ids : (body.id ? [body.id] : []);
            if (idsToDelete.length === 0) return json(400, { error: "Aucune photo sélectionnée" });
            
            const toDelete = data.photos.filter(p => idsToDelete.includes(p.id));
            if (toDelete.length === 0) return json(404, { error: "Photos introuvables" });
            
            data.photos = data.photos.filter((item) => !idsToDelete.includes(item.id));
            for (const photo of toDelete) {
                changes.push({ path: repositoryPath(photo.src), content: null });
                if (photo.thumbSrc) changes.push({ path: repositoryPath(photo.thumbSrc), content: null });
            }
        } else {
            const photo = data.photos.find((item) => item.id === body.id);
            if (!photo) return json(404, { error: "Photo introuvable" });
            if (action === "update") {
                const title = String(body.title || "").trim();
                if (!title) return json(400, { error: "Titre obligatoire" });
                photo.title = title.slice(0, 160);
                photo.alt = "";
            } else {
                return json(400, { error: "Action inconnue" });
            }
        }

        changes.push({ path: GALLERY_PATH, content: JSON.stringify(data, null, 2) + "\n" });
        await commitChanges(galleryCommitMessage(`Galerie : ${action}`, action === "add" && body.skipNetlify === true), changes);
        return json(200, { success: true, photo: resultPhoto });
    } catch (error) {
        logFunctionError("admin-gallery", error, context.awsRequestId);
        return json(validationStatus(error), { error: error instanceof Error ? error.message : "Modification de la galerie impossible" });
    }
};
