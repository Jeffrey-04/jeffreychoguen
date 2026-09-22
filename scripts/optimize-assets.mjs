import { existsSync } from "node:fs";
/**
 * Optimise les assets source de legacy/assets vers public/assets.
 * design.md §8 : AVIF + WebP, cible < 200 Ko par visuel plein format.
 * Idempotent — relançable avec `npm run assets`.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/assets";
/** Budget par visuel plein format (design.md §8). */
const BUDGET_KB = 200;
/**
 * Budget distinct pour les assets animés : comparer une séquence de 48 images
 * au budget d'une image fixe n'a pas de sens. Jeffrey a explicitement demandé
 * que la qualité de l'animation prime sur le poids, puis d'en augmenter encore
 * la résolution — d'où ce plafond élevé, assumé et non subi.
 */
const BUDGET_ANIMATED_KB = 900;
await mkdir(OUT, { recursive: true });

const jobs = [
  // Captures des projets. Sources renommées d'après le slug : le fichier
  // saveursducameroun.png illustre le projet saveurs-du-monde, qui englobe
  // ce site. 1600px suffit pour une carte de ~800px sur écran retina.
  ...["colisgo", "afreelink", "mundi-complex", "patrimony-life", "saveurs-du-monde"].map((slug) => ({
    src: `legacy/projects/${slug}.png`,
    variants: [
      { out: `${OUT}/projects/${slug}.avif`, width: 1600, format: "avif", quality: 60 },
      { out: `${OUT}/projects/${slug}.webp`, width: 1600, format: "webp", quality: 80 },
    ],
  })),
  {
    /*
     * Logo. La source est un tracé noir sur fond BLANC OPAQUE : l'alpha est
     * dérivé de la luminance inversée, ce qui conserve l'anticrénelage des
     * courbes là où un seuillage donnerait un contour en escalier.
     * Le résultat sert de MASQUE CSS : la couleur vient de currentColor,
     * un seul fichier suffit donc pour le fond clair comme pour le sombre.
     */
    src: "legacy/assets/logo-cutout.png",
    variants: [{ out: `${OUT}/logo.png`, width: 384, format: "png" }],
  },
  {
    // Portrait détourné du hero. Résolution native 600x400 conservée : c'est
    // la taille de la source fournie, l'agrandir n'ajouterait aucun détail.
    // La transparence est préservée (WebP et AVIF gèrent l'alpha).
    src: "legacy/assets/hero-cutout-source.png",
    // trim : retire les marges transparentes, pour que le sommet du crâne
    // coïncide avec le bord haut de l'image. Le débordement au-dessus du cadre
    // devient ainsi exactement la valeur demandée, sans marge invisible.
    trim: true,
    variants: [
      { out: `${OUT}/hero-cutout.avif`, format: "avif", quality: 62 },
      { out: `${OUT}/hero-cutout.webp`, format: "webp", quality: 88 },
    ],
  },
  {
    src: "legacy/assets/hero-image.png",
    // Portrait du hero : LCP de la page d'accueil, servi à ~1100px de large.
    variants: [
      { out: `${OUT}/hero.avif`, width: 1400, format: "avif", quality: 62 },
      { out: `${OUT}/hero.webp`, width: 1400, format: "webp", quality: 80 },
    ],
  },
  {
    // Texture fumée des cartes sombres : l'asset d'origine du template
    // (design/framer-reference/assets/IHneqoBbdHUCED6FYR137ZUxEqI.gif),
    // 2,4 Mo en GIF, ramené à ~140 Ko en WebP animé.
    src: "design/framer-reference/assets/IHneqoBbdHUCED6FYR137ZUxEqI.gif",
    variants: [
      // Suréchantillonné en 1000px (2x la source) au kernel Lanczos, à la
      // demande de Jeffrey. Le GIF d'origine fait 500x500 : cet agrandissement
      // n'ajoute donc AUCUN détail réel, mais évite au navigateur d'étirer
      // lui-même la texture sur les grandes cartes et lisse le rendu.
      { out: `${OUT}/smoke.webp`, width: 1000, kernel: "lanczos3", format: "webp", quality: 74, animated: true, grayscale: true },
      // Image fixe servie sous prefers-reduced-motion.
      { out: `${OUT}/smoke-still.webp`, format: "webp", quality: 82, grayscale: true },
    ],
  },
];

for (const job of jobs) {
  if (!existsSync(job.src)) {
    // Sources non versionnées (assets du template Sevora) : absentes d'un
    // clone frais. La sortie déjà générée reste dans public/assets/.
    console.log(`${job.src.padEnd(34)} source absente — ignoré`);
    continue;
  }
  for (const v of job.variants) {
    // Désaturation : le GIF d'origine est bleuté, alors que la référence
    // (screens/08-features.jpg) montre une fumée monochrome et que la palette
    // de design.md §2.1 n'a pas d'autre teinte que l'accent vert.
    const pipeline = sharp(job.src, { animated: v.animated === true });
    if (job.trim) pipeline.trim();
    if (v.width) pipeline.resize({ width: v.width, kernel: v.kernel ?? "lanczos3", withoutEnlargement: !v.kernel });
    if (v.grayscale) pipeline.grayscale();
    const info = await pipeline
      .toFormat(v.format, { quality: v.quality, effort: v.animated ? 4 : 6 })
      .toFile(v.out);
    const kb = info.size / 1024;
    console.log(`${v.out.padEnd(28)} ${info.width}x${info.height}  ${kb.toFixed(0)} Ko`);
    // Garde-fou : design.md §8 fixe 200 Ko par visuel plein format. Sans ce
    // contrôle, un asset gonflé par une exécution ratée part en production
    // sans que personne ne le remarque.
    const budget = v.animated ? BUDGET_ANIMATED_KB : BUDGET_KB;
    if (kb > budget) {
      console.error(`\n❌ ${v.out} dépasse le budget : ${kb.toFixed(0)} Ko > ${budget} Ko`);
      process.exitCode = 1;
    }
  }
}
