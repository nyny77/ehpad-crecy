import type { Handler } from "@netlify/functions";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { getMessagesStore, getResidentsStore } from "./_shared/blob-storage";
import { logFunctionError } from "./_shared/technical-log";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

function hashSecret(secret: string): string {
    // Generate a secure hash. We use sha256 for simplicity in matching.
    return crypto.createHash("sha256").update(secret).digest("hex");
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const residentsStore = getResidentsStore();
        const messagesStore = getMessagesStore();

        // 1. Lire les anciens fichiers JSON
        const residentsPath = path.resolve(process.cwd(), "src/lib/data/residents.json");
        const messagesPath = path.resolve(process.cwd(), "src/lib/data/messages.json");
        
        const residentsData = JSON.parse(await fs.readFile(residentsPath, "utf-8"));
        const messagesData = JSON.parse(await fs.readFile(messagesPath, "utf-8"));

        // 2. Migrer les résidents avec codes hachés
        for (const resident of residentsData.residents) {
            // Hachage du code secret (s'il n'est pas déjà haché)
            // On le garde lisible en mémoire temporairement pour la migration si nécessaire
            const hashedCode = resident.secretCode.length === 64 ? resident.secretCode : hashSecret(resident.secretCode);
            
            const secureResident = {
                ...resident,
                secretCode: hashedCode // Remplace le code en clair par le hash
            };
            await residentsStore.setJSON(resident.id, secureResident);
        }

        // 3. Migrer les messages
        for (const message of messagesData.messages) {
            await messagesStore.setJSON(message.id, message);
        }

        return json(200, { 
            message: "Migration réussie", 
            residentsCount: residentsData.residents.length, 
            messagesCount: messagesData.messages.length 
        });
    } catch (error) {
        logFunctionError("admin-migrate-blobs", error, context.awsRequestId);
        return json(500, { error: "Erreur lors de la migration vers Netlify Blobs" });
    }
};
