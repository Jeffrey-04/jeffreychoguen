import { ToolIcon } from "@/components/tools/ToolIcon";
import { toolsUi } from "@/content/tools/ui";
import type { ToolProcessing } from "@/content/tools/registry";
import { type Locale, t } from "@/lib/i18n";

/**
 * Badge de confidentialité.
 *
 * Son texte DÉCOULE de `processing` : il n'est jamais passé en propriété
 * libre. C'est ce qui rend structurellement impossible d'afficher
 * « vos fichiers restent sur votre appareil » sur un outil qui les envoie
 * ailleurs — l'erreur exacte que tools.md interdit.
 */
export function PrivacyBadge({
  processing,
  locale,
}: {
  processing: ToolProcessing;
  locale: Locale;
}) {
  const isLocal = processing === "client";

  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] leading-5 ${
        isLocal
          ? "border-accent-500 bg-accent-200 text-gray-900"
          : "border-gray-300 bg-gray-100 text-gray-700"
      }`}
    >
      <ToolIcon name={isLocal ? "shieldCheck" : "arrowsLeftRight"} size={15} />
      {t(isLocal ? toolsUi.privacyLocal : toolsUi.privacyExternal, locale)}
    </p>
  );
}
