import NextImage, { type ImageProps } from "next/image";
import { getOptimizedImageSrc } from "@/lib/optimized-image";

export default function OptimizedImage({ src, ...props }: ImageProps) {
    const optimizedSrc = typeof src === "string" ? getOptimizedImageSrc(src) : src;
    return <NextImage src={optimizedSrc} {...props} />;
}
