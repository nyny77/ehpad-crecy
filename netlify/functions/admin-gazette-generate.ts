import type { Handler } from "@netlify/functions";
import { logFunctionError } from "./_shared/technical-log";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { commitChanges, readRepositoryText } from "./_shared/github";
import {
    parseJsonObject,
    safeColor,
    safeExternalImageUrl,
    sanitizeRichText,
    validateImage,
    validationStatus,
} from "./_shared/request-security";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB max for image

function safeBaseName(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "").slice(0, 60) || "gazette";
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const body = parseJsonObject(event.body, 30 * 1024 * 1024);
        const title = sanitizeRichText(body.title || "Nouvelle gazette", 300);
        const blocks = Array.isArray(body.content) ? body.content : [];
        if (!title || blocks.length === 0 || blocks.length > 80) return json(400, { error: "Le titre ou le contenu de la gazette est invalide." });
        const pageBackgroundColor = safeColor(body.pageBackgroundColor, "#FDF7F0");
        const filesToCommit: { path: string; content: string; encoding: "utf-8" | "base64" }[] = [];

        const processedBlocks = await Promise.all(blocks.map(async (rawBlock: unknown, index: number) => {
            if (!rawBlock || typeof rawBlock !== "object" || Array.isArray(rawBlock)) throw new Error("Bloc de gazette invalide");
            const block = rawBlock as Record<string, unknown>;
            const type = String(block.type || "");
            if (!["text", "title", "image", "toc"].includes(type)) throw new Error("Type de bloc invalide");
            const id = String(block.id || `bloc-${index}`).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || `bloc-${index}`;
            const backgroundColor = safeColor(block.backgroundColor);

            if (block.type === "image") {
                if (block.base64) {
                    try {
                        const { buffer, format } = await validateImage(block.base64, { maxBytes: MAX_IMAGE_BYTES, maxWidth: 2_000, maxHeight: 2_000 });
                        const extension = format === "jpeg" ? "jpg" : format;
                        const imageName = `${Date.now()}-${safeBaseName(id)}.${extension}`;
                        const publicPath = `/images/gazette/${imageName}`;
                        
                        filesToCommit.push({
                            path: `public${publicPath}`,
                            content: buffer.toString("base64"),
                            encoding: "base64",
                        });

                        return {
                            id,
                            type: "image",
                            url: publicPath,
                            caption: sanitizeRichText(block.caption, 2_000),
                            layout: ["left", "center", "right"].includes(String(block.layout)) ? String(block.layout) : "center",
                            backgroundColor,
                        };
                    } catch (error) {
                        logFunctionError("admin-gazette-generate:image-decode", error, context.awsRequestId);
                        throw error;
                    }
                } else {
                    // External URL case (e.g., from image search)
                    return {
                        id,
                        type: "image",
                        url: safeExternalImageUrl(block.content),
                        caption: sanitizeRichText(block.caption, 2_000),
                        layout: ["left", "center", "right"].includes(String(block.layout)) ? String(block.layout) : "center",
                        backgroundColor,
                    };
                }
            }
            return {
                id,
                type,
                content: type === "toc" ? "" : sanitizeRichText(block.content, type === "title" ? 2_000 : 20_000),
                backgroundColor,
            };
        }));

        // Lire le fichier existant
        let existingData = { gazettes: [] as any[] };
        try {
            const oldContent = await readRepositoryText("src/lib/data/gazette.json");
            existingData = JSON.parse(oldContent);
            if (!existingData.gazettes) {
                existingData = { gazettes: (existingData as any).file ? [{ title: "Ancienne gazette", file: (existingData as any).file, date: (existingData as any).date }] : [] };
            }
        } catch (e) {
            console.log("Could not read existing gazette.json, assuming new", e);
        }
        
        const newGazetteData = {
            id: `gazette_${Date.now()}`,
            title,
            type: "generated",
            date: new Date().toISOString(),
            content: processedBlocks,
            backgroundColor: pageBackgroundColor
        };

        existingData.gazettes.unshift(newGazetteData);

        filesToCommit.push({
            path: "src/lib/data/gazette.json",
            content: JSON.stringify(existingData, null, 2) + "\n",
            encoding: "utf-8",
        });

        await commitChanges(`Gazette : génération de "${title.replace(/<[^>]*>/g, "").slice(0, 120)}"`, filesToCommit);
        
        return json(200, { success: true, id: newGazetteData.id });
    } catch (error) {
        logFunctionError("admin-gazette-generate", error, context.awsRequestId);
        return json(validationStatus(error), { error: error instanceof Error ? error.message : "Création impossible" });
    }
};
