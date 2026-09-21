"use client";

import { useEffect, useRef, useState } from "react";
import { trackTool } from "@/lib/tools/analytics";
import { formatBytes } from "@/lib/tools/image-engine";
import { type Locale, t } from "@/lib/i18n";

export const pdfCopy = {
  process: { en: "Process", fr: "Traiter" },
  processing: { en: "Working…", fr: "Traitement…" },
  download: { en: "Download", fr: "Télécharger" },
  downloadAll: { en: "Download all", fr: "Tout télécharger" },
  failed: { en: "Could not process this file.", fr: "Ce fichier n'a pas pu être traité." },
  encrypted: {
    en: "This PDF is password-protected and cannot be opened.",
    fr: "Ce PDF est protégé par mot de passe et ne peut pas être ouvert.",
  },
  moveUp: { en: "Move up", fr: "Monter" },
  moveDown: { en: "Move down", fr: "Descendre" },
  remove: { en: "Remove", fr: "Retirer" },
  pages: { en: "pages", fr: "pages" },
} as const;

export type Output = { name: string; blob: Blob; url: string };

/**
 * Gère les URL d'objets des résultats.
 *
 * Chaque URL retient son blob en mémoire jusqu'à révocation explicite : sur un
 * PDF de 200 pages rasterisées, l'oublier fait enfler l'onglet de plusieurs
 * centaines de mégaoctets.
 */
export function useOutputs() {
  const [outputs, setOutputs] = useState<Output[]>([]);
  const urls = useRef<string[]>([]);

  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);

  function publish(items: { name: string; blob: Blob }[]) {
    urls.current.forEach(URL.revokeObjectURL);
    urls.current = [];
    const next = items.map((item) => {
      const url = URL.createObjectURL(item.blob);
      urls.current.push(url);
      return { ...item, url };
    });
    setOutputs(next);
  }

  function clear() {
    urls.current.forEach(URL.revokeObjectURL);
    urls.current = [];
    setOutputs([]);
  }

  return { outputs, publish, clear };
}

export function DownloadList({
  outputs,
  locale,
  slug,
}: {
  outputs: Output[];
  locale: Locale;
  slug: string;
}) {
  if (outputs.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {outputs.map((output) => (
        <li
          key={output.url}
          className="flex flex-wrap items-center gap-4 rounded-[12px] border border-gray-200 bg-gray-50 p-4"
        >
          <span className="min-w-0 flex-1 truncate text-[15px] leading-6 text-gray-900">
            {output.name}
          </span>
          <span className="t-meta whitespace-nowrap">{formatBytes(output.blob.size)}</span>
          <a
            href={output.url}
            download={output.name}
            onClick={() => trackTool("download_result", { slug, category: "pdf" })}
            className="rounded-[8px] border border-gray-300 bg-white px-4 py-2 text-[14px] leading-5 text-gray-900"
          >
            {t(pdfCopy.download, locale)}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Liste de fichiers réordonnable — l'ordre décide du résultat d'une fusion. */
export function FileQueue({
  files,
  onChange,
  locale,
  meta,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  locale: Locale;
  meta?: (file: File, index: number) => string;
}) {
  function move(index: number, delta: number) {
    const next = [...files];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <ol className="flex flex-col gap-2">
      {files.map((file, index) => (
        <li
          key={`${file.name}-${index}`}
          className="flex flex-wrap items-center gap-3 rounded-[12px] border border-gray-200 bg-gray-50 p-3"
        >
          <span className="t-meta w-6 shrink-0">{index + 1}</span>
          <span className="min-w-0 flex-1 truncate text-[15px] leading-6 text-gray-900">
            {file.name}
          </span>
          <span className="t-meta whitespace-nowrap">
            {meta ? meta(file, index) : formatBytes(file.size)}
          </span>
          <span className="flex gap-1">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label={t(pdfCopy.moveUp, locale)}
              className="h-9 w-9 rounded-[8px] border border-gray-200 bg-white text-gray-700 disabled:opacity-40"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === files.length - 1}
              aria-label={t(pdfCopy.moveDown, locale)}
              className="h-9 w-9 rounded-[8px] border border-gray-200 bg-white text-gray-700 disabled:opacity-40"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => onChange(files.filter((_, i) => i !== index))}
              aria-label={t(pdfCopy.remove, locale)}
              className="h-9 w-9 rounded-[8px] border border-gray-200 bg-white text-gray-700"
            >
              ×
            </button>
          </span>
        </li>
      ))}
    </ol>
  );
}
