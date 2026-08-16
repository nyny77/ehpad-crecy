import type { Handler } from "@netlify/functions";
import { logFunctionError } from "./_shared/technical-log";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { commitChanges, readRepositoryText } from "./_shared/github";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB max for image

function safeBaseName(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "").slice(0, 60) || "gazette";
}

function decodeImage(value: unknown): Buffer {
    const encoded = String(value || "").replace(/^data:image\/\w+;base64,/i, "");
    const buffer = Buffer.from(encoded, "base64");
    if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) {
        throw new Error("Une image dépasse la limite de 5 Mo");
    }
    return buffer;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const body = JSON.parse(event.body || "{}");
        const title = body.title || "Nouvelle gazette";
        const blocks = body.content || [];
        const pageBackgroundColor = body.pageBackgroundColor;
        const filesToCommit: { path: string; content: string; encoding: "utf-8" | "base64" }[] = [];

        // Traiter les images dans les blocs
        const processedBlocks = blocks.map((block: any) => {
            if (block.type === "image") {
                if (block.base64) {
                    try {
                        const buffer = decodeImage(block.base64);
                        const imageName = `${Date.now()}-${safeBaseName("img")}.jpg`;
                        const publicPath = `/images/gazette/${imageName}`;
                        
                        filesToCommit.push({
                            path: `public${publicPath}`,
                            content: buffer.toString("base64"),
                            encoding: "base64",
                        });

                        return {
                            id: block.id,
                            type: "image",
                            url: publicPath,
                            caption: block.caption || "",
                            layout: block.layout || "center",
                            backgroundColor: block.backgroundColor
                        };
                    } catch (e) {
                        logFunctionError("admin-gazette-generate:image-decode", e, context.awsRequestId);
                        return { ...block, base64: undefined, url: block.content };
                    }
                } else {
                    // External URL case (e.g., from image search)
                    return {
                        id: block.id,
                        type: "image",
                        url: block.content, // use content as URL
                        caption: block.caption || "",
                        layout: block.layout || "center",
                        backgroundColor: block.backgroundColor
                    };
                }
            }
            return block;
        });

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
            backgroundColor: pageBackgroundColor || "#FDF7F0"
        };

        existingData.gazettes.unshift(newGazetteData);

        filesToCommit.push({
            path: "src/lib/data/gazette.json",
            content: JSON.stringify(existingData, null, 2) + "\n",
            encoding: "utf-8",
        });

        await commitChanges(`Gazette : génération de "${title}"`, filesToCommit);
        
        return json(200, { success: true, id: newGazetteData.id });
    } catch (error) {
        logFunctionError("admin-gazette-generate", error, context.awsRequestId);
        return json(500, { error: error instanceof Error ? error.message : "Création impossible" });
    }
};
