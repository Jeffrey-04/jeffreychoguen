import type { I18nText } from "@/lib/i18n";
import type { IconName } from "@/content/tools/icons";

/**
 * Catégories d'outils (tools.md §Navigation).
 * L'identifiant EST le segment d'URL : /tools/images, /tools/pdf…
 */
export const categoryIds = [
  "images",
  "pdf",
  "qr",
  "developer",
  "text",
  "seo",
  "design",
  "calculators",
  "converters",
  "security",
  "business",
  "social",
  "media",
  "ai",
] as const;

export type CategoryId = (typeof categoryIds)[number];

export type Category = {
  id: CategoryId;
  name: I18nText;
  description: I18nText;
  icon: IconName;
};

export const categories: Category[] = [
  {
    id: "images",
    name: { en: "Images", fr: "Images" },
    description: {
      en: "Compress, resize and convert images without leaving your browser.",
      fr: "Compressez, redimensionnez et convertissez vos images sans quitter votre navigateur.",
    },
    icon: "images",
  },
  {
    id: "pdf",
    name: { en: "PDF", fr: "PDF" },
    description: {
      en: "Merge, split and convert PDF files on your own machine.",
      fr: "Fusionnez, divisez et convertissez vos PDF sur votre propre machine.",
    },
    icon: "filePdf",
  },
  {
    id: "qr",
    name: { en: "QR codes", fr: "Codes QR" },
    description: {
      en: "Generate QR codes for links, Wi-Fi, contacts and more.",
      fr: "Générez des codes QR pour des liens, du Wi-Fi, des contacts et plus.",
    },
    icon: "qrCode",
  },
  {
    id: "developer",
    name: { en: "Developer", fr: "Développeur" },
    description: {
      en: "Format, validate, encode and decode — the daily utilities.",
      fr: "Formater, valider, encoder, décoder — les utilitaires du quotidien.",
    },
    icon: "code",
  },
  {
    id: "text",
    name: { en: "Text", fr: "Texte" },
    description: {
      en: "Count, clean, compare and transform text.",
      fr: "Compter, nettoyer, comparer et transformer du texte.",
    },
    icon: "textT",
  },
  {
    id: "seo",
    name: { en: "SEO", fr: "SEO" },
    description: {
      en: "Meta tags, structured data and search previews.",
      fr: "Balises meta, données structurées et aperçus de recherche.",
    },
    icon: "magnifyingGlass",
  },
  {
    id: "design",
    name: { en: "Design & colour", fr: "Design & couleur" },
    description: {
      en: "Colours, gradients, contrast and CSS helpers.",
      fr: "Couleurs, dégradés, contraste et aides CSS.",
    },
    icon: "palette",
  },
  {
    id: "calculators",
    name: { en: "Calculators", fr: "Calculatrices" },
    description: {
      en: "Percentages, dates, finance and developer units.",
      fr: "Pourcentages, dates, finance et unités de développeur.",
    },
    icon: "calculator",
  },
  {
    id: "converters",
    name: { en: "Converters", fr: "Convertisseurs" },
    description: {
      en: "Move between formats and units.",
      fr: "Passer d'un format ou d'une unité à l'autre.",
    },
    icon: "arrowsLeftRight",
  },
  {
    id: "security",
    name: { en: "Security", fr: "Sécurité" },
    description: {
      en: "Passwords, hashes and identifiers, generated locally.",
      fr: "Mots de passe, empreintes et identifiants, générés localement.",
    },
    icon: "shieldCheck",
  },
  {
    id: "business",
    name: { en: "Business", fr: "Entreprise" },
    description: {
      en: "Invoices, quotes and everyday business maths.",
      fr: "Factures, devis et calculs d'entreprise du quotidien.",
    },
    icon: "briefcase",
  },
  {
    id: "social",
    name: { en: "Social media", fr: "Réseaux sociaux" },
    description: {
      en: "Resize and preview images for each platform.",
      fr: "Redimensionnez et prévisualisez vos images pour chaque plateforme.",
    },
    icon: "shareNetwork",
  },
  {
    id: "media",
    name: { en: "Audio & video", fr: "Audio & vidéo" },
    description: {
      en: "Convert, trim and compress media files.",
      fr: "Convertir, découper et compresser des fichiers média.",
    },
    icon: "filmStrip",
  },
  {
    id: "ai",
    name: { en: "AI", fr: "IA" },
    description: {
      en: "Image and text tools powered by models.",
      fr: "Outils d'image et de texte propulsés par des modèles.",
    },
    icon: "sparkle",
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function isCategoryId(value: string): value is CategoryId {
  return (categoryIds as readonly string[]).includes(value);
}
