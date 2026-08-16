const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const apiToken = process.env.CLOUDFLARE_AI_TOKEN?.trim();

if (!accountId || !apiToken) {
    console.error("ÉCHEC : variables Cloudflare absentes de l'environnement Netlify.");
    process.exitCode = 1;
} else {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45_000);

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: "Illustration chaleureuse d'un bouquet de fleurs colorées sur une table, lumière naturelle, sans texte, sans logo",
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
