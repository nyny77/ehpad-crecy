import type { Handler } from "@netlify/functions";
import { randomBytes } from "node:crypto";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { commitChanges, readRepositoryText, type GitChange } from "./_shared/github";

export interface Resident {
    id: string;
    name: string;
    room: string;
    secretCode: string;
}

const RESIDENTS_PATH = "src/lib/data/residents.json";

function generateSecretCode(name: string): string {
    const firstName = name.split(" ")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
    const digits = Math.floor(1000 + Math.random() * 9000);
    return `${firstName.slice(0, 5)}-${digits}`;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });

    try {
        let data: { residents: Resident[] } = { residents: [] };
        try {
            data = JSON.parse(await readRepositoryText(RESIDENTS_PATH));
        } catch (e: any) {
            if (!e.message.includes("404")) throw e;
        }

        if (event.httpMethod === "GET") {
            return json(200, data);
        }

        if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

        const body = JSON.parse(event.body || "{}");
        const action = body.action || "add";
        const changes: GitChange[] = [];

        if (action === "add") {
            const name = String(body.name || "").trim();
            const room = String(body.room || "").trim();
            if (!name) return json(400, { error: "Le nom est obligatoire" });
            
            const resident: Resident = {
                id: randomBytes(8).toString("hex"),
                name,
                room,
                secretCode: generateSecretCode(name)
            };
            data.residents.push(resident);
        } else if (action === "update") {
            const resident = data.residents.find(r => r.id === body.id);
            if (!resident) return json(404, { error: "Résident introuvable" });
            
            if (body.name) resident.name = String(body.name).trim();
            if (body.room !== undefined) resident.room = String(body.room).trim();
            if (body.resetCode) resident.secretCode = generateSecretCode(resident.name);
        } else if (action === "delete") {
            const idsToDelete = Array.isArray(body.ids) ? body.ids : (body.id ? [body.id] : []);
            if (idsToDelete.length === 0) return json(400, { error: "Aucun résident sélectionné" });
            data.residents = data.residents.filter(r => !idsToDelete.includes(r.id));
        } else {
            return json(400, { error: "Action inconnue" });
        }

        changes.push({ path: RESIDENTS_PATH, content: JSON.stringify(data, null, 2) + "\n" });
        await commitChanges(`Résidents : ${action}`, changes);
        return json(200, { success: true, residents: data.residents });
    } catch (error) {
        console.error("residents administration failed", error);
        return json(500, { error: error instanceof Error ? error.message : "Erreur lors de la sauvegarde" });
    }
};
