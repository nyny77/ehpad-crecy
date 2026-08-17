import type { Handler } from "@netlify/functions";
import { randomBytes } from "node:crypto";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { logFunctionError } from "./_shared/technical-log";
import { parseJsonObject, validationStatus } from "./_shared/request-security";
import { getResidentsStore } from "./_shared/blob-storage";

export interface Resident {
    id: string;
    name: string;
    room: string;
    secretCode: string;
}

function generateSecretCode(name: string): string {
    const firstName = name.split(" ")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
    const digits = Math.floor(1000 + Math.random() * 9000);
    return `${firstName.slice(0, 5)}-${digits}`;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });

    try {
        const residentsStore = getResidentsStore();
        const { blobs } = await residentsStore.list();
        const residents: Resident[] = [];
        
        for (const b of blobs) {
            const data = await residentsStore.get(b.key, { type: "json" }) as Resident | null;
            if (data) residents.push(data);
        }

        if (event.httpMethod === "GET") {
            return json(200, { residents });
        }

        if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

        const body = parseJsonObject(event.body, 64 * 1024);
        const action = String(body.action || "add");

        if (action === "add") {
            const name = String(body.name || "").trim();
            const room = String(body.room || "").trim();
            if (!name || name.length > 120 || room.length > 40) return json(400, { error: "Le nom ou la chambre est invalide" });
            
            const resident: Resident = {
                id: randomBytes(8).toString("hex"),
                name,
                room,
                secretCode: generateSecretCode(name)
            };
            residents.push(resident);
            await residentsStore.setJSON(resident.id, resident);
        } else if (action === "update") {
            const resident = residents.find(r => r.id === body.id);
            if (!resident) return json(404, { error: "Résident introuvable" });
            
            if (body.name) resident.name = String(body.name).trim().slice(0, 120);
            if (body.room !== undefined) resident.room = String(body.room).trim().slice(0, 40);
            if (body.resetCode) resident.secretCode = generateSecretCode(resident.name);
            await residentsStore.setJSON(resident.id, resident);
        } else if (action === "delete") {
            const idsToDelete = Array.isArray(body.ids) ? body.ids : (body.id ? [body.id] : []);
            if (idsToDelete.length === 0) return json(400, { error: "Aucun résident sélectionné" });
            
            for (const id of idsToDelete) {
                await residentsStore.delete(String(id));
            }
            return json(200, { success: true, residents: residents.filter(r => !idsToDelete.includes(r.id)) });
        } else {
            return json(400, { error: "Action inconnue" });
        }

        return json(200, { success: true, residents });
    } catch (error) {
        logFunctionError("admin-residents", error, context.awsRequestId || "unknown");
        return json(validationStatus(error), { error: error instanceof Error ? error.message : "Erreur lors de la sauvegarde" });
    }
};
