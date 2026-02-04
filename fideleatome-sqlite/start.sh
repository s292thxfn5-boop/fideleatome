#!/bin/bash

echo "=========================================="
echo "  Démarrage de FideleAtome SQLite"
echo "=========================================="
echo ""

# Aller au dossier du script
cd "$(dirname "$0")"

# Vérifier si les modules sont installés
if [ ! -d "server/node_modules" ]; then
    echo "Les dépendances ne sont pas installées."
    echo "Exécutez d'abord: ./install.sh"
    exit 1
fi

# Vérifier si le build existe
if [ ! -d "client/dist" ]; then
    echo "Le client n'est pas buildé."
    echo "Build en cours..."
    cd client && npm run build && cd ..
fi

# Démarrer le serveur
echo "Démarrage du serveur sur http://localhost:5001"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

cd server
node server.js
