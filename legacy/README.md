# JeffreyChoguen

Page "Bientôt disponible" pour le site jeffreychoguen.cloud.

## Déploiement sur le serveur

### Option 1 : Depuis le serveur

Si ce dossier est cloné sur le serveur :

```bash
cd JeffreyChoguen
chmod +x deploy.sh
./deploy.sh
```

### Option 2 : Depuis votre machine locale

Copier les fichiers vers le serveur puis déployer :

```bash
scp -r JeffreyChoguen/* user@votre-serveur:/tmp/jeffreychoguen/
ssh user@votre-serveur "sudo cp -r /tmp/jeffreychoguen/* /var/www/jeffreychoguen/ && sudo chown -R www-data:www-data /var/www/jeffreychoguen"
```

### Prérequis Nginx

Assurez-vous que le site Nginx pour jeffreychoguen.cloud est configuré (voir la configuration dans `mundi/` ou la doc Nginx).
