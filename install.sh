#!/bin/bash

echo "🚀 Installation de FideleAtome"
echo "================================"
echo ""

# Vérifier si Node.js est installé
echo "📦 Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé!"
    echo ""
    echo "Veuillez installer Node.js avant de continuer:"
    echo "👉 https://nodejs.org/fr"
    echo ""
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js est installé: $NODE_VERSION"
echo ""

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé!"
    exit 1
fi

# Installation des dépendances du serveur
echo "📦 Installation des dépendances du serveur..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances du serveur"
    exit 1
fi
echo "✅ Dépendances du serveur installées"
echo ""

# Retour au dossier racine
cd ..

# Installation des dépendances du client
echo "📦 Installation des dépendances du client..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances du client"
    exit 1
fi
echo "✅ Dépendances du client installées"
echo ""

# Vérifier si le fichier .env existe
cd ../server
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo ""
    echo "📝 Configuration de la base de données requise:"
    echo ""

    if [ -f .env.example ]; then
        echo "Un fichier .env.example a été trouvé."
        read -p "Voulez-vous le copier vers .env maintenant? (o/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Oo]$ ]]; then
            cp .env.example .env
            echo "✅ Fichier .env créé à partir de .env.example"
            echo ""
            echo "⚠️  IMPORTANT: Vous devez maintenant éditer server/.env et remplir:"
            echo "   - DATABASE_URL (avec vos identifiants Supabase)"
            echo "   - JWT_SECRET (un secret sécurisé)"
            echo "   - QR_SECRET (un autre secret sécurisé)"
            echo ""
            read -p "Appuyez sur Entrée une fois que vous avez configuré le fichier .env..."
        else
            echo "❌ Installation annulée. Veuillez créer le fichier server/.env manuellement."
            echo "   Consultez INSTALLATION.md pour plus de détails."
            exit 1
        fi
    else
        echo "❌ Fichier .env.example non trouvé"
        echo "   Veuillez créer manuellement server/.env"
        echo "   Consultez INSTALLATION.md pour les instructions."
        exit 1
    fi
else
    echo "✅ Fichier .env trouvé"
fi
echo ""

# Retour au dossier racine
cd ..

# Build du frontend
echo "🔨 Construction du frontend (build de production)..."
cd client
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build du frontend"
    exit 1
fi
echo "✅ Frontend buildé avec succès"
echo ""

# Retour au dossier racine
cd ..

echo "🎉 Installation terminée avec succès!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo ""
echo "1. Configurez votre base de données Supabase:"
echo "   👉 Consultez SUPABASE_SETUP.md"
echo "   👉 Exécutez le script SQL dans l'éditeur Supabase"
echo ""
echo "2. Lancez l'application:"
echo "   👉 ./start-local.sh"
echo ""
echo "3. Accédez à l'application:"
echo "   👉 http://localhost:5001"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Pour plus d'informations, consultez:"
echo "   - INSTALLATION.md (guide complet)"
echo "   - README-LOCAL.md (utilisation quotidienne)"
echo ""
