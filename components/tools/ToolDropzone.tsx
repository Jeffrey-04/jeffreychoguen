"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { ToolIcon } from "@/components/tools/ToolIcon";
import { type Locale, t } from "@/lib/i18n";

const copy = {
  drop: { en: "Drop files here", fr: "Déposez vos fichiers ici" },
  or: { en: "or", fr: "ou" },
  choose: { en: "choose files", fr: "parcourir" },
  rejected: {
    en: "Some files were ignored: unsupported format.",
    fr: "Certains fichiers ont été ignorés : format non pris en charge.",
  },
} as const;

/**
 * Zone de dépôt.
 *
 * Le glisser-déposer n'est qu'un CONFORT : le champ de fichier reste un vrai
 * `<input>` focusable et déclenchable au clavier, jamais masqué derrière un
 * div. C'est l'alternative exigée par tools.md §20 — un dépôt à la souris
 * exclut sinon toute navigation clavier et tout lecteur d'écran.
 */
export function ToolDropzone({
  accept,
  multiple = true,
  onFiles,
  locale,
  hint,
}: {
  accept: string[];
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  locale: Locale;
  hint?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [rejected, setRejected] = useState(false);

  function handle(list: FileList | null) {
    if (!list) return;
    const all = Array.from(list);
    const kept = all.filter((file) => accept.includes(file.type));
    setRejected(kept.length !== all.length);
    if (kept.length) onFiles(multiple ? kept : kept.slice(0, 1));
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setOver(false);
    handle(event.dataTransfer.files);
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`rounded-[16px] border-2 border-dashed px-6 py-12 text-center transition-colors ${
          over ? "border-gray-900 bg-gray-100" : "border-gray-300 bg-gray-50"
        }`}
      >
        <span className="mb-3 inline-flex text-gray-500">
          <ToolIcon name="images" size={30} />
        </span>
        <p className="t-h6 mb-1">{t(copy.drop, locale)}</p>
        <p className="t-body-sm">
          {t(copy.or, locale)}{" "}
          <label
            htmlFor={id}
            className="cursor-pointer text-gray-900 underline underline-offset-4"
          >
            {t(copy.choose, locale)}
          </label>
        </p>
        {hint ? <p className="t-meta mt-3">{hint}</p> : null}

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          onChange={(event) => {
            handle(event.target.files);
            // Permet de resélectionner le même fichier après un reset.
            event.target.value = "";
          }}
          className="sr-only"
        />
      </div>

      {rejected ? (
        <p role="status" className="t-body-sm mt-3 text-gray-900">
          {t(copy.rejected, locale)}
        </p>
      ) : null}
    </div>
  );
}
