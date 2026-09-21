/**
 * Miroir local du modèle de détourage (@imgly/background-removal).
 *
 * Le modèle est servi par NOTRE Nginx : aucun tiers ne voit alors l'adresse
 * des visiteurs. L'image, elle, ne quitte jamais l'appareil dans les deux cas —
 * seul le modèle circule.
 *
 * On ne miroite QUE la variante quantifiée (42,3 Mo) et le runtime ONNX non
 * threadé (11,3 Mo). Les variantes fp16 (84 Mo) et pleine précision (168 Mo)
 * sont ignorées : le gain visuel ne justifie pas de tripler le téléchargement.
 *
 * Les fichiers ne sont pas versionnés. Le déploiement se fait par rsync, qui ne
 * les transfère qu'une seule fois.
 */
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";

const VERSION = "1.7.0";
const BASE = `https://staticimgly.com/@imgly/background-removal-data/${VERSION}/dist`;
const OUT = "public/vendor/bg";

/** Ressources conservées. Tout le reste est écarté du miroir. */
const KEEP = ["/models/isnet_quint8", "/onnxruntime-web/ort-wasm-simd-threaded.wasm", "/onnxruntime-web/ort-wasm-simd-threaded.mjs"];

mkdirSync(OUT, { recursive: true });

const manifestResponse = await fetch(`${BASE}/resources.json`);
if (!manifestResponse.ok) {
  throw new Error(`Manifeste du modèle inaccessible : HTTP ${manifestResponse.status}`);
}
const manifest = await manifestResponse.json();

// Le manifeste local ne déclare que ce qu'on héberge : demander une variante
// absente échouerait alors clairement, plutôt que silencieusement.
const local = Object.fromEntries(Object.entries(manifest).filter(([key]) => KEEP.includes(key)));
writeFileSync(`${OUT}/resources.json`, JSON.stringify(local));

let downloaded = 0;
let skipped = 0;

for (const resource of Object.values(local)) {
  for (const chunk of resource.chunks) {
    const target = `${OUT}/${chunk.name}`;
    const expected = chunk.offsets[1] - chunk.offsets[0];
    if (existsSync(target) && statSync(target).size === expected) {
      skipped++;
      continue;
    }
    const response = await fetch(`${BASE}/${chunk.name}`);
    if (!response.ok) throw new Error(`Chunk ${chunk.name.slice(0, 12)}… : HTTP ${response.status}`);
    writeFileSync(target, Buffer.from(await response.arrayBuffer()));
    downloaded++;
  }
}

const total = Object.values(local).reduce((sum, r) => sum + r.size, 0);
console.log(
  `modèle de détourage : ${(total / 1048576).toFixed(1)} Mo — ${downloaded} morceaux téléchargés, ${skipped} déjà présents`,
);
