import { expect, test } from "@playwright/test";
import sharp from "sharp";

test.describe.configure({ mode: "serial" });
test.setTimeout(120_000);

const MOBILE_SIZES = [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 412, height: 915 },
];

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        sessionStorage.setItem("ehpad-crecy-splash-seen", "true");
        localStorage.setItem("accessibility-hint-seen", "true");
    });
});

async function waitForMobileHydration(page: import("@playwright/test").Page) {
    await page.waitForFunction(() => document.documentElement.dataset.mobileNavigationReady === "true");
}

for (const viewport of MOBILE_SIZES) {
    test(`mobile ${viewport.width}px : aucun débordement horizontal`, async ({ page }) => {
        await page.setViewportSize(viewport);

        for (const route of ["/", "/hebergement", "/admissions", "/familles", "/contact"]) {
            await page.goto(route, { waitUntil: "domcontentloaded" });
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
        }
    });
}

test("mobile : Familles est immédiatement visible et le chatbot s'efface sous le menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/hebergement", { waitUntil: "domcontentloaded" });
    await waitForMobileHydration(page);

    await expect(page.getByRole("link", { name: "Accéder à l’Espace familles" })).toBeVisible();
    const menuButton = page.getByRole("button", { name: "Menu" });
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const familyLink = page.locator("#navigation-mobile").getByRole("link", { name: /Espace familles/ });
    await expect(familyLink).toBeInViewport();
    await expect(page.getByRole("button", { name: /Ouvrir l.assistant virtuel/ })).toBeHidden();
});

test("mobile 320px : le titre Tarifs et aides et la fenêtre du chatbot restent entièrement visibles", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/hebergement", { waitUntil: "domcontentloaded" });
    await waitForMobileHydration(page);

    await expect(page.getByRole("heading", { level: 1, name: "Tarifs et aides" })).toBeInViewport();
    await page.getByRole("button", { name: /Ouvrir l.assistant virtuel/ }).click();

    const dialog = page.locator("#assistant-ehpad");
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(8);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(312);
    expect(bounds!.y).toBeGreaterThanOrEqual(72);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(568);
});

test("mobile 320px : la fenêtre des options d'affichage conserve des marges", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/hebergement", { waitUntil: "domcontentloaded" });
    await waitForMobileHydration(page);
    // Le badge Next.js de développement occupe ce coin ; le clic DOM teste le composant réel.
    await page.getByRole("button", { name: "Options d'affichage" }).evaluate((button: HTMLButtonElement) => button.click());

    const panel = page.locator("#options-affichage");
    await expect(panel).toBeVisible();
    const bounds = await panel.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(16);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(304);
});

test("recrutement : l'annonce complète s'ouvre sur mobile et ordinateur", async ({ page }) => {
    for (const viewport of [{ width: 320, height: 568 }, { width: 1280, height: 800 }]) {
        await page.setViewportSize(viewport);
        await page.goto("/recrutement", { waitUntil: "domcontentloaded" });
        await waitForMobileHydration(page);

        const firstOffer = page.getByRole("button", { name: "Voir l'annonce" }).first();
        await expect(firstOffer).toBeVisible();
        await firstOffer.click();

        const dialog = page.getByRole("dialog", { name: "AIDE SOIGNANTE DE JOUR" });
        await expect(dialog).toBeVisible();
        await expect(dialog.getByText(/Ce métier exige de solides qualités humaines/)).toBeVisible();
        await expect(dialog.getByRole("link", { name: "Voir l'annonce complète sur la FHF" })).toHaveAttribute("href", "https://emploi.fhf.fr/emploi/477249");
        await expect(dialog.getByRole("link", { name: "Postuler à cette offre" })).toHaveAttribute("href", /offer=fhf-477249/);

        const bounds = await dialog.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
        await dialog.getByRole("button", { name: "Fermer l’annonce" }).click();
        await expect(dialog).toBeHidden();
    }
});

test("mobile 320px : le Postier replie son titre et prépare une photo verticale", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    let sentImage = "";
    await page.route("**/.netlify/functions/famille-send-message", async (route) => {
        const payload = route.request().postDataJSON();
        if (payload.action === "send") sentImage = payload.imageBase64 || "";
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ success: true, residentName: "Résidente test" }),
        });
    });
    await page.goto("/familles", { waitUntil: "domcontentloaded" });
    await waitForMobileHydration(page);

    const title = page.getByRole("heading", { name: "Envoyer une carte postale" });
    const titleBounds = await title.boundingBox();
    expect(titleBounds).not.toBeNull();
    expect(titleBounds!.x + titleBounds!.width).toBeLessThanOrEqual(296);

    await page.getByLabel("Code secret du résident").fill("TEST-1234");
    await page.getByRole("button", { name: "Accéder à la composition de la carte" }).click();
    const tallPhoto = await sharp({
        create: { width: 1_500, height: 4_000, channels: 3, background: "#d8c5a8" },
    }).png().toBuffer();
    await page.locator("#camera-photo-input").setInputFiles({
        name: "capture-telephone.png",
        mimeType: "image/png",
        buffer: tallPhoto,
    });

    const preview = page.getByAltText("Photo sélectionnée");
    await expect(preview).toBeVisible();
    const previewDimensions = await preview.evaluate((image: HTMLImageElement) => ({
        width: image.naturalWidth,
        height: image.naturalHeight,
    }));
    expect(Math.max(previewDimensions.width, previewDimensions.height)).toBeLessThanOrEqual(1_200);

    await page.getByLabel(/Votre nom ou signature/).fill("Famille test");
    await page.getByLabel("Votre message").fill("Bonjour depuis le téléphone.");
    await page.getByRole("button", { name: "Envoyer la carte postale" }).click();
    await expect(page.getByRole("heading", { name: "Carte postale envoyée avec succès !" })).toBeVisible();

    expect(sentImage).toMatch(/^data:image\/webp;base64,/);
    const metadata = await sharp(Buffer.from(sentImage.split(",")[1], "base64")).metadata();
    expect(Math.max(metadata.width || 0, metadata.height || 0)).toBeLessThanOrEqual(1_200);
});
