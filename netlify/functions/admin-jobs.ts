import type { Handler } from "@netlify/functions";
import { randomUUID } from "node:crypto";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { commitChanges, readRepositoryText } from "./_shared/github";
import { fetchFhfOffers, mergeFhfOffers } from "./_shared/fhf-jobs";
import { logFunctionError } from "./_shared/technical-log";
import { parseJsonObject, validationStatus } from "./_shared/request-security";
import { JOB_FACILITIES, type JobOffer, type JobsData, type JobStatus } from "../../src/lib/job-types";

const JOBS_PATH = "src/lib/data/jobs.json";
const STATUSES = new Set<JobStatus>(["pending", "published", "hidden", "ignored"]);

function text(value: unknown, max: number): string {
    return String(value || "").trim().slice(0, max);
}

function editedOffer(body: Record<string, any>, existing?: JobOffer): JobOffer {
    const facility = JOB_FACILITIES.find((item) => item.id === body.facilityId);
    if (!facility) throw new Error("Établissement invalide");
    const title = text(body.title, 160);
    const description = text(body.description, 4_000);
    const contract = text(body.contract, 80) || "À préciser";
    const status = text(body.status, 20) as JobStatus;
    if (!title || !description) throw new Error("Le titre et la description sont obligatoires");
    if (!STATUSES.has(status)) throw new Error("Statut invalide");
    const requirements = Array.isArray(body.requirements)
        ? body.requirements.slice(0, 12).map((item) => ({ req: text(typeof item === "string" ? item : item?.req, 180) })).filter((item) => item.req)
        : [];
    const deadline = text(body.deadline, 10);
    if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) throw new Error("Date limite invalide");
    const now = new Date().toISOString();
    return {
        ...(existing || {} as JobOffer),
        id: existing?.id || `manual-${randomUUID()}`,
        source: existing?.source || "manual",
        facilityId: facility.id,
        facilityName: facility.name,
        city: facility.city,
        title,
        contract,
        description,
        requirements,
        deadline: deadline || undefined,
        status,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
    };
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });
    try {
        const body = parseJsonObject(event.body, 128 * 1024);
        const current = JSON.parse(await readRepositoryText(JOBS_PATH)) as JobsData;
        let next = current;
        const action = text(body.action, 20);

        if (action === "sync") {
            const imported = await fetchFhfOffers();
            next = mergeFhfOffers(current, imported);
        } else if (action === "create") {
            next = { ...current, offers: [...current.offers, editedOffer(body)] };
        } else if (action === "update") {
            const id = text(body.id, 100);
            const existing = current.offers.find((offer) => offer.id === id);
            if (!existing) return json(404, { error: "Offre introuvable" });
            next = { ...current, offers: current.offers.map((offer) => offer.id === id ? editedOffer(body, existing) : offer) };
        } else {
            return json(400, { error: "Action inconnue" });
        }

        await commitChanges(`Recrutement : ${action === "sync" ? "synchronisation FHF" : "mise à jour des offres"}`, [
            { path: JOBS_PATH, content: JSON.stringify(next, null, 2) + "\n" },
        ]);
        return json(200, { success: true, data: next });
    } catch (error) {
        logFunctionError("admin-jobs", error, context.awsRequestId);
        return json(validationStatus(error), { error: error instanceof Error ? error.message : "Gestion des offres impossible" });
    }
};

