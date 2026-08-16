import type { Handler } from "@netlify/functions";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { logFunctionError } from "./_shared/technical-log";
import { commitChanges, readRepositoryText, type GitChange } from "./_shared/github";
import type { FamilyMessage } from "./famille-send-message";

const MESSAGES_PATH = "src/lib/data/messages.json";
const DISTRIBUTED_MESSAGE_RETENTION_DAYS = 30;

function isExpiredDistributedMessage(message: FamilyMessage, now = Date.now()): boolean {
    if (message.status !== "distribue" || !message.distributedAt) return false;

    const distributedAt = Date.parse(message.distributedAt);
    if (!Number.isFinite(distributedAt)) return false;

    return distributedAt <= now - DISTRIBUTED_MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });

    try {
        let data: { messages: FamilyMessage[] } = { messages: [] };
        try {
            data = JSON.parse(await readRepositoryText(MESSAGES_PATH));
        } catch (e: any) {
            if (!e.message.includes("404")) throw e;
        }

        if (event.httpMethod === "GET") {
            return json(200, data);
        }

        if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

        const body = JSON.parse(event.body || "{}");
        const action = body.action || "markDistributed";
        const changes: GitChange[] = [];

        if (action === "markDistributed") {
            const messageId = String(body.id || "");
            const message = data.messages.find(m => m.id === messageId);
            
            if (!message) return json(404, { error: "Message introuvable" });
            if (message.status === "distribue") return json(400, { error: "Message déjà distribué" });

            message.status = "distribue";
            message.distributedAt = new Date().toISOString();

            // If there's a photo, we delete it from GitHub to save space
            if (message.photoUrl) {
                changes.push({ path: `public${message.photoUrl}`, content: null });
                message.photoUrl = null;
            }

            changes.push({ path: MESSAGES_PATH, content: JSON.stringify(data, null, 2) + "\n" });
            await commitChanges("Postier : courrier distribué et photo nettoyée", changes);

            return json(200, { success: true, message });
        } else if (action === "delete") {
            const messageId = String(body.id || "");
            const message = data.messages.find(m => m.id === messageId);
            if (!message) return json(404, { error: "Message introuvable" });

            data.messages = data.messages.filter(m => m.id !== messageId);
            
            if (message.photoUrl && message.status !== "distribue") {
                changes.push({ path: `public${message.photoUrl}`, content: null });
            }

            changes.push({ path: MESSAGES_PATH, content: JSON.stringify(data, null, 2) + "\n" });
            await commitChanges("Postier : courrier supprimé", changes);

            return json(200, { success: true });
        } else if (action === "bulkDelete") {
            const messageIds = Array.isArray(body.ids) ? body.ids : [];
            if (messageIds.length === 0) return json(400, { error: "Aucun message sélectionné" });

            const messagesToDelete = data.messages.filter(m => messageIds.includes(m.id));
            data.messages = data.messages.filter(m => !messageIds.includes(m.id));
            
            for (const message of messagesToDelete) {
                if (message.photoUrl && message.status !== "distribue") {
                    changes.push({ path: `public${message.photoUrl}`, content: null });
                }
            }

            changes.push({ path: MESSAGES_PATH, content: JSON.stringify(data, null, 2) + "\n" });
            await commitChanges("Postier : courriers supprimés", changes);

            return json(200, { success: true });
        } else if (action === "purgeExpired") {
            const expiredMessages = data.messages.filter(message => isExpiredDistributedMessage(message));
            if (expiredMessages.length === 0) return json(200, { success: true, deletedCount: 0 });

            const expiredIds = new Set(expiredMessages.map(message => message.id));
            data.messages = data.messages.filter(message => !expiredIds.has(message.id));

            for (const message of expiredMessages) {
                if (message.photoUrl) {
                    changes.push({ path: `public${message.photoUrl}`, content: null });
                }
            }

            changes.push({ path: MESSAGES_PATH, content: JSON.stringify(data, null, 2) + "\n" });
            await commitChanges("Postier : purge automatique des courriers expirés", changes);

            return json(200, { success: true, deletedCount: expiredMessages.length });
        } else {
            return json(400, { error: "Action inconnue" });
        }
    } catch (error) {
        logFunctionError("admin-messages", error, context.awsRequestId);
        return json(500, { error: error instanceof Error ? error.message : "Erreur lors de la gestion du courrier" });
    }
};
