import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livret d’accueil des agents | EHPAD de Crécy",
  description: "Livret pratique destiné aux nouveaux professionnels de l’EHPAD de Crécy.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/livret-accueil",
  },
};

export default function LivretAccueilLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
