import type { JobOffer, JobsData, JobFacilityId } from "../../../src/lib/job-types";
import { JOB_FACILITIES } from "../../../src/lib/job-types";

const FHF_STRUCTURE_PAGES: Array<{ facilityId: JobFacilityId; structureId: string }> = [
    { facilityId: "crecy", structureId: "2148" },
    { facilityId: "le-marais", structureId: "2133" },
    { facilityId: "saint-aile", structureId: "2141" },
    { facilityId: "pierre-comby", structureId: "2145" },
];

const FACILITY_ALIASES: Record<JobFacilityId, string[]> = {
    crecy: ["ehpad de crecy", "ehpad crecy la chapelle", "ehpad (crecy la chapelle)"],
    "le-marais": ["ehpad le marais"],
    "saint-aile": ["ehpad saint aile", "ehpad departemental saint aile"],
    "pierre-comby": ["ehpad pierre comby"],
};

function normalize(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function decodeXmlOnce(value: string): string {
    return value
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
        .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
}

function cleanText(value: string): string {
    return decodeXmlOnce(decodeXmlOnce(value)).replace(/<[^>]*>/g, " ")
        .replace(/\r?\n|\t/g, " ").replace(/\s+/g, " ").trim();
}

function tag(item: string, name: string): string {
    return cleanText(item.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] || "");
}

function facilityFor(value: string) {
    const normalized = normalize(value);
    return JOB_FACILITIES.find((facility) => FACILITY_ALIASES[facility.id].some((alias) => normalized.includes(normalize(alias))));
}

function inferContract(description: string): string {
    const matches = description.match(/\b(CDI|CDD|mutation|vacation|stage|détachement|PH temps (?:plein|partiel))\b/gi);
    if (!matches?.length) return "À préciser";
    return [...new Set(matches.map((match) => match.toUpperCase().replace("TEMPS", "temps")))].slice(0, 2).join(" / ");
}

export function parseFhfFeed(xml: string, syncedAt = new Date().toISOString()): JobOffer[] {
    const offers: JobOffer[] = [];
    for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
        const rawTitle = tag(match[1], "title");
        const description = tag(match[1], "description");
        const sourceUrl = tag(match[1], "link");
        const facility = facilityFor(`${rawTitle} ${description}`);
        const sourceId = sourceUrl.match(/\/emploi\/(\d+)/)?.[1];
        if (!facility || !sourceId || !sourceUrl.startsWith("https://emploi.fhf.fr/emploi/")) continue;

        const title = rawTitle.replace(/^\d{2}\/\d{2}\/\d{4}\s*-\s*/, "")
            .replace(/\s+\((?:EHPAD|Établissement|Etablissement)[\s\S]*\)\s*$/i, "").trim();
        const parsedDate = Date.parse(tag(match[1], "pubDate"));
        offers.push({
            id: `fhf-${sourceId}`,
            source: "fhf",
            sourceUrl,
            sourceActive: true,
            facilityId: facility.id,
            facilityName: facility.name,
            city: facility.city,
            title: title || "Offre d’emploi",
            contract: inferContract(description),
            description: description.slice(0, 700),
            requirements: [],
            publishedAt: Number.isFinite(parsedDate) ? new Date(parsedDate).toISOString() : undefined,
            status: "pending",
            createdAt: syncedAt,
            updatedAt: syncedAt,
            sourceSeenAt: syncedAt,
        });
    }
    return offers;
}

function frenchDate(value: string, withTime = false): string | undefined {
    const match = value.match(/(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
    if (!match) return undefined;
    if (!withTime) return `${match[3]}-${match[2]}-${match[1]}`;
    return new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]), Number(match[4] || 12), Number(match[5] || 0))).toISOString();
}

export function parseFhfStructurePage(html: string, facilityId: JobFacilityId, syncedAt = new Date().toISOString()): JobOffer[] {
    const facility = JOB_FACILITIES.find((item) => item.id === facilityId);
    if (!facility) return [];
    const offers: JobOffer[] = [];
    for (const match of html.matchAll(/<article\s+class="[^"]*card-offer[^"]*"[^>]*>([\s\S]*?)<\/article>/gi)) {
        const card = match[1];
        const sourceId = card.match(/href="\/emploi\/(\d+)"/)?.[1];
        const title = cleanText(card.match(/<h3\s+class="card-title"[^>]*>([\s\S]*?)<\/h3>/i)?.[1] || "");
        const description = cleanText(card.match(/class="field--name-field-description"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || "");
        if (!sourceId || !title || !description) continue;
        const publishedText = cleanText(card.match(/class="field--name-field-publish-date"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || "");
        const deadlineText = cleanText(card.match(/class="field--name-field-limit-date"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || "");
        offers.push({
            id: `fhf-${sourceId}`,
            source: "fhf",
            sourceUrl: `https://emploi.fhf.fr/emploi/${sourceId}`,
            sourceActive: true,
            facilityId: facility.id,
            facilityName: facility.name,
            city: facility.city,
            title,
            contract: inferContract(description),
            description: description.slice(0, 700),
            requirements: [],
            publishedAt: frenchDate(publishedText, true),
            deadline: frenchDate(deadlineText),
            status: "pending",
            createdAt: syncedAt,
            updatedAt: syncedAt,
            sourceSeenAt: syncedAt,
        });
    }
    return offers;
}

export function parseFhfDetailDescription(html: string): string | undefined {
    const description = html.match(
        /<div\s+class="section-title"[^>]*>\s*Descriptif\s*<\/div>([\s\S]*?)<\/div>/i,
    )?.[1];
    const cleaned = description ? cleanText(description) : "";
    return cleaned || undefined;
}

export async function fetchFhfOffers(): Promise<JobOffer[]> {
    const syncedAt = new Date().toISOString();
    const pages = await Promise.all(FHF_STRUCTURE_PAGES.map(async ({ facilityId, structureId }) => {
        const url = `https://emploi.fhf.fr/emploi/search?structure=${structureId}`;
        const response = await fetch(url, {
            headers: { "User-Agent": "EHPAD-Crecy-Emploi/1.0" },
            signal: AbortSignal.timeout(15_000),
        });
        if (!response.ok) throw new Error(`Page FHF indisponible (${response.status})`);
        return { facilityId, html: await response.text() };
    }));
    const byId = new Map<string, JobOffer>();
    pages.flatMap(({ facilityId, html }) => parseFhfStructurePage(html, facilityId, syncedAt)).forEach((offer) => byId.set(offer.id, offer));

    return Promise.all([...byId.values()].map(async (offer) => {
        if (!offer.sourceUrl) return offer;
        try {
            const response = await fetch(offer.sourceUrl, {
                headers: { "User-Agent": "EHPAD-Crecy-Emploi/1.0" },
                signal: AbortSignal.timeout(15_000),
            });
            if (!response.ok) return offer;
            const fullDescription = parseFhfDetailDescription(await response.text());
            return fullDescription ? { ...offer, description: fullDescription } : offer;
        } catch {
            // Une annonce reste publiable avec son extrait si la fiche FHF est momentanément indisponible.
            return offer;
        }
    }));
}

export function mergeFhfOffers(data: JobsData, imported: JobOffer[], syncedAt = new Date().toISOString()): JobsData {
    const incoming = new Map(imported.map((offer) => [offer.id, offer]));
    const offers = data.offers.map((existing) => {
        if (existing.source !== "fhf") return existing;
        const next = incoming.get(existing.id);
        if (!next) return { ...existing, sourceActive: false, updatedAt: syncedAt };
        incoming.delete(existing.id);
        if (existing.status === "pending") {
            return { ...next, status: existing.status, createdAt: existing.createdAt, updatedAt: syncedAt };
        }
        return { ...existing, sourceActive: true, sourceSeenAt: syncedAt, updatedAt: syncedAt };
    });
    offers.push(...incoming.values());
    return { offers, lastFhfSyncAt: syncedAt };
}
