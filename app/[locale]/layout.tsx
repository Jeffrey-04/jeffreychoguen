import type { Metadata } from "next";
import { Lora, Instrument_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/JsonLd";
import { nav } from "@/content/dictionary";
import { site } from "@/content/site";
import { personJsonLd } from "@/lib/seo";
import { isLocale, locales, t, type Locale } from "@/lib/i18n";
import "../globals.css";

/* design.md §2.2 : deux familles seulement. latin-ext couvre les accents FR. */
const lora = Lora({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-lora",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-instrument",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s — ${site.name}`,
    default: `${site.name} — Full Stack Software Engineer`,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

/**
 * Layout racine : c'est ici, et non au-dessus, que <html> est rendu —
 * seul ce niveau connaît la langue, indispensable pour lang="fr" | "en".
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <html lang={locale} className={`${lora.variable} ${instrumentSans.variable}`}>
      <head>
        {/*
          Sans JavaScript, ce style annule les états d'apparition : le contenu
          s'affiche immédiatement — indispensable pour les lecteurs sans JS et
          pour les moteurs.

          Un <noscript> plutôt qu'un script : le précédent ajoutait une classe
          sur <html> AVANT l'hydratation, si bien que React comparait deux
          className différents et signalait une désynchronisation. Ici rien ne
          mute le document.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {/* Couches de fond : couleur + hachures 145° + grain (design.md §4).
            Le contenu vit dans .content-layer, au-dessus. */}
        <div className="bg-hatch bg-grain relative min-h-screen">
          <div className="content-layer">
            <SmoothScroll />
            <JsonLd data={personJsonLd(locale)} />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[8px] focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-white"
            >
              {t(nav.skipToContent, locale)}
            </a>
            <Navigation locale={locale} />
            <main id="main">{children}</main>
            <Footer locale={locale} />
          </div>
        </div>
      </body>
    </html>
  );
}
