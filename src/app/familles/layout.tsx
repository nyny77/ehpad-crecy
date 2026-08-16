import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Postier numérique | EHPAD de Crécy",
  description: "Envoyez un message et une photo à votre proche grâce au Postier numérique de l’EHPAD de Crécy.",
};

export default function FamillesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
