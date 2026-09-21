# TOOLS-PLAN.md — Plan d'exécution de la suite d'outils

Plan d'attaque dérivé de `tools.md`, confronté à l'architecture réelle du site.
`tools.md` reste la source de vérité pour le **catalogue** et le **positionnement** ;
ce document tranche le **comment** et l'**ordre**.

## Décisions actées (2026-09-15)

| Sujet | Décision |
|---|---|
| Langues | **Bilingue FR/EN**, comme le reste du site |
| Vague 1 | **Les 20 outils S** du tableau de lancement |
| Background Remover | **Reporté en phase 5** — modèle trop lourd, arbitrage à faire |
| Navigation | **Tools remplace Skills** |

---

## 1. Ce que l'architecture impose

Le site est un **export statique Next.js** servi par Nginx. Aucun code serveur.

**C'est un atout, pas une contrainte.** Le positionnement privacy-first de `tools.md`
devient une propriété structurelle : il n'y a pas de serveur vers lequel un fichier
*pourrait* partir. Là où les concurrents promettent le traitement local, nous en sommes
incapables de faire autrement.

**En contrepartie**, la valeur `processing: 'server'` du registry est inatteignable.
Tout outil qui ne tourne pas dans le navigateur doit soit passer par une API externe
déclarée, soit attendre.

### Conséquence sur le TOP 20

18 outils sur 20 sont réalisables sans réserve. Deux demandent un traitement particulier :

- **Background Remover** — reporté (décision ci-dessus).
- **Compress PDF** — `pdf-lib` ne compresse pas. La compression réelle consiste à
  ré-encoder les images intégrées. C'est faisable et efficace sur les PDF issus de scans
  ou de photos, qui sont le cas d'usage dominant de « compress pdf ». L'interface devra
  annoncer honnêtement que les PDF purement textuels gagneront peu.

La vague 1 livre donc **19 outils**, Background Remover exclu.

---

## 2. Coût réel des dépendances

Mesuré, pas estimé. Toutes en **import dynamique** : aucune n'entre dans le bundle initial.

| Besoin | Solution | Coût |
|---|---|---|
| Compression, redimensionnement, conversion d'images | **Canvas API native** | 0 Ko |
| Génération QR | `qrcode` | 132 Ko décompressé |
| Manipulation PDF (merge, split, rotate, pages) | `pdf-lib` | ~100 Ko gzip |
| Rendu PDF → image | `pdfjs-dist` + worker | ~1 Mo gzip, chargé uniquement sur ces pages |
| JSON, Base64, texte, calculs, UUID, mots de passe | **API navigateur** | 0 Ko |

Le budget JS initial du site est aujourd'hui de 188 Ko gzip. **Il ne doit pas bouger** :
chaque moteur est chargé à la demande, jamais au niveau du layout.

---

## 3. Phasage

### Phase 0 — Framework (aucun outil livré)

Tout le reste en dépend. À ne pas bâcler.

- `content/tools/registry.ts` — définitions typées, source unique du catalogue, de la
  recherche, des related tools, du sitemap, des metadata et des breadcrumbs.
- `content/tools/categories.ts` — les 15 catégories de `tools.md`.
- Composants partagés : `ToolShell`, `ToolHeader`, `ToolDropzone`, `ToolOptions`,
  `ToolPreview`, `ToolProgress`, `ToolResult`, `DownloadButton`, `PrivacyBadge`,
  `RelatedTools`, `ToolFAQ`.
- Routes : `/[locale]/tools/`, `/[locale]/tools/[category]/`, `/[locale]/tools/[slug]/`.
- SEO : breadcrumb schema, `SoftwareApplication` schema, extension du sitemap.
- Harnais Web Worker réutilisable + convention d'import dynamique.
- Événements analytics, sans jamais de données de fichier.
- Navigation : Tools remplace Skills.

**Critère de sortie :** une page outil factice traverse tout le parcours
(upload → options → progression → résultat → téléchargement → reset) sur mobile et desktop.

### Phase 1 — 8 outils à dépendance zéro

Password Generator · UUID Generator · Base64 · Word Counter ·
Percentage Calculator · JSON Formatter · JSON Validator · Case Converter

API navigateur uniquement. Ils valident le framework en production à coût de bundle nul,
avant tout investissement dans les moteurs lourds.

### Phase 2 — Images (Canvas + Worker)

Image Compressor · Image Resizer · Image Converter · PNG to JPG · JPG to PNG · WebP Converter

Un seul moteur `lib/tools/image-engine.ts` sert les six. Les quatre derniers ne sont que
des préréglages du convertisseur, avec leur propre page et leur propre intention SEO.

### Phase 3 — PDF (`pdf-lib` + `pdfjs-dist`)

Merge PDF · Split PDF · JPG to PDF · PDF to JPG · Compress PDF

`pdfjs-dist` n'est chargé que par PDF to JPG. Compress PDF réutilise le moteur image
de la phase 2 pour ré-encoder les images intégrées.

### Phase 4 — QR

QR Code Generator, avec les 10 types de `tools.md` (URL, Wi-Fi, vCard, WhatsApp…).

### Phase 5 — Arbitrages lourds

Background Remover · OCR · PDF to Word. Chacun demande une décision explicite
client-lourd / API externe avant d'être promis.

---

## 4. Registry — schéma adapté

Le schéma de `tools.md` §17, complété pour le bilinguisme et notre `I18nText`.

```ts
type ToolDefinition = {
  slug: string;
  category: CategoryId;
  priority: "S" | "A" | "B";
  /** Le nom reste en anglais : c'est l'intention de recherche. */
  name: string;
  tagline: I18nText;
  description: I18nText;
  processing: "client" | "external-api";
  inputTypes?: string[];
  outputTypes?: string[];
  /** Slugs — la réciprocité est vérifiée au build. */
  relatedTools: string[];
  /** Synonymes alimentant la recherche (« compress photo » → image-compressor). */
  keywords: I18nList;
  faq?: { q: I18nText; a: I18nText }[];
  status: "live" | "planned";
};
```

**Pourquoi `name` reste en anglais :** « Image Compressor » est le terme recherché, y
compris par les francophones. Le `tagline` et la `description` sont traduits, pas le nom.

**`status: 'planned'`** permet d'inscrire les 100+ outils au catalogue dès maintenant tout
en ne générant que les pages réellement fonctionnelles — la règle absolue de `tools.md` :
jamais d'URL sans outil derrière.

---

## 5. Règles non négociables

Reprises de `tools.md`, à faire respecter par le code et non par la discipline.

1. **Aucune page sans outil fonctionnel.** Le générateur de routes ne lit que
   `status: 'live'`.
2. **Le badge de confidentialité est dérivé du registry**, jamais écrit à la main.
   `processing: 'client'` → « traitement local » ; `external-api` → mention de l'envoi.
   Impossible d'afficher la mauvaise promesse par inadvertance.
3. **Aucun moteur au niveau du layout.** Vérifiable : le JS initial doit rester à 188 Ko.
4. **Analytics sans contenu.** Les événements ne portent que `slug`, `category`, durée et
   statut. Jamais de nom de fichier, de texte ni de dimensions.
5. **FAQ schema uniquement si la FAQ est visible** à l'écran.

---

## 6. Definition of Done

Celle de `tools.md` §29 s'applique. Trois ajouts propres à notre contexte :

- [ ] Le moteur ne fuit pas dans le bundle initial — vérifié au build.
- [ ] Les deux langues sont complètes, y compris messages d'erreur et libellés d'état.
- [ ] Les `relatedTools` sont réciproques et pointent vers des outils `live`.

---

## 6bis. État d'avancement

| Phase | État |
|---|---|
| 0 — Framework | ✅ livrée |
| 1 — 8 outils sans dépendance | ✅ livrée |
| 2 — 6 outils d'image (Canvas) | ✅ livrée |
| 3 — 5 outils PDF | ✅ livrée |
| 4 — QR | ✅ livrée |
| 5 — Arbitrages lourds | ✅ livrée |

**23 outils sur 23.** Aucun outil ne reste `planned`.

### Background Remover — comment le blocage a été levé

La préférence initiale était l'API externe. Elle s'est heurtée à l'architecture :
un export statique ne peut détenir aucune clé, et toute variable `NEXT_PUBLIC_*`
est lisible dans le JavaScript livré.

L'outil part donc du **modèle local**, seule voie qui fonctionne pour tout
visiteur sans infrastructure ni compte. Le grief initial portait sur les 54 Mo
subis : ils sont désormais **annoncés avant l'action**, avec leur poids exact,
un avertissement pour les connexions mobiles, et la détection du cache pour ne
pas prévenir deux fois.

La voie externe reste disponible : renseigner `NEXT_PUBLIC_BG_REMOVAL_ENDPOINT`
avec l'URL d'un proxy bascule l'outil dessus. **Une URL, jamais une clé** — le
secret reste chez le proxy. L'interface affiche alors d'elle-même l'avertissement
d'envoi.

### Auto-hébergement effectif### Auto-hébergement effectif

Les assets OCR sont servis par notre Nginx, jamais par jsDelivr : données de
langue (10,4 Mo anglais, 6,0 Mo français), worker et cœur WebAssembly (3,7 Mo).
Le modèle de détourage est miroité de même : 53,6 Mo, variante quantifiée
uniquement — les variantes fp16 (84 Mo) et pleine précision (168 Mo) sont
écartées, leur gain visuel ne justifiant pas de tripler le téléchargement.

`scripts/fetch-ocr-assets.mjs` et `scripts/fetch-bg-model.mjs` les préparent au
build et **échouent bruyamment** en cas de problème — un échec silencieux ferait
retomber les librairies sur leur CDN par défaut, contournant la décision sans
que personne ne le voie.

**Conséquence de déploiement :** la sortie pèse ~100 Mo, dont 81 Mo d'assets
`vendor/`. Le `rsync` ne les transfère qu'une fois.

### Vérification

Les outils sont testés en pilotant un vrai navigateur, pas seulement rendus.
Validés de bout en bout : les 8 outils sans dépendance ; la compression d'image
(1 Mo → 506 Ko) ; la cible de poids (120 Ko demandés, 118 Ko produits) ;
PNG→JPG ; JPG→PDF ; la fusion ; la découpe ; PDF→JPG (confirmé manuellement par
Jeffrey) ; la compression PDF (2,3 Mo → 746 Ko, 2 images sur 2 ré-encodées,
en-tête PDF intact) ; le QR (canvas rendu, SVG téléchargeable, alerte de
contraste). Les dix formats de charge utile QR passent 12 tests unitaires, et la
génération `.docx` produit un ZIP OOXML valide.

**Non vérifiés en headless : `ocr` et `pdf-to-word`.** Tous deux reposent sur un
Web Worker, qui ne progresse pas sous `--virtual-time-budget` — le même piège
que `pdf-to-jpg`, que Jeffrey a confirmé fonctionnel en navigateur réel. À
confirmer manuellement.

### Coût réel des librairies

`pdf-lib` (437 Ko), `pdf.js` (445 Ko) et `qrcode` ne figurent dans le manifeste
d'AUCUNE page : elles ne se chargent qu'au premier traitement.

### La correction structurelle à retenir

Les 21 outils partagent une route unique, donc toute référence faite depuis le
composant serveur entrait dans le graphe de chaque page : le code des 18 outils
voyageait ensemble, mesuré à 18 Ko gzip et voué à croître jusqu'à 100 outils.
`next/dynamic` n'y changeait rien. Le chargement a dû passer côté client, via
`React.lazy` dans `components/tools/ToolRuntime.tsx`.

Résultat : une page d'outil est passée de 203 à **187 Ko**, soit moins que la
page d'accueil — et ce chiffre ne bougera plus quand le catalogue grandira.

---

## 7. Points à trancher plus tard

- **Limites de taille de fichier** par outil — à fixer sur mesures réelles, pas à l'estime.
- **Compress PDF** : formuler la limite sur les PDF textuels sans décourager l'usage.
- **Outils Cameroun/Afrique** (`tools.md` §11) : les calculateurs fiscaux et salariaux
  exigent des barèmes à jour et datés. À ne pas lancer sans source vérifiable.
- **Monétisation** : hors périmètre jusqu'à la phase 3.

---

## 8. SEO — état après audit

Audit mené sur le HTML réellement produit, pas sur le code.

| Signal | Avant | Après |
|---|---|---|
| Titres tronqués (> 60 car.) | 43 | **0** |
| Descriptions tronquées (> 160 car.) | 9 | **0** |
| Descriptions trop courtes (< 70 car.) | 37 | 10 |
| Canonical · hreflang | 100 % | 100 % |
| Open Graph · carte X | 99 % | 99 % |
| Un seul `h1` par page | 99 % | 99 % |

Les 1 % manquants sont la page de redirection racine, en `noindex` par
construction : elle n'a ni `h1` ni Open Graph, et c'est correct.

### Ce qui a été ajouté

- **FAQPage** sur les pages portant une FAQ visible — accueil et trois outils.
  Jamais ailleurs : baliser une FAQ absente enfreint les consignes de Google.
- **ItemList** sur le catalogue et chaque page de catégorie.
- **WebSite + SearchAction**, condition d'affichage de la boîte de recherche
  dans les résultats.
- `compactTitle()` : les titres d'outils passaient par « Nom — accroche —
  Jeffrey Choguen », jusqu'à 103 caractères. Sur une page d'outil, c'est le NOM
  qui porte l'intention de recherche ; il ne doit jamais être ce qu'on coupe.
- `clampDescription()` : troncature à la phrase ou au mot, jamais en plein
  milieu.

### /llms.txt

Convention llmstxt.org. **Généré depuis les mêmes sources que le site** —
registry d'outils, CV, projets : un fichier écrit à la main se
désynchroniserait dès le premier outil ajouté, et un modèle citerait alors un
outil inexistant.

Il contient une section « Facts worth getting right » qui verrouille les points
sur lesquels un modèle se trompe : le nom d'usage face au nom légal, la
localisation, le chevauchement assumé des postes, et l'absence totale de
chiffres de trafic ou de clientèle — précisant qu'un tel chiffre attribué à
Jeffrey ne vient pas de ce site.
