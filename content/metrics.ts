import type { I18nText } from "@/lib/i18n";

/**
 * RÈGLE ABSOLUE (guide.md) : ne jamais inventer de chiffre.
 * Chaque métrique ci-dessous porte sa source. Une métrique sans source
 * vérifiable n'a pas sa place ici — mieux vaut une case vide qu'un chiffre faux.
 */

/** Première expérience professionnelle : Orelex Tech, 2019 (CV). */
const CAREER_START = 2019;

export function yearsOfExperience(now = new Date()): number {
  return now.getFullYear() - CAREER_START;
}

export type Metric = { value: string; label: I18nText };

export const heroMetrics: Metric[] = [
  {
    // Source : CV — Orelex Tech à partir de 2019.
    value: `${yearsOfExperience()}+`,
    label: { en: "Years of experience", fr: "Ans d'expérience" },
  },
  {
    // Source : Jeffrey, qui déclare plus de 15 projets livrés — au-delà des 10
    // documentés dans content/projects.ts, qui ne recensent que ceux dont il a
    // fourni les détails. Le « + » traduit ce plancher, il n'arrondit rien.
    value: "15+",
    label: { en: "Projects delivered", fr: "Projets livrés" },
  },
  {
    // Source : vérification HTTP du 2026-09-06 — 8 des 10 répondent 200.
    value: "8",
    label: { en: "Live in production", fr: "En production" },
  },
];

/**
 * EN ATTENTE DE CONFIRMATION — ne pas afficher tant que ce n'est pas tranché.
 * Jeffrey a indiqué « une base de 2 - 5 » sans préciser la grandeur mesurée
 * (taille d'équipe encadrée ? nombre de projets simultanés ?).
 * Dès que la réponse est connue : compléter puis référencer dans heroMetrics
 * ou dans la section Expérience.
 */
export const pendingMetrics = {
  teamSize: { range: "2-5", confirmed: false },
} as const;
