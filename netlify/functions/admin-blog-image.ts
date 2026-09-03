import type { Handler } from "@netlify/functions";
import { logFunctionError } from "./_shared/technical-log";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { commitChanges, skipCiCommitMessage } from "./_shared/github";
import { parseJsonObject, validateImage, validationStatus } from "./_shared/request-security";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function safeBaseName(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "").slice(0, 60) || "article";
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const body = parseJsonObject(event.body, 6 * 1024 * 1024);
        const image = (await validateImage(body.imageBase64, { maxBytes: MAX_IMAGE_BYTES, maxWidth: 2_000, maxHeight: 2_000, formats: ["webp"] })).buffer;
        const name = `${Date.now()}-${safeBaseName(String(body.fileName || "article"))}.webp`;
        const publicPath = `/images/uploads/blog/${name}`;
        await commitChanges(skipCiCommitMessage(`Blog : ajoute l'image ${name}`), [{
            path: `public${publicPath}`,
            content: image.toString("base64"),
            encoding: "base64",
        }]);
        return json(200, { success: true, path: publicPath });
    } catch (error) {
        logFunctionError("admin-blog-image", error, context.awsRequestId);
        return json(validationStatus(error), { error: error instanceof Error ? error.message : "Envoi de l'image impossible" });
    }
};
