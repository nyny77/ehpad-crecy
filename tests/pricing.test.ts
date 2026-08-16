import assert from "node:assert/strict";
import test from "node:test";
import { calculateMonthlyPricing } from "../src/lib/pricing-data";

test("le calculateur applique le ticket modérateur avec l’APA", () => {
    const estimate = calculateMonthlyPricing("simple", 0, true);

    assert.equal(estimate.dailyHebergement, 69.31);
    assert.equal(estimate.dailyDependance, 6.06);
    assert.equal(estimate.totalDaily, 75.37);
    assert.ok(Math.abs(estimate.estimatedMonthly - 2336.47) < 0.001);
});

test("le calculateur applique le tarif GIR complet sans APA", () => {
    const estimate = calculateMonthlyPricing("double", 1, false);

    assert.equal(estimate.dailyHebergement, 63.17);
    assert.equal(estimate.dailyDependance, 14.29);
    assert.ok(Math.abs(estimate.estimatedMonthly - 2401.26) < 0.001);
});

test("le calculateur refuse un GIR ou une durée impossibles", () => {
    assert.throws(() => calculateMonthlyPricing("simple", 9, true), /GIR invalide/);
    assert.throws(() => calculateMonthlyPricing("simple", 0, true, 0), /jours invalide/);
    assert.throws(() => calculateMonthlyPricing("simple", 0, true, 32), /jours invalide/);
});

