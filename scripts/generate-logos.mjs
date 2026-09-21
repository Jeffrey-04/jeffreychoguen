/**
 * Génère content/tech-logos.ts depuis le paquet simple-icons.
 * Les logos sont ainsi AUTO-HÉBERGÉS : aucune requête CDN à l'exécution,
 * donc aucun point de défaillance externe ni fuite de données de visite.
 * Relancer avec `npm run logos` après modification de la liste.
 */
import { writeFileSync } from "node:fs";
import * as si from "simple-icons";

/** Ordre d'affichage dans la bande défilante. */
// MySQL est volontairement absent : sa marque simple-icons intègre le mot
// « MySQL », illisible à 24px et redondant avec le libellé affiché à côté.
// La technologie reste listée dans la page Compétences.
const SLUGS = [
  "nodedotjs", "react", "nextdotjs", "typescript", "flutter",
  "mongodb", "docker", "nginx", "php", "firebase",
];

const key = (slug) => "si" + slug.charAt(0).toUpperCase() + slug.slice(1);

const entries = SLUGS.map((slug) => {
  const icon = si[key(slug)];
  if (!icon) throw new Error(`Icône introuvable dans simple-icons : ${slug}`);
  return { slug, title: icon.title, path: icon.path };
});

const file = `// Fichier généré par scripts/generate-logos.mjs — ne pas éditer à la main.
// Source : simple-icons (icônes sous CC0). Les marques appartiennent à leurs
// détenteurs ; elles sont utilisées ici à seule fin d'identification technique.

export type TechLogo = { slug: string; title: string; path: string };

export const techLogos: TechLogo[] = ${JSON.stringify(entries, null, 2)};
`;

writeFileSync("content/tech-logos.ts", file);
console.log(`${entries.length} logos écrits dans content/tech-logos.ts`);
