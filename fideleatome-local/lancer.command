#!/bin/bash
cd "$(dirname "$0")"
echo "Démarrage de FideleAtome..."
echo "Ouvrez http://localhost:8080 dans votre navigateur"
echo ""
echo "Comptes de démo:"
echo "  Client: client@demo.com / demo123"
echo "  Commerce: commerce@demo.com / demo123"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
open "http://localhost:8080"
python3 -m http.server 8080
