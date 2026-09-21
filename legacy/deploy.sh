#!/bin/bash

# Déploiement du site statique JeffreyChoguen vers /var/www/jeffreychoguen
# À exécuter sur le serveur (ou via SSH)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TARGET="/var/www/jeffreychoguen"

echo "🚀 Déploiement de JeffreyChoguen..."

# Créer le répertoire cible si nécessaire
sudo mkdir -p "$TARGET"

# Copier les fichiers statiques
echo "📦 Copie des fichiers..."
sudo cp -r "$SCRIPT_DIR"/* "$TARGET/"

# Permissions
echo "🔐 Configuration des permissions..."
sudo chown -R www-data:www-data "$TARGET"
sudo chmod -R 755 "$TARGET"

echo "✅ Déploiement terminé !"
echo "   Site accessible via jeffreychoguen.cloud"
