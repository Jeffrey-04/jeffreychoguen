import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { getAllSlugs } from "@/lib/writing";
import { categories } from "@/content/tools/categories";
import { liveTools } from "@/lib/tools";
import { locales, type Locale } from "@/lib/i18n";

/** Route statique : obligatoire avec output: "export". */
export const dynamic = "force-static";

/** Une entrée par page ET par langue, avec alternates hreflang (design.md §11.1). */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticSegments = ["", "about", "experience", "projects", "skills", "writing", "contact", "cv", "tools"];
  // Catégories et outils réellement construits. Un outil « planned » n'a pas
  // d'URL, il n'a donc rien à faire dans le sitemap.
  const toolSegments = [
    ...categories.map((category) => `tools/${category.id}`),
    ...liveTools.map((tool) => `tools/${tool.slug}`),
  ];
  const projectSegments = projects.map((project) => `projects/${project.slug}`);
  const writingSegments = getAllSlugs().map((slug) => `writing/${slug}`);
  const segments = [...staticSegments, ...toolSegments, ...projectSegments, ...writingSegments];

  const url = (locale: Locale, segment: string) =>
    segment ? `${site.url}/${locale}/${segment}/` : `${site.url}/${locale}/`;

  return segments.flatMap((segment) =>
    locales.map((locale) => ({
      url: url(locale, segment),
      lastModified: new Date(),
      changeFrequency: segment === "" ? ("weekly" as const) : ("monthly" as const),
      priority: segment === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, url(l, segment)])),
      },
    })),
  );
}
