"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { toolsUi } from "@/content/tools/ui";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

/**
 * Générateur de mots de passe.
 *
 * L'aléa vient de crypto.getRandomValues, jamais de Math.random() qui est
 * prévisible et impropre à un usage de sécurité.
 *
 * Les caractères ambigus (0/O, 1/l/I) sont retirables : ils causent des erreurs
 * de saisie quand le mot de passe doit être recopié à la main.
 */
const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};
const AMBIGUOUS = /[0O1lI|`]/g;

const copy = {
  length: { en: "Length", fr: "Longueur" },
  lower: { en: "Lowercase", fr: "Minuscules" },
  upper: { en: "Uppercase", fr: "Majuscules" },
  digits: { en: "Digits", fr: "Chiffres" },
  symbols: { en: "Symbols", fr: "Symboles" },
  include: { en: "Include", fr: "Inclure" },
  noAmbiguous: { en: "Exclude look-alike characters", fr: "Exclure les caractères ambigus" },
  strength: { en: "Strength", fr: "Robustesse" },
  entropy: { en: "bits of entropy", fr: "bits d'entropie" },
  needOne: { en: "Select at least one character set.", fr: "Sélectionnez au moins un jeu de caractères." },
  result: { en: "Generated password", fr: "Mot de passe généré" },
  weak: { en: "Weak", fr: "Faible" },
  fair: { en: "Fair", fr: "Correct" },
  strong: { en: "Strong", fr: "Fort" },
  excellent: { en: "Excellent", fr: "Excellent" },
} as const;

/** Tirage uniforme : le rejet évite le biais d'un simple modulo. */
function pick(alphabet: string): string {
  const max = Math.floor(256 / alphabet.length) * alphabet.length;
  const buffer = new Uint8Array(1);
  let value = max;
  while (value >= max) {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  }
  return alphabet[value % alphabet.length];
}

export function PasswordGenerator({ locale }: { locale: Locale }) {
  const [length, setLength] = useState(20);
  const [sets, setSets] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const alphabet = (Object.keys(SETS) as (keyof typeof SETS)[])
    .filter((key) => sets[key])
    .map((key) => SETS[key])
    .join("")
    .replace(noAmbiguous ? AMBIGUOUS : /(?!)/g, "");

  const generate = useCallback(() => {
    if (!alphabet) return;
    const next = Array.from({ length }, () => pick(alphabet)).join("");
    setPassword(next);
    setCopied(false);
    trackTool("tool_complete", { slug: "password-generator", category: "security" });
  }, [alphabet, length]);

  // Un mot de passe est présent dès l'arrivée : l'outil doit être utile
  // immédiatement, sans clic préalable.
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entropy = alphabet ? Math.round(length * Math.log2(alphabet.length)) : 0;
  const rating =
    entropy < 50 ? copy.weak : entropy < 80 ? copy.fair : entropy < 120 ? copy.strong : copy.excellent;

  async function onCopy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      trackTool("copy_result", { slug: "password-generator", category: "security" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Le presse-papiers peut être refusé : on n'interrompt pas l'outil. */
    }
  }

  const field = "rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-3";

  return (
    <div className="flex flex-col gap-8">
      {/* Résultat */}
      <div>
        <label htmlFor="pw-result" className="t-body-sm mb-2 block">
          {t(copy.result, locale)}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="pw-result"
            readOnly
            value={password}
            className={`${field} min-w-0 flex-1 font-mono text-[18px] leading-7 text-gray-900`}
          />
          <div className="flex gap-3">
            <Button type="button" onClick={onCopy} variant="secondary" disabled={!password}>
              {t(copied ? toolsUi.copied : toolsUi.copy, locale)}
            </Button>
            <Button type="button" onClick={generate} disabled={!alphabet}>
              {t(toolsUi.generate, locale)}
            </Button>
          </div>
        </div>
        <p aria-live="polite" className="t-meta mt-2">
          {alphabet
            ? `${t(copy.strength, locale)} : ${t(rating, locale)} — ${entropy} ${t(copy.entropy, locale)}`
            : t(copy.needOne, locale)}
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="pw-length" className="t-body-sm mb-2 block">
            {t(copy.length, locale)} : <strong className="text-gray-900">{length}</strong>
          </label>
          <input
            id="pw-length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            className="w-full accent-gray-900"
          />
        </div>

        <fieldset className="flex flex-wrap gap-x-6 gap-y-3">
          <legend className="t-body-sm mb-2">{t(copy.include, locale)}</legend>
          {(Object.keys(SETS) as (keyof typeof SETS)[]).map((key) => (
            <label key={key} className="t-body-sm inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={sets[key]}
                onChange={(event) => setSets({ ...sets, [key]: event.target.checked })}
                className="h-4 w-4 accent-gray-900"
              />
              {t(copy[key], locale)}
            </label>
          ))}
          <label className="t-body-sm inline-flex w-full items-center gap-2">
            <input
              type="checkbox"
              checked={noAmbiguous}
              onChange={(event) => setNoAmbiguous(event.target.checked)}
              className="h-4 w-4 accent-gray-900"
            />
            {t(copy.noAmbiguous, locale)}
          </label>
        </fieldset>
      </div>
    </div>
  );
}
