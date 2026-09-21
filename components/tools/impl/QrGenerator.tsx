"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, ToolStatus, fieldClass } from "@/components/tools/ToolKit";
import { buildPayload, type QrFields, type QrType } from "@/lib/tools/qr-payload";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "qr-code-generator";

const copy = {
  type: { en: "What the code contains", fr: "Ce que contient le code" },
  size: { en: "Size (px)", fr: "Taille (px)" },
  margin: { en: "Quiet zone", fr: "Marge blanche" },
  marginHint: {
    en: "The white border scanners need to find the code. Below 2 modules, reading becomes unreliable.",
    fr: "La bordure blanche dont les lecteurs ont besoin pour repérer le code. En dessous de 2 modules, la lecture devient incertaine.",
  },
  level: { en: "Error correction", fr: "Correction d'erreur" },
  levelHint: {
    en: "Higher levels survive scratches and logos, but pack more dots into the same square.",
    fr: "Un niveau élevé résiste aux rayures et aux logos, mais densifie le motif.",
  },
  dark: { en: "Foreground", fr: "Premier plan" },
  light: { en: "Background", fr: "Fond" },
  empty: { en: "Fill in the fields above to generate a code.", fr: "Remplissez les champs ci-dessus pour générer un code." },
  contrast: {
    en: "Not enough contrast between the two colours — many scanners will fail.",
    fr: "Contraste insuffisant entre les deux couleurs — de nombreux lecteurs échoueront.",
  },
  downloadPng: { en: "Download PNG", fr: "Télécharger le PNG" },
  downloadSvg: { en: "Download SVG", fr: "Télécharger le SVG" },
} as const;

const TYPES: { id: QrType; label: { en: string; fr: string } }[] = [
  { id: "url", label: { en: "Link", fr: "Lien" } },
  { id: "text", label: { en: "Text", fr: "Texte" } },
  { id: "wifi", label: { en: "Wi-Fi", fr: "Wi-Fi" } },
  { id: "email", label: { en: "Email", fr: "E-mail" } },
  { id: "phone", label: { en: "Phone", fr: "Téléphone" } },
  { id: "sms", label: { en: "SMS", fr: "SMS" } },
  { id: "whatsapp", label: { en: "WhatsApp", fr: "WhatsApp" } },
  { id: "vcard", label: { en: "Contact card", fr: "Carte de visite" } },
  { id: "location", label: { en: "Location", fr: "Lieu" } },
  { id: "event", label: { en: "Event", fr: "Événement" } },
];

type FieldSpec = { key: string; label: { en: string; fr: string }; type?: string; options?: string[] };

const FIELDS: Record<QrType, FieldSpec[]> = {
  url: [{ key: "url", label: { en: "Address", fr: "Adresse" } }],
  text: [{ key: "text", label: { en: "Text", fr: "Texte" }, type: "textarea" }],
  wifi: [
    { key: "ssid", label: { en: "Network name (SSID)", fr: "Nom du réseau (SSID)" } },
    { key: "password", label: { en: "Password", fr: "Mot de passe" } },
    { key: "security", label: { en: "Security", fr: "Sécurité" }, options: ["WPA", "WEP", "nopass"] },
  ],
  email: [
    { key: "to", label: { en: "To", fr: "Destinataire" } },
    { key: "subject", label: { en: "Subject", fr: "Objet" } },
    { key: "body", label: { en: "Message", fr: "Message" }, type: "textarea" },
  ],
  phone: [{ key: "phone", label: { en: "Phone number", fr: "Numéro" } }],
  sms: [
    { key: "phone", label: { en: "Phone number", fr: "Numéro" } },
    { key: "message", label: { en: "Message", fr: "Message" }, type: "textarea" },
  ],
  whatsapp: [
    { key: "phone", label: { en: "Number with country code", fr: "Numéro avec indicatif" } },
    { key: "message", label: { en: "Pre-filled message", fr: "Message pré-rempli" }, type: "textarea" },
  ],
  vcard: [
    { key: "firstName", label: { en: "First name", fr: "Prénom" } },
    { key: "lastName", label: { en: "Last name", fr: "Nom" } },
    { key: "organisation", label: { en: "Organisation", fr: "Organisation" } },
    { key: "title", label: { en: "Job title", fr: "Fonction" } },
    { key: "phone", label: { en: "Phone", fr: "Téléphone" } },
    { key: "email", label: { en: "Email", fr: "E-mail" } },
    { key: "url", label: { en: "Website", fr: "Site web" } },
  ],
  location: [
    { key: "latitude", label: { en: "Latitude", fr: "Latitude" } },
    { key: "longitude", label: { en: "Longitude", fr: "Longitude" } },
  ],
  event: [
    { key: "summary", label: { en: "Title", fr: "Titre" } },
    { key: "start", label: { en: "Start", fr: "Début" }, type: "datetime-local" },
    { key: "end", label: { en: "End", fr: "Fin" }, type: "datetime-local" },
    { key: "location", label: { en: "Place", fr: "Lieu" } },
  ],
};

/** Luminance relative WCAG — sert à refuser un couple de couleurs illisible. */
function luminance(hex: string): number {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((i) => {
    const c = parseInt(value.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function QrGenerator({ locale }: { locale: Locale }) {
  const [type, setType] = useState<QrType>("url");
  const [fields, setFields] = useState<QrFields>({ security: "WPA" });
  const [size, setSize] = useState(512);
  const [margin, setMargin] = useState(4);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [dark, setDark] = useState("#121218");
  const [light, setLight] = useState("#ffffff");
  const [pngUrl, setPngUrl] = useState("");
  const [svg, setSvg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const payload = useMemo(() => buildPayload(type, fields), [type, fields]);
  const ratio = contrastRatio(dark, light);
  // En deçà de 3:1, les lecteurs échouent sur de nombreux téléphones.
  const lowContrast = ratio < 3;

  useEffect(() => {
    let cancelled = false;
    if (!payload) {
      setPngUrl("");
      setSvg("");
      return;
    }

    (async () => {
      const QRCode = (await import("qrcode")).default;
      const options = {
        width: size,
        margin,
        errorCorrectionLevel: level,
        color: { dark, light },
      };
      const [dataUrl, svgString] = await Promise.all([
        QRCode.toDataURL(payload, options),
        QRCode.toString(payload, { ...options, type: "svg" as const }),
      ]);
      if (cancelled) return;
      setPngUrl(dataUrl);
      setSvg(svgString);
      if (canvasRef.current) await QRCode.toCanvas(canvasRef.current, payload, options);
      trackTool("tool_complete", { slug: SLUG, category: "qr" });
    })();

    return () => {
      cancelled = true;
    };
  }, [payload, size, margin, level, dark, light]);

  const svgUrl = useMemo(
    () => (svg ? URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })) : ""),
    [svg],
  );
  useEffect(() => () => { if (svgUrl) URL.revokeObjectURL(svgUrl); }, [svgUrl]);

  function update(key: string, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="t-body-sm mb-2">{t(copy.type, locale)}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t(copy.type, locale)}>
            {TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setType(item.id);
                  setFields(item.id === "wifi" ? { security: "WPA" } : {});
                  trackTool("tool_start", { slug: SLUG, category: "qr" });
                }}
                aria-pressed={type === item.id}
                className={`rounded-[8px] px-3.5 py-2 text-[14px] leading-5 transition-colors ${
                  type === item.id ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600"
                }`}
              >
                {t(item.label, locale)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS[type].map((spec) => (
            <Field
              key={spec.key}
              id={`qr-${spec.key}`}
              label={t(spec.label, locale)}
            >
              {spec.options ? (
                <select
                  id={`qr-${spec.key}`}
                  value={fields[spec.key] ?? spec.options[0]}
                  onChange={(event) => update(spec.key, event.target.value)}
                  className={fieldClass}
                >
                  {spec.options.map((option) => (
                    <option key={option} value={option}>
                      {option === "nopass" ? (locale === "fr" ? "Aucune" : "None") : option}
                    </option>
                  ))}
                </select>
              ) : spec.type === "textarea" ? (
                <textarea
                  id={`qr-${spec.key}`}
                  rows={3}
                  value={fields[spec.key] ?? ""}
                  onChange={(event) => update(spec.key, event.target.value)}
                  className={`${fieldClass} resize-y`}
                />
              ) : (
                <input
                  id={`qr-${spec.key}`}
                  type={spec.type ?? "text"}
                  value={fields[spec.key] ?? ""}
                  onChange={(event) => update(spec.key, event.target.value)}
                  className={fieldClass}
                />
              )}
            </Field>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="qr-size" label={`${t(copy.size, locale)} : ${size}`}>
            <input
              id="qr-size"
              type="range"
              min={128}
              max={2048}
              step={64}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="w-full accent-gray-900"
            />
          </Field>
          <Field id="qr-level" label={t(copy.level, locale)} hint={t(copy.levelHint, locale)}>
            <select
              id="qr-level"
              value={level}
              onChange={(event) => setLevel(event.target.value as "L" | "M" | "Q" | "H")}
              className={fieldClass}
            >
              <option value="L">L — 7%</option>
              <option value="M">M — 15%</option>
              <option value="Q">Q — 25%</option>
              <option value="H">H — 30%</option>
            </select>
          </Field>
          <Field id="qr-margin" label={t(copy.margin, locale)} hint={t(copy.marginHint, locale)}>
            <input
              id="qr-margin"
              type="number"
              min={0}
              max={10}
              value={margin}
              onChange={(event) => setMargin(Math.max(0, Number(event.target.value) || 0))}
              className={fieldClass}
            />
          </Field>
          <div className="flex gap-4">
            <Field id="qr-dark" label={t(copy.dark, locale)}>
              <input id="qr-dark" type="color" value={dark} onChange={(e) => setDark(e.target.value)}
                className="h-11 w-20 rounded-[12px] border border-gray-200 bg-gray-50 p-1" />
            </Field>
            <Field id="qr-light" label={t(copy.light, locale)}>
              <input id="qr-light" type="color" value={light} onChange={(e) => setLight(e.target.value)}
                className="h-11 w-20 rounded-[12px] border border-gray-200 bg-gray-50 p-1" />
            </Field>
          </div>
        </div>

        {lowContrast ? <ToolStatus tone="error">{t(copy.contrast, locale)}</ToolStatus> : null}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex aspect-square w-full max-w-[320px] items-center justify-center rounded-[16px] border border-gray-200 bg-white p-4">
          {payload ? (
            <canvas ref={canvasRef} className="h-full w-full" aria-label="QR code" />
          ) : (
            <p className="t-body-sm text-center">{t(copy.empty, locale)}</p>
          )}
        </div>
        {payload ? (
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              onClick={() => {
                const link = document.createElement("a");
                link.href = pngUrl;
                link.download = `qr-${type}.png`;
                link.click();
                trackTool("download_result", { slug: SLUG, category: "qr" });
              }}
              disabled={!pngUrl}
            >
              {t(copy.downloadPng, locale)}
            </Button>
            <a
              href={svgUrl}
              download={`qr-${type}.svg`}
              onClick={() => trackTool("download_result", { slug: SLUG, category: "qr" })}
              className="rounded-[8px] border border-gray-300 bg-white px-[22px] py-3 text-[16px] leading-6 text-gray-900"
            >
              {t(copy.downloadSvg, locale)}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
