# GUIDE.md — Site personnel de Jeffrey Choguen

## Vision

Créer un site personnel premium positionnant **Jeffrey Choguen** comme **Full Stack Software Engineer / Backend Developer / Mobile Developer**, avec deux objectifs : convaincre recruteurs et clients, et devenir progressivement le hub SEO autour du nom « Jeffrey Choguen ».

Le site doit relier CV, projets, expertise, GitHub, LinkedIn et contenu technique.

## Positionnement

Identité principale : **Jeffrey Choguen**

Titre recommandé :
> Full Stack Software Engineer · Backend Developer · Mobile Developer

Expertises à mettre en avant :
- Node.js / Backend
- React / Next.js
- Flutter
- Architecture logicielle
- Docker / CI-CD
- Firebase / Supabase
- Technical Leadership / CTO

Éviter les listes interminables de technologies : privilégier les compétences démontrées par les projets.

## Stack recommandée

- React + TypeScript
- Vite ou Next.js
- Tailwind CSS
- Framer Motion avec parcimonie
- Markdown/MDX pour le blog
- Cloudflare Pages, Vercel ou Netlify
- Domaine : `jeffreychoguen.cloud`

## Architecture

```text
/
├── /about
├── /experience
├── /projects
│   ├── /colisgo
│   ├── /afreelink
│   └── /saveurs-du-monde
├── /skills
├── /writing
│   └── /articles/[slug]
├── /contact
├── /cv
├── /sitemap.xml
├── /robots.txt
└── /rss.xml
```

## Home

Hero très clair :

**Jeffrey Choguen**

**Full Stack Software Engineer**

> I design and build web, mobile and backend systems that turn ideas into reliable digital products.

CTA :
- View my work
- Download my CV
- Contact me

Liens GitHub et LinkedIn visibles sans surcharger le hero.

## About

Présenter parcours, formation, philosophie de développement, domaines d'expertise, langues et une timeline :

**Junior Developer → Full Stack Developer → Lead Backend Developer → CTO**

## Experience

Présenter notamment :
- Colisgo — Lead Backend Developer
- AfreeLink — CTO
- Saveurs du Monde — Informaticien / Développeur Web et Desktop
- NumRise — Full Stack Developer
- Orelex Tech OneClick — Web Developer Junior
- Informaticien / Formateur

Pour chaque expérience : rôle, responsabilités, stack, impact et résultats.

Ajouter uniquement des métriques vérifiables : utilisateurs, projets, taille d'équipe, performance, temps gagné, etc. **Ne jamais inventer de chiffres.**

## Projects

Chaque projet doit comporter :
- nom
- rôle
- période
- problème
- solution
- technologies
- architecture
- décisions techniques
- résultats
- captures
- liens publics

Priorité : Colisgo, AfreeLink, Saveurs du Monde, projets NumRise.

Ne jamais publier secrets, clés API, données utilisateurs ou architecture confidentielle.

## Skills

Organiser les compétences :

### Core
JavaScript/TypeScript, Node.js, React, Flutter, MongoDB, MySQL, Docker.

### Frontend
React, Next.js, Vite, HTML5, CSS, Tailwind, Bootstrap, Material UI.

### Backend
Node.js, Express, PHP, REST APIs, Firebase, Supabase.

### Mobile
Flutter, Dart, React Native.

### Data
MongoDB, MySQL, SQLite.

### DevOps
Docker, CI/CD, Linux, GitHub.

Les technologies secondaires peuvent être placées dans « Additional knowledge ».

## Blog / Writing

Le blog est un moteur SEO majeur. Chaque article doit répondre à une vraie question et contenir :
- titre
- description
- date
- auteur
- catégorie
- tags
- temps de lecture
- image Open Graph
- liens internes
- CTA vers un projet ou le contact

Premiers sujets :
1. How I designed a scalable Node.js backend
2. Building a production-ready Flutter application
3. Docker for developers: what I learned
4. React vs Flutter for product development
5. Designing REST APIs with Node.js
6. What I learned building a startup ecosystem
7. Backend architecture lessons from Colisgo
8. Technical lessons from building AfreeLink

## SEO personnel

Mot-clé principal : `Jeffrey Choguen`

Variantes naturelles :
- Jeffrey Choguen developer
- Jeffrey Choguen software engineer
- Jeffrey Choguen Cameroon
- Jeffrey Choguen backend developer
- Jeffrey Choguen Flutter
- Jeffrey Choguen Node.js

Ne pas faire de keyword stuffing.

## SEO On-Page

Chaque page doit avoir :
- `<title>` unique
- meta description
- canonical
- Open Graph
- Twitter/X card
- structure H1/H2/H3 logique
- URLs propres
- liens internes
- images optimisées
- alt text descriptif

Exemple :

```html
<title>Jeffrey Choguen — Full Stack Software Engineer</title>
<meta name="description" content="Jeffrey Choguen is a Full Stack Software Engineer specializing in backend, web and mobile applications." />
```

## Structured Data

Ajouter Schema.org `Person` avec `name`, `url`, `image`, `jobTitle`, `sameAs`, `knowsAbout` et `worksFor` lorsque pertinent.

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jeffrey Choguen",
  "url": "https://jeffreychoguen.cloud",
  "jobTitle": "Full Stack Software Engineer",
  "sameAs": [
    "https://github.com/Jeffrey-04",
    "https://www.linkedin.com/in/jeffrey-choguen-8222a1255/"
  ]
}
```

Vérifier les URLs avant production.

## Indexation

Créer :
- `/sitemap.xml`
- `/robots.txt`
- RSS/Atom feed

Le robots.txt doit référencer le sitemap.

Soumettre le sitemap à Google Search Console et Bing Webmaster Tools.

Bing recommande notamment XML sitemaps, liens internes crawlables et IndexNow pour la découverte et la fraîcheur des URLs. citeturn0search18

## Outils gratuits pour maintenir le trafic

Le but n'est **pas** de fabriquer du trafic artificiel. Le système doit produire du trafic légitime grâce au contenu, à l'indexation et à la distribution.

### Google Search Console
À utiliser pour :
- requêtes
- impressions
- clics
- indexation
- erreurs
- opportunités de mots-clés

### Bing Webmaster Tools
À configurer pour :
- sitemap
- inspection des URLs
- Site Scan
- suivi SEO
- IndexNow

Bing fournit des outils et rapports pour améliorer la visibilité et permet de soumettre des sitemaps. citeturn0search3turn0search6

### Cloudflare Web Analytics
Utiliser pour :
- pages vues
- visiteurs
- pays
- URLs
- sources
- performance

Cloudflare présente Web Analytics comme gratuit et orienté confidentialité ; il fonctionne avec un petit beacon JavaScript et ne collecte pas les données personnelles des visiteurs. citeturn0search0turn0search1

### RSS
Chaque nouvel article doit être automatiquement disponible dans le feed RSS afin de permettre sa découverte par des lecteurs et agrégateurs.

### GitHub
Optimiser le README du profil :
- présentation
- stack
- projets
- portfolio
- LinkedIn
- articles

Chaque repository important doit avoir un README propre, captures, architecture et instructions.

### LinkedIn
Transformer chaque article en publication native :
```text
Problem
What I built
What I learned
Technical details
Link to article
```

Ne pas publier uniquement un lien.

### Newsletter
Ajouter :
> Get my latest engineering notes.

Utiliser un service disposant d'un niveau gratuit adapté au volume. Ne jamais acheter de listes d'emails.

## Boucle de trafic

```text
Article
  ↓
Google / Bing
  ↓
Visitor
  ↓
Project / Case Study
  ↓
GitHub / LinkedIn
  ↓
New visitor
  ↓
New article
```

Chaque article doit renvoyer vers une compétence, un projet et au moins un autre article.

## Automatisation

Lorsqu'un article est publié :

```text
New article
  ↓
RSS
  ↓
Search engines
  ↓
IndexNow
  ↓
LinkedIn post
  ↓
GitHub / portfolio
  ↓
Newsletter
```

Automatiser progressivement avec GitHub Actions.

Éviter tout système de spam ou de publication massive sans contrôle humain.

## SEO local

Utiliser naturellement des expressions comme :
- Software Engineer in Cameroon
- Full Stack Developer in Cameroon
- Backend Developer in Yaoundé
- Cameroon Software Engineer

Ne pas créer des dizaines de pages géographiques artificielles.

## Design

Direction : **Premium / Engineering / Editorial**

Éviter :
- template générique
- gradients excessifs
- animations permanentes
- trop de cartes
- barres de progression artificielles

Préférer :
- typographie forte
- espaces généreux
- grille claire
- micro-interactions
- screenshots
- architecture diagrams
- chiffres vérifiables

Palette :
- noir / blanc
- bleu nuit principal
- orange comme accent discret

Prévoir Light Mode + Dark Mode.

## Performance

Objectifs :
- excellent chargement mobile
- WebP/AVIF
- lazy loading
- fonts optimisées
- JavaScript limité
- animations légères
- Core Web Vitals surveillés

## Accessibilité

- HTML sémantique
- contraste correct
- navigation clavier
- alt text
- focus visible
- formulaires labellisés
- boutons accessibles

## Contact

Inclure :
- email professionnel
- LinkedIn
- GitHub
- formulaire

Prévoir validation, anti-spam, confirmation et protection contre l'injection.

## Tracking

Événements utiles :
- CV téléchargé
- clic GitHub
- clic LinkedIn
- clic projet
- formulaire envoyé
- inscription newsletter
- lecture article

Respecter les obligations de confidentialité applicables.

## Monitoring

Prévoir :
- uptime monitoring gratuit
- surveillance erreurs
- monitoring sitemap
- Search Console
- suivi performance

## Sécurité

Obligatoire :
- HTTPS
- headers de sécurité
- CSP lorsque possible
- validation serveur
- rate limiting
- protection du formulaire
- secrets dans variables d'environnement
- aucune clé secrète dans GitHub

## À ne jamais faire

- acheter du trafic
- acheter des backlinks douteux
- utiliser des bots
- générer des milliers de pages SEO sans valeur
- keyword stuffing
- spammer Reddit/LinkedIn
- créer de faux profils
- publier automatiquement du contenu IA non vérifié
- cacher du texte
- fabriquer des témoignages

Principe : **autorité réelle > hacks SEO.**

## Dashboard SEO

Suivre chaque mois :

| KPI | Objectif |
|---|---|
| Organic traffic | croissance |
| Search impressions | croissance |
| CTR | amélioration |
| Branded searches | croissance |
| Indexed pages | croissance contrôlée |
| GitHub clicks | croissance |
| CV downloads | croissance |
| Contact conversions | croissance |
| Newsletter subscribers | croissance |

Le KPI final n'est pas seulement le trafic :

**Traffic → crédibilité → opportunité.**

## Roadmap

### Phase 1 — Foundation
- Home
- About
- Experience
- Projects
- Contact
- CV
- responsive
- dark/light
- SEO technique

### Phase 2 — Authority
- études de cas
- GitHub optimisé
- LinkedIn optimisé
- Schema.org
- sitemap
- robots
- Search Console
- Bing Webmaster Tools
- Analytics

### Phase 3 — Content engine
- blog MDX
- RSS
- 2 articles/mois
- newsletter
- automatisation GitHub Actions

### Phase 4 — Authority externe
- open source
- guest posts
- conférences
- podcasts
- interviews
- collaborations

## Definition of Done

### UX
- [ ] Responsive
- [ ] Light/dark
- [ ] Navigation claire
- [ ] Animations fluides
- [ ] Accessibilité correcte

### Contenu
- [ ] About
- [ ] Experience
- [ ] Projects
- [ ] Skills
- [ ] Writing
- [ ] Contact
- [ ] CV

### SEO
- [ ] Titles
- [ ] Meta descriptions
- [ ] Canonicals
- [ ] Open Graph
- [ ] Schema Person
- [ ] Sitemap
- [ ] robots.txt
- [ ] RSS
- [ ] Search Console
- [ ] Bing Webmaster Tools
- [ ] IndexNow

### Performance
- [ ] Images optimisées
- [ ] Fonts optimisées
- [ ] JavaScript réduit
- [ ] Core Web Vitals vérifiés

### Autorité
- [ ] GitHub relié
- [ ] LinkedIn relié
- [ ] projets documentés
- [ ] premier article publié

## Vision finale

```text
                 Google / Bing
                      │
                      ▼
                Jeffrey Choguen
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    Portfolio      LinkedIn       GitHub
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                   Projects
                      │
                      ▼
                    Blog
                      │
                      ▼
                New visitors
                      │
                      ▼
                   Leads
```

Le site doit progressivement devenir **la source principale de vérité sur Jeffrey Choguen sur le Web**.
