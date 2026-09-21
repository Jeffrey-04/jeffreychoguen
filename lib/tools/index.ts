import { categories, type CategoryId, isCategoryId } from "@/content/tools/categories";
import { getTool, tools, type ToolDefinition } from "@/content/tools/registry";
import { type Locale, tList } from "@/lib/i18n";

export { getTool, tools, categories, isCategoryId };
export type { ToolDefinition, CategoryId };

/** Outils réellement construits — les seuls à obtenir une URL. */
export const liveTools = tools.filter((tool) => tool.status === "live");

export function toolsInCategory(id: CategoryId, onlyLive = false): ToolDefinition[] {
  const source = onlyLive ? liveTools : tools;
  return source.filter((tool) => tool.category === id);
}

/** Catégories comptant au moins un outil catalogué. */
export function populatedCategories() {
  return categories
    .map((category) => ({
      category,
      all: toolsInCategory(category.id),
      live: toolsInCategory(category.id, true),
    }))
    .filter((entry) => entry.all.length > 0);
}

/**
 * Recherche : nom, tagline et surtout SYNONYMES. C'est le champ `keywords` qui
 * permet à « compress photo » de trouver Image Compressor, comme le demande
 * tools.md §23 — une recherche sur le seul nom raterait l'intention.
 */
export function searchTools(query: string, locale: Locale): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return tools.filter((tool) => {
    const haystack = [
      tool.name,
      tool.slug.replace(/-/g, " "),
      tool.tagline[locale],
      ...tList(tool.keywords, locale),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

/**
 * Outils liés — la relation est IMPLICITEMENT RÉCIPROQUE.
 *
 * Déclarer « image-compressor → image-resizer » suffit : le lien inverse est
 * déduit. Exiger que chaque relation soit écrite deux fois obligerait à faire
 * remonter toute nouvelle liaison dans la liste de l'autre outil, qui
 * enflerait sans fin et finirait désynchronisée. Une relation est un fait
 * symétrique, le modèle doit le refléter.
 *
 * Plafonné à 6, comme le prévoit tools.md §24.
 */
export function relatedFor(tool: ToolDefinition, limit = 6): ToolDefinition[] {
  const slugs = new Set(tool.relatedTools);
  for (const other of tools) {
    if (other.relatedTools.includes(tool.slug)) slugs.add(other.slug);
  }
  slugs.delete(tool.slug);

  return [...slugs]
    .map((slug) => getTool(slug))
    .filter((t): t is ToolDefinition => Boolean(t))
    .slice(0, limit);
}

/**
 * Contrôles d'intégrité exécutés AU BUILD.
 *
 * Ces erreurs sont invisibles à la lecture et se découvrent autrement en
 * production, sur une page liée qui n'existe pas. Mieux vaut casser le build.
 */
export function assertRegistryIntegrity(): void {
  const slugs = new Set<string>();
  const problems: string[] = [];

  for (const tool of tools) {
    if (slugs.has(tool.slug)) problems.push(`slug en double : ${tool.slug}`);
    slugs.add(tool.slug);

    // Un slug d'outil ne doit jamais collisionner avec une catégorie :
    // les deux vivent sur le même segment d'URL, /tools/<segment>.
    if (isCategoryId(tool.slug)) {
      problems.push(`le slug « ${tool.slug} » entre en collision avec une catégorie`);
    }
  }

  // La réciprocité n'est plus vérifiée : relatedFor la déduit. Reste à
  // s'assurer qu'aucune relation ne pointe dans le vide.
  for (const tool of tools) {
    for (const slug of tool.relatedTools) {
      if (!getTool(slug)) {
        problems.push(`${tool.slug} référence un outil inconnu : ${slug}`);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(`Registry d'outils invalide :\n- ${problems.join("\n- ")}`);
  }
}
