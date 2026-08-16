import type { Handler } from "@netlify/functions";
import { logFunctionError } from "./_shared/technical-log";
import { isAdminRequest, json } from "./_shared/admin-auth";

const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const TRANSLATION_MODEL = "@cf/meta/llama-3.2-1b-instruct";
const MAX_PROMPT_LENGTH = 500;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type CloudflareResponse = {
    success?: boolean;
    result?: { image?: string };
    errors?: Array<{ code?: number; message?: string }>;
};

type CloudflareTextResponse = {
    success?: boolean;
    result?: { response?: string };
};

function cloudflareError(status: number, payload: CloudflareResponse): string {
    const code = payload.errors?.[0]?.code;
    const detail = payload.errors?.[0]?.message || "";
    if (status === 401) return "Le jeton Cloudflare est invalide ou expiré.";
    if (status === 403 && code === 5035) return "Ce modèle nécessite une offre Cloudflare payante.";
    if (status === 403) return "Le compte Cloudflare n'autorise pas cette génération.";
    if (status === 429 && code === 3036) return "Le quota gratuit Cloudflare du jour est épuisé.";
    if (status === 429) return "Cloudflare est momentanément saturé. Réessayez dans quelques minutes.";
    if (code === 8007 || /NSFW/i.test(detail)) {
        return "Cloudflare a refusé cette description par prudence. Reformulez-la simplement, sans information personnelle.";
    }
    return detail || `Cloudflare a répondu avec l'erreur ${status}.`;
}

async function translatePrompt(prompt: string, accountId: string, apiToken: string, signal: AbortSignal): Promise<string> {
    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${TRANSLATION_MODEL}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: "Translate the user's French image description into concise English. Output only the translation. Preserve the literal meaning and do not add commentary.",
                        },
                        { role: "user", content: prompt },
                    ],
                    max_tokens: 180,
                    temperature: 0,
                }),
                signal,
            },
        );
        const payload = await response.json() as CloudflareTextResponse;
        const translated = payload.result?.response?.trim();
        return response.ok && payload.success && translated ? translated.slice(0, 1000) : prompt;
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") throw error;
        return prompt;
    }
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
            const translatedPrompt = await translatePrompt(prompt, accountId, apiToken, controller.signal);
            response = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt: `Safe family-friendly editorial illustration for a senior care home newsletter. ${translatedPrompt}. No text, no logo, no brand.`,
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
