const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const apiToken = process.env.CLOUDFLARE_AI_TOKEN?.trim();
const requestedPrompt = process.argv.slice(2).join(" ").trim()
    || "Illustration chaleureuse d'un bouquet de fleurs colorées sur une table, lumière naturelle, sans texte, sans logo";

if (!accountId || !apiToken) {
    console.error("ÉCHEC : variables Cloudflare absentes de l'environnement Netlify.");
    process.exitCode = 1;
} else {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45_000);

    try {
        const translationResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.2-1b-instruct`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "Translate the user's French image description into concise English. Output only the translation. Preserve the literal meaning and do not add commentary." },
                        { role: "user", content: requestedPrompt },
                    ],
                    max_tokens: 180,
                    temperature: 0,
                }),
                signal: controller.signal,
            },
        );
        const translationPayload = await translationResponse.json();
        const translatedPrompt = String(translationPayload?.result?.response || "").trim();
        if (!translationResponse.ok || !translationPayload?.success || !translatedPrompt) {
            throw new Error("Translation failed");
        }

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: `Safe family-friendly editorial illustration for a senior care home newsletter. ${translatedPrompt}. No text, no logo.`,
                    steps: 4,
                }),
                signal: controller.signal,
            },
        );
        const payload = await response.json();
        const rawImage = String(payload?.result?.image || "").replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "");
        const imageBytes = Buffer.from(rawImage, "base64").length;

        if (!response.ok || !payload?.success || imageBytes === 0) {
            const code = payload?.errors?.[0]?.code || response.status;
            const message = payload?.errors?.[0]?.message || "Image absente";
            console.error(`ÉCHEC Cloudflare (${code}) : ${message}`);
            process.exitCode = 1;
        } else {
            console.log(`SUCCÈS : FLUX a généré une image JPEG valide (${Math.round(imageBytes / 1024)} Ko).`);
        }
    } catch (error) {
        console.error(error?.name === "AbortError" ? "ÉCHEC : délai Cloudflare dépassé." : "ÉCHEC : appel Cloudflare impossible.");
        process.exitCode = 1;
    } finally {
        clearTimeout(timeoutId);
    }
}
