#!/bin/bash

echo "🛑 Arrêt des serveurs existants..."
# Arrêter les processus sur les ports 5000 et 5001
lsof -ti :5001 | xargs kill -9 2>/dev/null || echo "  Port 5001 libre"
lsof -ti :5000 | xargs kill -9 2>/dev/null || echo "  Port 5000 libre"

sleep 1

echo ""
echo "🚀 Démarrage de FideleAtome (Mode Production)..."
echo ""
echo "📡 Application: http://localhost:5001"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

cd "$(dirname "$0")/server"
npm start
