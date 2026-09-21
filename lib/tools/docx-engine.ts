/**
 * Extraction du texte d'un PDF vers un .docx éditable.
 *
 * PÉRIMÈTRE ASSUMÉ : la mise en page n'est PAS reproduite. Une conversion
 * fidèle exigerait de reconstruire colonnes, tableaux, styles et images à
 * partir d'instructions de dessin — hors d'atteinte dans un navigateur, et
 * personne ne le fait honnêtement côté client. Ce que l'on produit est le
 * texte, découpé en paragraphes, dans un document Word réellement éditable :
 * c'est ce que cherche la majorité de ceux qui tapent « pdf to word ».
 */

export type ExtractedPage = { page: number; paragraphs: string[] };

/** Écart vertical au-delà duquel on considère un nouveau paragraphe. */
const LINE_BREAK_RATIO = 1.6;

export async function extractPdfText(
  file: File,
  onProgress?: (done: number, total: number) => void,
): Promise<ExtractedPage[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";

  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const doc = await task.promise;
  const pages: ExtractedPage[] = [];

  try {
    for (let number = 1; number <= doc.numPages; number++) {
      const page = await doc.getPage(number);
      const content = await page.getTextContent();

      /*
       * Un PDF ne contient pas de paragraphes : seulement des fragments de
       * texte à des coordonnées. On les regroupe par ligne via leur position
       * verticale, puis on ouvre un paragraphe dès que le saut dépasse
       * nettement la hauteur de ligne courante.
       */
      const lines: { y: number; height: number; text: string }[] = [];

      for (const item of content.items) {
        if (!("str" in item) || !item.str) continue;
        const y = item.transform[5] as number;
        const height = Math.abs(item.transform[3] as number) || 10;
        const last = lines[lines.length - 1];

        if (last && Math.abs(last.y - y) < height * 0.5) {
          last.text += item.str;
        } else {
          lines.push({ y, height, text: item.str });
        }
      }

      const paragraphs: string[] = [];
      let current = "";
      let previous: { y: number; height: number } | null = null;

      for (const line of lines) {
        const gap = previous ? Math.abs(previous.y - line.y) : 0;
        const isNewParagraph = previous !== null && gap > previous.height * LINE_BREAK_RATIO;

        if (isNewParagraph && current.trim()) {
          paragraphs.push(current.trim());
          current = "";
        }
        current += (current ? " " : "") + line.text.trim();
        previous = line;
      }
      if (current.trim()) paragraphs.push(current.trim());

      pages.push({ page: number, paragraphs });
      onProgress?.(number, doc.numPages);
    }
  } finally {
    await task.destroy();
  }

  return pages;
}

export async function buildDocx(pages: ExtractedPage[], title: string): Promise<Blob> {
  const { Document, Packer, Paragraph, HeadingLevel, PageBreak, TextRun } = await import("docx");

  const children = pages.flatMap((page, index) => {
    const blocks = [
      new Paragraph({
        text: `${title} — page ${page.page}`,
        heading: HeadingLevel.HEADING_3,
      }),
      ...page.paragraphs.map((text) => new Paragraph({ children: [new TextRun(text)] })),
    ];
    // Saut de page entre les pages d'origine, sauf après la dernière.
    if (index < pages.length - 1) {
      blocks.push(new Paragraph({ children: [new PageBreak()] }));
    }
    return blocks;
  });

  const document = new Document({ sections: [{ children }] });
  return Packer.toBlob(document);
}
