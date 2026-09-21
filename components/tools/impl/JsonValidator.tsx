"use client";

import { useMemo, useState } from "react";
import { Field, ToolStatus, fieldClass } from "@/components/tools/ToolKit";
import { parseJson } from "@/lib/tools/json";
import { type Locale, t } from "@/lib/i18n";

const copy = {
  input: { en: "JSON to check", fr: "JSON à vérifier" },
  placeholder: { en: '{"paste":"your json here"}', fr: '{"collez":"votre json ici"}' },
  valid: { en: "Valid JSON.", fr: "JSON valide." },
  errorAt: { en: "Error at line {line}, column {column}", fr: "Erreur ligne {line}, colonne {column}" },
  context: { en: "The problem is here:", fr: "Le problème se situe ici :" },
} as const;

export function JsonValidator({ locale }: { locale: Locale }) {
  const [input, setInput] = useState("");
  const result = useMemo(() => (input.trim() ? parseJson(input) : null), [input]);

  /** Ligne fautive extraite du document, pour situer l'erreur visuellement. */
  const context =
    result && !result.ok && result.line ? input.split("\n")[result.line - 1] ?? "" : "";

  return (
    <div className="flex flex-col gap-6">
      <Field id="jv-input" label={t(copy.input, locale)}>
        <textarea
          id="jv-input"
          rows={10}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(copy.placeholder, locale)}
          spellCheck={false}
          className={`${fieldClass} resize-y font-mono text-[14px] leading-6`}
        />
      </Field>

      {result ? (
        result.ok ? (
          <div className="rounded-[12px] border border-accent-500 bg-accent-200 px-4 py-3">
            <ToolStatus tone="ok">{t(copy.valid, locale)}</ToolStatus>
          </div>
        ) : (
          <div className="rounded-[12px] border border-gray-300 bg-gray-100 px-4 py-3">
            <ToolStatus tone="error">
              {result.line
                ? t(copy.errorAt, locale)
                    .replace("{line}", String(result.line))
                    .replace("{column}", String(result.column))
                : result.message}
            </ToolStatus>
            {context ? (
              <>
                <p className="t-meta mt-3">{t(copy.context, locale)}</p>
                <pre className="mt-1 overflow-x-auto rounded-[8px] bg-white p-3 font-mono text-[13px] leading-5 text-gray-900">
                  {context}
                  {result.column ? `\n${" ".repeat(Math.max(0, result.column - 1))}^` : ""}
                </pre>
              </>
            ) : null}
          </div>
        )
      ) : null}
    </div>
  );
}
