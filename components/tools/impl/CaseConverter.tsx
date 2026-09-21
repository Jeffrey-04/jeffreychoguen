"use client";

import { useState } from "react";
import { CopyButton, Field, fieldClass } from "@/components/tools/ToolKit";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "case-converter";
const CATEGORY = "text";

const copy = {
  input: { en: "Your text", fr: "Votre texte" },
  placeholder: { en: "Paste or type your text…", fr: "Collez ou saisissez votre texte…" },
} as const;

/** Découpe en mots, quelle que soit la casse d'origine (camel, snake, kebab…). */
function words(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean);
}

const CASES: { id: string; label: { en: string; fr: string }; fn: (s: string) => string }[] = [
  { id: "upper", label: { en: "UPPERCASE", fr: "MAJUSCULES" }, fn: (s) => s.toUpperCase() },
  { id: "lower", label: { en: "lowercase", fr: "minuscules" }, fn: (s) => s.toLowerCase() },
  {
    id: "title",
    label: { en: "Title Case", fr: "Casse De Titre" },
    fn: (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" "),
  },
  {
    id: "sentence",
    label: { en: "Sentence case", fr: "Casse de phrase" },
    // Remet une majuscule après chaque ponctuation forte, pas seulement au début.
    fn: (s) =>
      s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
  },
  {
    id: "camel",
    label: { en: "camelCase", fr: "camelCase" },
    fn: (s) =>
      words(s)
        .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
        .join(""),
  },
  {
    id: "pascal",
    label: { en: "PascalCase", fr: "PascalCase" },
    fn: (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(""),
  },
  { id: "snake", label: { en: "snake_case", fr: "snake_case" }, fn: (s) => words(s).map((w) => w.toLowerCase()).join("_") },
  { id: "kebab", label: { en: "kebab-case", fr: "kebab-case" }, fn: (s) => words(s).map((w) => w.toLowerCase()).join("-") },
];

export function CaseConverter({ locale }: { locale: Locale }) {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col gap-8">
      <Field id="cc-input" label={t(copy.input, locale)}>
        <textarea
          id="cc-input"
          rows={5}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t(copy.placeholder, locale)}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <ul className="flex flex-col gap-3">
        {CASES.map((item) => {
          const value = text ? item.fn(text) : "";
          return (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-3 rounded-[12px] border border-gray-200 bg-gray-50 p-3"
            >
              <span className="t-meta w-[140px] shrink-0">{t(item.label, locale)}</span>
              <span className="min-w-0 flex-1 truncate text-[15px] leading-6 text-gray-900">
                {value || "—"}
              </span>
              <CopyButton value={value} locale={locale} slug={SLUG} category={CATEGORY} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
