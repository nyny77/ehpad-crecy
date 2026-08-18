import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Galerie Photos | EHPAD de Crécy-la-Chapelle - Seine-et-Marne",
    description: "Découvrez en images l'EHPAD de Crécy-la-Chapelle : chambres, salons, jardins et vie quotidienne de notre établissement en Seine-et-Marne (77).",
    alternates: {
        canonical: "/galerie",
    },
};

export default function GalerieLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
