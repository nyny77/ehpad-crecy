import type { Handler } from "@netlify/functions";
import { logFunctionError } from "./_shared/technical-log";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { commitChanges } from "./_shared/github";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function safeBaseName(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "").slice(0, 60) || "article";
}

function decodeImage(value: unknown): Buffer {
    const encoded = String(value || "").replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "");
    const buffer = Buffer.from(encoded, "base64");
    if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) {
        throw new Error("L'image compressée dépasse la limite de 4 Mo");
    }
    return buffer;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const body = JSON.parse(event.body || "{}");
        const image = decodeImage(body.imageBase64);
        const name = `${Date.now()}-${safeBaseName(String(body.fileName || "article"))}.webp`;
        const publicPath = `/images/uploads/blog/${name}`;
        await commitChanges(`Blog : ajoute l'image ${name}`, [{
            path: `public${publicPath}`,
            content: image.toString("base64"),
            encoding: "base64",
        }]);
        return json(200, { success: true, path: publicPath });
    } catch (error) {
        logFunctionError("admin-blog-image", error, context.awsRequestId);
        return json(500, { error: error instanceof Error ? error.message : "Envoi de l'image impossible" });
    }
};
