import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | EHPAD de Crécy-la-Chapelle - Seine-et-Marne",
    description: "Contactez l'EHPAD de Crécy-la-Chapelle en Seine-et-Marne (77). Demandez une visite, posez vos questions ou programmez un rendez-vous.",
    alternates: {
        canonical: "/contact",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
