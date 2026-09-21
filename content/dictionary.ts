import type { I18nText } from "@/lib/i18n";

const d = (en: string, fr: string): I18nText => ({ en, fr });

export const nav = {
  home: d("Home", "Accueil"),
  about: d("About", "À propos"),
  experience: d("Experience", "Parcours"),
  projects: d("Projects", "Projets"),
  skills: d("Skills", "Compétences"),
  tools: d("Tools", "Outils"),
  writing: d("Writing", "Écrits"),
  contact: d("Contact", "Contact"),
  cv: d("CV", "CV"),
  menu: d("Menu", "Menu"),
  close: d("Close", "Fermer"),
  skipToContent: d("Skip to content", "Aller au contenu"),
  letsTalk: d("Let's talk", "Parlons-en"),
  language: d("Language", "Langue"),
};

export const ui = {
  viewMyWork: d("View my work", "Voir mes projets"),
  downloadCv: d("Download my CV", "Télécharger mon CV"),
  contactMe: d("Contact me", "Me contacter"),
  readMore: d("Read more", "Lire la suite"),
  viewProject: d("View project", "Voir le projet"),
  visitSite: d("Visit site", "Visiter le site"),
  allProjects: d("All projects", "Tous les projets"),
  available: d("Available for projects", "Disponible pour des projets"),
  availableDetail: d(
    "Share a few details about what you are building and I will come back with a clear direction.",
    "Décrivez brièvement ce que vous construisez et je reviendrai vers vous avec une direction claire.",
  ),
  offline: d("Offline", "Hors ligne"),
  present: d("Present", "Aujourd'hui"),
  role: d("Role", "Rôle"),
  period: d("Period", "Période"),
  stack: d("Stack", "Stack"),
  theProblem: d("The problem", "Le problème"),
  theSolution: d("The solution", "La solution"),
  keyDecisions: d("Technical decisions", "Décisions techniques"),
  outcome: d("Outcome", "Résultat"),
  education: d("Education", "Formation"),
  languagesSpoken: d("Languages", "Langues"),
  backToProjects: d("Back to projects", "Retour aux projets"),
  backToWriting: d("Back to writing", "Retour aux écrits"),
  minRead: d("min read", "min de lecture"),
  noArticlesYet: d(
    "The first articles are being written. They will appear here — and in the RSS feed.",
    "Les premiers articles sont en cours d'écriture. Ils apparaîtront ici — et dans le flux RSS.",
  ),
  notFoundTitle: d("This page does not exist", "Cette page n'existe pas"),
  notFoundBody: d(
    "The link may be outdated, or the page may have moved.",
    "Le lien est peut-être obsolète, ou la page a été déplacée.",
  ),
  backHome: d("Back to home", "Retour à l'accueil"),
};

export const sections = {
  approach: {
    badge: d("Approach", "Approche"),
    title: d("How I build", "Ma façon de construire"),
    description: d(
      "Three convictions that shape every system I ship.",
      "Trois convictions qui façonnent chaque système que je livre.",
    ),
  },
  projects: {
    badge: d("Selected work", "Projets sélectionnés"),
    title: d("Systems running in production", "Des systèmes en production"),
    description: d(
      "Every project below was built, deployed and — in most cases — is still maintained by me.",
      "Chaque projet ci-dessous a été construit, déployé et, pour la plupart, est toujours maintenu par mes soins.",
    ),
  },
  experience: {
    badge: d("Experience", "Parcours"),
    title: d("Where I have worked", "Où j'ai travaillé"),
    description: d(
      "Six roles since 2019, several of them overlapping. Each one states its nature so the timeline reads honestly.",
      "Six rôles depuis 2019, dont plusieurs simultanés. Chacun précise sa nature pour que la chronologie se lise honnêtement.",
    ),
  },
  process: {
    badge: d("Process", "Processus"),
    title: d("From problem to production", "Du problème à la production"),
    description: d(
      "The same six steps, whether the deliverable is an API, a mobile app or a full ecosystem.",
      "Les mêmes six étapes, que le livrable soit une API, une application mobile ou un écosystème complet.",
    ),
  },
  skills: {
    badge: d("Expertise", "Expertise"),
    title: d("What I work with", "Ce avec quoi je travaille"),
    description: d(
      "Technologies I have shipped production code in — not a list of everything I have read about.",
      "Des technologies avec lesquelles j'ai livré du code en production — pas une liste de tout ce dont j'ai entendu parler.",
    ),
  },
  faq: {
    badge: d("FAQ", "FAQ"),
    title: d("Questions I am often asked", "Les questions qu'on me pose"),
    description: d("Availability, ways of working, and what I do best.", "Disponibilité, modalités de travail et points forts."),
  },
  whyMe: {
    badge: d("Why choose me", "Pourquoi moi"),
    title: d("Engineering built to last", "Une ingénierie faite pour durer"),
    description: d(
      "Architecture, delivery and hosting handled by the same person — which is why the systems I ship are still running.",
      "Architecture, livraison et hébergement assurés par la même personne — c'est pourquoi les systèmes que je livre tournent encore.",
    ),
  },
  contact: {
    badge: d("Contact", "Contact"),
    title: d("Let's build something reliable", "Construisons quelque chose de fiable"),
    description: d(
      "Tell me about the system you need. I read every message.",
      "Parlez-moi du système dont vous avez besoin. Je lis chaque message.",
    ),
  },
  writing: {
    badge: d("Writing", "Écrits"),
    title: d("Engineering notes", "Notes d'ingénierie"),
    description: d(
      "What I learn building backends, mobile apps and the infrastructure under them.",
      "Ce que j'apprends en construisant des backends, des applications mobiles et l'infrastructure qui les porte.",
    ),
  },
};

/** Trois piliers de la section Benefits (design.md §6.1 #3). */
export const pillars = [
  {
    id: "backend",
    title: d("Backend that holds", "Un backend qui tient"),
    description: d(
      "One API contract, one place for business rules, and a data model designed before the first line of code.",
      "Un contrat d'API unique, un seul endroit pour les règles métier, et un modèle de données conçu avant la première ligne de code.",
    ),
  },
  {
    id: "mobile",
    title: d("Mobile that ships", "Du mobile qui sort"),
    description: d(
      "Android and iOS from a single Flutter codebase, connected to the same backend as the web.",
      "Android et iOS depuis une seule base de code Flutter, connectés au même backend que le web.",
    ),
  },
  {
    id: "devops",
    title: d("Delivery I own", "Une livraison que j'assume"),
    description: d(
      "I deploy on servers I provision and maintain, so shipping does not depend on someone else's calendar.",
      "Je déploie sur des serveurs que je provisionne et maintiens, pour que livrer ne dépende pas du calendrier d'un tiers.",
    ),
  },
];

/**
 * Mosaïque « Pourquoi moi » (design.md §6.1 #5).
 *
 * Le template affichait « +3K clients », « 92 % de satisfaction » et une note
 * de « 4,9 / 5 ». Aucun de ces chiffres n'existe ici : guide.md interdit
 * d'inventer des métriques comme de fabriquer des avis. Chaque valeur ci-dessous
 * est traçable — CV, projets recensés, ou vérification en ligne du 2026-09-06.
 */
export const whyMeCards = {
  stack: {
    label: d("technologies in production", "technologies en production"),
    // Source : content/tech-logos.ts, toutes utilisées sur des projets livrés.
    value: "10",
  },
  roles: {
    text: d(
      "The domain is modelled before the first line of code — a habit kept from a management-computing degree.",
      "Le domaine est modélisé avant la première ligne de code — une habitude héritée d'une formation en informatique de gestion.",
    ),
    // Source : CV, six expériences depuis 2019.
    value: "6",
    label: d("roles since 2019", "postes depuis 2019"),
  },
  ecosystems: {
    text: d(
      "Backend, mobile and web tied together by a single API contract, so business rules live in one place.",
      "Backend, mobile et web reliés par un seul contrat d'API, pour que les règles métier n'existent qu'à un endroit.",
    ),
    // Source : Colisgo, AfreeLink et Saveurs du Monde — cf. content/projects.ts.
    value: "3",
    label: d("complete ecosystems shipped", "écosystèmes complets livrés"),
  },
  dark: {
    text: d(
      "I deploy on Nginx and Ubuntu servers I provision and maintain myself. Shipping never waits on someone else's calendar, and neither does fixing.",
      "Je déploie sur des serveurs Nginx et Ubuntu que je provisionne et maintiens moi-même. Livrer ne dépend du calendrier de personne, corriger non plus.",
    ),
    // Source : CV — major de promotion (Licence Pro) et vice-major national (BTS).
    value: "2",
    label: d("distinctions at ISTAG", "distinctions à l'ISTAG"),
  },
};

/** Six étapes de la timeline Process (design.md §5.8 / §6.1 #7). */
export const processSteps = [
  { icon: "framing", title: d("Framing", "Cadrage"), description: d("Understanding the real problem before proposing a system.", "Comprendre le vrai problème avant de proposer un système.") },
  { icon: "modelling", title: d("Modelling", "Modélisation"), description: d("Data model and domain rules, drawn before any code exists.", "Modèle de données et règles du domaine, dessinés avant tout code.") },
  { icon: "architecture", title: d("Architecture", "Architecture"), description: d("Deciding what is shared, what is separated, and why.", "Décider ce qui est partagé, ce qui est séparé, et pourquoi.") },
  { icon: "build", title: d("Build", "Développement"), description: d("Implementation, one working slice at a time.", "Implémentation, une tranche fonctionnelle à la fois.") },
  { icon: "deploy", title: d("Deploy", "Déploiement"), description: d("Provisioning, deployment and the monitoring that follows.", "Provisionnement, déploiement et surveillance qui suit.") },
  { icon: "maintain", title: d("Maintain", "Maintenance"), description: d("Staying responsible for the system after launch.", "Rester responsable du système après le lancement.") },
] as const;

/** FAQ — réponses factuelles uniquement. */
export const faq = [
  {
    q: d("Are you available for new projects?", "Êtes-vous disponible pour de nouveaux projets ?"),
    a: d(
      "Yes. I am part-time at Colisgo and co-founder of AfreeLink, which leaves room for freelance work — as it did for the NumRise projects delivered in 2025 and 2026.",
      "Oui. Je suis à temps partiel chez Colisgo et co-fondateur d'AfreeLink, ce qui laisse de la place pour des missions freelance — comme pour les projets NumRise livrés en 2025 et 2026.",
    ),
  },
  {
    q: d("Where are you based, and do you work remotely?", "Où êtes-vous basé, et travaillez-vous à distance ?"),
    a: d(
      "I am based in Yaoundé, Cameroon, and I work remotely. Patrimony Life Financial was delivered for the Canadian market from here.",
      "Je suis basé à Yaoundé, au Cameroun, et je travaille à distance. Patrimony Life Financial a été livré pour le marché canadien depuis ici.",
    ),
  },
  {
    q: d("What kind of work fits you best?", "Quel type de mission vous correspond le mieux ?"),
    a: d(
      "Backend architecture and the systems around it: APIs serving several clients at once, mobile applications connected to them, and the deployment that follows.",
      "L'architecture backend et les systèmes qui l'entourent : des API desservant plusieurs clients à la fois, des applications mobiles qui s'y connectent, et le déploiement qui suit.",
    ),
  },
  {
    q: d("Do you handle hosting and deployment?", "Gérez-vous l'hébergement et le déploiement ?"),
    a: d(
      "Yes. Several of the projects I deliver run on Nginx and Ubuntu servers that I provision and maintain myself.",
      "Oui. Plusieurs des projets que je livre tournent sur des serveurs Nginx et Ubuntu que je provisionne et maintiens moi-même.",
    ),
  },
  {
    q: d("Which languages do you work in?", "Dans quelles langues travaillez-vous ?"),
    a: d(
      "French and English, both fluently.",
      "En français et en anglais, couramment dans les deux.",
    ),
  },
];
