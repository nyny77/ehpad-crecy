import { expect, test } from "@playwright/test";

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
