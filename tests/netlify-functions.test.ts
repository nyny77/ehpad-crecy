import assert from "node:assert/strict";
import test from "node:test";
import { handler as healthHandler } from "../netlify/functions/health";
import { handler as adminMessagesHandler } from "../netlify/functions/admin-messages";
import { handler as familyMessageHandler } from "../netlify/functions/famille-send-message";
import { handler as aiImageHandler } from "../netlify/functions/ai-image";

const event = (httpMethod: string, body?: object) => ({
    httpMethod,
    body: body ? JSON.stringify(body) : null,
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    path: "/",
    rawUrl: "http://localhost/",
    rawQuery: "",
    isBase64Encoded: false,
});

const anonymousContext = {};
const adminContext = {
    clientContext: { user: { app_metadata: { roles: ["admin"] } } },
};

test("la fonction de santé répond et refuse les autres méthodes", async () => {
    const ok = await healthHandler(event("GET") as never, anonymousContext as never);
    const rejected = await healthHandler(event("POST") as never, anonymousContext as never);

    assert.equal(ok?.statusCode, 200);
    assert.equal(JSON.parse(ok?.body || "{}").status, "ok");
    assert.equal(rejected?.statusCode, 405);
});

test("la gestion du courrier refuse un visiteur et accepte un administrateur", async () => {
    const forbidden = await adminMessagesHandler(event("GET") as never, anonymousContext as never);
    const allowed = await adminMessagesHandler(event("GET") as never, adminContext as never);

    assert.equal(forbidden?.statusCode, 403);
    assert.equal(allowed?.statusCode, 200);
    assert.ok(Array.isArray(JSON.parse(allowed?.body || "{}").messages));
});

test("le Postier refuse une mauvaise méthode et un code inconnu", async () => {
    const wrongMethod = await familyMessageHandler(event("GET") as never, anonymousContext as never);
    const unknownCode = await familyMessageHandler(
        event("POST", { action: "verify", secretCode: "CODE-TEST-INEXISTANT" }) as never,
        anonymousContext as never,
    );

    assert.equal(wrongMethod?.statusCode, 405);
    assert.equal(unknownCode?.statusCode, 401);
});

test("la génération d'image IA reste réservée à l'administration", async () => {
    const forbidden = await aiImageHandler(
        event("POST", { prompt: "Un bouquet de fleurs" }) as never,
        anonymousContext as never,
    );
    const wrongMethod = await aiImageHandler(event("GET") as never, adminContext as never);

    assert.equal(forbidden?.statusCode, 403);
    assert.equal(wrongMethod?.statusCode, 405);
});
