"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { ToolStatus } from "@/components/tools/ToolKit";
import { DownloadList, FileQueue, pdfCopy, useOutputs } from "@/components/tools/impl/PdfCommon";
import { toolsUi } from "@/content/tools/ui";
import { mergePdfs } from "@/lib/tools/pdf-engine";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "merge-pdf";

const copy = {
  hint: {
    en: "Add two or more PDFs. Drag the arrows to set the order.",
    fr: "Ajoutez au moins deux PDF. Les flèches définissent l'ordre.",
  },
  needTwo: { en: "Add at least two PDFs.", fr: "Ajoutez au moins deux PDF." },
} as const;

export function MergePdf({ locale }: { locale: Locale }) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { outputs, publish, clear } = useOutputs();

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const blob = await mergePdfs(files);
      publish([{ name: "merged.pdf", blob }]);
      trackTool("tool_complete", { slug: SLUG, category: "pdf" });
    } catch {
      setError(t(pdfCopy.encrypted, locale));
      trackTool("tool_error", { slug: SLUG, category: "pdf", code: "merge" });
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {files.length === 0 ? (
        <ToolDropzone
          accept={["application/pdf"]}
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
            accept={["application/pdf"]}
            onFiles={(added) => setFiles([...files, ...added])}
            locale={locale}
          />
        </>
      )}

      <DownloadList outputs={outputs} locale={locale} slug={SLUG} />
      {error ? <ToolStatus tone="error">{error}</ToolStatus> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={run} disabled={files.length < 2 || busy}>
          {t(busy ? pdfCopy.processing : pdfCopy.process, locale)}
        </Button>
        {files.length > 0 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFiles([]);
              clear();
              setError(null);
            }}
            disabled={busy}
          >
            {t(toolsUi.reset, locale)}
          </Button>
        ) : null}
        {files.length === 1 ? <ToolStatus tone="muted">{t(copy.needTwo, locale)}</ToolStatus> : null}
      </div>
    </div>
  );
}
