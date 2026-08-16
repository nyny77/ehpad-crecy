import galleryData from "@/lib/data/gallery.json";

export interface GalleryImage {
    id: string;
    src: string;
    thumbSrc?: string;
    alt: string;
    category: string; // Type enlarged for CMS flexibility
    title?: string;
    albumId?: string;
    deletedAt?: string;
}

export interface GalleryAlbum {
    id: string;
    title: string;
    date: string;
    createdAt: string;
}

// Ensure type safety when importing JSON
export const INITIAL_GALLERY: GalleryImage[] = (galleryData.photos as unknown) as GalleryImage[];
export const INITIAL_GALLERY_ALBUMS: GalleryAlbum[] = ((galleryData as unknown as { albums?: GalleryAlbum[] }).albums || []);
export const INITIAL_LEGACY_ALBUM_TITLE = (galleryData as unknown as { legacyAlbumTitle?: string }).legacyAlbumTitle || "Photos précédentes";
