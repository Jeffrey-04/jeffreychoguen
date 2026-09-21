/**
 * Slugs disposant réellement d'une interface.
 *
 * Module neutre — ni serveur ni client — car il est lu des deux côtés : par
 * ToolRuntime pour charger le bon module, et par la page pour casser le build
 * si un outil déclaré « live » n'a pas d'interface.
 */
export const implementedSlugs = [
  "password-generator",
  "uuid-generator",
  "base64",
  "word-counter",
  "case-converter",
  "percentage-calculator",
  "json-formatter",
  "json-validator",
  "image-compressor",
  "image-resizer",
  "image-converter",
  "png-to-jpg",
  "jpg-to-png",
  "webp-converter",
  "merge-pdf",
  "split-pdf",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "compress-pdf",
  "qr-code-generator",
  "background-remover",
  "ocr",
  "pdf-to-word",
] as const;

export function isImplemented(slug: string): boolean {
  return (implementedSlugs as readonly string[]).includes(slug);
}
