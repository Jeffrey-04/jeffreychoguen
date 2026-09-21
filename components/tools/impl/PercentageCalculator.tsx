"use client";

import { useState } from "react";
import { Field, Stat, fieldClass } from "@/components/tools/ToolKit";
import { type Locale, t } from "@/lib/i18n";

const copy = {
  mode1: { en: "What is X% of Y?", fr: "Combien font X % de Y ?" },
  mode2: { en: "X is what % of Y?", fr: "X représente quel % de Y ?" },
  mode3: { en: "Change from X to Y", fr: "Variation de X à Y" },
  result: { en: "Result", fr: "Résultat" },
  increase: { en: "increase", fr: "de hausse" },
  decrease: { en: "decrease", fr: "de baisse" },
  noChange: { en: "no change", fr: "aucune variation" },
} as const;

/** Arrondi à deux décimales, sans traîne de virgule flottante. */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function PercentageCalculator({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<"of" | "share" | "change">("of");
  const [x, setX] = useState("15");
  const [y, setY] = useState("200");

  const a = Number(x);
  const b = Number(y);
  const valid = Number.isFinite(a) && Number.isFinite(b);

  let result = "—";
  let note = "";

  if (valid) {
    if (mode === "of") {
      result = String(round((a / 100) * b));
    } else if (mode === "share") {
      result = b !== 0 ? `${round((a / b) * 100)} %` : "—";
    } else {
      if (a !== 0) {
        const delta = round(((b - a) / Math.abs(a)) * 100);
        result = `${delta > 0 ? "+" : ""}${delta} %`;
        note = t(delta > 0 ? copy.increase : delta < 0 ? copy.decrease : copy.noChange, locale);
      }
    }
  }

  const modes = [
    { id: "of", label: copy.mode1 },
    { id: "share", label: copy.mode2 },
    { id: "change", label: copy.mode3 },
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label={t(copy.result, locale)} className="flex flex-wrap gap-2">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            aria-pressed={mode === item.id}
            className={`rounded-[8px] px-4 py-2 text-[14px] leading-5 transition-colors ${
              mode === item.id ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600"
            }`}
          >
            {t(item.label, locale)}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="pc-x" label="X">
          <input
            id="pc-x"
            type="number"
            inputMode="decimal"
            value={x}
            onChange={(event) => setX(event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="pc-y" label="Y">
          <input
            id="pc-y"
            type="number"
            inputMode="decimal"
            value={y}
            onChange={(event) => setY(event.target.value)}
            className={fieldClass}
          />
        </Field>
      </div>

      <div aria-live="polite">
        <Stat value={result} label={note || t(copy.result, locale)} />
      </div>
    </div>
  );
}
