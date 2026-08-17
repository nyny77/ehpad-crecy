const OPTIMIZABLE_IMAGE = /\.(?:jpe?g|png)$/i;

export function getOptimizedImageSrc(src: string): string {
    if (src.startsWith("/evenements/") && OPTIMIZABLE_IMAGE.test(src)) {
        return src
            .replace("/evenements/", "/images/optimized/evenements/")
            .replace(OPTIMIZABLE_IMAGE, ".webp");
    }
    if (!src.startsWith("/images/")) return src;
    if (
        src.startsWith("/images/optimized/") ||
        src.startsWith("/images/private/") ||
        src.startsWith("/images/thumbnails/")
    ) {
        return src;
    }
    if (!OPTIMIZABLE_IMAGE.test(src)) return src;

    return src
        .replace("/images/", "/images/optimized/")
        .replace(OPTIMIZABLE_IMAGE, ".webp");
}

const RESPONSIVE_WIDTHS = [480, 960, 1600] as const;

export function getResponsiveImageSources(src: string): { avif: string; webp: string } | null {
    if (!src.startsWith("/images/") || !src.endsWith(".webp")) return null;
    if (
        src.startsWith("/images/responsive/") ||
        src.startsWith("/images/private/") ||
        src.includes("/thumbnails/") ||
        /(?:360|panorama-preview)/i.test(src)
    ) {
        return null;
    }

    const basePath = src
        .replace("/images/", "/images/responsive/")
        .replace(/\.webp$/i, "");
    const createSrcSet = (format: "avif" | "webp") => RESPONSIVE_WIDTHS
        .filter(width => format === "avif" || width < 1600)
        .map(width => `${basePath}-${width}.${format} ${width}w`)
        .join(", ");

    return {
        avif: createSrcSet("avif"),
        webp: `${createSrcSet("webp")}, ${src} 1600w`,
    };
}
