"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Field, fieldClass } from "@/components/tools/ToolKit";
import { toolsUi } from "@/content/tools/ui";
import {
  FORMAT_EXTENSION,
  canEncode,
  formatBytes,
  processImage,
  readDimensions,
  type ImageFormat,
} from "@/lib/tools/image-engine";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

export type ImageToolConfig = {
  slug: string;
  accept: string[];
  /** Formats de sortie proposés. Un seul élément masque le sélecteur. */
  outputs: ImageFormat[];
  showQuality?: boolean;
  showResize?: boolean;
  showTargetSize?: boolean;
  /** Choix du fond : utile seulement quand la sortie est un JPEG, sans alpha. */
  showBackground?: boolean;
  /** Le format de sortie suit celui de l'entrée (compresseur, redimensionneur). */
  keepFormat?: boolean;
};

type Entry = {
  id: string;
  file: File;
  before: number;
  after?: number;
  width?: number;
  height?: number;
  url?: string;
  name?: string;
  error?: boolean;
};

const copy = {
  format: { en: "Output format", fr: "Format de sortie" },
  quality: { en: "Quality", fr: "Qualité" },
  width: { en: "Max width (px)", fr: "Largeur max (px)" },
  height: { en: "Max height (px)", fr: "Hauteur max (px)" },
  targetSize: { en: "Target size (KB)", fr: "Poids cible (Ko)" },
  targetHint: {
    en: "Leave empty to use the quality slider instead.",
    fr: "Laissez vide pour utiliser plutôt le curseur de qualité.",
  },
  background: { en: "Background behind transparency", fr: "Fond sous la transparence" },
  process: { en: "Process", fr: "Traiter" },
  processing: { en: "Processing…", fr: "Traitement…" },
  download: { en: "Download", fr: "Télécharger" },
  saved: { en: "saved", fr: "économisés" },
  larger: { en: "larger", fr: "plus lourd" },
  failed: { en: "Could not process this file.", fr: "Ce fichier n'a pas pu être traité." },
  done: { en: "{n} file(s) ready.", fr: "{n} fichier(s) prêt(s)." },
  emptyHint: {
    en: "JPG, PNG and WebP. Everything runs on your device.",
    fr: "JPG, PNG et WebP. Tout se passe sur votre appareil.",
  },
} as const;

const FORMAT_LABEL: Record<ImageFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

export function ImageTool({ config, locale }: { config: ImageToolConfig; locale: Locale }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [format, setFormat] = useState<ImageFormat>(config.outputs[0]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [targetKb, setTargetKb] = useState("");
  const [background, setBackground] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const [supported, setSupported] = useState<ImageFormat[]>(config.outputs);

  // Les URL d'objets doivent être révoquées, sinon les blobs restent en
  // mémoire tant que l'onglet vit.
  const urls = useRef<string[]>([]);
  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);

  // On ne propose que les formats que CE navigateur sait encoder.
  useEffect(() => {
    let cancelled = false;
    Promise.all(config.outputs.map(async (f) => ((await canEncode(f)) ? f : null))).then((list) => {
      if (cancelled) return;
      const ok = list.filter((f): f is ImageFormat => Boolean(f));
      if (ok.length) {
        setSupported(ok);
        setFormat((current) => (ok.includes(current) ? current : ok[0]));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [config.outputs]);

  async function addFiles(files: File[]) {
    const next: Entry[] = [];
    for (const file of files) {
      next.push({ id: `${file.name}-${file.size}-${next.length}`, file, before: file.size });
    }
    setEntries((current) => [...current, ...next]);
    trackTool("tool_start", { slug: config.slug, category: "images" });
  }

  async function run() {
    setBusy(true);
    const started = performance.now();
    const target = Number(targetKb) > 0 ? Number(targetKb) * 1024 : undefined;

    const results: Entry[] = [];
    for (const entry of entries) {
      try {
        const outFormat = config.keepFormat
          ? ((["image/jpeg", "image/png", "image/webp"].includes(entry.file.type)
              ? entry.file.type
              : "image/jpeg") as ImageFormat)
          : format;

        const result = await processImage(entry.file, {
          format: outFormat,
          quality: quality / 100,
          maxWidth: Number(maxWidth) || undefined,
          maxHeight: Number(maxHeight) || undefined,
          targetBytes: target,
          background,
        });

        const url = URL.createObjectURL(result.blob);
        urls.current.push(url);
        const base = entry.file.name.replace(/\.[^.]+$/, "");
        results.push({
          ...entry,
          after: result.bytes,
          width: result.width,
          height: result.height,
          url,
          name: `${base}.${FORMAT_EXTENSION[outFormat]}`,
        });
      } catch {
        results.push({ ...entry, error: true });
        trackTool("tool_error", { slug: config.slug, category: "images", code: "process" });
      }
      // Rend la main au navigateur entre deux fichiers : sans cette pause,
      // un lot de 20 images fige l'interface.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    setEntries(results);
    setBusy(false);
    trackTool("tool_complete", {
      slug: config.slug,
      category: "images",
      durationMs: Math.round(performance.now() - started),
    });
  }

  function reset() {
    urls.current.forEach(URL.revokeObjectURL);
    urls.current = [];
    setEntries([]);
  }

  const ready = entries.filter((e) => e.url).length;
  const showFormat = !config.keepFormat && supported.length > 1;
  // Déduire ce choix du format menait à l'afficher à tort sur les outils qui
  // conservent le format d'entrée. Il est donc déclaré par l'outil.
  const showBackground = config.showBackground && (config.keepFormat || format === "image/jpeg");

  return (
    <div className="flex flex-col gap-8">
      {entries.length === 0 ? (
        <ToolDropzone
          accept={config.accept}
          onFiles={addFiles}
          locale={locale}
          hint={t(copy.emptyHint, locale)}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => {
            const delta = entry.after ? Math.round((1 - entry.after / entry.before) * 100) : 0;
            return (
              <li
                key={entry.id}
                className="flex flex-wrap items-center gap-4 rounded-[12px] border border-gray-200 bg-gray-50 p-4"
              >
                <span className="min-w-0 flex-1 truncate text-[15px] leading-6 text-gray-900">
                  {entry.name ?? entry.file.name}
                </span>
                {entry.error ? (
                  <span className="t-body-sm">{t(copy.failed, locale)}</span>
                ) : entry.after ? (
                  <>
                    <span className="t-meta whitespace-nowrap">
                      {formatBytes(entry.before)} → {formatBytes(entry.after)}
                      {entry.width ? ` · ${entry.width}×${entry.height}` : ""}
                    </span>
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-[13px] leading-5 ${
                        delta > 0 ? "bg-accent-200 text-gray-900" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {delta > 0
                        ? `${delta}% ${t(copy.saved, locale)}`
                        : `${Math.abs(delta)}% ${t(copy.larger, locale)}`}
                    </span>
                    <a
                      href={entry.url}
                      download={entry.name}
                      onClick={() =>
                        trackTool("download_result", { slug: config.slug, category: "images" })
                      }
                      className="rounded-[8px] border border-gray-300 bg-white px-4 py-2 text-[14px] leading-5 text-gray-900"
                    >
                      {t(copy.download, locale)}
                    </a>
                  </>
                ) : (
                  <span className="t-meta">{formatBytes(entry.before)}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Options */}
      <div className="grid gap-5 sm:grid-cols-2">
        {showFormat ? (
          <Field id="img-format" label={t(copy.format, locale)}>
            <select
              id="img-format"
              value={format}
              onChange={(event) => setFormat(event.target.value as ImageFormat)}
              className={fieldClass}
            >
              {supported.map((value) => (
                <option key={value} value={value}>
                  {FORMAT_LABEL[value]}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        {config.showQuality ? (
          <Field id="img-quality" label={`${t(copy.quality, locale)} : ${quality}%`}>
            <input
              id="img-quality"
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
              className="w-full accent-gray-900"
              disabled={Number(targetKb) > 0}
            />
          </Field>
        ) : null}

        {config.showTargetSize ? (
          <Field id="img-target" label={t(copy.targetSize, locale)} hint={t(copy.targetHint, locale)}>
            <input
              id="img-target"
              type="number"
              min={5}
              value={targetKb}
              onChange={(event) => setTargetKb(event.target.value)}
              placeholder="—"
              className={fieldClass}
            />
          </Field>
        ) : null}

        {config.showResize ? (
          <>
            <Field id="img-w" label={t(copy.width, locale)}>
              <input
                id="img-w"
                type="number"
                min={1}
                value={maxWidth}
                onChange={(event) => setMaxWidth(event.target.value)}
                placeholder="—"
                className={fieldClass}
              />
            </Field>
            <Field id="img-h" label={t(copy.height, locale)}>
              <input
                id="img-h"
                type="number"
                min={1}
                value={maxHeight}
                onChange={(event) => setMaxHeight(event.target.value)}
                placeholder="—"
                className={fieldClass}
              />
            </Field>
          </>
        ) : null}

        {showBackground ? (
          <Field id="img-bg" label={t(copy.background, locale)}>
            <input
              id="img-bg"
              type="color"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              className="h-11 w-20 rounded-[12px] border border-gray-200 bg-gray-50 p-1"
            />
          </Field>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={run} disabled={entries.length === 0 || busy}>
          {t(busy ? copy.processing : copy.process, locale)}
        </Button>
        {entries.length > 0 ? (
          <Button type="button" variant="secondary" onClick={reset} disabled={busy}>
            {t(toolsUi.reset, locale)}
          </Button>
        ) : null}
        <p role="status" aria-live="polite" className="t-meta">
          {ready > 0 ? t(copy.done, locale).replace("{n}", String(ready)) : ""}
        </p>
      </div>
    </div>
  );
}
