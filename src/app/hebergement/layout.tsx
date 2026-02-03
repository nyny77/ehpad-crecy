import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tarifs & Hébergement | EHPAD de Crécy-la-Chapelle - Seine-et-Marne",
    description: "Consultez les tarifs 2025 de l'EHPAD de Crécy-la-Chapelle (77). Chambres simples et doubles, aides financières (APA, APL, ASH). Établissement habilité aide sociale.",
};

export default function HebergementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
