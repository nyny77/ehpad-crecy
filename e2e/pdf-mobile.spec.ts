import { devices, expect, test } from "@playwright/test";

test.setTimeout(120_000);

const mobileProfile = (name: "iPhone 13" | "Pixel 7") => {
    const { defaultBrowserType: _defaultBrowserType, ...profile } = devices[name];
    return profile;
};

const documents = [
    { page: "/livret-accueil", pdf: "/documents/livret-accueil.pdf?v=2" },
    { page: "/echo-du-coeur", pdf: "/images/uploads/janvier2026.pdf" },
];

async function verifyMobilePdfAccess(page: import("@playwright/test").Page) {
    await page.addInitScript(() => sessionStorage.setItem("ehpad-crecy-splash-seen", "true"));

    for (const document of documents) {
        await page.goto(document.page, { waitUntil: "domcontentloaded" });
        const readLink = page.getByRole("link", { name: "Lire toutes les pages" });

        await expect(readLink).toBeVisible({ timeout: 30_000 });
        await expect(readLink).toHaveAttribute("href", document.pdf);
        await expect(page.locator("iframe[title*='PDF'], iframe[title*='Écho']")).toHaveCount(0);
        await expect(page.getByRole("link", { name: "Télécharger le PDF" })).toBeVisible();
        if (document.page === "/echo-du-coeur") {
            await expect(page.getByRole("link", { name: "Version texte accessible" })).toHaveAttribute("href", "/echo-du-coeur/janvier-2026");
        }

        const response = await page.request.head(document.pdf);
        expect(response.ok()).toBeTruthy();
        expect(response.headers()["content-type"]).toContain("application/pdf");
    }
}

test.describe("PDF sur iOS", () => {
    test.use(mobileProfile("iPhone 13"));

    test("le Livret et l’Écho du Cœur s’ouvrent dans le lecteur natif", async ({ page }) => {
        await verifyMobilePdfAccess(page);
    });
});

test.describe("PDF sur Android", () => {
    test.use(mobileProfile("Pixel 7"));

    test("le Livret et l’Écho du Cœur s’ouvrent dans le lecteur natif", async ({ page }) => {
        await verifyMobilePdfAccess(page);
    });
});
