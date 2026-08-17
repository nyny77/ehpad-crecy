import type { Context } from "@netlify/functions";
import { isAdminRequestV2, jsonV2 } from "./_shared/admin-auth";
import { getImagesStore } from "./_shared/blob-storage";
import { logFunctionError } from "./_shared/technical-log";

export default async (req: Request, context: Context) => {
    if (!isAdminRequestV2(req)) return jsonV2(403, { error: "Accès administrateur requis" });
    if (req.method !== "GET") return jsonV2(405, { error: "Méthode non autorisée" });

    try {
        const url = new URL(req.url);
        const key = url.searchParams.get("key");
        if (!key) return jsonV2(400, { error: "Clé d'image manquante" });

        const imagesStore = getImagesStore();
        const blob = await imagesStore.get(key, { type: "arrayBuffer" });
        if (!blob) return jsonV2(404, { error: "Image introuvable" });

        return new Response(blob, {
            status: 200,
            headers: {
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=3600"
            }
        });
    } catch (error) {
        logFunctionError("admin-get-image", error, context.requestId || "unknown");
        return jsonV2(500, { error: "Erreur serveur" });
    }
};
