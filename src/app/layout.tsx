import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import SplashScreen from "@/components/ui/SplashScreen";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import NetlifyIdentityRedirect from "@/components/providers/NetlifyIdentityRedirect";
import AccessibilityToggle from "@/components/ui/AccessibilityToggle";
import ChatBot from "@/components/ui/ChatBotWrapper";
import PerformanceMotionProvider from "@/components/providers/PerformanceMotionProvider";

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

export const viewport: Viewport = {
  themeColor: "#962d3a",
};

export const metadata: Metadata = {
  title: "EHPAD de Crécy | Bien plus qu'un EHPAD, un véritable lieu de vie",
  manifest: "/manifest.json",
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
    title: "EHPAD de Crécy | Bien plus qu'un EHPAD, un véritable lieu de vie",
    description:
      "EHPAD public de Crécy-la-Chapelle - Un lieu de vie chaleureux en Seine-et-Marne.",
    locale: "fr_FR",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EHPAD Crécy",
  },
};


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
          strategy="lazyOnload"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans text-charcoal-800 bg-stone-200 antialiased selection:bg-terracotta-200 selection:text-charcoal-900">
        <PerformanceMotionProvider>
          <SplashScreen />
          <NetlifyIdentityRedirect />
          <div className="max-w-[1600px] mx-auto bg-cream-50 min-h-screen shadow-2xl overflow-hidden relative flex flex-col">
            <ErrorBoundary>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <AccessibilityToggle />
              <ChatBot />
            </ErrorBoundary>
          </div>
        </PerformanceMotionProvider>
		<Script
  data-goatcounter="https://ehpadcrecy.goatcounter.com/count"
  async
  src="https://gc.zgo.at/count.js"
/>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful');
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
