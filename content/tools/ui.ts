import type { I18nText } from "@/lib/i18n";

const d = (en: string, fr: string): I18nText => ({ en, fr });

/**
 * Libellés de la suite d'outils (tools.md).
 *
 * Volontairement SÉPARÉ de content/dictionary.ts : ce dernier est importé par
 * la navigation, un composant client, donc tout ce qu'il contient part dans le
 * bundle de chaque page du site. Ces chaînes ne doivent être chargées que par
 * les pages /tools.
 */
export const toolsUi = {
  navLabel: d("Tools", "Outils"),
  heroBadge: d("Tools", "Outils"),
  heroTitle: d("Free tools that just work", "Des outils gratuits qui fonctionnent"),
  heroDescription: d(
    "Convert, compress, generate and clean files straight from your browser. No account, no upload, no waiting.",
    "Convertissez, compressez, générez et nettoyez vos fichiers directement depuis votre navigateur. Sans compte, sans envoi, sans attente.",
  ),
  searchPlaceholder: d("Search tools…", "Rechercher un outil…"),
  searchEmpty: d("No tool matches that yet.", "Aucun outil ne correspond pour l'instant."),
  popular: d("Popular", "Populaires"),
  allCategories: d("All categories", "Toutes les catégories"),
  comingSoon: d("Coming soon", "Bientôt"),
  available: d("Available", "Disponible"),
  toolsCount: d("tools", "outils"),
  categoryMetaFilled: d(
    "{n} free tools that run in your browser — no account, no upload.",
    "{n} outils gratuits qui tournent dans votre navigateur — sans compte, sans envoi.",
  ),
  categoryMetaEmpty: d(
    "This category is being built. Browse the tools already available meanwhile.",
    "Cette catégorie est en construction. Parcourez en attendant les outils déjà disponibles.",
  ),
  howItWorks: d("How it works", "Comment ça marche"),
  faqTitle: d("Questions", "Questions"),
  relatedTitle: d("Related tools", "Outils liés"),
  backToTools: d("All tools", "Tous les outils"),
  // Formulé pour couvrir aussi bien un fichier qu'un texte saisi : tous les
  // outils ne manipulent pas des fichiers.
  privacyLocal: d("Runs locally — nothing leaves your device.", "Traitement local — rien ne quitte votre appareil."),
  privacyExternal: d(
    "Processed by an external service — your data is sent off your device.",
    "Traité par un service externe — vos données quittent votre appareil.",
  ),
  plannedNotice: d(
    "This tool is catalogued but not built yet. It will appear here once it actually works.",
    "Cet outil est catalogué mais pas encore construit. Il apparaîtra ici quand il fonctionnera réellement.",
  ),
  copy: d("Copy", "Copier"),
  copied: d("Copied", "Copié"),
  reset: d("Reset", "Réinitialiser"),
  generate: d("Generate", "Générer"),
};
