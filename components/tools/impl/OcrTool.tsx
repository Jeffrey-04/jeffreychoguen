"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { CopyButton, Field, ToolStatus, fieldClass } from "@/components/tools/ToolKit";
import { toolsUi } from "@/content/tools/ui";
import { recogniseImages, type OcrLanguage } from "@/lib/tools/ocr-engine";
import { pdfToImages } from "@/lib/tools/pdf-engine";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "ocr";

const copy = {
  hint: { en: "An image or a scanned PDF.", fr: "Une image ou un PDF scanné." },
  language: { en: "Language of the text", fr: "Langue du texte" },
  languageHint: {
    en: "Picking the right language changes accuracy more than any other setting.",
    fr: "Choisir la bonne langue améliore la précision plus que tout autre réglage.",
  },
  firstRun: {
    en: "First run downloads the engine and language model — about 14 MB, once. It is then kept in your browser cache.",
    fr: "La première utilisation télécharge le moteur et le modèle de langue — environ 14 Mo, une seule fois. Ils restent ensuite dans le cache du navigateur.",
  },
  read: { en: "Read the text", fr: "Lire le texte" },
  working: { en: "Reading…", fr: "Lecture…" },
  result: { en: "Extracted text", fr: "Texte extrait" },
  confidence: { en: "Average confidence: {n}%", fr: "Confiance moyenne : {n} %" },
  lowConfidence: {
    en: "Confidence is low — check the result against the original before using it.",
    fr: "La confiance est faible — relisez le résultat avant de l'utiliser.",
  },
  empty: { en: "No text was found in this file.", fr: "Aucun texte n'a été trouvé dans ce fichier." },
  failed: { en: "This file could not be read.", fr: "Ce fichier n'a pas pu être lu." },
  rendering: { en: "Rendering page {n} of {total}…", fr: "Rendu de la page {n} sur {total}…" },
} as const;

const STAGES: Record<string, { en: string; fr: string }> = {
  "loading tesseract core": { en: "Loading engine…", fr: "Chargement du moteur…" },
  "loading language traineddata": { en: "Loading language…", fr: "Chargement de la langue…" },
  initializing: { en: "Starting…", fr: "Démarrage…" },
  "recognizing text": { en: "Recognising text…", fr: "Reconnaissance du texte…" },
  page: { en: "Reading pages…", fr: "Lecture des pages…" },
};

export function OcrTool({ locale }: { locale: Locale }) {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<OcrLanguage>(locale === "fr" ? "fra" : "eng");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setText("");
    setConfidence(null);

    try {
      let images: Blob[];
      if (file.type === "application/pdf") {
        // Un PDF scanné n'a pas de couche texte : il faut d'abord le rendre en
        // image, puis reconnaître. 2x suffit pour du texte imprimé net.
        images = await pdfToImages(
          file,
          { scale: 2, format: "image/png", quality: 1 },
          (n, total) =>
            setStage(t(copy.rendering, locale).replace("{n}", String(n)).replace("{total}", String(total))),
        );
      } else {
        images = [file];
      }

      const result = await recogniseImages(images, language, (progress) => {
        const label = STAGES[progress.stage];
        if (label) setStage(t(label, locale));
      });

      setText(result.text);
      setConfidence(result.confidence);
      if (!result.text.trim()) setError(t(copy.empty, locale));
      trackTool("tool_complete", { slug: SLUG, category: "text" });
    } catch {
      setError(t(copy.failed, locale));
      trackTool("tool_error", { slug: SLUG, category: "text", code: "ocr" });
    }

    setBusy(false);
    setStage("");
  }

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <ToolDropzone
          accept={["image/jpeg", "image/png", "image/webp", "application/pdf"]}
          multiple={false}
          onFiles={(added) => {
            setFile(added[0]);
            trackTool("tool_start", { slug: SLUG, category: "text" });
          }}
          locale={locale}
          hint={t(copy.hint, locale)}
        />
      ) : (
        <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-4">
          <p className="text-[15px] leading-6 text-gray-900">{file.name}</p>
        </div>
      )}

      <Field id="ocr-lang" label={t(copy.language, locale)} hint={t(copy.languageHint, locale)}>
        <select
          id="ocr-lang"
          value={language}
          onChange={(event) => setLanguage(event.target.value as OcrLanguage)}
          className={fieldClass}
        >
          <option value="eng">English</option>
          <option value="fra">Français</option>
        </select>
      </Field>

      <p className="t-body-sm max-w-[620px]">{t(copy.firstRun, locale)}</p>

      {text ? (
        <Field id="ocr-result" label={t(copy.result, locale)}>
          <textarea
            id="ocr-result"
            rows={12}
            readOnly
            value={text}
            className={`${fieldClass} resize-y font-mono text-[14px] leading-6`}
          />
        </Field>
      ) : null}

      {confidence !== null ? (
        <ToolStatus tone={confidence < 60 ? "error" : "ok"}>
          {t(copy.confidence, locale).replace("{n}", String(confidence))}
          {confidence < 60 ? ` — ${t(copy.lowConfidence, locale)}` : ""}
        </ToolStatus>
      ) : null}
      {error ? <ToolStatus tone="error">{error}</ToolStatus> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={run} disabled={!file || busy}>
          {t(busy ? copy.working : copy.read, locale)}
        </Button>
        {text ? <CopyButton value={text} locale={locale} slug={SLUG} category="text" /> : null}
        {file ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => { setFile(null); setText(""); setConfidence(null); setError(null); }}
            disabled={busy}
          >
            {t(toolsUi.reset, locale)}
          </Button>
        ) : null}
        {stage ? <ToolStatus tone="muted">{stage}</ToolStatus> : null}
      </div>
    </div>
  );
}
