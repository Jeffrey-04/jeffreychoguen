"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolIcon } from "@/components/tools/ToolIcon";
import { toolsUi } from "@/content/tools/ui";
import { searchTools } from "@/lib/tools";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

/**
 * Recherche du catalogue. Le filtrage se fait sur le registry déjà présent
 * dans la page : aucune requête réseau, résultat instantané.
 * L'événement analytics ne transporte QUE la longueur de la requête — jamais
 * son contenu, qui peut être personnel.
 */
export function ToolSearch({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchTools(query, locale), [query, locale]);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="mb-14">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <ToolIcon name="magnifyingGlass" size={18} />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => {
            if (hasQuery) trackTool("tool_search", { code: String(query.trim().length) });
          }}
          placeholder={t(toolsUi.searchPlaceholder, locale)}
          aria-label={t(toolsUi.searchPlaceholder, locale)}
          className="w-full rounded-[12px] border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-[16px] leading-6 text-gray-900 placeholder:text-gray-500"
        />
      </div>

      {hasQuery ? (
        results.length > 0 ? (
          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((tool) => (
              <li key={tool.slug}>
                <ToolCard tool={tool} locale={locale} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="t-body mt-6" role="status">
            {t(toolsUi.searchEmpty, locale)}
          </p>
        )
      ) : null}
    </div>
  );
}
