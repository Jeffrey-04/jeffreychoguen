"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton, Field, ToolStatus, fieldClass } from "@/components/tools/ToolKit";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "base64";
const CATEGORY = "developer";

const copy = {
  encode: { en: "Encode", fr: "Encoder" },
  decode: { en: "Decode", fr: "Décoder" },
  input: { en: "Input", fr: "Entrée" },
  output: { en: "Output", fr: "Sortie" },
  swap: { en: "Swap", fr: "Inverser" },
  invalid: { en: "That is not valid Base64.", fr: "Ce n'est pas du Base64 valide." },
  placeholderEncode: { en: "Text to encode…", fr: "Texte à encoder…" },
  placeholderDecode: { en: "Base64 to decode…", fr: "Base64 à décoder…" },
} as const;

/**
 * Encodage Base64 correct en UTF-8.
 *
 * btoa() seul échoue dès qu'un caractère dépasse l'octet — donc sur tout
 * accent français ou emoji. C'est l'erreur la plus répandue des convertisseurs
 * en ligne. On passe donc par TextEncoder, qui produit les octets UTF-8 avant
 * l'encodage.
 */
function encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decode(input: string): string {
  const binary = atob(input.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: false };
    try {
      return { output: mode === "encode" ? encode(input) : decode(input), error: false };
    } catch {
      return { output: "", error: true };
    }
  }, [input, mode]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label={t(copy.input, locale)} className="flex gap-2">
          {(["encode", "decode"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-pressed={mode === value}
              className={`rounded-[8px] px-4 py-2 text-[14px] leading-5 transition-colors ${
                mode === value ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600"
              }`}
            >
              {t(copy[value], locale)}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setInput(output);
            setMode(mode === "encode" ? "decode" : "encode");
          }}
          disabled={!output}
        >
          {t(copy.swap, locale)}
        </Button>
      </div>

      <Field id="b64-input" label={t(copy.input, locale)}>
        <textarea
          id="b64-input"
          rows={5}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(mode === "encode" ? copy.placeholderEncode : copy.placeholderDecode, locale)}
          className={`${fieldClass} resize-y font-mono text-[14px] leading-6`}
        />
      </Field>

      <Field id="b64-output" label={t(copy.output, locale)}>
        <textarea
          id="b64-output"
          rows={5}
          readOnly
          value={output}
          className={`${fieldClass} resize-y font-mono text-[14px] leading-6`}
        />
      </Field>

      <div className="flex items-center justify-between gap-4">
        {error ? <ToolStatus tone="error">{t(copy.invalid, locale)}</ToolStatus> : <span />}
        <CopyButton value={output} locale={locale} slug={SLUG} category={CATEGORY} />
      </div>
    </div>
  );
}
