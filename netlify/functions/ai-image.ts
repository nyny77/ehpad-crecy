import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
    const prompt = event.queryStringParameters?.prompt;
    const seed = event.queryStringParameters?.seed;
    if (!prompt) {
        return { statusCode: 400, body: "Prompt manquant" };
    }

    try {
        const seedParam = seed ? `&seed=${seed}` : '';
        const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true${seedParam}`;
        
        // Timeout handling just in case
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s max
        
        const response = await fetch(aiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erreur AI: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "image/jpeg",
                "Cache-Control": "public, max-age=31536000",
            },
            body: buffer.toString("base64"),
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error("AI Generation proxy failed:", error);
        return { statusCode: 500, body: "Erreur lors de la génération de l'image" };
    }
};
