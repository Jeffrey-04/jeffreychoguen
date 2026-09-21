/**
 * Génère content/phosphor-icons.ts depuis @phosphor-icons/core.
 * Les tracés sont inlinés : aucune requête réseau, aucun runtime React,
 * et la couleur s'hérite via currentColor.
 * Relancer avec `npm run icons` après modification de la liste.
 */
import { readFileSync, writeFileSync } from "node:fs";

const DIR = "node_modules/@phosphor-icons/core/assets/regular";

/** Clé utilisée dans le code → nom du fichier Phosphor. */
/*
 * Deux jeux SÉPARÉS, et non un seul.
 *
 * Un objet unique n'est pas élagable : la section Process de l'accueil, qui
 * n'a besoin que de 7 icônes, embarquerait aussi les 14 icônes de catégories
 * d'outils. L'écart est de 2 Ko aujourd'hui et croîtra avec le catalogue.
 */
const SETS = {
  "content/phosphor-icons.ts": {
    // Étapes de la section Process + interface générale du site.
    framing: "magnifying-glass",
    modelling: "tree-structure",
    architecture: "stack",
    build: "code",
    deploy: "rocket-launch",
    maintain: "shield-check",
    process: "flow-arrow",
    magnifyingGlass: "magnifying-glass",
    shieldCheck: "shield-check",
    arrowsLeftRight: "arrows-left-right",
    // Groupes de compétences (content/skills.ts)
    skillBackend: "database",
    skillFrontend: "browser",
    skillMobile: "device-mobile",
    skillDevops: "cloud",
    skillPractice: "compass",
    skillLanguages: "translate",
    skillExtra: "plus-circle",
  },
  "content/tools/icons.ts": {
    // Catégories d'outils uniquement — chargées par les pages /tools.
    images: "images",
    filePdf: "file-pdf",
    qrCode: "qr-code",
    code: "code",
    textT: "text-t",
    magnifyingGlass: "magnifying-glass",
    palette: "palette",
    calculator: "calculator",
    arrowsLeftRight: "arrows-left-right",
    shieldCheck: "shield-check",
    briefcase: "briefcase",
    shareNetwork: "share-network",
    filmStrip: "film-strip",
    sparkle: "sparkle",
  },
};

function build(icons) {
  return Object.entries(icons).map(([key, file]) => {
    const svg = readFileSync(`${DIR}/${file}.svg`, "utf8");
    const viewBox = (svg.match(/viewBox="([^"]+)"/) || [])[1];
    if (!viewBox) throw new Error(`viewBox absent pour ${file}`);
    const inner = svg
      .replace(/^[\s\S]*?<svg[^>]*>/, "")
      .replace(/<\/svg>[\s\S]*$/, "")
      .replace(/<rect[^>]*fill="none"[^>]*\/>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return { key, viewBox, inner };
  });
}

for (const [out, icons] of Object.entries(SETS)) {
  const entries = build(icons);
  const contents = `// Fichier généré par scripts/generate-icons.mjs — ne pas éditer à la main.
// Source : @phosphor-icons/core (MIT), style "regular".

export type PhosphorIcon = { viewBox: string; inner: string };

export const icons = {
${entries.map((e) => `  ${e.key}: { viewBox: "${e.viewBox}", inner: ${JSON.stringify(e.inner)} },`).join("\n")}
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof icons;
`;
  writeFileSync(out, contents);
  console.log(`${entries.length} icônes → ${out}`);
}
