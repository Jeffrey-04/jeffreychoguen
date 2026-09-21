import type { I18nText } from "@/lib/i18n";
import type { IconName } from "@/content/phosphor-icons";

export type SkillGroup = {
  id: string;
  title: I18nText;
  description: I18nText;
  items: string[];
  /** Icône affichée dans la pastille en relief de la carte. */
  icon: IconName;
  /** Une seule carte sombre par grille (design.md §5.3). */
  featured?: boolean;
};

/**
 * Source : rubrique « Compétences clés » du CV, complétée par les technologies
 * effectivement observées en production sur les projets livrés (Next.js sur
 * colisgo.ca, mundicomplex.com et patrimonylife.ca ; Vite sur afreelink.tech
 * et andylix.com ; Nginx/Ubuntu auto-administrés).
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    title: { en: "Backend", fr: "Backend" },
    icon: "skillBackend",
    description: {
      en: "Where I do my deepest work: API design, data modelling and the rules that hold a product together.",
      fr: "Là où mon travail est le plus abouti : conception d'API, modélisation des données et règles qui tiennent un produit ensemble.",
    },
    items: ["Node.js", "Express.js", "REST APIs", "PHP", "MongoDB", "MySQL", "SQLite"],
    featured: true,
  },
  {
    id: "frontend",
    title: { en: "Frontend", fr: "Frontend" },
    icon: "skillFrontend",
    description: {
      en: "Interfaces built to be indexed, fast and maintainable by the people who own them.",
      fr: "Des interfaces conçues pour être indexées, rapides et maintenables par ceux à qui elles appartiennent.",
    },
    items: ["React", "Next.js", "TypeScript", "Vite", "HTML5", "CSS", "Tailwind CSS", "Bootstrap", "Material UI"],
  },
  {
    id: "mobile",
    title: { en: "Mobile", fr: "Mobile" },
    icon: "skillMobile",
    description: {
      en: "Cross-platform applications shipped to both Android and iOS from one codebase.",
      fr: "Des applications cross-platform livrées sur Android et iOS depuis une seule base de code.",
    },
    items: ["Flutter", "Dart", "React Native"],
  },
  {
    id: "devops",
    title: { en: "Infrastructure & DevOps", fr: "Infrastructure & DevOps" },
    icon: "skillDevops",
    description: {
      en: "I deploy and operate the servers my applications run on, rather than handing that off.",
      fr: "Je déploie et exploite les serveurs sur lesquels tournent mes applications, plutôt que de déléguer.",
    },
    items: ["Nginx", "Ubuntu", "Docker", "Linux", "CI/CD", "GitHub", "Firebase", "Supabase"],
  },
  {
    id: "engineering",
    title: { en: "Engineering practice", fr: "Pratique d'ingénierie" },
    icon: "skillPractice",
    description: {
      en: "Formal modelling before code — a habit from a management-computing degree, kept because it works.",
      fr: "Modélisation formelle avant le code — une habitude issue d'une formation en informatique de gestion, conservée parce qu'elle fonctionne.",
    },
    items: ["UML", "MERISE", "OOP", "PowerAMC", "DbMain", "StarUML"],
  },
  {
    id: "languages",
    title: { en: "Languages", fr: "Langages" },
    icon: "skillLanguages",
    description: {
      en: "The languages I have shipped production code in.",
      fr: "Les langages avec lesquels j'ai livré du code en production.",
    },
    items: ["JavaScript", "TypeScript", "Dart", "PHP", "C#", "Java", "Visual Basic"],
  },
];

export const additionalKnowledge: { title: I18nText; items: string[] } = {
  title: { en: "Additional knowledge", fr: "Connaissances complémentaires" },
  items: ["LLM integration", "MOODLE", "Meta Business Suite", "Canva", "Cristal Reports", "Android Studio"],
};
