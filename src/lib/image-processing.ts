export const MAX_SOURCE_IMAGE_BYTES = 15 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export interface ProcessedImage {
    image: Blob;
    thumbnail: Blob;
}

export function encodeBlobBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
        reader.onerror = () => reject(new Error("Lecture de l'image impossible"));
        reader.readAsDataURL(blob);
    });
}

function canvasBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Compression impossible")), "image/webp", quality);
    });
}

async function drawResized(file: File, maxWidth: number, quality: number): Promise<Blob> {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Traitement de l’image indisponible");
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    return canvasBlob(canvas, quality);
}

export function validateSourceImage(file: File): void {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
        throw new Error(`${file.name} : seuls JPEG, PNG et WebP sont acceptés.`);
    }
    if (file.size > MAX_SOURCE_IMAGE_BYTES) {
        throw new Error(`${file.name} dépasse la limite de 15 Mo.`);
    }
}

export async function processImage(file: File): Promise<ProcessedImage> {
    validateSourceImage(file);
    const [image, thumbnail] = await Promise.all([
        drawResized(file, 1920, 0.82),
        drawResized(file, 600, 0.76),
    ]);
    return { image, thumbnail };
}
