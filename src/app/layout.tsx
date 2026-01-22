import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import NetlifyIdentityRedirect from "@/components/providers/NetlifyIdentityRedirect";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EHPAD de Crécy | L'art de bien vivre, entouré et en toute sérénité",
  description:
    "EHPAD public de Crécy-la-Chapelle (77) - 63 lits en Seine-et-Marne. Un lieu de vie chaleureux où bienveillance, professionnalisme et vie sociale s'unissent pour le bien-être de nos résidents.",
  keywords: [
    "EHPAD",
    "Crécy-la-Chapelle",
    "Seine-et-Marne",
    "maison de retraite",
    "personnes âgées",
    "77580",
    "hébergement seniors",
  ],
  authors: [{ name: "EHPAD de Crécy" }],
  openGraph: {
    title: "EHPAD de Crécy | L'art de bien vivre, entouré et en toute sérénité",
    description:
      "EHPAD public de Crécy-la-Chapelle - Un lieu de vie chaleureux en Seine-et-Marne.",
    locale: "fr_FR",
    type: "website",
  },
};

import MaintenanceGuard from "@/components/layout/MaintenanceGuard";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans text-charcoal-800 bg-cream-50 antialiased selection:bg-terracotta-200 selection:text-charcoal-900">
        <NetlifyIdentityRedirect />
        <ErrorBoundary>
          <Header />
          {children}
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
