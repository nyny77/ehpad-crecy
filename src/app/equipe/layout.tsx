import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notre Équipe | EHPAD de Crécy-la-Chapelle - Seine-et-Marne",
    description: "Découvrez l'équipe pluridisciplinaire de l'EHPAD de Crécy-la-Chapelle : soignants, animation, restauration et accompagnement personnalisé en Seine-et-Marne.",
};

export default function EquipeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
