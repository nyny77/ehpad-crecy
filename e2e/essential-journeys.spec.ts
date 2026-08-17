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
