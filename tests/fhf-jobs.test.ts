import test from "node:test";
import assert from "node:assert/strict";
import { mergeFhfOffers, parseFhfStructurePage } from "../netlify/functions/_shared/fhf-jobs";
import type { JobsData } from "../src/lib/job-types";

const CARD = `
<article class="card card-offer">
  <div class="field--name-field-publish-date">Publié le 15.06.2026 15:07</div>
  <div class="field--name-field-limit-date">Date de limite de candidatures 31.12.2026</div>
  <h3 class="card-title">AIDE SOIGNANTE DE JOUR</h3>
  <div class="field--name-field-description">CDD auprès de l&apos;équipe du Marais.</div>
  <a href="/emploi/477249">Voir l’offre</a>
</article>`;

test("la page établissement FHF produit une offre en attente rattachée au bon EHPAD", () => {
    const [offer] = parseFhfStructurePage(CARD, "le-marais", "2026-08-20T10:00:00.000Z");
    assert.equal(offer.id, "fhf-477249");
    assert.equal(offer.facilityName, "EHPAD Le Marais");
    assert.equal(offer.status, "pending");
    assert.equal(offer.contract, "CDD");
    assert.equal(offer.deadline, "2026-12-31");
    assert.match(offer.description, /l'équipe/);
});

test("une synchronisation ne remplace pas le texte d’une offre déjà validée", () => {
    const [imported] = parseFhfStructurePage(CARD, "le-marais", "2026-08-20T10:00:00.000Z");
    const current: JobsData = {
        offers: [{ ...imported, title: "Titre corrigé", status: "published", updatedAt: "2026-08-19T10:00:00.000Z" }],
    };
    const merged = mergeFhfOffers(current, [imported], "2026-08-20T11:00:00.000Z");
    assert.equal(merged.offers[0].title, "Titre corrigé");
    assert.equal(merged.offers[0].status, "published");
    assert.equal(merged.offers[0].sourceActive, true);
});

