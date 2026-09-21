"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Field, ToolStatus, fieldClass } from "@/components/tools/ToolKit";
import { DownloadList, pdfCopy, useOutputs } from "@/components/tools/impl/PdfCommon";
import { toolsUi } from "@/content/tools/ui";
import { countPages, extractPages, parseRanges, splitToPages } from "@/lib/tools/pdf-engine";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "split-pdf";

const copy = {
  hint: { en: "One PDF at a time.", fr: "Un seul PDF à la fois." },
  mode: { en: "What to do", fr: "Que faire" },
  extract: { en: "Extract pages", fr: "Extraire des pages" },
  everyPage: { en: "One file per page", fr: "Un fichier par page" },
  ranges: { en: "Pages to keep", fr: "Pages à conserver" },
  rangesHint: {
    en: "For example: 1-3, 5, 8-10. Page numbers, not indexes.",
    fr: "Par exemple : 1-3, 5, 8-10. Des numéros de page, pas des index.",
  },
  loaded: { en: "{n} pages", fr: "{n} pages" },
  invalid: { en: "No valid page in that range.", fr: "Aucune page valide dans cette plage." },
} as const;

export function SplitPdf({ locale }: { locale: Locale }) {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [mode, setMode] = useState<"extract" | "every">("extract");
  const [ranges, setRanges] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { outputs, publish, clear } = useOutputs();

  async function accept(added: File[]) {
    const first = added[0];
    setFile(first);
    setError(null);
    trackTool("tool_start", { slug: SLUG, category: "pdf" });
    try {
      const count = await countPages(first);
      setPages(count);
      setRanges(`1-${count}`);
    } catch {
      setError(t(pdfCopy.encrypted, locale));
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const base = file.name.replace(/\.pdf$/i, "");
      if (mode === "every") {
        const blobs = await splitToPages(file);
        publish(blobs.map((blob, index) => ({ name: `${base}-${index + 1}.pdf`, blob })));
      } else {
        const parsed = parseRanges(ranges, pages);
        if (parsed.length === 0) throw new Error("no-range");
        const blob = await extractPages(file, parsed);
        publish([{ name: `${base}-extract.pdf`, blob }]);
      }
      trackTool("tool_complete", { slug: SLUG, category: "pdf" });
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message === "no-range"
          ? t(copy.invalid, locale)
          : t(pdfCopy.failed, locale),
      );
      trackTool("tool_error", { slug: SLUG, category: "pdf", code: "split" });
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <ToolDropzone
          accept={["application/pdf"]}
          multiple={false}
          onFiles={accept}
          locale={locale}
          hint={t(copy.hint, locale)}
        />
      ) : (
        <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-4">
          <p className="text-[15px] leading-6 text-gray-900">{file.name}</p>
          {pages > 0 ? (
            <p className="t-meta mt-1">{t(copy.loaded, locale).replace("{n}", String(pages))}</p>
          ) : null}
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label={t(copy.mode, locale)}>
        {(["extract", "every"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            aria-pressed={mode === value}
            className={`rounded-[8px] px-4 py-2 text-[14px] leading-5 transition-colors ${
              mode === value ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600"
            }`}
          >
            {t(value === "extract" ? copy.extract : copy.everyPage, locale)}
          </button>
        ))}
      </div>

      {mode === "extract" ? (
        <Field id="sp-ranges" label={t(copy.ranges, locale)} hint={t(copy.rangesHint, locale)}>
          <input
            id="sp-ranges"
            value={ranges}
            onChange={(event) => setRanges(event.target.value)}
            className={fieldClass}
          />
        </Field>
      ) : null}

      <DownloadList outputs={outputs} locale={locale} slug={SLUG} />
      {error ? <ToolStatus tone="error">{error}</ToolStatus> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={run} disabled={!file || busy}>
          {t(busy ? pdfCopy.processing : pdfCopy.process, locale)}
        </Button>
        {file ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFile(null);
              setPages(0);
              clear();
              setError(null);
            }}
            disabled={busy}
          >
            {t(toolsUi.reset, locale)}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
