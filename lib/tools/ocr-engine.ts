/**
 * Moteur OCR — Tesseract, entièrement auto-hébergé.
 *
 * Les chemins sont explicites et pointent vers /vendor : sans eux,
 * tesseract.js irait chercher son worker, son cœur WebAssembly et ses données
 * de langue sur jsDelivr. L'image ne quitterait toujours pas l'appareil, mais
 * un tiers verrait l'adresse de chaque visiteur — exactement ce que
 * l'auto-hébergement supprime.
 */
export type OcrLanguage = "eng" | "fra";

export type OcrResult = {
  text: string;
  /** Confiance moyenne sur 100, telle que rapportée par Tesseract. */
  confidence: number;
};

export type OcrProgress = { stage: string; ratio: number };

export async function recogniseImages(
  images: Blob[],
  language: OcrLanguage,
  onProgress?: (progress: OcrProgress) => void,
): Promise<OcrResult> {
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker(language, 1, {
    workerPath: "/vendor/tesseract/worker.min.js",
    corePath: "/vendor/tesseract/",
    langPath: "/vendor/tessdata",
    // Les données de langue sont servies pré-compressées.
    gzip: true,
    logger: (message: { status: string; progress: number }) =>
      onProgress?.({ stage: message.status, ratio: message.progress }),
  });

  try {
    const parts: string[] = [];
    let confidenceSum = 0;

    for (const [index, image] of images.entries()) {
      const { data } = await worker.recognize(image);
      parts.push(data.text.trim());
      confidenceSum += data.confidence;
      onProgress?.({ stage: "page", ratio: (index + 1) / images.length });
    }

    return {
      // Deux sauts de ligne entre pages : la séparation reste lisible une fois
      // le texte copié ailleurs.
      text: parts.join("\n\n"),
      confidence: images.length ? Math.round(confidenceSum / images.length) : 0,
    };
  } finally {
    // Sans terminate(), le worker et ses ~20 Mo de mémoire survivent à l'onglet.
    await worker.terminate();
  }
}
