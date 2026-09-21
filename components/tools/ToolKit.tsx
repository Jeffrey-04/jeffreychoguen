"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { toolsUi } from "@/content/tools/ui";
import { trackTool } from "@/lib/tools/analytics";
import { type Locale, t } from "@/lib/i18n";

/**
 * Primitives partagées des outils.
 *
 * Elles existent pour que les 20 outils se ressemblent sans être copiés-collés :
 * un même champ, un même bouton de copie, une même façon d'annoncer un
 * résultat aux lecteurs d'écran.
 */

export const fieldClass =
  "w-full rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-3 text-[16px] leading-6 text-gray-900 placeholder:text-gray-500";

export function Field({
  id,
  label,
  children,
  hint,
}: {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="t-body-sm mb-2 block">
        {label}
      </label>
      {children}
      {hint ? <p className="t-meta mt-1.5">{hint}</p> : null}
    </div>
  );
}

/** Bouton de copie avec retour visuel, et sans jamais journaliser le contenu. */
export function CopyButton({
  value,
  locale,
  slug,
  category,
  variant = "secondary",
}: {
  value: string;
  locale: Locale;
  slug: string;
  category: string;
  variant?: "primary" | "secondary";
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      trackTool("copy_result", { slug, category });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Presse-papiers refusé : l'outil reste utilisable. */
    }
  }

  return (
    <Button type="button" onClick={onCopy} variant={variant} disabled={!value}>
      {t(copied ? toolsUi.copied : toolsUi.copy, locale)}
    </Button>
  );
}

/** Ligne de statistique — compteurs, tailles, résultats numériques. */
export function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <p className="font-display text-[32px] leading-none tracking-[-0.02em] text-gray-900">
        {value}
      </p>
      <p className="t-meta mt-1.5">{label}</p>
    </div>
  );
}

/**
 * Message de statut. `role="status"` le fait annoncer par les lecteurs
 * d'écran sans voler le focus — indispensable pour un résultat qui apparaît
 * sans changement de page.
 */
export function ToolStatus({ tone, children }: { tone: "ok" | "error" | "muted"; children: ReactNode }) {
  const colour =
    tone === "error" ? "text-gray-900" : tone === "ok" ? "text-gray-900" : "text-gray-500";
  return (
    <p role="status" aria-live="polite" className={`t-body-sm ${colour}`}>
      {children}
    </p>
  );
}
