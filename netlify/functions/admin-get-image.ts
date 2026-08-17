import type { Handler } from "@netlify/functions";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { getImagesStore } from "./_shared/blob-storage";
import { logFunctionError } from "./_shared/technical-log";

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "GET") return json(405, { error: "Méthode non autorisée" });

    try {
        const key = event.queryStringParameters?.key;
        if (!key) return json(400, { error: "Clé d'image manquante" });

        const imagesStore = getImagesStore();
        const blob = await imagesStore.get(key, { type: "arrayBuffer" });
        if (!blob) return json(404, { error: "Image introuvable" });

        const base64 = Buffer.from(blob).toString("base64");

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=3600"
            },
            body: base64,
            isBase64Encoded: true
        };
    } catch (error) {
        logFunctionError("admin-get-image", error, context.awsRequestId);
        return json(500, { error: "Erreur serveur" });
    }
};
