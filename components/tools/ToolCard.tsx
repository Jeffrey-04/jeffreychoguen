import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/Icon";
import { toolsUi } from "@/content/tools/ui";
import type { ToolDefinition } from "@/content/tools/registry";
import { type Locale, path, t } from "@/lib/i18n";

/**
 * Carte d'outil du catalogue.
 * Un outil `planned` n'est PAS un lien : il n'a pas d'URL, conformément à la
 * règle « jamais d'URL sans outil derrière ».
 */
export function ToolCard({ tool, locale }: { tool: ToolDefinition; locale: Locale }) {
  const isLive = tool.status === "live";

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="t-h6">{tool.name}</h3>
        {isLive ? (
          <ArrowUpRight size={18} className="shrink-0 text-gray-400" />
        ) : (
          <span className="shrink-0 rounded-full border border-gray-200 px-2.5 py-0.5 text-[11px] leading-4 text-gray-500">
            {t(toolsUi.comingSoon, locale)}
          </span>
        )}
      </div>
      <p className="t-body-sm mt-1">{t(tool.tagline, locale)}</p>
    </>
  );

  const shell = "rounded-[16px] border border-gray-200 bg-white p-5";

  if (!isLive) {
    return <div className={`${shell} opacity-70`}>{body}</div>;
  }

  return (
    <Link
      href={path(locale, `tools/${tool.slug}`)}
      className={`${shell} block transition-colors hover:border-gray-300`}
    >
      {body}
    </Link>
  );
}
