import type { Context } from "@netlify/functions";
import { randomUUID } from "node:crypto";
import crypto from "node:crypto";
import { logFunctionError } from "./_shared/technical-log";
import { getMessagesStore, getResidentsStore, getImagesStore } from "./_shared/blob-storage";
import type { Resident } from "./admin-residents";
import { parseJsonObject, validateImage, validationStatus } from "./_shared/request-security";

export interface FamilyMessage {
    id: string;
    residentId: string;
    senderName: string;
    text: string;
    photoUrl: string | null;
    date: string;
    status: "nouveau" | "distribue";
    distributedAt?: string;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const json = (status: number, body: unknown) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export default async (req: Request, context: Context) => {
    // Endpoint public
    if (req.method !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const bodyText = await req.text();
        const body = parseJsonObject(bodyText, 8 * 1024 * 1024);
        const action = String(body.action || "send").trim();
        const secretCode = String(body.secretCode || "").trim().toUpperCase();
        const senderName = String(body.senderName || "").trim();
        const text = String(body.text || "").trim();
        const imageBase64 = body.imageBase64;
        const turnstileToken = String(body.turnstileToken || "");

        if (!secretCode) return json(400, { error: "Le code secret est obligatoire." });
        if (!new Set(["send", "verify"]).has(action)) return json(400, { error: "Action invalide." });
        if (senderName.length > 100 || text.length > 2_000) return json(400, { error: "Le nom ou le message est trop long." });
        if (action === "send" && (!senderName || !text)) {
            return json(400, { error: "Le nom et le message sont obligatoires." });
        }

        // --- 1. Validation du CAPTCHA ---
        if (action === "send") {
            if (process.env.CF_TURNSTILE_SECRET) {
                const formData = new FormData();
                formData.append("secret", process.env.CF_TURNSTILE_SECRET);
                formData.append("response", turnstileToken);
                formData.append("remoteip", req.headers.get("client-ip") || req.headers.get("x-forwarded-for") || "");

                const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                    body: formData,
                    method: "POST",
                });
                const outcome = await result.json();
                if (!outcome.success) {
                    return json(403, { error: "Échec de la validation du CAPTCHA (humain)." });
                }
            } else {
                // Mode fallback si pas configuré
                if (!turnstileToken) {
                    return json(400, { error: "Veuillez cocher la case 'Je suis un humain'." });
                }
            }
        }

        // --- 2. Vérification du Code Secret ---
        const residentsStore = getResidentsStore();
        const { blobs } = await residentsStore.list();
        let resident: Resident | null = null;
        const hashedInputCode = crypto.createHash("sha256").update(secretCode).digest("hex");

        for (const b of blobs) {
            const res = await residentsStore.get(b.key, { type: "json" }) as Resident;
            // Support rétro-compatible pendant la migration
            const storedHash = res.secretCode.length === 64 ? res.secretCode : crypto.createHash("sha256").update(res.secretCode).digest("hex");
            if (storedHash === hashedInputCode) {
                resident = res;
                break;
            }
        }

        if (!resident) {
            // Erreur générique pour éviter l'énumération
            return json(401, { error: "Code secret incorrect." });
        }

        if (action === "verify") {
            return json(200, { success: true, residentName: resident.name });
        }

        // --- 3. Traitement de la photo ---
        let photoUrl: string | null = null;
        if (imageBase64) {
            const image = (await validateImage(imageBase64, { maxBytes: MAX_IMAGE_BYTES, maxWidth: 2_000, maxHeight: 2_000, formats: ["webp"] })).buffer;
            const name = `msg-${Date.now()}-${randomUUID().slice(0, 8)}.webp`;
            
            const imagesStore = getImagesStore();
            await imagesStore.set(name, image as any);
            photoUrl = name; // On ne stocke que la clé de l'image
        }

        // --- 4. Enregistrement du message ---
        const messagesStore = getMessagesStore();
        const newMessage: FamilyMessage = {
            id: randomUUID(),
            residentId: resident.id,
            senderName,
            text,
            photoUrl,
            date: new Date().toISOString(),
            status: "nouveau"
        };

        await messagesStore.setJSON(newMessage.id, newMessage);

        return json(200, { success: true, residentName: resident.name });
    } catch (error) {
        logFunctionError("famille-send-message", error, context.requestId || "unknown");
        return json(validationStatus(error), { error: error instanceof Error ? error.message : "Erreur lors de l'envoi du message" });
    }
};
