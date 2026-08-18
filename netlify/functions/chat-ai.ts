import type { Handler } from "@netlify/functions";
import { logFunctionError } from "./_shared/technical-log";
import { parseJsonObject, RequestValidationError } from "./_shared/request-security";

const MODEL = "@cf/meta/llama-3.2-3b-instruct";
const FALLBACK_MODEL = "@cf/meta/llama-3.2-1b-instruct";
const MAX_MESSAGE_LENGTH = 400;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

// Simple in-memory rate limiting per IP
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = ipRequestCounts.get(ip);
    if (!record || now > record.resetAt) {
        ipRequestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }
    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return true;
    }
    record.count += 1;
    return false;
}

const SYSTEM_PROMPT = `Tu es l'assistant virtuel officiel de l'EHPAD de Crécy-la-Chapelle (Seine-et-Marne, 77580).
Ton rôle est d'accueillir chaleureusement les familles, résidents et visiteurs, et de répondre avec précision, bienveillance et concision à leurs questions sur la vie à l'établissement.

INFORMATIONS EXACTES SUR L'ÉTABLISSEMENT :
- Adresse : 2 rue de la Chapelle, 77580 Crécy-la-Chapelle (la "Venise Briarde", le long du Grand Morin).
- Téléphone standard : 01 64 63 80 00 (joignable du lundi au vendredi de 9h à 18h).
- Tarifs 2026 en vigueur :
  * Chambre simple : 70,55 € / jour.
  * Chambre double : 63,50 € / jour.
  * Dépendance : GIR 1-2 = 21,90 €/j, GIR 3-4 = 13,90 €/j, GIR 5-6 (ticket modérateur) = 5,90 €/j.
  * Aides financières acceptées : APA (département), ASH (aide sociale à l'hébergement), APL / ALS (Caf).
  * Simulateur de reste à charge disponible sur /admissions.
- Admissions : inscription via le portail national ViaTrajectoire ou dossier papier à l'accueil.
- Visites : libres tous les jours, recommandées entre 14h et 18h pour respecter le rythme des soins du matin.
- Restauration : repas cuisinés sur place par le chef avec produits frais, régimes adaptés. La salle de restaurant et la cuisine se trouvent dans le bâtiment historique en pierre érigé en 1868 (ancien hospice de Montplaisir).
- Postier numérique : service gratuit sur /familles permettant aux proches d'envoyer un mot et une photo imprimés et distribués au résident.
- Vie sociale & Animations : ateliers mémoire, gymnastique douce, musique, sorties au bord des brassets, Gazette « L'Écho du Cœur ».
- Animaux : admis en visite sous conditions (vaccinés, tenus en laisse).

RÈGLES STRICTES DE RÉPONSE :
1. Réponds toujours en français, avec un ton poli, chaleureux et direct.
2. Sois concis : 2 à 4 phrases maximum par réponse.
3. Si la question porte sur un diagnostic médical privé, un traitement ou l'état de santé confidentiel d'un résident, refuse avec courtoisie et invite à contacter directement le médecin coordonnateur ou l'infirmière référente au 01 64 63 80 00.
4. Tu peux suggérer un lien utile sous la forme : [Nom du lien](/url), par exemple [Tarifs & Admissions](/admissions), [Nous contacter](/contact), [Visite](/visite), [Envoyer une carte](/familles).
5. N'invente aucune information non présente dans le contexte officiel ci-dessus.`;

type CloudflareResponse = {
    success?: boolean;
    result?: { response?: string };
    errors?: Array<{ code?: number; message?: string }>;
};

export const handler: Handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Méthode non autorisée" }),
        };
    }

    const clientIp = event.headers["x-nf-client-connection-ip"] ||
        event.headers["client-ip"] ||
        event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        "anonymous";

    if (isRateLimited(clientIp)) {
        return {
            statusCode: 429,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                error: "Trop de questions en peu de temps. Veuillez patienter une minute.",
            }),
        };
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
    const apiToken = process.env.CLOUDFLARE_AI_TOKEN?.trim();

    try {
        const body = parseJsonObject(event.body, 16 * 1024);
        const message = String(body.message || "").trim();
        const history = Array.isArray(body.history) ? body.history : [];

        if (!message || message.length > MAX_MESSAGE_LENGTH) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    error: `La question doit comporter entre 1 et ${MAX_MESSAGE_LENGTH} caractères.`,
                }),
            };
        }

        // If Cloudflare credentials are missing, return 503 so client falls back to local rules
        if (!accountId || !apiToken) {
            return {
                statusCode: 503,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Service IA non configuré, mode local activé." }),
            };
        }

        const messagesForAI = [
            { role: "system", content: SYSTEM_PROMPT },
            ...history.slice(-4).map((h: { sender: string; text: string }) => ({
                role: h.sender === "user" ? "user" : "assistant",
                content: String(h.text || "").slice(0, 300),
            })),
            { role: "user", content: message },
        ];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12_000);

        let responseText = "";

        try {
            const aiRes = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: messagesForAI,
                        max_tokens: 250,
                        temperature: 0.3,
                    }),
                    signal: controller.signal,
                },
            );

            clearTimeout(timeoutId);
            const data = (await aiRes.json()) as CloudflareResponse;

            if (aiRes.ok && data.success && data.result?.response) {
                responseText = data.result.response.trim();
            } else {
                // Try fallback model
                const fallbackRes = await fetch(
                    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${FALLBACK_MODEL}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${apiToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            messages: messagesForAI,
                            max_tokens: 250,
                            temperature: 0.3,
                        }),
                    },
                );
                const fallbackData = (await fallbackRes.json()) as CloudflareResponse;
                if (fallbackRes.ok && fallbackData.success && fallbackData.result?.response) {
                    responseText = fallbackData.result.response.trim();
                }
            }
        } catch (fetchErr) {
            clearTimeout(timeoutId);
            logFunctionError("chat-ai", fetchErr, { clientIp });
        }

        if (!responseText) {
            return {
                statusCode: 503,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "L'IA n'a pas pu répondre, bascule vers le mode local." }),
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
            body: JSON.stringify({ response: responseText }),
        };
    } catch (err) {
        if (err instanceof RequestValidationError) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: err.message }),
            };
        }
        logFunctionError("chat-ai", err, { clientIp });
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Une erreur interne est survenue." }),
        };
    }
};
