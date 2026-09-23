# reload.md — Commandes de mise à jour du serveur

Toutes les commandes à lancer après chaque modification, dans l'ordre. Le
schéma est release + symlink (voir README.md « Déployer ») : chaque envoi va
dans un dossier neuf, jamais écrit par-dessus, et `current` bascule dessus en
une seule opération. `/var/www/jeffreychoguen/mundi/` (le site de Mundi
Complex) n'est jamais dans le chemin d'aucune de ces commandes.

## ⚠️ Le piège à ne pas reproduire

`$REL` doit être **la même valeur des deux côtés** — Mac et serveur sont deux
shells différents, une variable définie sur l'un n'existe pas sur l'autre.
Datée le 2026-09-22 : `$REL` vide côté serveur a fait pointer `current` sur
`releases/` entier plutôt que sur le bon sous-dossier, d'où un 403 malgré un
déploiement par ailleurs réussi.

**La parade : ne jamais taper `$REL` à la main sur le serveur.** Toutes les
commandes ci-dessous calculent la valeur sur le Mac puis l'envoient telle
quelle dans la commande SSH — jamais une variable séparée à redéfinir.

## Mise à jour normale

Tout se lance **depuis le Mac**, dans le dossier du projet.

```bash
# 1. Construire et vérifier
npm run build
npm run verify        # 22 contrôles — ne pas continuer si l'un échoue

# 2. Envoyer et basculer en une seule séquence, $REL calculé une fois
REL=$(date +%Y%m%d-%H%M)
ssh root@srv1253054 "mkdir -p /var/www/jeffreychoguen/releases/$REL"
rsync -a out/ root@srv1253054:/var/www/jeffreychoguen/releases/$REL/
ssh root@srv1253054 "ln -sfn /var/www/jeffreychoguen/releases/$REL /var/www/jeffreychoguen/current"

# 3. Vérifier que ça répond
curl -I https://jeffreychoguen.cloud
```

Ces quatre commandes s'exécutent l'une après l'autre, dans le **même terminal,
sans le fermer** entre elles : c'est ce qui garantit que `$REL` reste la même
valeur partout. Ne pas recopier seulement la ligne `ln -sfn` dans un autre
terminal plus tard.

Aucun rechargement Nginx n'est nécessaire : `root` est résolu à chaque
requête, pas mis en cache au chargement de la config.

## Vérification après coup

```bash
npm run verify                        # déjà fait avant l'envoi, sinon relancer ici
curl -I https://jeffreychoguen.cloud
curl -I https://mundicomplex.com      # confirme que Mundi n'a pas bougé
```

Ouvrir la console du navigateur sur l'accueil et sur un outil de chaque
famille (image, PDF, OCR, détourage) : la CSP est en **Report-Only**, elle
signale sans bloquer.

## En cas de problème

**Revenir à la version précédente** — lister les releases disponibles puis
pointer `current` sur l'une d'elles :

```bash
ssh root@srv1253054 "ls -t /var/www/jeffreychoguen/releases/"
ssh root@srv1253054 "ln -sfn /var/www/jeffreychoguen/releases/<horodatage-précédent> /var/www/jeffreychoguen/current"
```

**403 après un déploiement qui semblait réussi** — presque toujours le piège
du `$REL` vide décrit plus haut :

```bash
ssh root@srv1253054 "readlink -f /var/www/jeffreychoguen/current"
```

Si ça renvoie `/var/www/jeffreychoguen/releases` (sans sous-dossier), le
symlink pointe sur le mauvais niveau — refaire le `ln -sfn` avec l'horodatage
exact :

```bash
ssh root@srv1253054 "ls /var/www/jeffreychoguen/releases/"
ssh root@srv1253054 "ln -sfn /var/www/jeffreychoguen/releases/<horodatage-exact> /var/www/jeffreychoguen/current"
```

**Diagnostiquer plus largement** :

```bash
ssh root@srv1253054 "tail -30 /var/log/nginx/error.log"
ssh root@srv1253054 "nginx -T 2>&1 | grep -E 'server_name|listen|root '"
```

## Nettoyage périodique

Ne supprime que dans `releases/` — jamais la racine, jamais `mundi/`. Garde
les 3 releases les plus récentes :

```bash
ssh root@srv1253054 "cd /var/www/jeffreychoguen/releases && ls -t | tail -n +4 | xargs -r rm -rf"
```

## Modification de la configuration Nginx

Seulement si `deploy/nginx.conf` ou `deploy/security-headers.conf` a changé —
pas nécessaire pour une mise à jour de contenu classique.

```bash
scp deploy/nginx.conf deploy/security-headers.conf root@srv1253054:/tmp/
ssh root@srv1253054 "cp /tmp/security-headers.conf /etc/nginx/snippets/jeffreychoguen-security.conf && \
  cp /tmp/nginx.conf /etc/nginx/sites-available/jeffreychoguen && \
  nginx -t && systemctl reload nginx"
```

Après un `nginx -t`, vérifier qu'aucun message `conflicting server name`
n'apparaît — signe que la config est chargée en double dans
`/etc/nginx/sites-enabled/`.
