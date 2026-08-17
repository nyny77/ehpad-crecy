import NextImage, { type ImageProps } from "next/image";
import { getOptimizedImageSrc, getResponsiveImageSources } from "@/lib/optimized-image";

export default function OptimizedImage({ src, ...props }: ImageProps) {
    const optimizedSrc = typeof src === "string" ? getOptimizedImageSrc(src) : src;
    const responsiveSources = typeof optimizedSrc === "string"
        ? getResponsiveImageSources(optimizedSrc)
        : null;

    if (!responsiveSources) return <NextImage src={optimizedSrc} {...props} />;

    const sizes = props.sizes || (typeof props.width === "number" ? `${props.width}px` : "100vw");
    return (
        <picture className={props.fill ? "absolute inset-0 block" : undefined}>
            <source type="image/avif" srcSet={responsiveSources.avif} sizes={sizes} />
            <source type="image/webp" srcSet={responsiveSources.webp} sizes={sizes} />
            <NextImage src={optimizedSrc} {...props} sizes={sizes} />
        </picture>
    );
}
