"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { ToolStatus } from "@/components/tools/ToolKit";
import { DownloadList, pdfCopy, useOutputs } from "@/components/tools/impl/PdfCommon";
import { toolsUi } from "@/content/tools/ui";
import { buildDocx, extractPdfText } from "@/lib/tools/docx-engine";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "pdf-to-word";

const copy = {
  hint: { en: "One PDF at a time.", fr: "Un seul PDF à la fois." },
  scope: {
    en: "This returns the text, split into paragraphs, in an editable .docx. Columns, tables and images are not reconstructed — no browser tool does that honestly.",
    fr: "Vous obtenez le texte, découpé en paragraphes, dans un .docx éditable. Colonnes, tableaux et images ne sont pas reconstruits — aucun outil navigateur ne le fait honnêtement.",
  },
  progress: { en: "Page {n} of {total}…", fr: "Page {n} sur {total}…" },
  noText: {
    en: "No text layer was found. This PDF is probably a scan — run it through the OCR tool instead.",
    fr: "Aucune couche de texte trouvée. Ce PDF est probablement un scan — passez-le plutôt par l'outil OCR.",
  },
  done: { en: "{n} paragraphs across {p} pages.", fr: "{n} paragraphes sur {p} pages." },
} as const;

export function PdfToWord({ locale }: { locale: Locale }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ n: number; total: number } | null>(null);
  const [report, setReport] = useState<{ paragraphs: number; pages: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { outputs, publish, clear } = useOutputs();

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setReport(null);
    try {
      const base = file.name.replace(/\.pdf$/i, "");
      const pages = await extractPdfText(file, (n, total) => setProgress({ n, total }));
      const count = pages.reduce((sum, page) => sum + page.paragraphs.length, 0);

      if (count === 0) {
        setError(t(copy.noText, locale));
      } else {
        const blob = await buildDocx(pages, base);
        publish([{ name: `${base}.docx`, blob }]);
        setReport({ paragraphs: count, pages: pages.length });
        trackTool("tool_complete", { slug: SLUG, category: "pdf" });
      }
    } catch {
      setError(t(pdfCopy.encrypted, locale));
      trackTool("tool_error", { slug: SLUG, category: "pdf", code: "extract" });
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

      <p className="t-body-sm max-w-[620px]">{t(copy.scope, locale)}</p>

      <DownloadList outputs={outputs} locale={locale} slug={SLUG} />

      {report ? (
        <ToolStatus tone="ok">
          {t(copy.done, locale)
            .replace("{n}", String(report.paragraphs))
            .replace("{p}", String(report.pages))}
        </ToolStatus>
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
