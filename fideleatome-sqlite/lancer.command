#!/bin/bash

# Ce script peut être double-cliqué sur Mac pour lancer l'application

cd "$(dirname "$0")"

# Vérifier si les modules sont installés
if [ ! -d "server/node_modules" ]; then
    echo "Première exécution détectée. Installation en cours..."
    ./install.sh
fi

# Ouvrir le navigateur après un délai
(sleep 3 && open "http://localhost:5001") &

# Lancer le serveur
./start.sh
