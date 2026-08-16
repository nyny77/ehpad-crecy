import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visite virtuelle | EHPAD de Crécy",
  description: "Découvrez les espaces et le jardin de l’EHPAD de Crécy-la-Chapelle grâce à la visite virtuelle à 360 degrés.",
};

export default function VisiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
