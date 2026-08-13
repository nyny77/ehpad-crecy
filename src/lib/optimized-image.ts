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
