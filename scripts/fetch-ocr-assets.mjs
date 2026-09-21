/**
 * Récupère les données de langue Tesseract dans public/vendor/tessdata/.
 *
 * Décision d'hébergement : les modèles sont servis par notre propre Nginx, pas
 * par un CDN tiers. Aucun tiers ne voit alors qui utilise l'outil ni depuis
 * quelle adresse.
 *
 * Les fichiers ne sont PAS versionnés (16 Mo), ils sont téléchargés au build.
 * L'échec est FATAL et non silencieux : sans cela, tesseract.js retomberait
 * discrètement sur son CDN par défaut, et la décision d'auto-hébergement
 * serait contournée sans que personne ne s'en aperçoive.
 */
import { copyFileSync, createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const BASE = "https://tessdata.projectnaptha.com/4.0.0";
const OUT = "public/vendor/tessdata";
const LANGUAGES = ["eng", "fra"];

mkdirSync(OUT, { recursive: true });

for (const lang of LANGUAGES) {
  const target = `${OUT}/${lang}.traineddata.gz`;
  if (existsSync(target) && statSync(target).size > 1_000_000) {
    console.log(`tessdata ${lang} : déjà présent (${(statSync(target).size / 1048576).toFixed(1)} Mo)`);
    continue;
  }

  const response = await fetch(`${BASE}/${lang}.traineddata.gz`);
  if (!response.ok || !response.body) {
    throw new Error(`Téléchargement de ${lang}.traineddata.gz impossible : HTTP ${response.status}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(target));
  console.log(`tessdata ${lang} : ${(statSync(target).size / 1048576).toFixed(1)} Mo téléchargés`);
}

/*
 * Worker et cœur WebAssembly, copiés depuis node_modules — aucun réseau requis.
 * Sans eux, tesseract.js irait les chercher sur jsDelivr, ce qui réintroduirait
 * exactement le tiers que l'auto-hébergement vise à supprimer.
 *
 * Variante « simd-lstm » : 3,7 Mo contre 4,5 Mo. Elle ne porte que le moteur
 * LSTM, le seul utilisé depuis Tesseract 4 — l'ancien moteur serait du poids
 * mort.
 */
const VENDOR = "public/vendor/tesseract";
mkdirSync(VENDOR, { recursive: true });

const COPIES = [
  ["node_modules/tesseract.js/dist/worker.min.js", `${VENDOR}/worker.min.js`],
  ["node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm.js", `${VENDOR}/core-simd-lstm.wasm.js`],
  ["node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js", `${VENDOR}/core-lstm.wasm.js`],
];

for (const [from, to] of COPIES) {
  copyFileSync(from, to);
  console.log(`${to.split("/").pop()} : ${(statSync(to).size / 1048576).toFixed(1)} Mo`);
}
