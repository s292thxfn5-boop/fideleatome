#!/bin/bash

echo "=========================================="
echo "  Installation de FideleAtome SQLite"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org"
    exit 1
fi

echo -e "${BLUE}Installation des dépendances du serveur...${NC}"
cd "$(dirname "$0")/server"
npm install

echo ""
echo -e "${BLUE}Initialisation de la base de données SQLite...${NC}"
npm run init-db

echo ""
echo -e "${BLUE}Installation des dépendances du client...${NC}"
cd ../client
npm install

echo ""
echo -e "${BLUE}Build du client...${NC}"
npm run build

echo ""
echo -e "${GREEN}=========================================="
echo "  Installation terminée !"
echo "==========================================${NC}"
echo ""
echo "Pour lancer l'application :"
echo "  ./start.sh"
echo ""
echo "Ou double-cliquez sur 'lancer.command'"
