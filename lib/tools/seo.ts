import { getCategory } from "@/content/tools/categories";
import type { ToolDefinition } from "@/content/tools/registry";
import { site } from "@/content/site";
import { type Locale, t } from "@/lib/i18n";

/** Fil d'Ariane structuré (tools.md §21). */
export function breadcrumbJsonLd(tool: ToolDefinition, locale: Locale) {
  const category = getCategory(tool.category);
  const base = `${site.url}/${locale}`;

  const items = [
    { name: "Tools", url: `${base}/tools/` },
    ...(category ? [{ name: t(category.name, locale), url: `${base}/tools/${category.id}/` }] : []),
    { name: tool.name, url: `${base}/tools/${tool.slug}/` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Schema SoftwareApplication.
 * `price: 0` est une information exacte : les outils sont gratuits et sans
 * compte. On ne déclare pas de note ni d'avis, faute d'en avoir de réels.
 */
export function toolJsonLd(tool: ToolDefinition, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: `${site.url}/${locale}/tools/${tool.slug}/`,
    description: t(tool.description, locale),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    author: { "@type": "Person", name: site.name, url: site.url },
  };
}
