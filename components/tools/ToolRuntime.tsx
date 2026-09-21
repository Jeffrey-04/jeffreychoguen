"use client";

import { Suspense, lazy, type ComponentType } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Chargement de l'interface d'un outil, côté client uniquement.
 *
 * Pourquoi ici et pas dans la page serveur : les 21 outils partagent UNE route
 * (/tools/[segment]). Toute référence faite depuis le composant serveur entre
 * dans le graphe de la page, et le code des 18 outils voyageait sur chacune
 * d'elles — mesuré à 18 Ko gzip, et voué à croître jusqu'aux 100 outils.
 *
 * React.lazy déplace ce choix à l'exécution : seul le module de l'outil
 * demandé est téléchargé. Le contenu indexable (titre, description, FAQ,
 * outils liés) reste rendu côté serveur par ToolShell — c'est lui qui porte
 * la valeur SEO, pas le widget.
 */
type ToolProps = { locale: Locale };

const registry: Record<string, () => Promise<{ default: ComponentType<ToolProps> }>> = {
  "password-generator": () =>
    import("@/components/tools/impl/PasswordGenerator").then((m) => ({ default: m.PasswordGenerator })),
  "uuid-generator": () =>
    import("@/components/tools/impl/UuidGenerator").then((m) => ({ default: m.UuidGenerator })),
  base64: () => import("@/components/tools/impl/Base64Tool").then((m) => ({ default: m.Base64Tool })),
  "word-counter": () =>
    import("@/components/tools/impl/WordCounter").then((m) => ({ default: m.WordCounter })),
  "case-converter": () =>
    import("@/components/tools/impl/CaseConverter").then((m) => ({ default: m.CaseConverter })),
  "percentage-calculator": () =>
    import("@/components/tools/impl/PercentageCalculator").then((m) => ({ default: m.PercentageCalculator })),
  "json-formatter": () =>
    import("@/components/tools/impl/JsonFormatter").then((m) => ({ default: m.JsonFormatter })),
  "json-validator": () =>
    import("@/components/tools/impl/JsonValidator").then((m) => ({ default: m.JsonValidator })),
  "qr-code-generator": () =>
    import("@/components/tools/impl/QrGenerator").then((m) => ({ default: m.QrGenerator })),
  "background-remover": () =>
    import("@/components/tools/impl/BackgroundRemover").then((m) => ({ default: m.BackgroundRemover })),
  ocr: () => import("@/components/tools/impl/OcrTool").then((m) => ({ default: m.OcrTool })),
  "pdf-to-word": () =>
    import("@/components/tools/impl/PdfToWord").then((m) => ({ default: m.PdfToWord })),
  "merge-pdf": () => import("@/components/tools/impl/MergePdf").then((m) => ({ default: m.MergePdf })),
  "split-pdf": () => import("@/components/tools/impl/SplitPdf").then((m) => ({ default: m.SplitPdf })),
  "jpg-to-pdf": () =>
    import("@/components/tools/impl/ImagesToPdf").then((m) => ({ default: m.ImagesToPdf })),
  "compress-pdf": () =>
    import("@/components/tools/impl/CompressPdf").then((m) => ({ default: m.CompressPdf })),
  "pdf-to-jpg": () =>
    import("@/components/tools/impl/PdfToImages").then((m) => ({ default: m.PdfToImages })),
};

/** Les six outils d'image partagent une interface : un seul module suffit. */
const IMAGE_TOOLS = [
  "image-compressor",
  "image-resizer",
  "image-converter",
  "png-to-jpg",
  "jpg-to-png",
  "webp-converter",
];

for (const slug of IMAGE_TOOLS) {
  registry[slug] = () =>
    import("@/components/tools/impl/ImageToolLoader").then((m) => ({ default: m.default }));
}

export function hasRuntime(slug: string): boolean {
  return slug in registry;
}

/** Réservation d'espace pendant le chargement, pour éviter un saut de mise en page. */
function Placeholder() {
  return <div aria-hidden="true" className="min-h-[280px] animate-pulse rounded-[12px] bg-gray-100" />;
}

export function ToolRuntime({ slug, locale }: { slug: string; locale: Locale }) {
  const loader = registry[slug];
  if (!loader) return null;
  const Component = lazy(loader);

  return (
    <Suspense fallback={<Placeholder />}>
      <Component locale={locale} />
    </Suspense>
  );
}
