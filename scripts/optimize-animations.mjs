/**
 * Optimise les animations Lottie de public/Animations/ vers public/animations/.
 *
 * Deux choses s'y jouent.
 *
 * 1. LE POIDS. Ces Lottie embarquent leurs images en base64 dans le JSON.
 *    Mobile.json contient 90 PNG, soit 0,46 Mo sur 0,90. Du PNG déjà compressé
 *    ne gagne rien à la compression gzip du serveur : c'est donc le format
 *    d'image lui-même qu'il faut changer. Converties en WebP, ces mêmes images
 *    fondent sans perte visible à l'échelle où elles sont affichées.
 *
 * 2. L'EMPLACEMENT. Les sources vivent hors de public/ : sans cela le dossier
 *    d'origine ET la sortie optimisée seraient tous deux déployés, soit le
 *    double du poids pour rien.
 *
 *    Le dossier de sortie ne doit JAMAIS être une simple variante de casse du
 *    dossier source : macOS ne distingue pas la casse et les deux ne seraient
 *    qu'un seul dossier — le script écraserait ses propres sources.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import sharp from "sharp";

const SRC = "legacy/animations";
const OUT = "public/assets/lottie";

mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((name) => name.endsWith(".json"));
if (files.length === 0) throw new Error(`Aucune animation dans ${SRC}`);

for (const file of files) {
  const raw = readFileSync(`${SRC}/${file}`, "utf8");
  const animation = JSON.parse(raw);
  let converted = 0;
  let before = 0;
  let after = 0;

  for (const asset of animation.assets ?? []) {
    if (typeof asset.p !== "string" || !asset.p.startsWith("data:image/")) continue;
    // Déjà converti : recompresser du WebP en WebP dégraderait à chaque passage.
    if (asset.p.startsWith("data:image/webp")) continue;
    const comma = asset.p.indexOf(",");
    const payload = Buffer.from(asset.p.slice(comma + 1), "base64");
    before += payload.length;

    try {
      // Qualité 82 : au-delà le gain s'effondre, en deçà les aplats se tachent.
      const webp = await sharp(payload).webp({ quality: 82, effort: 6 }).toBuffer();
      if (webp.length < payload.length) {
        asset.p = `data:image/webp;base64,${webp.toString("base64")}`;
        after += webp.length;
        converted++;
      } else {
        after += payload.length;
      }
    } catch {
      // Une image illisible reste telle quelle : mieux vaut lourd que cassé.
      after += payload.length;
    }
  }

  const target = `${OUT}/${file.toLowerCase()}`;
  writeFileSync(target, JSON.stringify(animation));

  const srcKb = statSync(`${SRC}/${file}`).size / 1024;
  const outKb = statSync(target).size / 1024;
  const detail = converted
    ? ` — ${converted} images ${(before / 1024).toFixed(0)}→${(after / 1024).toFixed(0)} Ko`
    : " — aucune image embarquée";
  console.log(
    `${target.padEnd(34)} ${srcKb.toFixed(0)} → ${outKb.toFixed(0)} Ko${detail}`,
  );
}
