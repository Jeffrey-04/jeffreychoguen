"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Field, ToolStatus } from "@/components/tools/ToolKit";
import { toolsUi } from "@/content/tools/ui";
import { formatBytes } from "@/lib/tools/image-engine";
import {
  flattenOnto,
  isLocalProcessing,
  isModelCached,
  MODEL_BYTES,
  removeBackground,
} from "@/lib/tools/background-engine";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "background-remover";

const copy = {
  hint: { en: "A JPG or PNG photo.", fr: "Une photo JPG ou PNG." },
  modelTitle: { en: "One-time download", fr: "Téléchargement unique" },
  modelBody: {
    en: "This tool runs the AI model on your own device, so your photo never leaves it. That model weighs {size} and is downloaded once, then kept by your browser.",
    fr: "Cet outil exécute le modèle sur votre appareil : votre photo n'en sort jamais. Ce modèle pèse {size}, téléchargé une seule fois puis conservé par votre navigateur.",
  },
  modelWarn: {
    en: "On a mobile connection, check your data plan first.",
    fr: "Sur connexion mobile, vérifiez votre forfait avant de lancer.",
  },
  cached: { en: "Model already downloaded — this will start immediately.", fr: "Modèle déjà téléchargé — le traitement démarrera immédiatement." },
  external: {
    en: "Your image is sent to an external service for processing. It leaves your device.",
    fr: "Votre image est envoyée à un service externe pour traitement. Elle quitte votre appareil.",
  },
  start: { en: "Remove the background", fr: "Détourer l'image" },
  startWithDownload: { en: "Download model and remove background", fr: "Télécharger le modèle et détourer" },
  downloading: { en: "Downloading model… {pct}%", fr: "Téléchargement du modèle… {pct} %" },
  computing: { en: "Detecting the subject…", fr: "Détection du sujet…" },
  result: { en: "Result", fr: "Résultat" },
  transparent: { en: "Transparent PNG", fr: "PNG transparent" },
  onColour: { en: "On a colour", fr: "Sur une couleur" },
  colour: { en: "Background colour", fr: "Couleur de fond" },
  download: { en: "Download", fr: "Télécharger" },
  failed: { en: "The background could not be removed from this image.", fr: "L'arrière-plan n'a pas pu être retiré de cette image." },
} as const;

export function BackgroundRemover({ locale }: { locale: Locale }) {
  const [file, setFile] = useState<File | null>(null);
  const [cached, setCached] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ pct: number; label: string } | null>(null);
  const [cutout, setCutout] = useState<Blob | null>(null);
  const [preview, setPreview] = useState("");
  const [mode, setMode] = useState<"transparent" | "colour">("transparent");
  const [colour, setColour] = useState("#ffffff");
  const [error, setError] = useState<string | null>(null);

  const local = isLocalProcessing();

  useEffect(() => {
    if (local) isModelCached().then(setCached);
  }, [local]);

  useEffect(() => {
    if (!cutout) return;
    let url = "";
    let cancelled = false;
    (async () => {
      const blob = mode === "colour" ? await flattenOnto(cutout, colour) : cutout;
      if (cancelled) return;
      url = URL.createObjectURL(blob);
      setPreview(url);
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [cutout, mode, colour]);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setCutout(null);
    try {
      const blob = await removeBackground(file, (p) =>
        setProgress({ pct: Math.round(p.ratio * 100), label: p.label }),
      );
      setCutout(blob);
      setCached(true);
      trackTool("tool_complete", { slug: SLUG, category: "images" });
    } catch {
      setError(t(copy.failed, locale));
      trackTool("tool_error", { slug: SLUG, category: "images", code: "remove" });
    }
    setBusy(false);
    setProgress(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <ToolDropzone
          accept={["image/jpeg", "image/png", "image/webp"]}
          multiple={false}
          onFiles={(added) => {
            setFile(added[0]);
            setCutout(null);
            trackTool("tool_start", { slug: SLUG, category: "images" });
          }}
          locale={locale}
          hint={t(copy.hint, locale)}
        />
      ) : (
        <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-4">
          <p className="text-[15px] leading-6 text-gray-900">{file.name}</p>
        </div>
      )}

      {/* Le coût est annoncé AVANT l'action, jamais découvert pendant. */}
      {local ? (
        <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-4">
          <p className="t-h6 mb-1">{t(copy.modelTitle, locale)}</p>
          <p className="t-body-sm">
            {t(copy.modelBody, locale).replace("{size}", formatBytes(MODEL_BYTES))}
          </p>
          <p className="t-body-sm mt-2">
            {cached ? t(copy.cached, locale) : t(copy.modelWarn, locale)}
          </p>
        </div>
      ) : (
        <ToolStatus tone="error">{t(copy.external, locale)}</ToolStatus>
      )}

      {cutout ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t(copy.result, locale)}>
            {(["transparent", "colour"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={`rounded-[8px] px-4 py-2 text-[14px] leading-5 transition-colors ${
                  mode === value ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600"
                }`}
              >
                {t(value === "transparent" ? copy.transparent : copy.onColour, locale)}
              </button>
            ))}
            {mode === "colour" ? (
              <input
                type="color"
                aria-label={t(copy.colour, locale)}
                value={colour}
                onChange={(event) => setColour(event.target.value)}
                className="h-10 w-16 rounded-[8px] border border-gray-200 bg-white p-1"
              />
            ) : null}
          </div>

          {preview ? (
            <>
              {/* Damier : sans lui, une transparence est indiscernable d'un fond blanc. */}
              <div
                className="flex min-h-[220px] items-center justify-center rounded-[12px] border border-gray-200 p-4"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg,#e0e2e6 25%,transparent 25%),linear-gradient(-45deg,#e0e2e6 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e0e2e6 75%),linear-gradient(-45deg,transparent 75%,#e0e2e6 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt={t(copy.result, locale)} className="max-h-[320px] w-auto" />
              </div>
              <a
                href={preview}
                download={`${(file?.name ?? "image").replace(/\.[^.]+$/, "")}-cutout.png`}
                onClick={() => trackTool("download_result", { slug: SLUG, category: "images" })}
                className="inline-flex w-fit rounded-[8px] border border-gray-300 bg-white px-[22px] py-3 text-[16px] leading-6 text-gray-900"
              >
                {t(copy.download, locale)}
              </a>
            </>
          ) : null}
        </div>
      ) : null}

      {error ? <ToolStatus tone="error">{error}</ToolStatus> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={run} disabled={!file || busy}>
          {t(local && cached === false ? copy.startWithDownload : copy.start, locale)}
        </Button>
        {file ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => { setFile(null); setCutout(null); setPreview(""); setError(null); }}
            disabled={busy}
          >
            {t(toolsUi.reset, locale)}
          </Button>
        ) : null}
        {progress ? (
          <ToolStatus tone="muted">
            {progress.label === "download"
              ? t(copy.downloading, locale).replace("{pct}", String(progress.pct))
              : t(copy.computing, locale)}
          </ToolStatus>
        ) : null}
      </div>
    </div>
  );
}
