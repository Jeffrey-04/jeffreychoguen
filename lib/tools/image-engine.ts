/**
 * Moteur image — Canvas natif, aucune librairie.
 *
 * Un seul moteur sert les six outils d'image : compresseur, redimensionneur,
 * convertisseur et les trois conversions dédiées. Ils n'en sont que des
 * préréglages, avec chacun leur page et leur intention de recherche.
 *
 * Tout se passe dans le navigateur. Aucun octet ne part sur le réseau.
 */

export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

export type ImageJob = {
  format: ImageFormat;
  /** 0 à 1. Ignoré pour le PNG, qui est sans perte. */
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  /** Cible de poids en octets : la qualité est cherchée par dichotomie. */
  targetBytes?: number;
  /** Couleur sous la transparence, quand le format de sortie ne la gère pas. */
  background?: string;
};

export type ImageResult = {
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
  /** Qualité réellement retenue — utile quand une cible de poids l'a imposée. */
  quality?: number;
};

export const FORMAT_EXTENSION: Record<ImageFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Tous les navigateurs ne savent pas ENCODER tous les formats qu'ils savent
 * lire — l'AVIF en est l'exemple courant. On teste réellement plutôt que de
 * supposer, et l'interface masque ce qui n'est pas supporté.
 */
export async function canEncode(format: ImageFormat): Promise<boolean> {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const url = canvas.toDataURL(format);
    return url.startsWith(`data:${format}`);
  } catch {
    return false;
  }
}

/** Dimensions cibles, en préservant le rapport d'aspect. */
export function fitWithin(
  width: number,
  height: number,
  maxWidth?: number,
  maxHeight?: number,
): { width: number; height: number } {
  if (!maxWidth && !maxHeight) return { width, height };
  const ratioW = maxWidth ? maxWidth / width : Infinity;
  const ratioH = maxHeight ? maxHeight / height : Infinity;
  // Jamais d'agrandissement : on n'invente pas de détail qui n'existe pas.
  const ratio = Math.min(ratioW, ratioH, 1);
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}

type Decoded = {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
};

/** Au-delà, on considère le décodage bloqué plutôt que lent. */
const DECODE_TIMEOUT_MS = 20_000;

/**
 * Décodage via <img> et l'événement load.
 *
 * Trois choix, tous mesurés plutôt que supposés :
 *
 * - Pas createImageBitmap : plus élégant, mais sa prise en charge reste
 *   inégale selon les navigateurs et les formats.
 * - load plutôt que decode() : decode() garantit qu'aucun décodage ne
 *   surviendra à l'affichage, ce qui n'a aucun intérêt ici puisqu'on dessine
 *   dans un canvas. En revanche il reste bloqué dans certains contextes —
 *   une iframe, notamment — là où load répond en quelques millisecondes.
 * - Un délai maximum : sans lui, un décodage qui ne répond jamais laisse
 *   l'outil figé sur « Traitement… » indéfiniment, sans message ni recours.
 */
async function decodeImage(file: File): Promise<Decoded> {
  const url = URL.createObjectURL(file);
  const image = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("decode-timeout")), DECODE_TIMEOUT_MS);
      image.onload = () => {
        clearTimeout(timer);
        resolve();
      };
      image.onerror = () => {
        clearTimeout(timer);
        reject(new Error("decode-failed"));
      };
      image.src = url;
    });
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }

  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    release: () => URL.revokeObjectURL(url),
  };
}

function encode(canvas: HTMLCanvasElement, format: ImageFormat, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("encode-failed"))),
      format,
      format === "image/png" ? undefined : quality,
    );
  });
}

/**
 * Recherche par dichotomie de la plus haute qualité tenant sous la cible.
 *
 * Il n'existe aucune formule reliant qualité et poids : elle dépend
 * entièrement du contenu de l'image. Douze essais suffisent à cerner
 * l'optimum à moins d'un pour cent.
 */
async function searchQuality(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  targetBytes: number,
): Promise<{ blob: Blob; quality: number }> {
  let low = 0.05;
  let high = 0.98;
  let best: { blob: Blob; quality: number } | null = null;

  for (let i = 0; i < 12; i++) {
    const quality = (low + high) / 2;
    const blob = await encode(canvas, format, quality);
    if (blob.size <= targetBytes) {
      best = { blob, quality };
      low = quality;
    } else {
      high = quality;
    }
    if (high - low < 0.01) break;
  }

  // Cible inatteignable : on rend la version la plus légère possible plutôt
  // qu'une erreur, et l'interface affiche le poids obtenu.
  if (!best) {
    const blob = await encode(canvas, format, 0.05);
    return { blob, quality: 0.05 };
  }
  return best;
}

export async function processImage(file: File, job: ImageJob): Promise<ImageResult> {
  const decoded = await decodeImage(file);
  const { width, height } = fitWithin(decoded.width, decoded.height, job.maxWidth, job.maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas-unavailable");

  /*
   * Le JPEG n'a pas de canal alpha : sans fond explicite, les zones
   * transparentes deviennent noires. On peint donc le fond AVANT l'image.
   */
  if (job.format === "image/jpeg") {
    context.fillStyle = job.background ?? "#ffffff";
    context.fillRect(0, 0, width, height);
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(decoded.source, 0, 0, width, height);
  decoded.release();

  if (job.targetBytes) {
    const { blob, quality } = await searchQuality(canvas, job.format, job.targetBytes);
    return { blob, width, height, bytes: blob.size, quality };
  }

  const blob = await encode(canvas, job.format, job.quality ?? 0.82);
  return { blob, width, height, bytes: blob.size, quality: job.quality };
}

export async function readDimensions(file: File): Promise<{ width: number; height: number }> {
  const decoded = await decodeImage(file);
  const size = { width: decoded.width, height: decoded.height };
  decoded.release();
  return size;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
