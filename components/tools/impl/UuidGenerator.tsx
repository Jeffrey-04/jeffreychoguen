"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton, Field, fieldClass } from "@/components/tools/ToolKit";
import { toolsUi } from "@/content/tools/ui";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

const SLUG = "uuid-generator";
const CATEGORY = "developer";

const copy = {
  count: { en: "How many", fr: "Combien" },
  uppercase: { en: "Uppercase", fr: "Majuscules" },
  noDashes: { en: "Remove dashes", fr: "Sans tirets" },
  result: { en: "Generated UUIDs", fr: "UUID générés" },
} as const;

/**
 * UUID v4 via crypto.randomUUID, natif dans tous les navigateurs modernes.
 * Repli manuel sur getRandomValues pour les contextes non sécurisés, où
 * randomUUID n'est pas exposé.
 */
function uuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant RFC 4122
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function UuidGenerator({ locale }: { locale: Locale }) {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const [list, setList] = useState<string[]>([]);

  const generate = useCallback(() => {
    const next = Array.from({ length: count }, () => {
      let value = uuid();
      if (noDashes) value = value.replace(/-/g, "");
      return uppercase ? value.toUpperCase() : value;
    });
    setList(next);
    trackTool("tool_complete", { slug: SLUG, category: CATEGORY });
  }, [count, uppercase, noDashes]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const text = list.join("\n");

  return (
    <div className="flex flex-col gap-8">
      <Field id="uuid-result" label={t(copy.result, locale)}>
        <textarea
          id="uuid-result"
          readOnly
          value={text}
          rows={Math.min(10, Math.max(3, list.length))}
          className={`${fieldClass} resize-y font-mono text-[14px] leading-6`}
        />
      </Field>

      <div className="flex flex-wrap items-end gap-6">
        <Field id="uuid-count" label={t(copy.count, locale)}>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) =>
              setCount(Math.min(100, Math.max(1, Number(event.target.value) || 1)))
            }
            className={`${fieldClass} w-28`}
          />
        </Field>

        <div className="flex flex-col gap-3 pb-3">
          <label className="t-body-sm inline-flex items-center gap-2">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="h-4 w-4 accent-gray-900" />
            {t(copy.uppercase, locale)}
          </label>
          <label className="t-body-sm inline-flex items-center gap-2">
            <input type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} className="h-4 w-4 accent-gray-900" />
            {t(copy.noDashes, locale)}
          </label>
        </div>

        <div className="flex gap-3 pb-3">
          <CopyButton value={text} locale={locale} slug={SLUG} category={CATEGORY} />
          <Button type="button" onClick={generate}>
            {t(toolsUi.generate, locale)}
          </Button>
        </div>
      </div>
    </div>
  );
}
