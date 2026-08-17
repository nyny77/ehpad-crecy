import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("ehpad-crecy-splash-seen", "true"));
});

test("Contact : le formulaire peut être parcouru et envoyé", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Demande d'information" }).click();
    await page.getByLabel(/Votre message/).fill("Je souhaite obtenir des informations complémentaires.");
    await page.getByRole("button", { name: "Suivant" }).click();
    await page.getByLabel("Prénom *").fill("Test");
    await page.getByLabel("Nom *", { exact: true }).fill("Automatique");
    await page.getByLabel("Email *", { exact: true }).fill("test@example.test");

    await page.route("**/", async route => {
        if (route.request().method() === "POST") {
            await route.fulfill({ status: 200, body: "ok" });
        } else {
            await route.continue();
        }
    });
    await page.getByRole("button", { name: "Envoyer" }).click();

    await expect(page.getByRole("heading", { name: "Message bien reçu !" })).toBeVisible();
});

test("Admission : le guide, ViaTrajectoire et le simulateur tarifaire réagissent", async ({ page }) => {
    await page.goto("/admissions");
    await expect(page.getByRole("heading", { level: 1, name: "Préparer mon entrée" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Faire ma demande sur ViaTrajectoire/ })).toHaveAttribute("href", /FINESS=770701050/);

    await page.goto("/hebergement#tarifs");
    await page.getByRole("group", { name: "Type de chambre" }).getByRole("button", { name: "Chambre Double" }).click();
    await page.getByRole("button", { name: "GIR 3 - 4" }).click();
    await page.getByRole("button", { name: "Non" }).click();
    await expect(page.getByText(/2.401/, { exact: true })).toBeVisible();
});

test("Visite : le panorama complet se charge seulement après activation", async ({ page }) => {
    const panoramaUrl = "/images/optimized/jardin-360.webp";
    const panoramaRequests: string[] = [];
    page.on("request", request => {
        if (request.url().endsWith(panoramaUrl)) panoramaRequests.push(request.url());
    });

    await page.goto("/visite");
    const launchButton = page.getByRole("button", { name: /Lancer la visite à 360 degrés/ });
    await expect(launchButton).toBeVisible();
    expect(panoramaRequests).toHaveLength(0);

    const panoramaRequest = page.waitForRequest(request => request.url().endsWith(panoramaUrl));
    await launchButton.click();
    await panoramaRequest;
    await expect(page.locator(".pnlm-container")).toBeVisible();
});

test("Performance : images responsives et chatbot différé fonctionnent", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('source[type="image/avif"][srcset*="global-hero-480.avif"]')).toHaveCount(1);
    await expect(page.getByRole("dialog", { name: /Assistant EHPAD/ })).toHaveCount(0);

    await page.getByRole("button", { name: "Ouvrir l’assistant" }).click();
    await expect(page.getByRole("dialog", { name: /Assistant EHPAD/ })).toBeVisible();
});

test("Performance : Netlify Identity reste absent des pages publiques ordinaires", async ({ page }) => {
    const identityRequests: string[] = [];
    await page.route("https://identity.netlify.com/**", async route => {
        identityRequests.push(route.request().url());
        await route.fulfill({
            contentType: "application/javascript",
            body: "window.netlifyIdentity={init(){},currentUser(){return null},on(){},off(){}};",
        });
    });

    await page.goto("/");
    await page.waitForTimeout(500);
    expect(identityRequests).toHaveLength(0);

    const identityRequest = page.waitForRequest(request => request.url().includes("identity.netlify.com"));
    await page.goto("/galerie");
    await identityRequest;
    expect(identityRequests).toHaveLength(1);
});

test("Administration : un visiteur reste bloqué sur la connexion", async ({ page }) => {
    await page.addInitScript(() => {
        Object.defineProperty(window, "netlifyIdentity", {
            configurable: false,
            value: {
                currentUser: () => null,
                init: () => undefined,
                on: () => undefined,
                off: () => undefined,
                open: () => undefined,
                close: () => undefined,
                logout: async () => undefined,
            },
        });
    });
    await page.route("https://identity.netlify.com/**", route => route.abort());
    await page.goto("/administration");

    await expect(page.getByRole("heading", { level: 1, name: "Administration" })).toBeVisible();
    await expect(page.getByText(/Connectez-vous avec votre compte administrateur/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Se connecter/ })).toBeVisible();
});

test("Postier : code, message simple et confirmation fonctionnent", async ({ page }) => {
    await page.route("**/.netlify/functions/famille-send-message", async route => {
        const payload = route.request().postDataJSON();
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(payload.action === "verify"
                ? { success: true, residentName: "Résident test" }
                : { success: true, residentName: "Résident test" }),
        });
    });
    await page.goto("/familles");
    await page.getByLabel("Code secret du résident").fill("TEST-1234");
    await page.getByRole("button", { name: "Accéder à la messagerie" }).click();
    await expect(page.getByRole("heading", { name: /Nouveau message pour Résident test/ })).toBeVisible();
    await page.getByLabel(/Votre nom/).fill("Famille test");
    await page.getByLabel("Votre message").fill("Bonjour depuis le test automatique.");
    await page.getByRole("button", { name: "Envoyer le message" }).click();
    await expect(page.getByRole("heading", { name: "Message envoyé !" })).toBeVisible();
});
