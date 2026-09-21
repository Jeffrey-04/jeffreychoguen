"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Field, ToolStatus, fieldClass } from "@/components/tools/ToolKit";
import { DownloadList, pdfCopy, useOutputs } from "@/components/tools/impl/PdfCommon";
import { toolsUi } from "@/content/tools/ui";
import { formatBytes } from "@/lib/tools/image-engine";
import { compressPdf } from "@/lib/tools/pdf-engine";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "compress-pdf";

const copy = {
  hint: { en: "One PDF at a time.", fr: "Un seul PDF à la fois." },
  quality: { en: "Image quality", fr: "Qualité des images" },
  maxWidth: { en: "Limit image width (px)", fr: "Limiter la largeur des images (px)" },
  maxWidthHint: {
    en: "Leave empty to keep the original dimensions.",
    fr: "Laissez vide pour conserver les dimensions d'origine.",
  },
  how: {
    en: "Only the images inside the PDF are re-encoded. Text, vectors and layout stay untouched — nothing is flattened into a picture.",
    fr: "Seules les images contenues dans le PDF sont ré-encodées. Le texte, les vecteurs et la mise en page restent intacts — rien n'est aplati en image.",
  },
  progress: { en: "Image {n} of {total}…", fr: "Image {n} sur {total}…" },
  noImages: {
    en: "This PDF contains no re-encodable image, so there is nothing to compress. Text-only documents are already about as small as they get.",
    fr: "Ce PDF ne contient aucune image ré-encodable : il n'y a rien à compresser. Un document purement textuel est déjà proche de son poids minimal.",
  },
  noGain: {
    en: "Its images are already well optimised — compressing further would have made them larger.",
    fr: "Ses images sont déjà bien optimisées — les compresser davantage les aurait alourdies.",
  },
  done: { en: "{n} of {total} images re-encoded.", fr: "{n} images sur {total} ré-encodées." },
} as const;

export function CompressPdf({ locale }: { locale: Locale }) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(65);
  const [maxWidth, setMaxWidth] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ n: number; total: number } | null>(null);
  const [report, setReport] = useState<{ touched: number; found: number; before: number; after: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { outputs, publish, clear } = useOutputs();

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setReport(null);
    try {
      const result = await compressPdf(
        file,
        { quality: quality / 100, maxImageWidth: Number(maxWidth) || undefined },
        (n, total) => setProgress({ n, total }),
      );
      const base = file.name.replace(/\.pdf$/i, "");
      publish([{ name: `${base}-compressed.pdf`, blob: result.blob }]);
      setReport({
        touched: result.imagesTouched,
        found: result.imagesFound,
        before: file.size,
        after: result.blob.size,
      });
      trackTool("tool_complete", { slug: SLUG, category: "pdf" });
    } catch {
      setError(t(pdfCopy.encrypted, locale));
      trackTool("tool_error", { slug: SLUG, category: "pdf", code: "compress" });
    }
    setBusy(false);
    setProgress(null);
  }

  const saved = report && report.before > 0 ? Math.round((1 - report.after / report.before) * 100) : 0;

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
          <p className="t-meta mt-1">{formatBytes(file.size)}</p>
        </div>
      )}

      <p className="t-body-sm max-w-[620px]">{t(copy.how, locale)}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cp-quality" label={`${t(copy.quality, locale)} : ${quality}%`}>
          <input
            id="cp-quality"
            type="range"
            min={20}
            max={95}
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
            className="w-full accent-gray-900"
          />
        </Field>
        <Field id="cp-width" label={t(copy.maxWidth, locale)} hint={t(copy.maxWidthHint, locale)}>
          <input
            id="cp-width"
            type="number"
            min={100}
            value={maxWidth}
            onChange={(event) => setMaxWidth(event.target.value)}
            placeholder="—"
            className={fieldClass}
          />
        </Field>
      </div>

      <DownloadList outputs={outputs} locale={locale} slug={SLUG} />

      {report ? (
        <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-4">
          {report.found === 0 ? (
            <ToolStatus tone="muted">{t(copy.noImages, locale)}</ToolStatus>
          ) : report.touched === 0 ? (
            <ToolStatus tone="muted">{t(copy.noGain, locale)}</ToolStatus>
          ) : (
            <ToolStatus tone="ok">
              {formatBytes(report.before)} → {formatBytes(report.after)}
              {saved > 0 ? ` · ${saved}% ` : " · "}
              {t(copy.done, locale)
                .replace("{n}", String(report.touched))
                .replace("{total}", String(report.found))}
            </ToolStatus>
          )}
        </div>
      ) : null}

      {error ? <ToolStatus tone="error">{error}</ToolStatus> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={run} disabled={!file || busy}>
          {t(busy ? pdfCopy.processing : pdfCopy.process, locale)}
        </Button>
        {file ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => { setFile(null); clear(); setReport(null); setError(null); }}
            disabled={busy}
          >
            {t(toolsUi.reset, locale)}
          </Button>
        ) : null}
        {progress ? (
          <ToolStatus tone="muted">
            {t(copy.progress, locale).replace("{n}", String(progress.n)).replace("{total}", String(progress.total))}
          </ToolStatus>
        ) : null}
      </div>
    </div>
  );
}
