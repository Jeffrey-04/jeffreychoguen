/**
 * Détourage d'arrière-plan.
 *
 * Deux voies, dans cet ordre :
 *
 * 1. Un ENDPOINT externe, s'il est configuré. C'était la préférence initiale,
 *    mais un export statique ne peut détenir aucune clé d'API : on ne prend
 *    donc qu'une URL de proxy, jamais un secret. Tant qu'elle n'est pas
 *    fournie, cette voie n'existe pas.
 * 2. Le MODÈLE LOCAL, par défaut. Il fonctionne pour tout visiteur, sans
 *    compte ni infrastructure, et l'image ne quitte jamais l'appareil.
 *
 * Le modèle est miroité sur notre domaine (cf. scripts/fetch-bg-model.mjs) :
 * aucun tiers ne voit qui utilise l'outil.
 */

/** Proxy optionnel : une URL, jamais une clé. */
export const EXTERNAL_ENDPOINT = process.env.NEXT_PUBLIC_BG_REMOVAL_ENDPOINT ?? "";

export const MODEL_BYTES = 53_600_000;

export type BackgroundProgress = { ratio: number; label: string };

/** L'image est-elle traitée sur l'appareil ? Décide du badge affiché. */
export function isLocalProcessing(): boolean {
  return !EXTERNAL_ENDPOINT;
}

/**
 * Le modèle a-t-il déjà été téléchargé ?
 *
 * On interroge le Cache Storage plutôt qu'un drapeau applicatif : c'est là que
 * la librairie dépose réellement ses morceaux, donc la seule source fiable.
 * Un cache vidé par le navigateur est ainsi détecté.
 */
export async function isModelCached(): Promise<boolean> {
  if (typeof caches === "undefined") return false;
  try {
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      if (keys.some((request) => request.url.includes("/vendor/bg/"))) return true;
    }
  } catch {
    // Cache Storage indisponible (navigation privée) : on annonce le
    // téléchargement, quitte à le sur-annoncer.
  }
  return false;
}

async function viaEndpoint(file: File): Promise<Blob> {
  const body = new FormData();
  body.append("image", file);
  const response = await fetch(EXTERNAL_ENDPOINT, { method: "POST", body });
  if (!response.ok) throw new Error(`endpoint-${response.status}`);
  return response.blob();
}

export async function removeBackground(
  file: File,
  onProgress?: (progress: BackgroundProgress) => void,
): Promise<Blob> {
  if (EXTERNAL_ENDPOINT) return viaEndpoint(file);

  const { removeBackground: run } = await import("@imgly/background-removal");

  return run(file, {
    publicPath: new URL("/vendor/bg/", window.location.origin).href,
    model: "isnet_quint8",
    output: { format: "image/png" },
    progress: (key: string, current: number, total: number) => {
      onProgress?.({
        ratio: total > 0 ? current / total : 0,
        label: key.startsWith("fetch") ? "download" : "compute",
      });
    },
  });
}

/**
 * Aplatit un détourage sur une couleur.
 * Le PNG transparent reste la sortie par défaut : c'est celle qu'on ne peut
 * pas reconstituer après coup.
 */
export async function flattenOnto(cutout: Blob, colour: string): Promise<Blob> {
  const url = URL.createObjectURL(cutout);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("decode-failed"));
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas-unavailable");
    context.fillStyle = colour;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("encode-failed"))), "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
