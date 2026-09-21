"use client";

import { useMemo, useState } from "react";
import { Field, Stat, fieldClass } from "@/components/tools/ToolKit";
import { type Locale, t } from "@/lib/i18n";

const copy = {
  input: { en: "Your text", fr: "Votre texte" },
  placeholder: { en: "Paste or type your text…", fr: "Collez ou saisissez votre texte…" },
  words: { en: "Words", fr: "Mots" },
  characters: { en: "Characters", fr: "Caractères" },
  noSpaces: { en: "Without spaces", fr: "Sans espaces" },
  sentences: { en: "Sentences", fr: "Phrases" },
  paragraphs: { en: "Paragraphs", fr: "Paragraphes" },
  reading: { en: "Reading time", fr: "Temps de lecture" },
  minute: { en: "min", fr: "min" },
} as const;

/** 200 mots/minute : moyenne usuelle pour de la lecture silencieuse. */
const WORDS_PER_MINUTE = 200;

export function WordCounter({ locale }: { locale: Locale }) {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    return {
      words,
      characters: text.length,
      noSpaces: text.replace(/\s/g, "").length,
      // Une phrase se termine par . ! ? ou … — on ignore les segments vides.
      sentences: trimmed ? trimmed.split(/[.!?…]+/).filter((s) => s.trim()).length : 0,
      paragraphs: trimmed ? trimmed.split(/\n{2,}/).filter((p) => p.trim()).length : 0,
      minutes: Math.max(words > 0 ? 1 : 0, Math.round(words / WORDS_PER_MINUTE)),
    };
  }, [text]);

  return (
    <div className="flex flex-col gap-8">
      <Field id="wc-input" label={t(copy.input, locale)}>
        <textarea
          id="wc-input"
          rows={10}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t(copy.placeholder, locale)}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        <Stat value={stats.words} label={t(copy.words, locale)} />
        <Stat value={stats.characters} label={t(copy.characters, locale)} />
        <Stat value={stats.noSpaces} label={t(copy.noSpaces, locale)} />
        <Stat value={stats.sentences} label={t(copy.sentences, locale)} />
        <Stat value={stats.paragraphs} label={t(copy.paragraphs, locale)} />
        <Stat value={`${stats.minutes} ${t(copy.minute, locale)}`} label={t(copy.reading, locale)} />
      </dl>
    </div>
  );
}
