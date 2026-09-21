import type { Metadata } from "next";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";
import { experiences } from "@/content/experience";
import { type Locale, locales, t } from "@/lib/i18n";

type PageSeo = {
  locale: Locale;
  title: string;
  description: string;
  /** Segment sans langue ni slash, ex. "projects" ou "projects/colisgo". */
  segment?: string;
  /**
   * Titre exact, sans le suffixe « — Jeffrey Choguen » du layout. Utilisé par
   * les pages d'outils, où ce suffixe mange des caractères sans servir
   * l'intention de recherche.
   */
  exactTitle?: boolean;
};

/**
 * Seuil au-delà duquel Google tronque un titre. Ce n'est pas une limite de
 * caractères stricte mais de largeur en pixels ; 60 est le repère de sécurité.
 */
const TITLE_LIMIT = 60;

/** Au-delà, Google tronque la description affichée dans ses résultats. */
const DESCRIPTION_LIMIT = 155;

/**
 * Description ramenée sous la limite, coupée à la phrase ou au mot.
 *
 * Mieux vaut une phrase complète plus courte qu'un texte interrompu par des
 * points de suspension : c'est cette description qui décide du clic.
 */
export function clampDescription(text: string): string {
  if (text.length <= DESCRIPTION_LIMIT) return text;
  const window = text.slice(0, DESCRIPTION_LIMIT);
  const sentence = Math.max(window.lastIndexOf(". "), window.lastIndexOf(" — "));
  if (sentence > 80) return window.slice(0, sentence + 1).trim();
  const word = window.lastIndexOf(" ");
  return `${window.slice(0, word > 80 ? word : DESCRIPTION_LIMIT).trim()}…`;
}

/**
 * Titre garanti court, sans suffixe de site.
 *
 * Les pages d'outils portaient « Nom — accroche — Jeffrey Choguen », jusqu'à
 * 103 caractères dont Google n'affichait que la moitié. Sur une page d'outil
 * c'est le NOM qui porte l'intention de recherche : il ne doit jamais être ce
 * qu'on coupe.
 */
export function compactTitle(lead: string, tail?: string): string {
  if (!tail) return lead;
  const full = `${lead} — ${tail}`;
  if (full.length <= TITLE_LIMIT) return full;
  const room = TITLE_LIMIT - lead.length - 3;
  if (room < 14) return lead;
  const cut = tail.slice(0, room);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lead} — ${(lastSpace > 10 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, "")}`;
}

/** Métadonnées complètes d'une page : canonical, hreflang, Open Graph, carte X. */
export function buildMetadata({
  locale,
  title,
  description,
  segment = "",
  exactTitle = false,
}: PageSeo): Metadata {
  const clean = segment.replace(/^\/+|\/+$/g, "");
  const pathFor = (l: Locale) => (clean ? `/${l}/${clean}/` : `/${l}/`);
  const url = pathFor(locale);

  const languages: Record<string, string> = { "x-default": "/" };
  for (const l of locales) languages[l] = pathFor(l);

  const clamped = clampDescription(description);

  return {
    title: exactTitle ? { absolute: title } : title,
    description: clamped,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      title,
      description: clamped,
      url,
      siteName: site.name,
      locale: locale === "fr" ? "fr_CM" : "en_US",
      images: [{ url: "/assets/hero.webp", width: 1100, height: 733, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: clamped,
      images: ["/assets/hero.webp"],
    },
  };
}

/** JSON-LD Person (guide.md §Structured Data). */
export function personJsonLd(locale: Locale) {
  const sameAs: string[] = [site.social.linkedin];
  if (site.showGithub) sameAs.push(site.social.github);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.legalName,
    url: site.url,
    image: `${site.url}/assets/hero.webp`,
    jobTitle: t(site.jobTitle, locale),
    description: t(site.tagline, locale),
    email: `mailto:${site.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressCountry: "CM",
    },
    sameAs,
    knowsLanguage: ["fr", "en"],
    knowsAbout: Array.from(new Set(skillGroups.flatMap((g) => g.items))),
    worksFor: experiences
      .filter((e) => e.end === null)
      .map((e) => ({ "@type": "Organization", name: e.company })),
  };
}

/**
 * FAQPage — uniquement lorsque la FAQ est RÉELLEMENT affichée (guide.md §SEO).
 * Baliser une FAQ absente de la page enfreint les consignes de Google et coûte
 * les résultats enrichis.
 */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Liste ordonnée — catalogue d'outils, page de catégorie. */
export function itemListJsonLd(
  items: { name: string; url: string; description?: string }[],
  name: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

/**
 * WebSite — rattache le domaine à une entité nommée et déclare la recherche
 * interne, condition d'affichage de la boîte de recherche dans les résultats.
 */
export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.legalName,
    url: site.url,
    inLanguage: locale,
    publisher: { "@type": "Person", name: site.name, url: site.url },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/${locale}/tools/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
