/**
 * Contrôle de la sortie avant déploiement — `npm run verify`.
 *
 * Inspecte out/ tel qu'il sera envoyé, pas le code : liens internes, pages
 * des outils dans les deux langues, validité de chaque bloc JSON-LD, fichiers
 * pour moteurs et agents, assets des outils, budget JS de l'accueil, absence
 * de librairie lourde sur l'accueil, propreté de la sortie.
 *
 * Code de sortie non nul au premier échec : utilisable tel quel en CI.
 * À lancer APRÈS `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const OUT = "out";
const results = [];
const ok = (label, pass, detail = "") => results.push({ label, pass, detail });

function walk(dir, list = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, list); else list.push(p);
  }
  return list;
}
const files = walk(OUT);
const html = files.filter((f) => f.endsWith(".html"));

// 1. Liens internes
const exists = (u) => {
  const clean = u.split("#")[0].split("?")[0];
  const p = path.join(OUT, clean);
  return (fs.existsSync(p) && fs.statSync(p).isFile()) || fs.existsSync(path.join(p, "index.html"));
};
let links = 0; const broken = new Set();
for (const f of html) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    if (m[1].startsWith("/_next/")) continue;
    links++; if (!exists(m[1])) broken.add(m[1]);
  }
}
ok("Liens internes", broken.size === 0, `${links} vérifiés${broken.size ? " — cassés : " + [...broken].slice(0, 3).join(", ") : ""}`);

// 2. Pages des 23 outils, dans les deux langues
const registry = fs.readFileSync("content/tools/registry.ts", "utf8");
const live = [...registry.matchAll(/slug: "([a-z0-9-]+)",[\s\S]*?status: "(live|planned)"/g)].filter((m) => m[2] === "live").map((m) => m[1]);
const missingTools = [];
for (const s of live) for (const l of ["en", "fr"]) if (!fs.existsSync(`${OUT}/${l}/tools/${s}/index.html`)) missingTools.push(`${l}/${s}`);
ok("Pages d'outils", missingTools.length === 0, `${live.length} outils × 2 langues${missingTools.length ? " — manquantes : " + missingTools.join(", ") : ""}`);

// 3. Pages principales
const main = ["", "about", "experience", "projects", "tools", "writing", "contact", "cv", "skills"];
const missingMain = [];
for (const l of ["en", "fr"]) for (const p of main) if (!fs.existsSync(`${OUT}/${l}/${p}${p ? "/" : ""}index.html`)) missingMain.push(`${l}/${p}`);
ok("Pages principales", missingMain.length === 0, `${main.length} × 2 langues${missingMain.length ? " — manquantes : " + missingMain.join(", ") : ""}`);

// 4. Données structurées : chaque bloc JSON-LD doit être du JSON valide
let ld = 0; const badLd = [];
for (const f of html) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    ld++; try { JSON.parse(m[1]); } catch { badLd.push(f); }
  }
}
ok("JSON-LD valide", badLd.length === 0, `${ld} blocs${badLd.length ? " — invalides : " + badLd.slice(0, 2).join(", ") : ""}`);

// 5. Fichiers pour moteurs et agents
for (const f of ["robots.txt", "sitemap.xml", "feed.xml", "llms.txt", "favicon.ico", "404.html"]) {
  ok(`/${f}`, fs.existsSync(`${OUT}/${f}`) && fs.statSync(`${OUT}/${f}`).size > 0, fs.existsSync(`${OUT}/${f}`) ? `${Math.round(fs.statSync(`${OUT}/${f}`).size / 1024)} Ko` : "absent");
}

// 6. Assets du jour
for (const f of ["assets/lottie/backend.json", "assets/lottie/mobile.json", "assets/lottie/delivery.json"]) ok(`Animation ${path.basename(f)}`, fs.existsSync(`${OUT}/${f}`));
const shots = fs.readdirSync(`${OUT}/assets/projects`).filter((n) => n.endsWith(".webp")).length;
ok("Captures de projets", shots === 5, `${shots} WebP (+ AVIF)`);
ok("CV", fs.existsSync(`${OUT}/cv/CV-Jeffrey-en.pdf`) && fs.existsSync(`${OUT}/cv/CV-Jeffrey-fr.pdf`), "en + fr");
ok("Assets d'outils", ["vendor/pdf.worker.min.mjs", "vendor/tessdata/eng.traineddata.gz", "vendor/bg/resources.json"].every((f) => fs.existsSync(`${OUT}/${f}`)), "worker PDF, OCR, détourage");

// 7. Budget JS de l'accueil
const homeJs = [...new Set([...fs.readFileSync(`${OUT}/en/index.html`, "utf8").matchAll(/\/_next\/static\/[^"]+\.js/g)].map((m) => m[0]))];
const gz = homeJs.reduce((s, u) => s + (fs.existsSync(OUT + u) ? zlib.gzipSync(fs.readFileSync(OUT + u)).length : 0), 0);
ok("Budget JS accueil", gz / 1024 < 200, `${Math.round(gz / 1024)} Ko gzip`);

// 8. Étanchéité : aucune librairie lourde ni moteur sur l'accueil
const leaks = [];
for (const u of homeJs) {
  const t = fs.existsSync(OUT + u) ? fs.readFileSync(OUT + u, "utf8") : "";
  if (t.includes("PDFHexString")) leaks.push("pdf-lib");
  if (t.includes("AnnotationLayer")) leaks.push("pdf.js");
  if (t.includes("loadAnimation") && t.includes("bodymovin")) leaks.push("lottie");
  if (t.includes("recognize") && t.includes("tesseract")) leaks.push("tesseract");
}
ok("Aucune librairie lourde sur l'accueil", leaks.length === 0, leaks.length ? [...new Set(leaks)].join(", ") : "pdf-lib, pdf.js, lottie, tesseract absents");

// 9. Propreté de la sortie
ok("Aucun .DS_Store", !files.some((f) => f.endsWith(".DS_Store")));
ok("Aucun fichier de test", !fs.readdirSync(OUT).some((n) => n.endsWith(".html") && !["index.html", "404.html"].includes(n)));
ok("Aucun source Lottie en double", !fs.existsSync(`${OUT}/Animations`) && !fs.existsSync(`${OUT}/Projects`));

// 10. Titres et descriptions
const titles = new Set(), descs = [];
for (const f of html) {
  const t = fs.readFileSync(f, "utf8");
  const ti = t.match(/<title>(.*?)<\/title>/); if (ti) titles.add(ti[1].replace(/&amp;/g, "&").replace(/&#x27;/g, "'"));
  const de = t.match(/<meta name="description" content="(.*?)"/); if (de) descs.push(de[1]);
}
ok("Titres ≤ 60 caractères", [...titles].every((t) => t.length <= 60), `${[...titles].filter((t) => t.length > 60).length} trop longs`);

const width = Math.max(...results.map((r) => r.label.length));
for (const r of results) console.log(`  ${r.pass ? "✓" : "✗"} ${r.label.padEnd(width)}  ${r.detail}`);
const failed = results.filter((r) => !r.pass).length;
console.log(`\n  ${results.length - failed}/${results.length} contrôles réussis`);
process.exitCode = failed ? 1 : 0;
