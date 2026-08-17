import assert from "node:assert/strict";
import test from "node:test";
import { handler as healthHandler } from "../netlify/functions/health";
import adminMessagesHandler from "../netlify/functions/admin-messages";
import familyMessageHandler from "../netlify/functions/famille-send-message";
import { handler as aiImageHandler } from "../netlify/functions/ai-image";
import { handler as testEmailHandler } from "../netlify/functions/test-email";
import { handler as sendNotificationHandler } from "../netlify/functions/send-notification";
import { galleryCommitMessage } from "../netlify/functions/admin-gallery";
import sharp from "sharp";
import {
    parseJsonObject,
    sanitizeRichText,
    validateImage,
    validatePdf,
} from "../netlify/functions/_shared/request-security";

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
    // Netlify V2 utilise l'objet Request. Pour l'admin, on vérifie un entête Authorization simulé ou on rejette.
    // L'implémentation isAdminRequestV2 extrait le JWT (partie 2).
    const generateFakeJWT = () => {
        const payload = Buffer.from(JSON.stringify({ app_metadata: { roles: ["admin"] } })).toString("base64");
        return `header.${payload}.signature`;
    };
    
    const forbiddenReq = new Request("http://localhost/", { method: "GET" });
    const allowedReq = new Request("http://localhost/", {
        method: "GET",
        headers: { Authorization: `Bearer ${generateFakeJWT()}` }
    });

    const forbidden = await adminMessagesHandler(forbiddenReq, anonymousContext as never) as Response;
    const allowed = await adminMessagesHandler(allowedReq, anonymousContext as never) as Response;

    assert.equal(forbidden?.status, 403);
    assert.equal(allowed?.status, 200);
    const allowedData = await allowed.json() as any;
    assert.ok(Array.isArray(allowedData.messages));
});

test("le Postier refuse une mauvaise méthode et un code inconnu", async () => {
    const wrongMethod = await familyMessageHandler(new Request("http://localhost/", { method: "GET" }), anonymousContext as never);
    const unknownCode = await familyMessageHandler(
        new Request("http://localhost/", { method: "POST", body: JSON.stringify({ action: "verify", secretCode: "CODE-TEST-INEXISTANT" }) }),
        anonymousContext as never,
    );

    assert.equal(wrongMethod?.status, 405);
    assert.equal(unknownCode?.status, 401);
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

test("les fonctions de messagerie technique restent réservées à l’administration", async () => {
    const testEmailForbidden = await testEmailHandler(event("POST") as never, anonymousContext as never);
    const notificationForbidden = await sendNotificationHandler(event("POST") as never, anonymousContext as never);
    const wrongMethod = await testEmailHandler(event("GET") as never, adminContext as never);

    assert.equal(testEmailForbidden?.statusCode, 403);
    assert.equal(notificationForbidden?.statusCode, 403);
    assert.equal(wrongMethod?.statusCode, 405);
});

test("la validation commune refuse les requêtes et fichiers déguisés", async () => {
    assert.throws(() => parseJsonObject("[]"), /requête est invalide/);
    assert.throws(() => validatePdf(Buffer.from("<script>alert(1)</script>").toString("base64"), 10_000), /PDF valide/);
    await assert.rejects(
        validateImage(Buffer.from("faux fichier image").toString("base64"), { maxBytes: 10_000 }),
        /image valide/,
    );
});

test("la validation d’image contrôle le format réel et les dimensions", async () => {
    const image = await sharp({ create: { width: 4, height: 3, channels: 3, background: "#c05621" } }).webp().toBuffer();
    const checked = await validateImage(image.toString("base64"), {
        maxBytes: 10_000,
        maxWidth: 10,
        maxHeight: 10,
        formats: ["webp"],
    });

    assert.equal(checked.format, "webp");
    assert.equal(checked.width, 4);
    assert.equal(checked.height, 3);
    await assert.rejects(validateImage(image.toString("base64"), { maxBytes: 10_000, maxWidth: 2 }), /dimensions/);
});

test("le HTML de la Gazette conserve la mise en forme sans code actif", () => {
    const cleaned = sanitizeRichText('<p style="color:#c05621" onclick="alert(1)"><strong>Bonjour</strong><img src=x onerror=alert(1)><a href="javascript:alert(1)">lien</a><script>alert(1)</script></p>');

    assert.match(cleaned, /<strong>Bonjour<\/strong>/);
    assert.match(cleaned, /color:#c05621/);
    assert.doesNotMatch(cleaned, /onclick|onerror|javascript:|script|<img/i);
});

test("les lots de photos ne déclenchent Netlify qu’au dernier commit", () => {
    assert.equal(galleryCommitMessage("Galerie : add", true), "Galerie : add [skip netlify]");
    assert.equal(galleryCommitMessage("Galerie : add", false), "Galerie : add");
});
