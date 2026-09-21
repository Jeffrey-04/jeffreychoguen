/**
 * Moteur PDF.
 *
 * Deux librairies, chargées UNIQUEMENT à l'usage :
 *  - pdf-lib pour manipuler la structure (fusion, découpe, assemblage) ;
 *  - pdf.js pour rasteriser des pages en image.
 *
 * Les imports sont dynamiques : elles ne doivent jamais entrer dans le bundle
 * des pages qui ne s'en servent pas, ce qui inclut la totalité du portfolio.
 */

/*
 * Import de TYPES uniquement : il est effacé à la compilation et n'entraîne
 * donc aucun chargement de pdf-lib au runtime.
 */
import type { PDFRawStream, PDFRef } from "pdf-lib";

/** Déclaré une fois : chaque appel direct à import() créerait un chunk séparé. */
async function pdfLib() {
  return import("pdf-lib");
}

export type PdfPageRange = { from: number; to: number };

/**
 * pdf-lib renvoie un Uint8Array dont le tampon est typé ArrayBufferLike, que
 * Blob n'accepte pas : il pourrait s'agir d'un SharedArrayBuffer. On recopie
 * dans un tampon dont le type est garanti.
 */
function toPdfBlob(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy.buffer], { type: "application/pdf" });
}

/**
 * Analyse une saisie de pages : « 1-3, 5, 8-10 ».
 * Les numéros sont ceux de l'utilisateur (à partir de 1), pas des index.
 */
export function parseRanges(input: string, pageCount: number): PdfPageRange[] {
  const ranges: PdfPageRange[] = [];
  for (const part of input.split(",")) {
    const chunk = part.trim();
    if (!chunk) continue;
    const match = chunk.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
    if (!match) continue;
    const from = Math.max(1, Number(match[1]));
    const to = Math.min(pageCount, match[2] ? Number(match[2]) : from);
    if (from <= to) ranges.push({ from, to });
  }
  return ranges;
}

export async function countPages(file: File): Promise<number> {
  const { PDFDocument } = await pdfLib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  return doc.getPageCount();
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  const { PDFDocument } = await pdfLib();
  const merged = await PDFDocument.create();

  for (const file of files) {
    const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) merged.addPage(page);
  }

  return toPdfBlob(await merged.save());
}

/** Extrait les pages demandées dans un nouveau document. */
export async function extractPages(file: File, ranges: PdfPageRange[]): Promise<Blob> {
  const { PDFDocument } = await pdfLib();
  const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const out = await PDFDocument.create();

  const indices: number[] = [];
  for (const range of ranges) {
    for (let page = range.from; page <= range.to; page++) indices.push(page - 1);
  }
  if (indices.length === 0) throw new Error("no-pages");

  const pages = await out.copyPages(source, indices);
  for (const page of pages) out.addPage(page);
  return toPdfBlob(await out.save());
}

/** Découpe en un document par page. */
export async function splitToPages(file: File): Promise<Blob[]> {
  const { PDFDocument } = await pdfLib();
  const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const results: Blob[] = [];

  for (let index = 0; index < source.getPageCount(); index++) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(source, [index]);
    out.addPage(page);
    results.push(toPdfBlob(await out.save()));
  }
  return results;
}

export type PageSize = "fit" | "a4" | "letter";

const SIZES: Record<Exclude<PageSize, "fit">, [number, number]> = {
  // Dimensions en points PostScript (72 par pouce), unité native du PDF.
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export async function imagesToPdf(
  files: File[],
  options: { size: PageSize; margin: number },
): Promise<Blob> {
  const { PDFDocument } = await pdfLib();
  const doc = await PDFDocument.create();

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const image =
      file.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);

    if (options.size === "fit") {
      // La page épouse l'image : aucun recadrage, aucune bande blanche.
      const page = doc.addPage([image.width + options.margin * 2, image.height + options.margin * 2]);
      page.drawImage(image, {
        x: options.margin,
        y: options.margin,
        width: image.width,
        height: image.height,
      });
      continue;
    }

    const [pageWidth, pageHeight] = SIZES[options.size];
    const page = doc.addPage([pageWidth, pageHeight]);
    const usableWidth = pageWidth - options.margin * 2;
    const usableHeight = pageHeight - options.margin * 2;
    const scale = Math.min(usableWidth / image.width, usableHeight / image.height, 1);
    const width = image.width * scale;
    const height = image.height * scale;

    page.drawImage(image, {
      x: (pageWidth - width) / 2,
      y: (pageHeight - height) / 2,
      width,
      height,
    });
  }

  return toPdfBlob(await doc.save());
}

/** Rasterise chaque page. `scale` 2 ≈ 144 dpi, suffisant pour la lecture écran. */
export async function pdfToImages(
  file: File,
  options: { scale: number; format: "image/jpeg" | "image/png"; quality: number },
  onProgress?: (done: number, total: number) => void,
): Promise<Blob[]> {
  const pdfjs = await import("pdfjs-dist");
  // Chemin fixe servi depuis public/ — cf. scripts/copy-pdf-worker.mjs.
  pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";

  // On garde la tâche de chargement : c'est elle qui porte destroy(), et sans
  // cet appel le worker et ses tampons restent en mémoire après coup.
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const doc = await task.promise;
  const blobs: Blob[] = [];

  for (let number = 1; number <= doc.numPages; number++) {
    const page = await doc.getPage(number);
    const viewport = page.getViewport({ scale: options.scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas-unavailable");

    // Le JPEG n'a pas d'alpha : sans fond blanc, une page transparente
    // ressortirait noire.
    if (options.format === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({ canvas, canvasContext: context, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("encode-failed"))),
        options.format,
        options.format === "image/png" ? undefined : options.quality,
      );
    });
    blobs.push(blob);
    onProgress?.(number, doc.numPages);
  }

  await task.destroy();
  return blobs;
}

export type CompressResult = {
  blob: Blob;
  /** Nombre d'images ré-encodées — 0 signale un PDF sans image compressible. */
  imagesTouched: number;
  imagesFound: number;
};

/**
 * Compression d'un PDF par ré-encodage de ses images intégrées.
 *
 * L'approche répandue consiste à rasteriser chaque page en JPEG puis à
 * reconstruire le document. Elle réduit énormément le poids, mais détruit le
 * texte : plus de sélection, plus de recherche, plus de netteté au zoom. Elle
 * est ici écartée.
 *
 * On cible donc uniquement les flux d'image en DCTDecode — c'est-à-dire des
 * JPEG déjà encodés, que l'on décode, redimensionne et ré-encode plus
 * agressivement. Le texte, les vecteurs et la structure restent intacts.
 *
 * Conséquence à annoncer à l'utilisateur : un PDF purement textuel ne contient
 * aucune image, donc ne gagne rien. Le gain est spectaculaire sur les scans et
 * les documents riches en photos, qui sont le cas d'usage réel de « compresser
 * un PDF ».
 */
export async function compressPdf(
  file: File,
  options: { quality: number; maxImageWidth?: number },
  onProgress?: (done: number, total: number) => void,
): Promise<CompressResult> {
  const { PDFDocument, PDFRawStream: RawStream, PDFName, PDFNumber } = await pdfLib();
  const { processImage } = await import("@/lib/tools/image-engine");

  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const entries = doc.context.enumerateIndirectObjects();

  // Repérage préalable : permet d'annoncer une progression honnête et de
  // distinguer « aucune image » de « aucun gain possible ».
  const targets: { ref: PDFRef; stream: PDFRawStream }[] = [];

  for (const [ref, object] of entries) {
    if (!(object instanceof RawStream)) continue;
    const dict = object.dict;
    if (dict.get(PDFName.of("Subtype"))?.toString() !== "/Image") continue;
    // Seuls les JPEG déjà encodés : les autres filtres demanderaient de
    // reconstruire l'espace colorimétrique, pour un gain bien moindre.
    if (dict.get(PDFName.of("Filter"))?.toString() !== "/DCTDecode") continue;
    targets.push({ ref, stream: object });
  }

  let touched = 0;

  for (const [index, target] of targets.entries()) {
    try {
      const original = target.stream.contents;
      const copy = new Uint8Array(original.byteLength);
      copy.set(original);
      const asFile = new File([copy.buffer], "embedded.jpg", { type: "image/jpeg" });

      const result = await processImage(asFile, {
        format: "image/jpeg",
        quality: options.quality,
        maxWidth: options.maxImageWidth,
      });

      // On ne remplace que si l'on gagne réellement : ré-encoder une image déjà
      // optimisée l'alourdit souvent.
      if (result.bytes < original.byteLength) {
        const bytes = new Uint8Array(await result.blob.arrayBuffer());
        const dict = target.stream.dict;
        dict.set(PDFName.of("Width"), PDFNumber.of(result.width));
        dict.set(PDFName.of("Height"), PDFNumber.of(result.height));
        dict.set(PDFName.of("Length"), PDFNumber.of(bytes.byteLength));
        dict.set(PDFName.of("BitsPerComponent"), PDFNumber.of(8));
        // Le canvas restitue en sRGB : l'espace d'origine, potentiellement
        // CMJN ou ICC, ne décrirait plus les octets.
        dict.set(PDFName.of("ColorSpace"), PDFName.of("DeviceRGB"));
        dict.delete(PDFName.of("DecodeParms"));
        dict.delete(PDFName.of("Decode"));
        doc.context.assign(target.ref, RawStream.of(dict, bytes));
        touched++;
      }
    } catch {
      // Une image illisible ne doit pas faire échouer tout le document.
    }
    onProgress?.(index + 1, targets.length);
  }

  return {
    blob: toPdfBlob(await doc.save()),
    imagesTouched: touched,
    imagesFound: targets.length,
  };
}
