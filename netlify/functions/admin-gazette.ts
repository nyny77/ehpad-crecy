import type { Handler } from "@netlify/functions";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { commitChanges, readRepositoryText } from "./_shared/github";

const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10MB max for PDF

function safeBaseName(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "").slice(0, 60) || "gazette";
}

function decodeFile(value: unknown): Buffer {
    const encoded = String(value || "").replace(/^data:application\/pdf;base64,/i, "");
    const buffer = Buffer.from(encoded, "base64");
    if (!buffer.length || buffer.length > MAX_PDF_BYTES) {
        throw new Error("Le fichier dépasse la limite de 10 Mo");
    }
    return buffer;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const body = JSON.parse(event.body || "{}");
        const file = decodeFile(body.fileBase64);
        const title = body.title || "Nouvelle gazette";
        
        // Ensure name is clean and ends with .pdf
        const name = `${Date.now()}-${safeBaseName(String(body.fileName || "gazette"))}.pdf`;
        const publicPath = `/documents/${name}`;
        
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
            title,
            file: publicPath,
            date: new Date().toISOString()
        };

        existingData.gazettes.unshift(newGazetteData);

        // We commit 2 files at once: the new PDF, and the updated gazette.json
        await commitChanges(`Gazette : nouvelle parution (${name})`, [
            {
                path: `public${publicPath}`,
                content: file.toString("base64"),
                encoding: "base64",
            },
            {
                path: "src/lib/data/gazette.json",
                content: JSON.stringify(existingData, null, 2) + "\n",
                encoding: "utf-8",
            }
        ]);
        
        return json(200, { success: true, path: publicPath });
    } catch (error) {
        console.error("gazette upload failed", error);
        return json(500, { error: error instanceof Error ? error.message : "Envoi du fichier impossible" });
    }
};
