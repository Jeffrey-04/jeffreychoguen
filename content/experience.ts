import type { I18nList, I18nText } from "@/lib/i18n";

export type EngagementType =
  | "co-founder"
  | "part-time"
  | "full-time"
  | "freelance"
  | "employee";

export type Experience = {
  slug: string;
  company: string;
  role: I18nText;
  /** Nature de l'engagement — obligatoire : quatre postes se chevauchent en 2025. */
  engagement: EngagementType;
  start: string;
  end: string | null;
  summary: I18nText;
  highlights: I18nList;
  stack: string[];
  links?: { label: string; href: string }[];
};

export const engagementLabels: Record<EngagementType, I18nText> = {
  "co-founder": { en: "Co-founder", fr: "Co-fondateur" },
  "part-time": { en: "Part-time", fr: "Temps partiel" },
  "full-time": { en: "Full-time", fr: "Temps plein" },
  freelance: { en: "Freelance", fr: "Freelance" },
  employee: { en: "Employee", fr: "Salarié" },
};

/** Ordre antéchronologique — le plus récent d'abord. */
export const experiences: Experience[] = [
  {
    slug: "colisgo",
    company: "Colisgo",
    role: { en: "Lead Backend Developer", fr: "Lead Backend Developer" },
    engagement: "part-time",
    start: "2025",
    end: null,
    summary: {
      en: "I designed and built the entire backend architecture of the Colisgo ecosystem — mobile apps for Android and iOS, the web platform and the administration dashboard — and I run the hosting server it all depends on.",
      fr: "J'ai conçu et mis en place toute l'architecture backend de l'écosystème Colisgo — applications mobiles Android et iOS, plateforme web et tableau de bord d'administration — et j'administre le serveur d'hébergement dont l'ensemble dépend.",
    },
    highlights: {
      en: [
        "Designed the backend architecture serving three clients at once: mobile (Android/iOS), web and admin dashboard.",
        "Deployed and maintained the hosting server, from provisioning to day-to-day operations.",
        "Defined the API contract shared by every client of the ecosystem.",
      ],
      fr: [
        "Conception de l'architecture backend desservant trois clients simultanés : mobile (Android/iOS), web et tableau de bord d'administration.",
        "Déploiement et maintenance du serveur d'hébergement, du provisionnement à l'exploitation quotidienne.",
        "Définition du contrat d'API partagé par tous les clients de l'écosystème.",
      ],
    },
    stack: ["Node.js", "Express.js", "MongoDB", "Next.js", "Flutter", "Docker", "Linux"],
    links: [{ label: "colisgo.ca", href: "https://colisgo.ca" }],
  },
  {
    slug: "afreelink",
    company: "AfreeLink",
    role: { en: "CTO & Co-founder", fr: "CTO & Co-fondateur" },
    engagement: "co-founder",
    start: "2023",
    end: null,
    summary: {
      en: "Co-founder and technical lead of AfreeLink, a pan-African freelance platform. I took the product from modelling to production: architecture, implementation and deployment of the public site and the application.",
      fr: "Co-fondateur et responsable technique d'AfreeLink, plateforme freelance panafricaine. J'ai porté le produit de la modélisation à la production : architecture, réalisation et déploiement du site public et de l'application.",
    },
    highlights: {
      en: [
        "Full technical ownership: modelling, architecture, implementation and delivery of the ecosystem.",
        "Shipped and operate two production surfaces — the public site and the web application.",
        "Self-hosted infrastructure on Nginx / Ubuntu that I provision and maintain.",
      ],
      fr: [
        "Responsabilité technique complète : modélisation, architecture, réalisation et livraison de l'écosystème.",
        "Mise en production et exploitation de deux surfaces : le site public et l'application web.",
        "Infrastructure auto-hébergée sur Nginx / Ubuntu, provisionnée et maintenue par mes soins.",
      ],
    },
    stack: ["Node.js", "Vite", "React", "MongoDB", "Nginx", "Ubuntu"],
    links: [
      { label: "afreelink.tech", href: "https://afreelink.tech" },
      { label: "app.afreelink.tech", href: "https://app.afreelink.tech" },
    ],
  },
  {
    slug: "numrise",
    company: "NumRise",
    role: { en: "Full Stack Developer", fr: "Développeur Full Stack" },
    engagement: "freelance",
    start: "2025",
    end: "2026",
    summary: {
      en: "Freelance delivery of three production client projects, from build to deployment.",
      fr: "Livraison en freelance de trois projets clients en production, du développement au déploiement.",
    },
    highlights: {
      en: [
        "Delivered Complexe MUNDI — hotel, sport and seminar venue in Yaoundé.",
        "Delivered Andylix — a platform connecting craftspeople with clients.",
        "Delivered Patrimony Life Financial — a life-insurance site for the Canadian market.",
      ],
      fr: [
        "Livraison de Complexe MUNDI — hôtel, sport et séminaires à Yaoundé.",
        "Livraison d'Andylix — plateforme de mise en relation entre artisans et clients.",
        "Livraison de Patrimony Life Financial — site d'assurance vie pour le marché canadien.",
      ],
    },
    stack: ["Next.js", "React", "Vite", "Node.js", "Bootstrap"],
    links: [
      { label: "mundicomplex.com", href: "https://mundicomplex.com" },
      { label: "andylix.com", href: "https://andylix.com" },
      { label: "patrimonylife.ca", href: "https://patrimonylife.ca" },
    ],
  },
  {
    slug: "saveurs-du-monde",
    company: "Saveurs du Monde",
    role: {
      en: "IT Specialist / Web & Desktop Developer",
      fr: "Informaticien / Développeur Web et Desktop",
    },
    engagement: "full-time",
    start: "2024",
    end: "2026",
    summary: {
      en: "Sole technical resource of the company: I built its websites, developed the desktop management software, and ran the entire IT estate.",
      fr: "Seule ressource technique de l'entreprise : j'ai construit ses sites web, développé les logiciels de gestion desktop et administré l'ensemble du parc informatique.",
    },
    highlights: {
      en: [
        "Built and maintained the company websites, including saveursdumonde.cm and saveursducameroun.com.",
        "Developed desktop management applications, notably the point-of-sale system.",
        "Ran the full IT estate: equipment, systems and day-to-day maintenance.",
        "Managed the Facebook and Instagram presence of the company and its festival.",
      ],
      fr: [
        "Création et maintenance des sites de l'entreprise, dont saveursdumonde.cm et saveursducameroun.com.",
        "Développement d'applications de gestion desktop, notamment le système de caisse.",
        "Administration complète du parc informatique : équipements, systèmes et maintenance quotidienne.",
        "Gestion des pages Facebook et Instagram de l'entreprise et de son festival.",
      ],
    },
    stack: ["WordPress", "PHP", "C#", "MySQL", "Meta Business Suite"],
    links: [
      { label: "saveursdumonde.cm", href: "https://saveursdumonde.cm" },
      { label: "saveursducameroun.com", href: "https://saveursducameroun.com" },
    ],
  },
  {
    slug: "oneclick",
    company: "OneClick — Académie du Digital",
    role: { en: "IT Specialist / Trainer", fr: "Informaticien / Formateur" },
    engagement: "employee",
    start: "2022",
    end: "2024",
    summary: {
      en: "Ran the organisation's IT unit and taught office automation and programming.",
      fr: "Gestion de la cellule informatique de la structure et formation en bureautique et en programmation.",
    },
    highlights: {
      en: [
        "Managed and maintained the whole IT unit of the organisation.",
        "Taught programming — HTML, PHP, C# — and office automation.",
      ],
      fr: [
        "Gestion et maintenance de l'ensemble de la cellule informatique de la structure.",
        "Formation en programmation — HTML, PHP, C# — et en secrétariat bureautique.",
      ],
    },
    stack: ["HTML", "PHP", "C#"],
  },
  {
    slug: "orelex-tech",
    company: "Orelex Tech",
    role: { en: "Junior Web Developer", fr: "Développeur Web Junior" },
    engagement: "employee",
    start: "2019",
    end: "2022",
    summary: {
      en: "Where it started: writing modules inside larger applications and testing my colleagues' code.",
      fr: "Le point de départ : développement de modules au sein d'applications plus larges et tests du code de mes collègues.",
    },
    highlights: {
      en: [
        "Wrote modules for the company's larger applications.",
        "Ran integration tests on modules written by colleagues.",
        "Kept the company's equipment operational.",
      ],
      fr: [
        "Développement de modules d'applications plus larges pour le compte de l'entreprise.",
        "Tests d'intégration sur des modules codés par des collègues.",
        "Maintien en condition opérationnelle des équipements de l'entreprise.",
      ],
    },
    stack: ["JavaScript", "PHP", "MySQL"],
  },
];

export type Education = {
  school: string;
  degree: I18nText;
  distinction?: I18nText;
  start: string;
  end: string;
};

export const education: Education[] = [
  {
    school: "ISTAG",
    degree: {
      en: "Professional Bachelor's in Management Computing",
      fr: "Licence Professionnelle en Informatique de Gestion",
    },
    distinction: { en: "Top of the class", fr: "Major de promotion" },
    start: "2021",
    end: "2023",
  },
  {
    school: "ISTAG",
    degree: {
      en: "Higher Technician's Certificate — Information Systems Management",
      fr: "BTS en Gestion des Systèmes d'Information",
    },
    distinction: { en: "Second nationally", fr: "Vice-major national" },
    start: "2021",
    end: "2022",
  },
  {
    school: "AMASIA Bilingual High School",
    degree: { en: "GCE A'Level — Science", fr: "GCE A'Level — Série scientifique" },
    start: "2016",
    end: "2018",
  },
  {
    school: "Croix-Rouge Cameroun",
    degree: { en: "First-aid certificate", fr: "Brevet de secouriste" },
    start: "2019",
    end: "2020",
  },
];
