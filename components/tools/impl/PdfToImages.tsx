"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Field, ToolStatus, fieldClass } from "@/components/tools/ToolKit";
import { DownloadList, pdfCopy, useOutputs } from "@/components/tools/impl/PdfCommon";
import { toolsUi } from "@/content/tools/ui";
import { pdfToImages } from "@/lib/tools/pdf-engine";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "pdf-to-jpg";

const copy = {
  hint: { en: "One PDF. Every page becomes an image.", fr: "Un PDF. Chaque page devient une image." },
  format: { en: "Image format", fr: "Format d'image" },
  resolution: { en: "Resolution", fr: "Résolution" },
  screen: { en: "Screen (~144 dpi)", fr: "Écran (~144 ppp)" },
  high: { en: "High (~216 dpi)", fr: "Élevée (~216 ppp)" },
  print: { en: "Print (~288 dpi)", fr: "Impression (~288 ppp)" },
  progress: { en: "Page {n} of {total}…", fr: "Page {n} sur {total}…" },
  heavy: {
    en: "Higher resolutions produce much larger files and take longer.",
    fr: "Une résolution élevée produit des fichiers bien plus lourds et prend plus de temps.",
  },
} as const;

export function PdfToImages({ locale }: { locale: Locale }) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [scale, setScale] = useState(2);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ n: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { outputs, publish, clear } = useOutputs();

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(null);
    try {
      const base = file.name.replace(/\.pdf$/i, "");
      const extension = format === "image/png" ? "png" : "jpg";
      const blobs = await pdfToImages(
        file,
        { scale, format, quality: 0.85 },
        (done, total) => setProgress({ n: done, total }),
      );
      publish(blobs.map((blob, index) => ({ name: `${base}-${index + 1}.${extension}`, blob })));
      trackTool("tool_complete", { slug: SLUG, category: "pdf" });
    } catch {
      setError(t(pdfCopy.encrypted, locale));
      trackTool("tool_error", { slug: SLUG, category: "pdf", code: "render" });
    }
    setBusy(false);
    setProgress(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <ToolDropzone
          accept={["application/pdf"]}
          multiple={false}
          onFiles={(added) => {
            setFile(added[0]);
            trackTool("tool_start", { slug: SLUG, category: "pdf" });
          }}
          locale={locale}
          hint={t(copy.hint, locale)}
        />
      ) : (
        <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-4">
          <p className="text-[15px] leading-6 text-gray-900">{file.name}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="pi-format" label={t(copy.format, locale)}>
          <select
            id="pi-format"
            value={format}
            onChange={(event) => setFormat(event.target.value as "image/jpeg" | "image/png")}
            className={fieldClass}
          >
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
          </select>
        </Field>
        <Field id="pi-scale" label={t(copy.resolution, locale)} hint={t(copy.heavy, locale)}>
          <select
            id="pi-scale"
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
            className={fieldClass}
          >
            <option value={2}>{t(copy.screen, locale)}</option>
            <option value={3}>{t(copy.high, locale)}</option>
            <option value={4}>{t(copy.print, locale)}</option>
          </select>
        </Field>
      </div>

      <DownloadList outputs={outputs} locale={locale} slug={SLUG} />
      {error ? <ToolStatus tone="error">{error}</ToolStatus> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={run} disabled={!file || busy}>
          {t(busy ? pdfCopy.processing : pdfCopy.process, locale)}
        </Button>
        {file ? (
          <Button type="button" variant="secondary" onClick={() => { setFile(null); clear(); setError(null); }} disabled={busy}>
            {t(toolsUi.reset, locale)}
          </Button>
        ) : null}
        {progress ? (
          <ToolStatus tone="muted">
            {t(copy.progress, locale)
              .replace("{n}", String(progress.n))
              .replace("{total}", String(progress.total))}
          </ToolStatus>
        ) : null}
      </div>
    </div>
  );
}
