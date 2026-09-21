"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Field, ToolStatus, fieldClass } from "@/components/tools/ToolKit";
import { DownloadList, FileQueue, pdfCopy, useOutputs } from "@/components/tools/impl/PdfCommon";
import { toolsUi } from "@/content/tools/ui";
import { imagesToPdf, type PageSize } from "@/lib/tools/pdf-engine";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "jpg-to-pdf";

const copy = {
  hint: { en: "JPG and PNG. Order sets the page order.", fr: "JPG et PNG. L'ordre définit celui des pages." },
  size: { en: "Page size", fr: "Format de page" },
  fit: { en: "Fit to image", fr: "Ajusté à l'image" },
  margin: { en: "Margin (pt)", fr: "Marge (pt)" },
  marginHint: { en: "72 points = 1 inch.", fr: "72 points = 1 pouce." },
} as const;

export function ImagesToPdf({ locale }: { locale: Locale }) {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState<PageSize>("fit");
  const [margin, setMargin] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { outputs, publish, clear } = useOutputs();

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const blob = await imagesToPdf(files, { size, margin });
      publish([{ name: "images.pdf", blob }]);
      trackTool("tool_complete", { slug: SLUG, category: "pdf" });
    } catch {
      setError(t(pdfCopy.failed, locale));
      trackTool("tool_error", { slug: SLUG, category: "pdf", code: "build" });
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {files.length === 0 ? (
        <ToolDropzone
          accept={["image/jpeg", "image/png"]}
          onFiles={(added) => {
            setFiles(added);
            trackTool("tool_start", { slug: SLUG, category: "pdf" });
          }}
          locale={locale}
          hint={t(copy.hint, locale)}
        />
      ) : (
        <>
          <FileQueue files={files} onChange={setFiles} locale={locale} />
          <ToolDropzone
            accept={["image/jpeg", "image/png"]}
            onFiles={(added) => setFiles([...files, ...added])}
            locale={locale}
          />
        </>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="ip-size" label={t(copy.size, locale)}>
          <select
            id="ip-size"
            value={size}
            onChange={(event) => setSize(event.target.value as PageSize)}
            className={fieldClass}
          >
            <option value="fit">{t(copy.fit, locale)}</option>
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
          </select>
        </Field>
        <Field id="ip-margin" label={t(copy.margin, locale)} hint={t(copy.marginHint, locale)}>
          <input
            id="ip-margin"
            type="number"
            min={0}
            max={144}
            value={margin}
            onChange={(event) => setMargin(Math.max(0, Number(event.target.value) || 0))}
            className={fieldClass}
          />
        </Field>
      </div>

      <DownloadList outputs={outputs} locale={locale} slug={SLUG} />
      {error ? <ToolStatus tone="error">{error}</ToolStatus> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={run} disabled={files.length === 0 || busy}>
          {t(busy ? pdfCopy.processing : pdfCopy.process, locale)}
        </Button>
        {files.length > 0 ? (
          <Button type="button" variant="secondary" onClick={() => { setFiles([]); clear(); setError(null); }} disabled={busy}>
            {t(toolsUi.reset, locale)}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
