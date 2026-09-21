"use client";

import type { ToolDefinition } from "@/content/tools/registry";

/**
 * Événements outils (tools.md §25).
 *
 * La charge utile est VOLONTAIREMENT pauvre : slug, catégorie, durée, statut.
 * Jamais de nom de fichier, de dimensions, de texte saisi ni de résultat.
 * Le type l'impose plutôt que de s'en remettre à la vigilance de l'appelant.
 */
export type ToolEventName =
  | "tool_view"
  | "tool_start"
  | "tool_complete"
  | "tool_error"
  | "download_result"
  | "copy_result"
  | "related_tool_click"
  | "tool_search"
  | "category_view";

type ToolEventPayload = {
  slug?: string;
  category?: string;
  /** Durée du traitement en millisecondes. */
  durationMs?: number;
  /** Code d'erreur court, jamais le message brut d'une exception. */
  code?: string;
};

declare global {
  interface Window {
    /** Renseigné par le fournisseur d'analytics lorsqu'il est présent. */
    jcAnalytics?: (name: string, payload: Record<string, unknown>) => void;
  }
}

export function trackTool(name: ToolEventName, payload: ToolEventPayload = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.jcAnalytics?.(name, { ...payload });
  } catch {
    // L'analytics ne doit jamais casser un outil.
  }
}

export function trackToolView(tool: ToolDefinition): void {
  trackTool("tool_view", { slug: tool.slug, category: tool.category });
}
