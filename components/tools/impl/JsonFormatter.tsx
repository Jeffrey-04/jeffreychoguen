"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, ToolStatus, fieldClass } from "@/components/tools/ToolKit";
import { formatJson } from "@/lib/tools/json";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "json-formatter";
const CATEGORY = "developer";

const copy = {
  input: { en: "JSON input", fr: "JSON en entrée" },
  output: { en: "Formatted", fr: "Formaté" },
  placeholder: { en: '{"paste":"your json here"}', fr: '{"collez":"votre json ici"}' },
  indent: { en: "Indent", fr: "Indentation" },
  minify: { en: "Minify", fr: "Minifier" },
  spaces: { en: "spaces", fr: "espaces" },
  valid: { en: "Valid JSON.", fr: "JSON valide." },
  errorAt: { en: "Error at line {line}, column {column}.", fr: "Erreur ligne {line}, colonne {column}." },
} as const;

const INDENTS = [0, 2, 4] as const;

export function JsonFormatter({ locale }: { locale: Locale }) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<number>(2);

  const result = useMemo(() => (input.trim() ? formatJson(input, indent) : null), [input, indent]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t(copy.indent, locale)}>
        {INDENTS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setIndent(value)}
            aria-pressed={indent === value}
            className={`rounded-[8px] px-4 py-2 text-[14px] leading-5 transition-colors ${
              indent === value ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600"
            }`}
          >
            {value === 0 ? t(copy.minify, locale) : `${value} ${t(copy.spaces, locale)}`}
          </button>
        ))}
      </div>

      <Field id="jf-input" label={t(copy.input, locale)}>
        <textarea
          id="jf-input"
          rows={8}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(copy.placeholder, locale)}
          spellCheck={false}
          className={`${fieldClass} resize-y font-mono text-[14px] leading-6`}
        />
      </Field>

      <Field id="jf-output" label={t(copy.output, locale)}>
        <textarea
          id="jf-output"
          rows={8}
          readOnly
          value={result?.ok ? (result.output ?? "") : ""}
          spellCheck={false}
          className={`${fieldClass} resize-y font-mono text-[14px] leading-6`}
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {result ? (
            result.ok ? (
              <ToolStatus tone="ok">{t(copy.valid, locale)}</ToolStatus>
            ) : (
              <ToolStatus tone="error">
                {result.line
                  ? t(copy.errorAt, locale)
                      .replace("{line}", String(result.line))
                      .replace("{column}", String(result.column))
                  : result.message}
              </ToolStatus>
            )
          ) : null}
        </div>
        <CopyButton
          value={result?.ok ? (result.output ?? "") : ""}
          locale={locale}
          slug={SLUG}
          category={CATEGORY}
        />
      </div>
    </div>
  );
}
