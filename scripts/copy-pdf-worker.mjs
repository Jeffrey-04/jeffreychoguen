/**
 * Copie le worker PDF.js dans public/vendor/.
 *
 * Il est servi comme fichier statique plutôt que résolu par le bundler : en
 * export statique, faire résoudre un worker par Turbopack est fragile et son
 * URL change à chaque build. Un chemin fixe est prévisible et cacheable.
 * Lancé automatiquement avant chaque build.
 */
import { copyFileSync, mkdirSync, statSync } from "node:fs";

const SRC = "node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
const OUT = "public/vendor/pdf.worker.min.mjs";

mkdirSync("public/vendor", { recursive: true });
copyFileSync(SRC, OUT);
console.log(`worker PDF.js copié : ${(statSync(OUT).size / 1024).toFixed(0)} Ko`);
