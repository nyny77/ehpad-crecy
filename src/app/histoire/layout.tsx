import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notre Ville | EHPAD de Crécy-la-Chapelle - Seine-et-Marne",
    description: "Découvrez Crécy-la-Chapelle, la Venise Briarde en Seine-et-Marne (77). Histoire, patrimoine et cadre de vie de notre commune.",
    alternates: {
        canonical: "/histoire",
    },
};

export default function HistoireLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
