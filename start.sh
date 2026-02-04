#!/bin/bash

echo "🛑 Arrêt des serveurs existants..."
# Arrêter les processus sur les ports 5000 et 5173
lsof -ti :5000 | xargs kill -9 2>/dev/null || echo "  Port 5000 libre"
lsof -ti :5173 | xargs kill -9 2>/dev/null || echo "  Port 5173 libre"

sleep 2

echo ""
echo "🚀 Démarrage de FideleAtome..."
echo ""
echo "📡 Backend: http://localhost:5000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

cd "$(dirname "$0")"
npm run dev
