import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion des accès | EHPAD de Crécy",
  robots: { index: false, follow: false },
};

export default function AdminUsersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
