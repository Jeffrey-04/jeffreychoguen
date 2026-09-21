import type { I18nText } from "@/lib/i18n";

/**
 * Profil — chaque valeur provient du CV de Jeffrey (2026) ou d'une vérification
 * en ligne. Aucun chiffre n'est estimé : voir metrics.ts pour la traçabilité.
 */
export const site = {
  /** Nom public unique, utilisé partout (SEO, Schema.org, titres). */
  name: "Jeffrey Choguen",
  /** Nom complet de l'état civil, exposé uniquement en alternateName. */
  legalName: "Jeffrey Choguen Talla",
  url: "https://jeffreychoguen.cloud",
  email: "jeffreychoguen@colisgo.org",
  location: {
    city: "Yaoundé",
    country: { en: "Cameroon", fr: "Cameroun" } as I18nText,
  },
  jobTitle: {
    en: "Full Stack Software Engineer",
    fr: "Ingénieur logiciel full stack",
  } as I18nText,
  roleLine: {
    en: "Full Stack Software Engineer · Backend Developer · Mobile Developer",
    fr: "Ingénieur logiciel full stack · Développeur backend · Développeur mobile",
  } as I18nText,
  tagline: {
    en: "I design and build web, mobile and backend systems that turn ideas into reliable digital products.",
    fr: "Je conçois et développe des systèmes web, mobiles et backend qui transforment des idées en produits numériques fiables.",
  } as I18nText,
  social: {
    linkedin: "https://www.linkedin.com/in/jeffrey-choguen-8222a1255",
    github: "https://github.com/Jeffrey-04",
  },
  /**
   * GitHub compte 2 dépôts publics et aucune bio (vérifié le 2026-09-06).
   * Tant qu'il n'est pas étoffé, le lien reste masqué : un profil vide
   * dessert un portfolio qui présente 10 projets livrés.
   */
  showGithub: false,
} as const;

export const languages = [
  { name: { en: "French", fr: "Français" }, level: { en: "Native", fr: "Natif" } },
  { name: { en: "English", fr: "Anglais" }, level: { en: "Fluent", fr: "Courant" } },
] as const;
