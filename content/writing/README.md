# Articles

Un fichier MDX par article **et par langue** :

```
mon-article.en.mdx
mon-article.fr.mdx
```

Le slug (partie avant la langue) doit être identique dans les deux langues :
une seule URL canonique par contenu, traduite (design.md §11.1).

## Front matter

```yaml
---
title: "How I designed a scalable Node.js backend"
description: "Une phrase qui donne envie de lire, reprise en meta description."
date: "2026-09-15"
category: "Backend"
tags: ["Node.js", "Architecture"]
---
```

Le temps de lecture est calculé automatiquement — ne pas le renseigner.

Après ajout d'un fichier, l'article apparaît dans la liste, dans le sitemap
et dans le flux RSS au prochain `npm run build`.
