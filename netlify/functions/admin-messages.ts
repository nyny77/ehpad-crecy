import type { Handler } from "@netlify/functions";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { logFunctionError } from "./_shared/technical-log";
import { getMessagesStore, getImagesStore } from "./_shared/blob-storage";
import type { FamilyMessage } from "./famille-send-message";
import { parseJsonObject, validationStatus } from "./_shared/request-security";

const DISTRIBUTED_MESSAGE_RETENTION_DAYS = 0; // Effacement automatique direct

function isExpiredDistributedMessage(message: FamilyMessage, now = Date.now()): boolean {
    if (message.status !== "distribue" || !message.distributedAt) return false;
    const distributedAt = Date.parse(message.distributedAt);
    if (!Number.isFinite(distributedAt)) return false;
    return distributedAt <= now - DISTRIBUTED_MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });

    try {
        const messagesStore = getMessagesStore();
        const imagesStore = getImagesStore();
        
        // 1. Charger tous les messages
        const { blobs } = await messagesStore.list();
        let messages: FamilyMessage[] = [];
        for (const b of blobs) {
            messages.push(await messagesStore.get(b.key, { type: "json" }) as FamilyMessage);
        }

        if (event.httpMethod === "GET") {
            return json(200, { messages });
        }

        if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

        const body = parseJsonObject(event.body, 64 * 1024);
        const action = String(body.action || "markDistributed");

        const deletePhoto = async (photoUrl: string | null) => {
            // Ne supprimer du blob que si ce n'est pas une ancienne image GitHub (commençant par /)
            if (photoUrl && !photoUrl.startsWith("/")) {
                await imagesStore.delete(photoUrl);
            }
        };

        if (action === "markDistributed") {
            const messageId = String(body.id || "");
            const message = messages.find(m => m.id === messageId);
            
            if (!message) return json(404, { error: "Message introuvable" });
            if (message.status === "distribue") return json(400, { error: "Message déjà distribué" });

            // User preference: effacement automatique direct
            await deletePhoto(message.photoUrl);
            await messagesStore.delete(message.id);
            
            message.status = "distribue";
            message.distributedAt = new Date().toISOString();
            message.photoUrl = null;

            return json(200, { success: true, message });
        } else if (action === "delete") {
            const messageId = String(body.id || "");
            const message = messages.find(m => m.id === messageId);
            if (!message) return json(404, { error: "Message introuvable" });

            await deletePhoto(message.photoUrl);
            await messagesStore.delete(message.id);

            return json(200, { success: true });
        } else if (action === "bulkDelete") {
            const messageIds = Array.isArray(body.ids) ? body.ids.map(String).slice(0, 200) : [];
            if (messageIds.length === 0) return json(400, { error: "Aucun message sélectionné" });

            const messagesToDelete = messages.filter(m => messageIds.includes(m.id));
            for (const message of messagesToDelete) {
                await deletePhoto(message.photoUrl);
                await messagesStore.delete(message.id);
            }

            return json(200, { success: true });
        } else if (action === "purgeExpired") {
            const expiredMessages = messages.filter(message => isExpiredDistributedMessage(message));
            if (expiredMessages.length === 0) return json(200, { success: true, deletedCount: 0 });

            for (const message of expiredMessages) {
                await deletePhoto(message.photoUrl);
                await messagesStore.delete(message.id);
            }

            return json(200, { success: true, deletedCount: expiredMessages.length });
        } else {
            return json(400, { error: "Action inconnue" });
        }
    } catch (error) {
        logFunctionError("admin-messages", error, context.awsRequestId);
        return json(validationStatus(error), { error: error instanceof Error ? error.message : "Erreur lors de la gestion du courrier" });
    }
};
