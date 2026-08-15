import type { Handler } from "@netlify/functions";
import { randomUUID } from "node:crypto";
import { json } from "./_shared/admin-auth";
import { commitChanges, readRepositoryText, type GitChange } from "./_shared/github";
import type { Resident } from "./admin-residents";

export interface FamilyMessage {
    id: string;
    residentId: string;
    senderName: string;
    text: string;
    photoUrl: string | null;
    date: string;
    status: "nouveau" | "distribue";
}

const RESIDENTS_PATH = "src/lib/data/residents.json";
const MESSAGES_PATH = "src/lib/data/messages.json";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function decodeImage(value: unknown): Buffer {
    const encoded = String(value || "").replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "");
    const buffer = Buffer.from(encoded, "base64");
    if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) throw new Error("L’image compressée dépasse la limite de 5 Mo");
    return buffer;
}

export const handler: Handler = async (event) => {
    // Note: Public endpoint, no admin-auth required. We authenticate via secretCode.
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const body = JSON.parse(event.body || "{}");
        const action = String(body.action || "send").trim();
        const secretCode = String(body.secretCode || "").trim().toUpperCase();
        const senderName = String(body.senderName || "").trim();
        const text = String(body.text || "").trim();
        const imageBase64 = body.imageBase64;

        if (!secretCode) {
            return json(400, { error: "Le code secret est obligatoire." });
        }
        if (action === "send" && (!senderName || !text)) {
            return json(400, { error: "Le nom et le message sont obligatoires." });
        }

        // 1. Verify Secret Code
        let residentsData: { residents: Resident[] } = { residents: [] };
        try {
            residentsData = JSON.parse(await readRepositoryText(RESIDENTS_PATH));
        } catch (e: any) {
            if (!e.message.includes("404")) throw e;
        }

        const resident = residentsData.residents.find(r => r.secretCode === secretCode);
        if (!resident) {
            // Give a generic error to avoid code enumeration
            return json(401, { error: "Code secret incorrect." });
        }

        if (action === "verify") {
            return json(200, { success: true, residentName: resident.name });
        }

        // 2. Fetch Messages
        let messagesData: { messages: FamilyMessage[] } = { messages: [] };
        try {
            messagesData = JSON.parse(await readRepositoryText(MESSAGES_PATH));
        } catch (e: any) {
            if (!e.message.includes("404")) throw e;
        }

        const changes: GitChange[] = [];
        let photoUrl: string | null = null;

        // 3. Process Photo if present
        if (imageBase64) {
            const image = decodeImage(imageBase64);
            const name = `msg-${Date.now()}-${randomUUID().slice(0, 8)}.webp`;
            photoUrl = `/images/messages/${name}`;
            changes.push({ path: `public${photoUrl}`, content: image.toString("base64"), encoding: "base64" });
        }

        // 4. Create Message
        const newMessage: FamilyMessage = {
            id: randomUUID(),
            residentId: resident.id,
            senderName,
            text,
            photoUrl,
            date: new Date().toISOString(),
            status: "nouveau"
        };
        messagesData.messages.push(newMessage);

        // 5. Commit
        changes.push({ path: MESSAGES_PATH, content: JSON.stringify(messagesData, null, 2) + "\n" });
        await commitChanges(`Nouveau message de ${senderName} pour ${resident.name}`, changes);

        return json(200, { success: true, residentName: resident.name });
    } catch (error) {
        console.error("family send message failed", error);
        return json(500, { error: error instanceof Error ? error.message : "Erreur lors de l'envoi du message" });
    }
};
