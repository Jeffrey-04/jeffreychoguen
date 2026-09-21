# jeffreychoguen.cloud

Site personnel de **Jeffrey Choguen** — Full Stack Software Engineer — et suite
de 23 outils web gratuits qui tournent entièrement dans le navigateur.

Next.js 16 · TypeScript · Tailwind CSS 4 · export statique · bilingue FR/EN.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

La racine `/` redirige vers `/en/` ou `/fr/` selon la langue du navigateur.

## Construire

```bash
npm run build      # génère out/ — HTML statique, prêt à servir
npm run serve      # inspecte out/ localement sur http://localhost:8070
```

**Toujours `npm run build`, jamais `npx next build`.** Ce dernier court-circuite
les scripts `prebuild` et `postbuild` : sur un poste vierge, le site sortirait
sans worker PDF, sans données OCR, sans modèle de détourage ni animations.

Le `prebuild` télécharge ~80 Mo de modèles au premier lancement, puis les
réutilise.

### Scripts

| Commande | Rôle |
|---|---|
| `npm run build` | Build de production complet, préparation comprise |
| `npm run serve` | Sert `out/` localement, comme Nginx le fera |
| `npm run verify` | Contrôle `out/` en 22 points avant envoi : liens, pages, JSON-LD, assets, budget JS. À lancer après le build |
| `npm run typecheck` | Vérifie les types TypeScript. `next lint` n'existe plus depuis Next 16 |
| `npm run assets` | Régénère portrait, captures de projets, logo et fumée depuis `legacy/`. Plusieurs minutes : absent du build |
| `npm run animations` | Optimise les Lottie de `legacy/animations/` |
| `npm run icons` | Régénère les icônes Phosphor |
| `npm run logos` | Régénère les logos de technologies |

## Déployer

Nginx sert `out/`. Aucun processus Node ne tourne sur le serveur.

### Première mise en production

1. **Installer la configuration Nginx** — elle corrige trois pièges qui ne se
   voient qu'en production (voir plus bas) :

   ```bash
   scp deploy/nginx.conf deploy/security-headers.conf user@serveur:/tmp/
   ssh user@serveur
   sudo mkdir -p /etc/nginx/snippets
   sudo cp /tmp/security-headers.conf /etc/nginx/snippets/jeffreychoguen-security.conf
   sudo cp /tmp/nginx.conf /etc/nginx/sites-available/jeffreychoguen
   sudo ln -sf /etc/nginx/sites-available/jeffreychoguen /etc/nginx/sites-enabled/
   sudo nginx -t
   ```

2. **Envoyer le site**

   ```bash
   npm run build
   npm run verify     # 22 contrôles — ne pas envoyer si l'un échoue
   rsync -a --delete out/ user@serveur:/var/www/jeffreychoguen/
   ```

   Le premier envoi fait ~131 Mo, dont 83 Mo d'assets d'outils. Les suivants ne
   transfèrent que ce qui a changé.

3. **Recharger** — `sudo systemctl reload nginx`

Pour les mises à jour suivantes, l'étape 2 suffit : Nginx sert les fichiers
directement, sans rechargement.

### Ce que la configuration Nginx corrige

- **Les types MIME des outils.** Un worker PDF.js servi en
  `application/octet-stream` est refusé par le navigateur : PDF→JPG, PDF→Word
  et l'OCR fonctionneraient en local et tomberaient en production.
- **L'héritage des en-têtes.** Un bloc `location` qui pose un `add_header`
  n'hérite plus d'aucun en-tête du serveur. Sans l'include répété, HSTS et la
  CSP disparaîtraient justement des pages HTML.
- **La compatibilité 1.24.** Le serveur tourne en Nginx 1.24.0 : `http2 on;` y
  est inconnu, d'où `listen 443 ssl http2`.

### Après la mise en ligne

- [ ] **Envoyer un e-mail de test à contact@jeffreychoguen.cloud.** Cette adresse
  figure dans le contact, le pied de page, le JSON-LD et `llms.txt`. Le MX pointe
  vers le serveur web lui-même, sur lequel aucun serveur mail n'a été constaté.
- [ ] Ouvrir la console sur l'accueil et sur un outil de chaque famille (image,
  PDF, OCR, détourage) : la CSP est en **Report-Only**, elle signale sans
  bloquer. Si rien n'apparaît, retirer `-Report-Only` dans le snippet.
- [ ] Soumettre `/sitemap.xml` à Google Search Console et Bing Webmaster Tools.

## Variables d'environnement

Toutes **optionnelles** — le site fonctionne sans aucune. Modèle dans
`.env.example`, à copier en `.env.local`.

| Variable | Absente | Présente |
|---|---|---|
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Le formulaire affiche un lien `mailto:` | Le formulaire poste vers ce service |
| `NEXT_PUBLIC_BG_REMOVAL_ENDPOINT` | Détourage par le modèle local, 54 Mo téléchargés avec l'accord du visiteur | Détourage via ce proxy |

Toute variable `NEXT_PUBLIC_*` est intégrée au JavaScript livré, donc lisible par
n'importe qui : **une URL, jamais une clé**. L'endpoint de contact doit assurer
lui-même la validation, le rate limiting et l'anti-spam.

## Structure

| Dossier | Rôle |
|---|---|
| `app/[locale]/` | Pages, une route par langue. `layout.tsx` est le layout racine — seul niveau qui connaît la langue, nécessaire à `<html lang>`. |
| `app/(root)/` | La page `/`, qui redirige selon la langue. |
| `app/llms.txt/` | `/llms.txt`, généré depuis les données du site. |
| `content/` | **Tout le contenu éditable** : profil, expériences, projets, compétences, métriques, libellés. |
| `content/tools/` | Registry des outils, catégories, libellés et icônes de la suite. |
| `components/` | `layout/`, `ui/`, `sections/`, `motion/`, `tools/`. |
| `lib/` | i18n, SEO, articles ; `lib/tools/` pour les moteurs image, PDF, OCR, QR. |
| `deploy/` | Configuration Nginx de production. |
| `scripts/` | Préparation des assets et du build. |
| `legacy/` | **Sources** des assets optimisés (portrait, captures, animations, logo) et ancienne page « bientôt disponible ». |
| `design/framer-reference/` | Captures du design source. Exclu du build. |

### Pourquoi les sources vivent dans `legacy/`

macOS ne distingue pas la casse : `public/Animations` et `public/animations` y
sont **le même dossier**. Écrire la sortie optimisée dans une variante de casse
écrase les sources — c'est arrivé. Règle : sources dans `legacy/<nom>/`, sortie
dans `public/assets/<nom>/`, jamais un simple changement de casse.

## Modifier le contenu

Tout est centralisé dans `content/`, en français **et** en anglais :

```ts
role: { en: "Lead Backend Developer", fr: "Lead Backend Developer" }
```

- Une expérience → `content/experience.ts`
- Un projet → `content/projects.ts`
- Les compétences → `content/skills.ts`
- Les libellés du site → `content/dictionary.ts`
- Les libellés des outils → `content/tools/ui.ts`

### Ajouter une capture de projet

1. Déposer le PNG dans `legacy/projects/<slug>.png`
2. Ajouter le slug à la liste des projets dans `scripts/optimize-assets.mjs`
3. `npm run assets`
4. Renseigner `image: "/assets/projects/<slug>"` dans `content/projects.ts` —
   **sans extension**, le composant choisit AVIF ou WebP.

Sans capture, la carte affiche le nom du projet : ce n'est pas une erreur.

### Ajouter un outil

1. Le déclarer dans `content/tools/registry.ts` avec `status: "planned"`
2. Écrire son interface dans `components/tools/impl/`
3. L'enregistrer dans `components/tools/ToolRuntime.tsx` et
   `content/tools/implemented.ts`
4. Passer `status: "live"`

Le build **échoue** si un outil `live` n'a pas d'interface, et un outil `planned`
n'obtient jamais d'URL. Le badge de confidentialité découle de `processing` :
il ne s'écrit jamais à la main.

### Règle sur les chiffres

`content/metrics.ts` ne contient que des valeurs **vérifiables**, chacune
commentée avec sa source. Aucune métrique sans source : c'est une exigence de
`guide.md`, reprise dans `llms.txt`.

## À compléter

- [x] CV en PDF, un par langue — `public/cv/CV-Jeffrey-{en,fr}.pdf`
- [x] Captures de 5 projets sur 7
- [ ] Captures d'**Andylix** et de **CRESPAC** — voir « Ajouter une capture »
- [ ] Vérifier que `contact@jeffreychoguen.cloud` reçoit bien le courrier
- [ ] Définir `NEXT_PUBLIC_CONTACT_ENDPOINT` pour activer le formulaire
- [ ] Étoffer le profil GitHub, puis passer `showGithub: true` dans `content/site.ts`
- [ ] Publier le premier article dans `content/writing/`

## Références

- `guide.md` — contenu, SEO et stratégie
- `design.md` — contrat de design : tokens, composants, animations
- `tools.md` — catalogue et positionnement de la suite d'outils
- `tools-plan.md` — plan d'exécution des outils et état d'avancement
