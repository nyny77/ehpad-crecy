import type { Handler } from "@netlify/functions";
import { randomUUID } from "node:crypto";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { commitChanges, readRepositoryText, type GitChange } from "./_shared/github";

interface GalleryPhoto {
    id: string;
    src: string;
    thumbSrc?: string;
    alt: string;
    category: string;
    title?: string;
}

const GALLERY_PATH = "src/lib/data/gallery.json";
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function safeBaseName(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "").slice(0, 60) || "photo";
}

function decodeImage(value: unknown): Buffer {
    const encoded = String(value || "").replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "");
    const buffer = Buffer.from(encoded, "base64");
    if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) throw new Error("L’image compressée dépasse la limite de 4 Mo");
    return buffer;
}

function repositoryPath(publicPath: string): string {
    if (!publicPath.startsWith("/images/")) throw new Error("Chemin d’image invalide");
    return `public${publicPath}`;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const body = JSON.parse(event.body || "{}");
        const data = JSON.parse(await readRepositoryText(GALLERY_PATH)) as { photos: GalleryPhoto[] };
        const action = body.action || "add";
        const changes: GitChange[] = [];
        let resultPhoto: GalleryPhoto | undefined;

        if (action === "add") {
            const image = decodeImage(body.imageBase64);
            const thumbnail = decodeImage(body.thumbnailBase64);
            const title = String(body.title || "").trim();
            const alt = String(body.alt || "").trim();
            if (!title || !alt) return json(400, { error: "Titre et description obligatoires" });
            const id = randomUUID();
            const name = `${Date.now()}-${safeBaseName(String(body.fileName || "photo"))}.webp`;
            const src = `/images/uploads/${name}`;
            const thumbSrc = `/images/thumbnails/${name}`;
            resultPhoto = { id, src, thumbSrc, title: title.slice(0, 160), alt: alt.slice(0, 300), category: "autre" };
            data.photos.push(resultPhoto);
            changes.push(
                { path: repositoryPath(src), content: image.toString("base64"), encoding: "base64" },
                { path: repositoryPath(thumbSrc), content: thumbnail.toString("base64"), encoding: "base64" },
            );
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
                const alt = String(body.alt || "").trim();
                if (!title || !alt) return json(400, { error: "Titre et description obligatoires" });
                photo.title = title.slice(0, 160);
                photo.alt = alt.slice(0, 300);
            } else {
                return json(400, { error: "Action inconnue" });
            }
        }

        changes.push({ path: GALLERY_PATH, content: JSON.stringify(data, null, 2) + "\n" });
        await commitChanges(`Galerie : ${action}`, changes);
        return json(200, { success: true, photo: resultPhoto });
    } catch (error) {
        console.error("gallery administration failed", error);
        return json(500, { error: error instanceof Error ? error.message : "Modification de la galerie impossible" });
    }
};
