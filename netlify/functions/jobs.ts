import type { Handler } from "@netlify/functions";
import { readJobs } from "./_shared/jobs-store";

export const handler: Handler = async (event) => {
    if (event.httpMethod !== "GET") return { statusCode: 405, body: "Méthode non autorisée" };
    try {
        const data = await readJobs(event);
        const today = new Date().toISOString().slice(0, 10);
        const offers = data.offers.filter((offer) => {
            if (offer.source === "fhf") {
                return offer.sourceActive !== false && (!offer.deadline || offer.deadline >= today);
            }
            return offer.status === "published";
        });
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
            body: JSON.stringify({ offers, lastFhfSyncAt: data.lastFhfSyncAt }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error instanceof Error ? error.message : "Offres indisponibles" }) };
    }
};
