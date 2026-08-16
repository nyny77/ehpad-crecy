import { getAllPosts } from "@/lib/blog";
import { INITIAL_GALLERY, INITIAL_GALLERY_ALBUMS, INITIAL_LEGACY_ALBUM_TITLE } from "@/lib/gallery";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
    title: "Administration | EHPAD de Crécy",
    robots: { index: false, follow: false },
};

export default function AdministrationPage() {
    return <AdminDashboard initialArticles={getAllPosts({ includeDrafts: true })} initialPhotos={INITIAL_GALLERY} initialAlbums={INITIAL_GALLERY_ALBUMS} initialLegacyAlbumTitle={INITIAL_LEGACY_ALBUM_TITLE} />;
}
