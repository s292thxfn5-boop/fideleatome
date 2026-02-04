# FideleAtome - Version SQLite Locale

Application de fidélité avec stockage local SQLite. Toutes les données restent sur votre ordinateur.

## Prérequis

- Node.js 18+ installé sur votre machine
- npm (inclus avec Node.js)

## Installation

1. Ouvrez un terminal dans ce dossier
2. Exécutez le script d'installation :

```bash
./install.sh
```

## Lancement

### Option 1 : Script en ligne de commande
```bash
./start.sh
```

### Option 2 : Double-clic (Mac)
Double-cliquez sur le fichier `lancer.command`

L'application sera accessible sur **http://localhost:5001**

## Structure

```
fideleatome-sqlite/
├── server/           # API Node.js + Express
│   ├── database/     # Base de données SQLite
│   ├── models/       # Modèles de données
│   ├── controllers/  # Logique métier
│   ├── routes/       # Routes API
│   └── services/     # Services (fidélité, stats, QR)
├── client/           # Interface React
├── install.sh        # Script d'installation
├── start.sh          # Script de démarrage
└── lancer.command    # Lanceur Mac (double-clic)
```

## Base de données

La base de données SQLite est stockée dans :
```
server/database/fideleatome.db
```

Toutes vos données (clients, achats, récompenses) sont sauvegardées localement.

## API Endpoints

### Authentification
- `POST /api/auth/register/customer` - Inscription client
- `POST /api/auth/register/business` - Inscription entreprise
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Client
- `GET /api/customer/profile` - Profil
- `GET /api/customer/qrcode` - QR code
- `GET /api/customer/loyalty` - Info fidélité
- `GET /api/customer/history` - Historique achats
- `GET /api/customer/rewards` - Historique récompenses

### Entreprise
- `GET /api/business/profile` - Profil
- `POST /api/business/scan` - Scanner QR
- `POST /api/business/add-point` - Ajouter point(s)
- `GET /api/business/customers` - Liste clients
- `GET /api/business/stats` - Statistiques

## Sauvegarde

Pour sauvegarder vos données, copiez simplement le fichier :
```
server/database/fideleatome.db
```
