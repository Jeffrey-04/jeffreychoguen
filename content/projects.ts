import type { I18nList, I18nText } from "@/lib/i18n";

export type ProjectCategory = "backend" | "mobile" | "web" | "devops";

export type Project = {
  slug: string;
  name: string;
  /** Statut vérifié le 2026-09-06 par requête HTTP. */
  status: "live" | "offline";
  featured: boolean;
  categories: ProjectCategory[];
  period: string;
  role: I18nText;
  context: I18nText;
  problem: I18nText;
  solution: I18nText;
  decisions: I18nList;
  outcome: I18nText;
  stack: string[];
  links: { label: string; href: string }[];
  /**
   * Chemin de base de la capture, SANS extension : le composant choisit AVIF
   * ou WebP selon le navigateur. Absent = repli typographique sur le nom.
   */
  image?: string;
};

export const categoryLabels: Record<ProjectCategory, I18nText> = {
  backend: { en: "Backend", fr: "Backend" },
  mobile: { en: "Mobile", fr: "Mobile" },
  web: { en: "Web", fr: "Web" },
  devops: { en: "DevOps", fr: "DevOps" },
};

export const projects: Project[] = [
  {
    slug: "colisgo",
    image: "/assets/projects/colisgo",
    name: "Colisgo",
    status: "live",
    featured: true,
    categories: ["backend", "mobile", "devops"],
    period: "2025 —",
    role: { en: "Lead Backend Developer", fr: "Lead Backend Developer" },
    context: {
      en: "A parcel-delivery ecosystem serving three distinct surfaces from a single backend.",
      fr: "Un écosystème de livraison de colis desservant trois surfaces distinctes depuis un seul backend.",
    },
    problem: {
      en: "Three clients — an Android and iOS mobile app, a public web platform and an administration dashboard — each needed the same data and the same business rules, without duplicating logic three times over.",
      fr: "Trois clients — une application mobile Android et iOS, une plateforme web publique et un tableau de bord d'administration — avaient besoin des mêmes données et des mêmes règles métier, sans tripler la logique.",
    },
    solution: {
      en: "I designed a single backend exposing one API contract consumed by every client, and I deployed and now operate the server that hosts it.",
      fr: "J'ai conçu un backend unique exposant un contrat d'API unique consommé par tous les clients, et j'ai déployé puis exploité le serveur qui l'héberge.",
    },
    decisions: {
      en: [
        "One API contract shared by all three clients, so business rules live in exactly one place.",
        "Backend responsibility separated from the delivery surfaces, letting mobile and web evolve independently.",
        "Hosting managed in-house rather than delegated, keeping deployment and incident response under direct control.",
      ],
      fr: [
        "Un contrat d'API unique partagé par les trois clients, pour que les règles métier n'existent qu'à un seul endroit.",
        "Séparation de la responsabilité backend et des surfaces de livraison, permettant au mobile et au web d'évoluer indépendamment.",
        "Hébergement géré en interne plutôt que délégué, gardant le déploiement et la réponse aux incidents sous contrôle direct.",
      ],
    },
    outcome: {
      en: "The ecosystem runs in production at colisgo.ca.",
      fr: "L'écosystème est en production sur colisgo.ca.",
    },
    stack: ["Node.js", "Express.js", "MongoDB", "Next.js", "Flutter", "Docker", "Linux"],
    links: [{ label: "colisgo.ca", href: "https://colisgo.ca" }],
  },
  {
    slug: "afreelink",
    image: "/assets/projects/afreelink",
    name: "AfreeLink",
    status: "live",
    featured: true,
    categories: ["backend", "web", "devops"],
    period: "2023 —",
    role: { en: "CTO & Co-founder", fr: "CTO & Co-fondateur" },
    context: {
      en: "A pan-African freelance platform connecting clients with independent professionals.",
      fr: "Une plateforme freelance panafricaine mettant en relation des clients et des indépendants.",
    },
    problem: {
      en: "Building a two-sided marketplace from nothing, as the technical half of a founding team — with no existing platform, infrastructure or codebase to build on.",
      fr: "Construire une place de marché biface à partir de rien, en tant que moitié technique d'une équipe fondatrice — sans plateforme, infrastructure ni base de code existante.",
    },
    solution: {
      en: "I modelled the domain, designed the architecture, implemented the ecosystem and put it into production across two surfaces: a public marketing site and the application itself.",
      fr: "J'ai modélisé le domaine, conçu l'architecture, réalisé l'écosystème et l'ai mis en production sur deux surfaces : un site public et l'application elle-même.",
    },
    decisions: {
      en: [
        "Public site and application split into two deployments, so marketing changes never risk the product.",
        "Self-hosted on Nginx / Ubuntu, which keeps infrastructure costs predictable for an early-stage startup.",
        "Domain modelled before any code was written — an approach carried over from formal UML and MERISE training.",
      ],
      fr: [
        "Site public et application séparés en deux déploiements, pour qu'une évolution marketing ne mette jamais le produit en risque.",
        "Auto-hébergement sur Nginx / Ubuntu, qui garde des coûts d'infrastructure prévisibles pour une startup à ses débuts.",
        "Domaine modélisé avant toute ligne de code — une approche héritée d'une formation formelle en UML et MERISE.",
      ],
    },
    outcome: {
      en: "Both surfaces are live and maintained: afreelink.tech and app.afreelink.tech.",
      fr: "Les deux surfaces sont en ligne et maintenues : afreelink.tech et app.afreelink.tech.",
    },
    stack: ["Node.js", "React", "Vite", "MongoDB", "Nginx", "Ubuntu"],
    links: [
      { label: "afreelink.tech", href: "https://afreelink.tech" },
      { label: "app.afreelink.tech", href: "https://app.afreelink.tech" },
    ],
  },
  {
    slug: "mundi-complex",
    image: "/assets/projects/mundi-complex",
    name: "Complexe MUNDI",
    status: "live",
    featured: true,
    categories: ["web"],
    period: "2025 — 2026",
    role: { en: "Full Stack Developer (freelance, NumRise)", fr: "Développeur Full Stack (freelance, NumRise)" },
    context: {
      en: "A hotel, sport and seminar venue in Yaoundé needing a credible online presence.",
      fr: "Un complexe hôtelier, sportif et de séminaires à Yaoundé ayant besoin d'une présence en ligne crédible.",
    },
    problem: {
      en: "A venue with three distinct activities — accommodation, sport and events — had to present all of them without the site becoming a directory.",
      fr: "Un établissement aux trois activités distinctes — hébergement, sport et événementiel — devait toutes les présenter sans que le site devienne un annuaire.",
    },
    solution: {
      en: "A Next.js site organised around the three activities, each with its own entry point into the same booking intent.",
      fr: "Un site Next.js organisé autour des trois activités, chacune disposant de sa propre porte d'entrée vers la même intention de réservation.",
    },
    decisions: {
      en: [
        "Next.js chosen for server-rendered pages, so the venue is properly indexed by search engines.",
        "Deployed on the Nginx / Ubuntu infrastructure I already operate.",
      ],
      fr: [
        "Next.js retenu pour des pages rendues côté serveur, afin que l'établissement soit correctement indexé par les moteurs de recherche.",
        "Déployé sur l'infrastructure Nginx / Ubuntu que j'exploite déjà.",
      ],
    },
    outcome: { en: "Live at mundicomplex.com.", fr: "En ligne sur mundicomplex.com." },
    stack: ["Next.js", "React", "Nginx", "Ubuntu"],
    links: [{ label: "mundicomplex.com", href: "https://mundicomplex.com" }],
  },
  {
    slug: "andylix",
    name: "Andylix",
    status: "live",
    featured: false,
    categories: ["web"],
    period: "2025 — 2026",
    role: { en: "Full Stack Developer (freelance, NumRise)", fr: "Développeur Full Stack (freelance, NumRise)" },
    context: {
      en: "A platform connecting craftspeople with the clients who need them.",
      fr: "Une plateforme de mise en relation entre artisans et clients.",
    },
    problem: {
      en: "Matching two audiences with opposite needs — craftspeople looking for work, clients looking for a trade — inside one interface.",
      fr: "Faire se rencontrer deux publics aux besoins opposés — des artisans en recherche de travail, des clients en recherche d'un métier — dans une seule interface.",
    },
    solution: {
      en: "A Vite application with two clearly separated entry paths converging on a single search and contact flow.",
      fr: "Une application Vite avec deux parcours d'entrée clairement séparés convergeant vers un seul flux de recherche et de contact.",
    },
    decisions: {
      en: [
        "Vite for a fast client-side application where interaction matters more than indexing.",
        "Bootstrap as the component base, to reach production quickly on a client budget.",
      ],
      fr: [
        "Vite pour une application client rapide où l'interaction prime sur l'indexation.",
        "Bootstrap comme base de composants, pour atteindre la production rapidement sur un budget client.",
      ],
    },
    outcome: { en: "Live at andylix.com.", fr: "En ligne sur andylix.com." },
    stack: ["Vite", "React", "Bootstrap", "Nginx"],
    links: [{ label: "andylix.com", href: "https://andylix.com" }],
  },
  {
    slug: "patrimony-life",
    image: "/assets/projects/patrimony-life",
    name: "Patrimony Life Financial",
    status: "live",
    featured: false,
    categories: ["web"],
    period: "2025 — 2026",
    role: { en: "Full Stack Developer (freelance, NumRise)", fr: "Développeur Full Stack (freelance, NumRise)" },
    context: {
      en: "A life-insurance brand addressing the Canadian market.",
      fr: "Une marque d'assurance vie s'adressant au marché canadien.",
    },
    problem: {
      en: "Life insurance is a low-trust, high-consideration purchase: the site had to make a complex product feel simple and legitimate.",
      fr: "L'assurance vie est un achat à faible confiance et forte considération : le site devait rendre un produit complexe simple et légitime.",
    },
    solution: {
      en: "A Next.js site built around clarity — plain wording, short paths to contact, and a restrained visual system.",
      fr: "Un site Next.js construit autour de la clarté — formulations simples, chemins courts vers le contact et système visuel sobre.",
    },
    decisions: {
      en: [
        "Next.js for indexable, fast-loading pages on an international market.",
        "Content structured around questions a buyer actually asks, rather than around insurance products.",
      ],
      fr: [
        "Next.js pour des pages indexables et rapides sur un marché international.",
        "Contenu structuré autour des questions que se pose réellement un acheteur, plutôt qu'autour des produits d'assurance.",
      ],
    },
    outcome: { en: "Live at patrimonylife.ca.", fr: "En ligne sur patrimonylife.ca." },
    stack: ["Next.js", "React"],
    links: [{ label: "patrimonylife.ca", href: "https://patrimonylife.ca" }],
  },
  {
    slug: "saveurs-du-monde",
    image: "/assets/projects/saveurs-du-monde",
    name: "Saveurs du Monde",
    status: "live",
    featured: true,
    categories: ["web", "backend"],
    period: "2024 — 2026",
    role: {
      en: "IT Specialist / Web & Desktop Developer",
      fr: "Informaticien / Développeur Web et Desktop",
    },
    context: {
      en: "A food company and its festival, with no technical team of its own.",
      fr: "Une entreprise agroalimentaire et son festival, sans équipe technique interne.",
    },
    problem: {
      en: "The company needed a web presence, working management software and a maintained IT estate — with one person covering all three.",
      fr: "L'entreprise avait besoin d'une présence web, de logiciels de gestion fonctionnels et d'un parc informatique entretenu — avec une seule personne pour couvrir les trois.",
    },
    solution: {
      en: "I built the sites on WordPress so non-technical staff could edit them, wrote the desktop point-of-sale software, and ran the equipment and systems.",
      fr: "J'ai construit les sites sous WordPress pour que des non-techniciens puissent les éditer, développé le logiciel de caisse desktop, et administré équipements et systèmes.",
    },
    decisions: {
      en: [
        "WordPress deliberately chosen over a custom build: the team had to keep the sites alive without me.",
        "Point-of-sale built as a desktop application, matching how the shop actually works — offline-first, on the counter.",
      ],
      fr: [
        "WordPress délibérément retenu plutôt qu'un développement sur mesure : l'équipe devait pouvoir faire vivre les sites sans moi.",
        "Caisse développée en application desktop, au plus près du fonctionnement réel de la boutique — hors-ligne d'abord, sur le comptoir.",
      ],
    },
    outcome: {
      en: "saveursdumonde.cm and saveursducameroun.com are live.",
      fr: "saveursdumonde.cm et saveursducameroun.com sont en ligne.",
    },
    stack: ["WordPress", "PHP", "C#", "MySQL"],
    links: [
      { label: "saveursdumonde.cm", href: "https://saveursdumonde.cm" },
      { label: "saveursducameroun.com", href: "https://saveursducameroun.com" },
    ],
  },
  {
    slug: "crespac",
    name: "CRESPAC",
    status: "offline",
    featured: false,
    categories: ["web"],
    period: "2024 — 2026",
    role: {
      en: "IT Specialist / Web Developer",
      fr: "Informaticien / Développeur Web",
    },
    context: {
      en: "An institutional site and its festival sub-site, delivered for a client of Saveurs du Monde.",
      fr: "Un site institutionnel et le sous-site de son festival, livrés pour un client de Saveurs du Monde.",
    },
    problem: {
      en: "An organisation and its annual festival needed separate identities without maintaining two independent systems.",
      fr: "Une organisation et son festival annuel avaient besoin d'identités distinctes sans maintenir deux systèmes indépendants.",
    },
    solution: {
      en: "A main site with the festival on its own subdomain, sharing one publishing workflow.",
      fr: "Un site principal avec le festival sur son propre sous-domaine, partageant un seul flux de publication.",
    },
    decisions: {
      en: ["Festival isolated on a subdomain so its seasonal traffic never affects the main site."],
      fr: ["Festival isolé sur un sous-domaine pour que son trafic saisonnier n'affecte jamais le site principal."],
    },
    outcome: {
      en: "Both sites were delivered and ran in production. They are offline today because the client did not renew the domains — they are listed here for completeness, not as live references.",
      fr: "Les deux sites ont été livrés et exploités en production. Ils sont hors ligne aujourd'hui, le client n'ayant pas renouvelé les domaines — ils figurent ici par souci d'exhaustivité, non comme références consultables.",
    },
    stack: ["WordPress", "PHP", "MySQL"],
    links: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const liveProjects = projects.filter((p) => p.status === "live");
