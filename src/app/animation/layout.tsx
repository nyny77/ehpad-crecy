import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animations et vie sociale | EHPAD de Crécy",
  description: "Découvrez les activités, sorties et temps forts proposés aux résidents de l’EHPAD de Crécy-la-Chapelle.",
};

export default function AnimationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
