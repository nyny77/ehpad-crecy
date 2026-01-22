import galleryData from "@/lib/data/gallery.json";

export interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    category: string; // Type enlarged for CMS flexibility
    title?: string;
}

// Ensure type safety when importing JSON
export const INITIAL_GALLERY: GalleryImage[] = (galleryData.photos as unknown) as GalleryImage[];
