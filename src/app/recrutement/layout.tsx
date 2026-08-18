import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Recrutement | EHPAD de Crécy-la-Chapelle - Seine-et-Marne",
    description: "Rejoignez l'équipe de l'EHPAD de Crécy-la-Chapelle en Seine-et-Marne (77). Offres d'emploi et candidatures spontanées pour soignants, aides-soignants et personnel médico-social.",
    alternates: {
        canonical: "/recrutement",
    },
};

export default function RecrutementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
