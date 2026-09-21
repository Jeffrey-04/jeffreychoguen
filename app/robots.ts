import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Route statique : obligatoire avec output: "export". */
export const dynamic = "force-static";

/**
 * robots.txt. Le site expose aussi /llms.txt (convention llmstxt.org), qui
 * décrit son contenu aux modèles de langage sous une forme qu'ils lisent sans
 * exécuter de JavaScript.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
