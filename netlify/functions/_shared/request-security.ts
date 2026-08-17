import sharp, { type Metadata } from "sharp";
import sanitizeHtml from "sanitize-html";

const BASE64_RE = /^[A-Za-z0-9+/]*={0,2}$/;
const IMAGE_MIMES = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
} as const;

export type AcceptedImageFormat = keyof typeof IMAGE_MIMES;

export class RequestValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RequestValidationError";
    }
}

export function parseJsonObject(value: string | null, maxBytes = 256 * 1024): Record<string, unknown> {
    const raw = value || "{}";
    if (Buffer.byteLength(raw, "utf8") > maxBytes) {
        throw new RequestValidationError("La requête est trop volumineuse.");
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new RequestValidationError("Le contenu JSON est invalide.");
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new RequestValidationError("Le contenu de la requête est invalide.");
    }
    return parsed as Record<string, unknown>;
}

function decodeBase64(value: unknown, expectedPrefix?: RegExp): { buffer: Buffer; declaredMime?: string } {
    if (typeof value !== "string" || !value) {
        throw new RequestValidationError("Le fichier est manquant.");
    }

    const comma = value.indexOf(",");
    const hasDataPrefix = value.startsWith("data:");
    const prefix = hasDataPrefix && comma >= 0 ? value.slice(0, comma + 1) : "";
    const encoded = hasDataPrefix && comma >= 0 ? value.slice(comma + 1) : value;
    if (hasDataPrefix && (!expectedPrefix || !expectedPrefix.test(prefix))) {
        throw new RequestValidationError("Le type déclaré du fichier n’est pas accepté.");
    }
    if (!encoded || encoded.length % 4 !== 0 || !BASE64_RE.test(encoded)) {
        throw new RequestValidationError("L’encodage du fichier est invalide.");
    }

    const buffer = Buffer.from(encoded, "base64");
    if (!buffer.length || buffer.toString("base64").replace(/=+$/, "") !== encoded.replace(/=+$/, "")) {
        throw new RequestValidationError("L’encodage du fichier est invalide.");
    }
    const declaredMime = prefix.match(/^data:([^;,]+);base64,$/i)?.[1]?.toLowerCase();
    return { buffer, declaredMime };
}

export async function validateImage(
    value: unknown,
    options: {
        maxBytes: number;
        maxWidth?: number;
        maxHeight?: number;
        formats?: readonly AcceptedImageFormat[];
    },
): Promise<{ buffer: Buffer; format: AcceptedImageFormat; width: number; height: number }> {
    const { buffer, declaredMime } = decodeBase64(value, /^data:image\/(?:jpeg|jpg|png|webp);base64,$/i);
    if (buffer.length > options.maxBytes) {
        throw new RequestValidationError(`L’image dépasse la limite de ${Math.floor(options.maxBytes / 1024 / 1024)} Mo.`);
    }

    let metadata: Metadata;
    try {
        metadata = await sharp(buffer, { limitInputPixels: 40_000_000, animated: false }).metadata();
    } catch {
        throw new RequestValidationError("Le contenu du fichier n’est pas une image valide.");
    }

    const format = metadata.format;
    const allowed = options.formats || (["jpeg", "png", "webp"] as const);
    if (format !== "jpeg" && format !== "png" && format !== "webp" || !allowed.includes(format)) {
        throw new RequestValidationError("Le format réel de l’image n’est pas accepté.");
    }
    if (declaredMime && declaredMime.replace("image/jpg", "image/jpeg") !== IMAGE_MIMES[format]) {
        throw new RequestValidationError("Le type déclaré ne correspond pas au contenu réel de l’image.");
    }

    const width = metadata.width || 0;
    const height = metadata.height || 0;
    if (!width || !height || (metadata.pages || 1) !== 1) {
        throw new RequestValidationError("Les dimensions de l’image sont invalides.");
    }
    if (width > (options.maxWidth || 8_000) || height > (options.maxHeight || 8_000)) {
        throw new RequestValidationError("Les dimensions de l’image sont trop importantes.");
    }
    return { buffer, format, width, height };
}

export function validatePdf(value: unknown, maxBytes: number): Buffer {
    const { buffer } = decodeBase64(value, /^data:application\/pdf;base64,$/i);
    if (buffer.length > maxBytes) {
        throw new RequestValidationError(`Le PDF dépasse la limite de ${Math.floor(maxBytes / 1024 / 1024)} Mo.`);
    }
    if (buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
        throw new RequestValidationError("Le contenu du fichier n’est pas un PDF valide.");
    }
    return buffer;
}

export function sanitizeRichText(value: unknown, maxLength = 20_000): string {
    const input = String(value || "").slice(0, maxLength);
    return sanitizeHtml(input, {
        allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "h2", "h3", "ul", "ol", "li", "blockquote", "a", "span", "font"],
        allowedAttributes: {
            a: ["href", "title", "target", "rel"],
            span: ["style"],
            p: ["style"],
            font: ["color", "face", "size"],
        },
        allowedStyles: {
            "*": {
                color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i],
                "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i],
                "font-family": [/^(?:Arial|Georgia|Times New Roman|Verdana|Courier New)(?:,\s*(?:serif|sans-serif|monospace))?$/i],
                "font-size": [/^(?:12|14|16|18|24|32|48)px$/],
            },
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
        allowProtocolRelative: false,
        transformTags: {
            a: (_tagName, attribs) => ({
                tagName: "a",
                attribs: {
                    ...attribs,
                    ...(attribs.target === "_blank" ? { rel: "noopener noreferrer" } : {}),
                },
            }),
        },
        disallowedTagsMode: "discard",
    }).trim();
}

export function escapeHtml(value: unknown, maxLength: number): string {
    return String(value || "").trim().slice(0, maxLength)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function safeColor(value: unknown, fallback = "#ffffff"): string {
    const color = String(value || "").trim();
    return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

export function safeExternalImageUrl(value: unknown): string {
    let url: URL;
    try {
        url = new URL(String(value || ""));
    } catch {
        throw new RequestValidationError("L’adresse de l’image est invalide.");
    }
    const allowedHosts = ["live.staticflickr.com", "images.unsplash.com"];
    if (url.protocol !== "https:" || !allowedHosts.includes(url.hostname)) {
        throw new RequestValidationError("La source de cette image n’est pas autorisée.");
    }
    return url.toString();
}

export function validationStatus(error: unknown): number {
    return error instanceof RequestValidationError ? 400 : 500;
}
