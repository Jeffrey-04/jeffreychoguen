# DESIGN.md — Spécification de design du site jeffreychoguen.cloud

**Source du design :** projet Framer *Sevora Framer Template copy* (`F0gTYVzKongFvo0e8nvL`).
**Statut :** spécification extraite du projet Framer (tokens, géométrie, animations, assets réels). Aucune valeur inventée — tout ce qui suit est lu depuis le projet.
**Rôle de ce document :** contrat de design. Le code doit s'y conformer. `guide.md` reste la source de vérité pour le **contenu**, le **SEO** et la **stratégie** ; `design.md` prend le dessus sur la section « Design » de `guide.md`.

> ⚠️ Conflit résolu : `guide.md` proposait une palette « bleu nuit + orange » et un mode clair/sombre. Le design Framer est **monochrome gris/noir + accent vert**, en **mode clair uniquement**. Décision : on suit Framer.

---

## 1. Références locales

> **Dossier non versionné.** `design/framer-reference/` reste en local et
> n'est pas poussé : ses portraits et avatars représentent des personnes réelles
> et appartiennent au template Sevora (cf. §8, Licences). Le publier dans un
> dépôt public reviendrait à les redistribuer. Un clone frais ne l'aura donc
> pas ; `npm run assets` ignore proprement une source absente, et les sorties
> déjà générées sont versionnées dans `public/assets/`.

| Dossier | Contenu |
|---|---|
| `design/framer-reference/screens/` | 24 captures des sections/pages du projet Framer (rendu desktop) |
| `design/framer-reference/assets/` | 15 assets binaires extraits du projet Framer |

Captures disponibles : `02-hero`, `03-benefits`, `04-projects`, `05-whychoose`, `06-services`, `07-process`, `08-features`, `09-testimonials`, `10-pricing`, `11-faqs`, `about-01-hero` → `about-06-cta`, `projects-main`, `articles-main`, `contact-main`, `lt-nav`, `lt-prev` (footer), `lt-desktop`.

---

## 2. Design tokens

### 2.1 Couleurs

Tokens exacts du projet Framer. Un seul thème (clair) — aucun token `dark` n'est défini.

| Token | Valeur | Hex | Usage |
|---|---|---|---|
| `gray-50` | `rgb(247, 247, 248)` | `#F7F7F8` | Fond de page global |
| `gray-100` | `rgb(237, 238, 241)` | `#EDEEF1` | Lignes du motif de fond, fonds secondaires, bouton secondaire |
| `gray-200` | `rgb(224, 226, 230)` | `#E0E2E6` | Bordure de carte (1px), bouton inverse |
| `gray-300` | `rgb(201, 205, 210)` | `#C9CDD2` | Fin de dégradé hero, bordure bouton secondaire |
| `gray-400` | `rgb(148, 151, 158)` | `#94979E` | Texte tertiaire, numéros décoratifs |
| `gray-500` | `rgb(97, 100, 107)` | `#61646B` | Texte atténué |
| `gray-600` | `rgb(68, 69, 76)` | `#44454C` | **Couleur de texte courant (body)** |
| `gray-700` | `rgb(36, 36, 42)` | `#24242A` | Haut du dégradé des boutons primaires |
| `gray-800` | `rgb(27, 27, 33)` | `#1B1B21` | Surfaces sombres secondaires |
| `gray-900` | `rgb(18, 18, 24)` | `#121218` | **Couleur des titres**, cartes sombres, bouton primaire |
| `white` | `rgb(255, 255, 255)` | `#FFFFFF` | Fond des cartes |
| `accent-200` | `rgb(216, 248, 157)` | `#D8F89D` | Accent clair (halo de disponibilité) |
| `accent-500` | `rgb(131, 202, 22)` | `#83CA16` | **Accent** — pastille « disponible », états actifs |

Alphas définis dans le projet (à conserver tels quels) :
`white/0`, `white/20%`, `white/30%`, `white/60%`, `gray-900/5%`, `gray-900/20%`, `gray-900/30%`, `gray-900/50%`, `gray-100/0`, `gray-300/0`, `gray-900/0`.

Implémentation Tailwind v4 (`@theme`) :

```css
@theme {
  --color-gray-50:  #F7F7F8;
  --color-gray-100: #EDEEF1;
  --color-gray-200: #E0E2E6;
  --color-gray-300: #C9CDD2;
  --color-gray-400: #94979E;
  --color-gray-500: #61646B;
  --color-gray-600: #44454C;
  --color-gray-700: #24242A;
  --color-gray-800: #1B1B21;
  --color-gray-900: #121218;
  --color-accent-200: #D8F89D;
  --color-accent-500: #83CA16;
}
```

### 2.2 Typographie

Deux familles seulement.

| Famille | Rôle | Poids utilisés |
|---|---|---|
| **Lora** (serif) | Titres éditoriaux `h1` / `h2` | 500, 600 |
| **Instrument Sans** (sans-serif) | Tout le reste : `h3`–`h6`, corps, UI, boutons | 400, 500, 600 |

Les deux sont sur Google Fonts → charger via `next/font/google` avec `display: swap` et subset `latin` (+ `latin-ext` pour les accents FR).

`Chakra Petch` et `Inter` sont référencées dans le projet mais **non utilisées** dans les styles de texte → ne pas les charger.

**Presets de texte** (valeurs exactes) :

| Preset | Famille | Poids | Taille | Interligne | Letter-spacing | Balise | Couleur |
|---|---|---|---|---|---|---|---|
| `Heading 4xl \| medium` | Lora | 500 | 72 / 64 / 48 px | 72 / 64 / 48 px | −0.02em | `h1` | gray-900 |
| `Heading 4xl` | Lora | 600 | 56px | 64px | −0.02em | `h1` | gray-900 |
| `Heading 3xl` | Lora | 600 | 36px | 48px | −0.02em | `h2` | gray-900 |
| `Heading 2xl` | Instrument Sans | 600 | 24px | 32px | −0.02em | `h3` | gray-900 |
| `Heading 2xl \| medium` | Instrument Sans | 500 | 24px | 32px | −0.02em | `h3` | gray-900 |
| `Heading xl` | Instrument Sans | 500 | 20px | 30px | −0.04em | `h4` | gray-900 |
| `Heading lg` | Instrument Sans | 500 | 18px | 28px | −0.02em | `h5` | gray-900 |
| `Heading md` | Instrument Sans | 500 | 16px | 24px | −0.02em | `h6` | gray-900 |
| `Heading sm` | Instrument Sans | 500 | 14px | 20px | −0.01em | `h6` | gray-900 |
| `Body lg` | Instrument Sans | 400 | 18px | 28px | −0.02em | — | gray-600 |
| `Body md` / `Paragraph md` | Instrument Sans | 400 | 16px | 24px | −0.02em | — | gray-600 |
| `Body sm` / `Paragraph sm` | Instrument Sans | 400 | 14px | 20px | 0 / −0.01em | — | gray-600 |
| `Body xs` | Instrument Sans | 400 | 12px | 16px | −0.02em | — | gray-600 |

Les variantes `Paragraph *` sont identiques aux `Body *` **plus** `text-wrap: balance`. Les variantes `| Balanced` ajoutent la même chose aux titres.

Le `h1` est le seul preset **responsive** : 48px (< 810px) → 64px (≥ 810px) → 72px (≥ 1200px), interligne = taille (ratio 1.0).

Fonctionnalités OpenType actives sur tous les textes : `blwf`, `cv03`, `cv04`, `cv09`, `cv11` → en CSS : `font-feature-settings: "cv03" 1, "cv04" 1, "cv09" 1, "cv11" 1;` (le `blwf` ne concerne pas le latin, ignorable).

### 2.3 Rayons

| Jeton | Valeur | Usage |
|---|---|---|
| `radius-sm` | `8px` | Boutons, petits contrôles |
| `radius-md` | `12px` | Champs de formulaire |
| `radius-lg` | `16px` | **Cartes** (standard du template) |
| `radius-xl` | `32px` | Bloc hero, grands conteneurs |
| `radius-full` | `999px` | Badges, pastilles, barres de progression |

### 2.4 Bordures et ombres

- Bordure standard de carte : `1px solid #E0E2E6` (gray-200).
- Bordure sur fond sombre : `1px solid rgba(255,255,255,0.2)` ou `0.3`.
- Le template n'utilise **pas** de `box-shadow` porté sur les cartes — la séparation se fait par la bordure 1px sur fond gris. Les cartes sombres reposent sur un dégradé/texture interne.
- Ombre autorisée uniquement sur les éléments flottants (carte « disponible » du hero, cartes empilées de la section Outils) : ombre douce très diffuse, faible opacité.

### 2.5 Espacement

Échelle 4px. Valeurs réellement utilisées : `4, 6, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 96, 192`.

---

## 3. Grille et layout

| Élément | Valeur |
|---|---|
| Largeur max du conteneur | **1200px** |
| Padding horizontal du conteneur | **24px** |
| Padding vertical de section (standard) | **96px** haut / **96px** bas |
| Padding vertical hero | **56px** haut / **48px** bas |
| Gap entre le header de section et son contenu | **64px** |
| Gap interne du header de section | **12px** (badge+titre ↔ description : 8px) |
| Largeur max d'un header de section centré | **560px** |
| Gap entre cartes d'une grille | **16px** |
| Gap entre sections | **24px** |

### 3.1 Breakpoints

Exactement ceux du projet Framer :

| Nom | Media query |
|---|---|
| Desktop | `(min-width: 1200px)` |
| Tablet | `(min-width: 810px) and (max-width: 1199.98px)` |
| Phone | `(max-width: 809.98px)` |

En Tailwind : redéfinir les breakpoints pour coller à Framer.

```css
@theme {
  --breakpoint-md: 810px;
  --breakpoint-lg: 1200px;
}
```

Règles de dégradation :
- Grilles 3 colonnes → 2 colonnes (tablet) → 1 colonne (phone).
- Blocs deux colonnes (texte / visuel) → empilés verticalement, visuel en second.
- Hero : padding interne `96px` → `48px` (tablet) → `32px 24px` (phone) ; portrait passe en dessous ou est rogné.

---

## 4. Fond de page

Trois couches superposées, définies dans le *layout template* « Main » :

1. **Couleur de base** : `gray-50` `#F7F7F8`.
2. **Motif de lignes** (composant `LinePattern`) — `position: absolute`, plein écran, `z-index: 0`, `pointer-events: none`, `user-select: none` :
   - couleur des lignes : `gray-100` `#EDEEF1`
   - épaisseur : `1px`
   - espacement : `4px`
   - rotation : `145°`
3. **Grain** (composant de bruit) — `position: absolute`, intensité `15`.

Implémentation recommandée sans dépendance JS :

```css
.bg-hatch {
  background-color: #F7F7F8;
  background-image: repeating-linear-gradient(
    145deg,
    #EDEEF1 0 1px,
    transparent 1px 4px
  );
}
```

Le grain : un SVG `feTurbulence` inline en `background-image` répété, opacité ~0.15, ou un PNG de bruit 128×128 en `repeat`. Doit rester sous `pointer-events: none` et derrière tout le contenu.

Le contenu du site est au-dessus (`z-index: 10` pour la navigation).

---

## 5. Composants

### 5.1 Bouton

4 variantes, toutes en `inline-flex`, `align-items: center`, `border-radius: 8px`, label en `Heading md` (ou `Heading sm` en taille `sm`), icône optionnelle 20×24px à droite.

| Variante | Fond | Bordure | Couleur du label | Padding | Gap |
|---|---|---|---|---|---|
| **Primary md** | `linear-gradient(180deg, #24242A 0%, #121218 100%)` | `1px solid #121218` | `#FFFFFF` | `12px 22px` | `12px` |
| **Primary sm** | idem | idem | `#FFFFFF` | `8px 16px` | `6px` |
| **Secondary md** | `#EDEEF1` | `1px solid #C9CDD2` | `#121218` | `12px 22px` | `12px` |
| **Inverse md** | `#E0E2E6` | `1px solid #E0E2E6` | `#121218` | `8px 20px` | `6px` |

Le template affiche au survol un **GIF de texture** (`IHneqoBbdHUCED6FYR137ZUxEqI.gif`, 500×500, 2.5 Mo) en fond du bouton primaire. **Décision : ne pas reproduire ce GIF** — 2.5 Mo par bouton est incompatible avec les objectifs Core Web Vitals de `guide.md`. Remplacement : un halo animé en CSS pur (dégradé radial clair qui balaye le bouton en 600ms au survol), même intention visuelle, coût nul.

États : `hover` → légère montée du dégradé ; `focus-visible` → anneau 2px `#121218` avec `outline-offset: 2px` (obligatoire, cf. §9).

### 5.2 Badge (pastille de section)

- `border-radius: 999px`
- `padding: 6px 16px`
- `border: 1px solid #E0E2E6`
- fond : blanc
- label : `Heading sm` (14/20, poids 500), couleur `gray-900`
- icône optionnelle 16×16 avant et/ou après le label, gap `6px`

Utilisé en tête de chaque section : « Benefits », « Selected work », « Process », « Expertise », « Testimonials », « Pricing », « About me », « My approach », « Principles », « Tools », « My story », « Contact », « Journal », « Projects ».

### 5.3 Carte

**Carte claire (standard)**
- fond `#FFFFFF`, bordure `1px solid #E0E2E6`, rayon `16px`
- zone visuelle en haut : hauteur fixe `258px`, largeur `100%`
- zone contenu : `padding: 32px`, `gap: 8px`
- titre `Heading 2xl` (24/32), description `Body md` (16/24, gray-600)

**Carte sombre (mise en avant)**
- fond `#121218`, texture fumée en overlay, rayon `16px`
- titre blanc, description `rgba(255,255,255,0.6)`
- utilisée pour exactement **une** carte par grille (accent visuel) — cf. `08-features` (« Speed »), `about-03-principles` (carte 02)

**Carte projet**
- visuelle pleine largeur, ratio ~4:3, rayon `16px`
- barre de pied blanche : titre à gauche (`Heading xl`), icône `arrow up right` à droite
- au survol : effet `HoverCardMove` (cf. §7.4)

**Carte article**
- visuel en haut (rayon 16px), méta `Body sm` gray-400 (`catégorie · X min read`), titre `Heading xl`

### 5.4 Navigation

- Barre sur toute la largeur, hauteur ~88px, `z-index: 10`, fond transparent sur le motif.
- Gauche : logo (icône 24px + wordmark `Heading xl` gray-900).
- Centre : liens `Home · About · Projects · Articles · Contact`, `Body md`, gray-600 → gray-900 au survol.
- Droite : bouton **Primary sm** « Let's talk » + icône `arrow up right`.
- Variante *flyout* (menu plein écran) sur tablet et phone, déclenchée par un bouton menu.
- Comportement au scroll : la nav est en `absolute` en haut de page puis une variante `fixed` prend le relais (transition `spring-physics 500 60 1`).

Adaptation FR/EN : ajouter un sélecteur de langue discret (FR / EN) à droite, avant le bouton CTA, en `Body sm` gray-500.

### 5.5 Pied de page

- Bloc blanc, rayon `32px`, marge sous le contenu, bordure `1px solid #E0E2E6`.
- Colonne 1 : logo + baseline (`Body md`, gray-600, max ~460px).
- Colonne 2 « Pages » : Home, About, Projects, Articles, Contact.
- Colonne 3 « Social » : GitHub, LinkedIn, X (adapter les libellés du template).
- Grand wordmark chromé en bas (SVG `fNNlYXrAGPgp4qHPRedQjrKpo9c.svg`, 615×203) → **à remplacer** par un wordmark « JEFFREY CHOGUEN » traité de la même façon (dégradé métallique) ou par une version typographique simple.
- Barre finale sombre (`#121218`, texte `Body sm` blanc 60%) : `© 2026 Jeffrey Choguen`.

### 5.6 Accordéon (FAQ)

- Item : carte blanche, rayon `16px`, bordure `1px solid #E0E2E6`, `padding: 20px 24px`.
- Question : `Heading lg` gray-900. Icône `+` à droite (rotation 45° à l'ouverture).
- Espacement entre items : `12px`.
- Ouverture : hauteur animée, `spring-duration 0.4s`, damping `0.2`.
- Accessibilité : `<button aria-expanded>` + région `role="region"` liée par `aria-labelledby`.

### 5.7 Onglets / filtres

- Ligne de pills. Actif : fond `#121218`, texte blanc, rayon `8px`, `padding: 10px 18px`.
- Inactif : transparent, texte gray-600.
- Utilisé sur `/projects` (All projects, AI, Business, One page, Portfolio, Online course) et `/articles` (All articles, Web design…).
- Adaptation : catégories de projets = `Backend`, `Mobile`, `Web`, `DevOps` ; catégories d'articles = `Backend`, `Mobile`, `DevOps`, `Architecture`.

### 5.8 Timeline verticale (Process)

- Colonne gauche : badge + titre `Heading 3xl` + description `Body md`.
- Colonne droite : liste d'étapes. Chaque étape = icône ronde 40px (fond blanc, bordure 1px) + titre `Heading xl` + description `Body md`.
- Un trait vertical `2px` relie les icônes, rayon `999px`, piste `gray-100`, remplissage `gray-900`.
- Le remplissage progresse selon le **scroll**, déclenché quand la carte atteint le **centre** du viewport (composant `CardCenterScrollProgress`, axe Y, trigger `Center`).
- L'étape active passe en carte blanche avec bordure ; les étapes non atteintes restent sans fond.

### 5.9 Marquee de logos

- Bande sous le hero, `overflow: hidden`, gap `64px`, logos en 24px de haut.
- Défilement horizontal continu, boucle infinie, vitesse lente.
- À adapter : logos des technologies (Node.js, React, Next.js, Flutter, Docker, MongoDB, Firebase) plutôt que des logos clients fictifs.
- Respecter `prefers-reduced-motion` → arrêter le défilement.

### 5.10 Formulaire de contact

Champs (cf. `contact-main`) : `Name`, `Email`, `Project type` (select), `Budget range` (select), `Message` (textarea).

- Label : `Body sm` gray-600, marge basse 8px.
- Champ : fond `#F7F7F8`, bordure `1px solid #E0E2E6`, rayon `12px`, `padding: 12px 16px`, texte `Body md`, placeholder gray-400.
- Textarea : hauteur min 120px, redimensionnable verticalement.
- Bouton : **Primary md** pleine largeur, libellé « Send message ».
- Carte d'informations à droite : fond `#121218`, rayon `16px`, texture fumée ; lignes Email / Location / Response time séparées par un filet `rgba(255,255,255,0.2)`, icône ronde 40px à gauche.
- Adaptation : `Project type` → `Backend`, `Mobile app`, `Web app`, `Consulting`, `Other`.
- Contraintes `guide.md` : validation côté serveur, anti-spam, message de confirmation, protection contre l'injection. Labels réellement associés (`<label for>`), erreurs annoncées via `aria-live`.

---

## 6. Catalogue des sections

Toutes les sections suivent la même enveloppe : `section > .container(max-width:1200px; padding:96px 24px)`.

### 6.1 Page d'accueil (`/`)

| # | Section | Anatomie | Devient (contenu Jeffrey) |
|---|---|---|---|
| 1 | **Hero** | Bloc rayon `32px`, `padding: 96px`, dégradé `linear-gradient(90deg, #EDEEF1 60%, #C9CDD2 100%)`, hauteur `800px`. Colonne texte 50% : `h1` Lora 72px (deuxième moitié du titre en gray-400), sous-titre `Body lg`, 2 boutons (Primary md + Secondary md), rangée de 3 stats (chiffre `Heading 4xl` Lora + label `Body sm`). Portrait 549×700 ancré en bas à droite, rayon `0 0 32px 0`. Carte flottante 360px en bas à droite (fond `white/20%`, bordure `white/30%`, rayon 16px, padding `28px 32px 32px`) avec bouton icône rond. | **Jeffrey Choguen — Full Stack Software Engineer.** Titre : « Building reliable *web, mobile and backend systems* ». CTA : `View my work` + `Download my CV`. Stats : uniquement des chiffres vérifiables (années d'expérience, projets livrés) — **laisser vides tant que non fournis**. Carte flottante : « Available for projects ». |
| 2 | **Marquee logos** | Bande de logos défilante, 24px de haut, gap 64px | Stack technique |
| 3 | **Benefits** | Header centré (badge + `h2` + description, max 560px) puis 3 cartes blanches, visuel 258px + contenu 32px | 3 piliers : *Backend solide*, *Mobile natif & cross-platform*, *Livraison & DevOps* |
| 4 | **Projects** | Header centré + grille 2 colonnes de cartes projet (visuel + barre de pied avec titre et flèche) | Colisgo, AfreeLink, Saveurs du Monde, NumRise |
| 5 | **Why choose me** | Header à 2 colonnes (badge + `h2` à gauche, description à droite). Mosaïque : colonne 1 = 2 cartes empilées (avatars + gros chiffre), colonne 2 = 2 cartes (texte + gros chiffre + pastille verte « Available »), colonne 3 = 1 grande carte sombre avec note en bas | Approche technique + métriques vérifiables uniquement |
| 6 | **Services** | Titre centré, puis 2 colonnes : liste d'items cliquables à gauche (l'actif devient une carte blanche avec icône), panneau visuel à droite dans un cadre rayon 16px bordure 1px | Services : *Backend & API*, *Applications mobiles*, *Web / Full Stack* |
| 7 | **Process** | Timeline verticale (§5.8) — 6 étapes | Cadrage → Architecture → Développement → Tests → Déploiement → Suivi |
| 8 | **Features / Expertise** | Header centré + grille irrégulière de 8 cartes (largeurs variables), une carte sombre en accent | Compétences par domaine (Core, Frontend, Backend, Mobile, Data, DevOps) |
| 9 | **Testimonials** | Header 2 colonnes + 3 colonnes de cartes : grande carte sombre à gauche (5 étoiles + citation + auteur), colonne centrale (carte claire + bandeau « Trusted by »), colonne droite (bouton sombre + carte claire) | **À laisser vide tant qu'aucun témoignage réel** — `guide.md` interdit les faux témoignages. Remplacer par des recommandations LinkedIn réelles ou supprimer la section en v1. |
| 10 | **Pricing** | Header centré + 2 cartes tarifaires (une claire, une sombre) : icône ronde 48px, titre, description, prix `Heading 4xl` Lora + devise, bouton pleine largeur, bloc « Added Features » avec 5 lignes à coche | Optionnel pour un portfolio de développeur. Si conservé : formules de prestation. Sinon supprimer et garder Process → Features → CTA. |
| 11 | **FAQs** | Header centré + accordéon 8 items, largeur max ~770px | Questions réelles : disponibilité, modalités de travail, stack, délais |
| 12 | **CTA final** | Bloc 2 colonnes rayon `32px` : à gauche fond `#EDEEF1` (badge, `h2` Lora, description, 2 boutons, filet, liste de tags) ; à droite carte sombre `#121218` (icône ronde flèche, titre, sous-titre, 3 lignes Email / Location / Response time) | Email pro, Yaoundé (Cameroun) / Remote, délai de réponse |

### 6.2 `/about`

| # | Section | Anatomie | Contenu |
|---|---|---|---|
| 1 | Hero | 2 colonnes : gauche = badge + `h1` Lora 2 lignes + `Body lg` + signature manuscrite ; droite = portrait rayon 16px avec objet en débord. Sous le bloc : 3 cartes de stats (icône ronde 40px + chiffre `Heading 2xl` + label + description) | Parcours, formation, philosophie |
| 2 | My approach | 2 colonnes : gauche = badge + `h2` + description + 3 étapes en mini-timeline ; droite = photo carrée rayon 16px | Philosophie de développement |
| 3 | Principles | Header centré + 4 cartes numérotées `01`–`04` (numéro `Heading 2xl` gray-400 en haut à droite, filet séparateur, titre, description), la carte `02` en sombre | 4 principes d'ingénierie |
| 4 | Tools | 2 colonnes : gauche = badge + `h2` + description + 3 lignes catégorie (icône carrée 40px + titre + liste + numéro gris) ; droite = cartes empilées en perspective avec logos | Stack : Design / Build / Ship |
| 5 | My story | 2 colonnes : gauche = photo rayon 16px + carte flottante sombre en bas (« Since 2016 ») ; droite = badge + `h2` + 3 paragraphes + signature + nom/rôle séparés par un filet vertical | Timeline Junior → Full Stack → Lead Backend → CTO |
| 6 | CTA | Identique au CTA final de l'accueil | — |

### 6.3 `/projects`

Header aligné à gauche (badge + `h1` Lora 2 lignes + description max ~420px), barre de filtres (§5.7), grille 2 colonnes de cartes projet, bouton « Load More » centré (variante Inverse md, rayon 999px).

### 6.4 `/articles`

Header aligné à gauche + filtres + **grille 3 colonnes** de cartes article, bouton « Load More ».

### 6.5 `/contact`

Header aligné à gauche (badge + `h1` + description) puis 2 colonnes : formulaire dans une carte claire (§5.10), carte sombre d'informations à droite.

### 6.6 Pages additionnelles requises par `guide.md` (absentes du template)

À construire avec les mêmes composants, sans inventer de nouveau langage visuel :

- **`/experience`** — réutiliser la timeline verticale du Process (§5.8), une entrée par poste (rôle, période, stack, responsabilités, impact).
- **`/skills`** — réutiliser la grille Features (§6.1 #8), un groupe par catégorie (Core, Frontend, Backend, Mobile, Data, DevOps, Additional knowledge).
- **`/projects/[slug]`** — page d'étude de cas : hero façon `/about` puis blocs alternés texte/visuel (problème, solution, architecture, décisions techniques, résultats) et captures en cartes rayon 16px.
- **`/writing/[slug]`** — article : `h1` Lora 56px, méta (date · catégorie · temps de lecture), contenu MDX en `Body lg` largeur max 720px, CTA de fin réutilisant le bloc CTA.
- **`/cv`** — page de téléchargement + aperçu, bouton Primary md.
- **`/404`** — présente dans le template, à reprendre.

---

## 7. Animations

Le système d'animation est très régulier : **855 effets** dans le projet se réduisent à un petit nombre de motifs.

### 7.1 Apparition au scroll (motif dominant)

Tous les effets d'apparition partagent :

- déclencheur : `onMount`, seuil `threshold: 0.5` (l'élément s'anime quand 50% est visible)
- état initial : `opacity: 0` + translation
- état final : `opacity: 1`, `translate: 0`
- transition : ressort — `spring-duration 0.4s`, `damping 0.2` (variante physique : `stiffness 400, damping 30, mass 1`)

Distances de translation observées : `y: 32, 48, 64, 112, 192` et `x: ±16, 24, 32, 64, 96, 128, 160, 192`.

**Cascade de délais dans une section** (valeurs réelles) :

| Élément | Délai |
|---|---|
| Navigation | `0s` |
| Titre / hero content | `0.1s` |
| Visuel principal | `0.2s` |
| Signature / élément secondaire | `0.3s` |
| Contenu | `0.4s` |
| Cartes | `0.5s` |
| Actions (boutons) | `0.6s` |
| Icônes | `0.8s` |
| Éléments décoratifs | `0.9s` |

Les logos du marquee entrent en cascade horizontale : `x: 64, 96, 128, 160, 192` avec le même ressort et délai `0s`.

Équivalent Framer Motion :

```ts
const enter = {
  hidden:  { opacity: 0, y: 64 },
  visible: { opacity: 1, y: 0 },
};
// viewport: { once: true, amount: 0.5 }
// transition: { type: "spring", duration: 0.4, bounce: 0.2, delay }
```

`duration: 0.4` + `bounce: 0.2` reproduit fidèlement `spring-duration 0.4s 0.2`.

### 7.2 Transition de page

Fondu à l'entrée : `opacity 0 → 1`, `tween`, courbe `cubic-bezier(0.27, 0, 0.51, 1)`, durée `0.2s`, délai `0s`. Appliqué à toutes les pages.

### 7.3 Navigation

Transition d'état (absolute → fixed au scroll) : ressort `stiffness 500, damping 60, mass 1`. Apparition initiale : fondu, `spring-duration 0.4s 0.2`, délai `0s`.

### 7.4 Survol de carte 3D (`HoverCardMove`)

Override réel du projet, à réimplémenter tel quel (hook React `useHoverCardMove`) :

- `onPointerEnter` : `transform: perspective(900px) scale(1.04)`, transition `140ms ease-out`, `will-change: transform`, `transform-style: preserve-3d`
- `onPointerMove` : position du pointeur normalisée sur le rectangle de l'élément, centrée sur `-1..1` :
  - translation : `±14px` max sur X et Y (proportionnelle)
  - inclinaison : `rotateX = -cy * 10deg`, `rotateY = cx * 10deg` (max `±10°`)
  - transition `40ms linear` pendant le mouvement
- `onPointerLeave` : retour à `perspective(900px) translate3d(0,0,0) rotateX(0) rotateY(0) scale(1)`, transition `180ms ease-out`

Paramètres par défaut : `maxTilt: 10`, `maxMove: 14`, `hoverScale: 1.04`, `perspective: 900`.
À désactiver sur appareils tactiles (`@media (hover: hover)`) et sous `prefers-reduced-motion`.

### 7.5 Barre de progression au scroll

Section Process : trait vertical `2px`, rayon `999px`, piste `gray-100`, remplissage `gray-900`, axe `Scroll Y`, déclencheur `Center` (progression calée sur le passage de la carte au centre du viewport), offsets `0`.

### 7.6 Défilement fluide

Le projet utilise un composant *Smooth Scroll*. **Décision : ne pas l'implémenter.** Le scroll natif est plus performant, accessible et prévisible ; un smooth-scroll JS pénalise l'INP et casse la navigation clavier. Conserver `scroll-behavior: smooth` uniquement pour les ancres.

### 7.7 Réduction de mouvement

Obligatoire (`guide.md` §Accessibilité) :

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Sous cette préférence : pas de translation d'apparition (opacité seule ou rien), marquee arrêté, `HoverCardMove` désactivé.

---

## 8. Assets

15 assets extraits dans `design/framer-reference/assets/`.

| Fichier | Dim. | Poids | Rôle dans le template | Statut pour le site Jeffrey |
|---|---|---|---|---|
| `3Wbfg1JRGAb4TRMMz69WlQMTe8.png` | 2244×1904 | 261 Ko | Portrait du hero d'accueil | 🔴 **À remplacer** — photo de Jeffrey, détourée, fond neutre |
| `xr7AByWMQArTJoUQ72juGc1wbI.jpg` | 2244×2244 | 424 Ko | Portrait du hero `/about` | 🔴 **À remplacer** |
| `bUHmg5LpBVLyB89LNwRKdlwCo.png` | 3200×4000 | 1.8 Mo | Photo « My story » (bureau) | 🔴 À remplacer (ou photo de poste de travail) |
| `WpPH5o5mJSJkqfaHofbVcED1fiE.png` | 930×611 | 37 Ko | Signature manuscrite | 🔴 **À remplacer** par la signature de Jeffrey |
| `fNNlYXrAGPgp4qHPRedQjrKpo9c.svg` | 615×203 | 2 Mo | Wordmark chromé « SEVORA » du footer | 🔴 À refaire (« JEFFREY CHOGUEN ») — **et à optimiser**, 2 Mo pour un SVG est excessif |
| `cgXwgj75ijDSBCwJjLkPHR8f8.png` | 512×152 | 2.6 Ko | Petit logo | 🔴 À remplacer par le logo JC |
| `7n35…`, `s45y…`, `S9Py…`, `nFTy…` `.jpg` | ~520² | 26–50 Ko | Avatars de témoignages / clients | 🔴 Ne pas réutiliser — personnes réelles sous licence template |
| `tM9dFJoYpuPFsgm0rEyiucfcUWc.png` | 1227×917 | 284 Ko | Illustration carte Benefits | 🟡 À remplacer par des captures réelles de projets |
| `UzJzJqXzd7hGr0L8GmNzJ0s41wM.png` | 1254×1254 | 392 Ko | Illustration carte Benefits | 🟡 idem |
| `hiVKDTvJcZfQcvsdGemPrqIROGc.png` | 1244×1265 | 319 Ko | Illustration carte Benefits | 🟡 idem |
| `P6JIpN2w9g393iHrqDrjyIgdIN8.png` | 1254×1254 | 268 Ko | Mockup isométrique Services | 🟡 À remplacer par un diagramme d'architecture (cf. `guide.md` §Design) |
| `IHneqoBbdHUCED6FYR137ZUxEqI.gif` | 500×500 | 2.5 Mo | Texture animée au survol des boutons | ⚫ **Non repris** — remplacé par un effet CSS (§5.1) |

**Licences.** Les portraits, avatars et le wordmark appartiennent au template Sevora et représentent des personnes réelles. Ils ne doivent pas être publiés sur `jeffreychoguen.cloud`. Ils restent dans `design/framer-reference/` comme **référence visuelle de cadrage uniquement**, exclue du build (`design/` hors du dossier `public/`).

**Format de production.** Toutes les images du site en **AVIF + WebP** avec repli JPEG, servies par `next/image`, `loading="lazy"` hors hero, `priority` sur le portrait du hero, `sizes` renseigné. Cible : < 200 Ko par visuel plein format.

### 8.1 Icônes

- Jeu principal : **Stylokit** — les icônes réellement utilisées sont `arrow up right` (85×), `users`, `circle exclamation`, `seal question`, `circle information`, `chevron down`, `arrow circle down/up right`, `arrow square right`.
- Jeu secondaire : **Logos** — Framer, Figma, Webflow, Notion (à remplacer par Node.js, React, Next.js, Flutter, Docker, PostgreSQL/MongoDB).
- Composant externe **Phosphor** pour les icônes de sections (éclair, baguette, aimant, palette, trophée, cible, casque, bouclier).

Implémentation : `phosphor-react` (ou `@phosphor-icons/react`) pour Phosphor + un jeu SVG local pour les 8 icônes Stylokit récurrentes et les logos de technologies. Taille par défaut 20px (24px dans les cercles), `stroke-width` régulier, couleur héritée via `currentColor`.

### 8.2 Composants de code du projet Framer

| Composant | Rôle | Décision |
|---|---|---|
| `LinePattern` | Motif de lignes du fond | Réimplémenté en CSS pur (§4) |
| `withHoverCardMove` (override) | Survol 3D des cartes | Réimplémenté en hook React (§7.4) |
| `CardCenterScrollProgress` | Progression de la timeline | Réimplémenté avec `useScroll` de Framer Motion (§7.5) |
| `AnimatedNumber` | Compteur animé des stats | Réimplémenté avec `useMotionValue` + `animate` |
| `Smooth Scroll` | Scroll lissé | ⚫ Non repris (§7.6) |
| `HUDLayerStack` | Empilement en perspective (section Tools) | Réimplémenté en CSS `transform` + `perspective` |
| `Tab` | Onglets Services/Filtres | Composant React accessible (`role="tablist"`) |
| Shader `logo-spectrum` | Wordmark chromé du footer | Remplacé par un dégradé CSS/SVG statique |

---

## 9. Accessibilité

Non négociable (`guide.md` §Accessibilité) et non couvert par le template :

- HTML sémantique : `header`, `nav`, `main`, `section` avec `aria-labelledby`, `footer`, un seul `h1` par page, hiérarchie de titres sans saut.
- **Contrastes** — vérifiés sur la palette :
  - gray-900 `#121218` sur gray-50 `#F7F7F8` → **17.43:1** ✅
  - gray-600 `#44454C` sur gray-50 → **8.91:1** ✅
  - gray-400 `#94979E` sur gray-50 → **2.73:1** ❌ **échoue AA**. Le template l'utilise pour les numéros décoratifs et certaines métas. Règle : `gray-400` uniquement pour du décoratif non informatif ; toute méta lisible (catégorie, temps de lecture, date) passe en **gray-500** `#61646B` (**5.54:1** ✅).
  - blanc 60% sur `#121218` (soit `#A0A0A3`) → **7.15:1** ✅
  - gray-300 `#C9CDD2` sur gray-50 → **1.49:1** — bordures et filets uniquement, jamais de texte.
- `:focus-visible` visible partout : anneau 2px `#121218` (ou blanc sur fond sombre), `outline-offset: 2px`. Le template n'en définit aucun — à ajouter.
- Navigation clavier complète : menu flyout piégeant le focus, `Escape` pour fermer, accordéon et onglets au clavier.
- `alt` descriptif sur toutes les images ; `alt=""` sur le décoratif.
- Lien d'évitement « Aller au contenu » en début de page.
- Formulaire : `<label for>` réels, erreurs liées par `aria-describedby`, statut d'envoi en `aria-live="polite"`.

---

## 10. Performance

Objectifs `guide.md` : Core Web Vitals surveillés, JavaScript limité.

- **Rendu** : composants serveur par défaut ; `"use client"` réservé aux composants animés (apparitions, timeline, onglets, accordéon, menu, formulaire).
- **Framer Motion** : importé uniquement dans les composants clients, via `LazyMotion` + `domAnimation` pour réduire le bundle.
- **Polices** : `next/font/google`, `display: swap`, préchargement des deux familles, `size-adjust` automatique pour limiter le CLS.
- **Images** : cf. §8. Le hero est le LCP → `priority`, format AVIF, largeur servie ≈ 1100px.
- **Fond** : motif en CSS pur (aucune requête réseau, aucun JS).
- **Budget** : < 120 Ko de JS initial (gzip), LCP < 2.0s en 4G, CLS < 0.05, INP < 200ms.

---

## 11. Architecture front

```text
app/
├── [locale]/                 # 'fr' | 'en'
│   ├── layout.tsx            # <html lang>, fond, nav, footer, transitions
│   ├── page.tsx              # Home
│   ├── about/page.tsx
│   ├── experience/page.tsx
│   ├── projects/page.tsx
│   ├── projects/[slug]/page.tsx
│   ├── skills/page.tsx
│   ├── writing/page.tsx
│   ├── writing/[slug]/page.tsx
│   ├── contact/page.tsx
│   ├── cv/page.tsx
│   └── not-found.tsx
├── sitemap.ts                # multilingue, alternates hreflang
├── robots.ts
└── feed.xml/route.ts         # RSS

components/
├── layout/      Navigation, Footer, LocaleSwitcher, BackgroundPattern, PageTransition
├── ui/          Button, Badge, Card, Accordion, Tabs, Field, Marquee, Reveal
├── sections/    Hero, Benefits, Projects, WhyChooseMe, Services, Process,
│                Features, Testimonials, Pricing, FAQ, CTA
└── motion/      useHoverCardMove, useScrollProgress, AnimatedNumber

content/
├── fr/  en/                  # dictionnaires typés (UI + contenu de page)
├── projects/                 # MDX par projet (bilingue)
└── writing/                  # MDX par article (bilingue)

lib/           seo.ts (metadata + JSON-LD Person), i18n.ts, analytics.ts
design/        framer-reference/ (screens + assets — hors build)
```

### 11.1 Bilingue FR/EN

- Segment de route `[locale]` : `/fr/...` et `/en/...`. Langue par défaut : **en** (marché visé par `guide.md`), redirection depuis `/` selon `Accept-Language` avec repli `en`.
- Chaque page expose `alternates.languages` (`fr`, `en`, `x-default`).
- Sitemap : une entrée par page et par langue, avec `alternates`.
- Sélecteur de langue dans la nav (§5.4), qui conserve la route courante.
- Les slugs de projets et d'articles restent **identiques** dans les deux langues (une seule URL canonique par contenu, traduite).

### 11.2 SEO

Repris intégralement de `guide.md` : `title` unique, meta description, canonical, Open Graph, carte X, JSON-LD `Person` (`name`, `url`, `jobTitle`, `sameAs` GitHub + LinkedIn, `knowsAbout`), sitemap, robots référençant le sitemap, RSS. L'image Open Graph par défaut réutilise le cadrage du hero (1200×630).

---

## 12. Ce qui doit être fourni avant l'intégration

Éléments sans lesquels le design ne peut pas être rempli honnêtement (`guide.md` : « ne jamais inventer de chiffres ») :

1. **Photo de Jeffrey** — portrait haute résolution pour le hero (fond neutre, cadrage buste) et une seconde pour `/about`.
2. **Signature** manuscrite scannée (PNG transparent) — sinon la retirer du design.
3. **Logo / monogramme** JC pour la nav et le footer.
4. **Chiffres vérifiables** pour les stats du hero et la section « Why choose me » : années d'expérience, nombre de projets livrés, taille d'équipe encadrée. Tant qu'ils manquent, ces emplacements restent vides — pas de valeurs de remplissage.
5. **Captures des projets** (Colisgo, AfreeLink, Saveurs du Monde, NumRise) + éventuels diagrammes d'architecture.
6. **CV PDF** pour `/cv` et le CTA hero.
7. **Décision sur trois sections** : Pricing (à conserver ?), Testimonials (témoignages réels disponibles ?), Marquee logos (technos ou clients ?).

---

## 13. Écarts assumés par rapport au template

| Élément du template | Décision | Raison |
|---|---|---|
| GIF de survol des boutons (2.5 Mo) | Remplacé par un effet CSS | Core Web Vitals |
| Smooth Scroll JS | Supprimé | INP, accessibilité, navigation clavier |
| Shader `logo-spectrum` | Dégradé statique | Coût GPU/JS pour un élément décoratif |
| `gray-400` sur texte informatif | Remonté à `gray-500` | Contraste AA (2.73:1 → 5.54:1) |
| Aucun état de focus | Anneau de focus ajouté partout | Accessibilité clavier |
| Témoignages fictifs | Section vidée ou supprimée | `guide.md` : interdiction des faux témoignages |
| Contenu « agence de design » | Réécrit en ingénierie logicielle | Positionnement de `guide.md` |
| Mode clair uniquement | Conservé tel quel en v1 | Le template ne définit aucun token sombre ; un mode sombre demanderait une seconde palette complète (à traiter en phase ultérieure) |
