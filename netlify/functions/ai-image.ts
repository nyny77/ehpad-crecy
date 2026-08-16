import type { Handler } from "@netlify/functions";
import { logFunctionError } from "./_shared/technical-log";
import { isAdminRequest, json } from "./_shared/admin-auth";

const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const MAX_PROMPT_LENGTH = 500;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type CloudflareResponse = {
    success?: boolean;
    result?: { image?: string };
    errors?: Array<{ code?: number; message?: string }>;
};

function cloudflareError(status: number, payload: CloudflareResponse): string {
    const code = payload.errors?.[0]?.code;
    if (status === 401) return "Le jeton Cloudflare est invalide ou expiré.";
    if (status === 403 && code === 5035) return "Ce modèle nécessite une offre Cloudflare payante.";
    if (status === 403) return "Le compte Cloudflare n'autorise pas cette génération.";
    if (status === 429 && code === 3036) return "Le quota gratuit Cloudflare du jour est épuisé.";
    if (status === 429) return "Cloudflare est momentanément saturé. Réessayez dans quelques minutes.";
    return payload.errors?.[0]?.message || `Cloudflare a répondu avec l'erreur ${status}.`;
}

export const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
    const apiToken = process.env.CLOUDFLARE_AI_TOKEN?.trim();
    if (!accountId || !apiToken) {
        return json(503, { error: "La génération d'images n'est pas encore configurée." });
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const prompt = String(body.prompt || "").trim();
        if (prompt.length < 3 || prompt.length > MAX_PROMPT_LENGTH) {
            return json(400, { error: `La description doit contenir entre 3 et ${MAX_PROMPT_LENGTH} caractères.` });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45_000);
        let response: Response;
        try {
            response = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt: `Illustration chaleureuse et digne pour la gazette d'un EHPAD en France. ${prompt}. Sans texte, sans logo, sans marque.`,
                        steps: 4,
                    }),
                    signal: controller.signal,
                },
            );
        } finally {
            clearTimeout(timeoutId);
        }

        const payload = await response.json() as CloudflareResponse;
        if (!response.ok || !payload.success) {
            return json(response.status >= 500 ? 502 : response.status, { error: cloudflareError(response.status, payload) });
        }

        const rawImage = payload.result?.image?.replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "") || "";
        const image = Buffer.from(rawImage, "base64");
        if (!image.length || image.length > MAX_IMAGE_BYTES) {
            throw new Error("L'image reçue de Cloudflare est vide ou trop volumineuse.");
        }

        return json(200, {
            success: true,
            imageBase64: `data:image/jpeg;base64,${image.toString("base64")}`,
            label: "Illustration générée par IA",
        });
    } catch (error) {
        logFunctionError("ai-image", error, context.awsRequestId);
        const message = error instanceof Error && error.name === "AbortError"
            ? "La génération a pris trop de temps. Réessayez dans quelques minutes."
            : "La génération de l'image a échoué.";
        return json(500, { error: message });
    }
};
