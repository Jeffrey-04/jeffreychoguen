export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Texte disponible dans les deux langues. */
export type I18nText = Record<Locale, string>;
/** Liste disponible dans les deux langues. */
export type I18nList = Record<Locale, string[]>;

export function t(text: I18nText, locale: Locale): string {
  return text[locale] ?? text[defaultLocale];
}

export function tList(list: I18nList, locale: Locale): string[] {
  return list[locale] ?? list[defaultLocale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Construit une URL interne préfixée par la langue. */
export function path(locale: Locale, segment = ""): string {
  const clean = segment.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}
