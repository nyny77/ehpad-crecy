import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L’Écho du Cœur | Gazette de l’EHPAD de Crécy",
  description: "Consultez les derniers numéros et les archives de la Gazette L’Écho du Cœur.",
  alternates: {
    canonical: "/echo-du-coeur",
  },
};

export default function EchoDuCoeurLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
