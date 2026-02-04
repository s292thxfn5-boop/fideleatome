# 📦 Installation FideleAtome - Guide Complet

## Pour le Responsable IT / Gestionnaire

Ce guide explique comment installer FideleAtome sur n'importe quel PC.

---

## ⚙️ Prérequis (À installer AVANT)

### 1. Node.js (Obligatoire)
- **Télécharger** : https://nodejs.org/fr
- **Choisir** : Version LTS (recommandée)
- **Installer** : Double-clic et suivre les instructions
- **Vérifier** : Ouvrir un terminal et taper :
  ```bash
  node --version
  ```
  Doit afficher : `v18.x.x` ou plus

### 2. Compte Supabase (Gratuit - Obligatoire)
- **Créer un compte** : https://app.supabase.com
- **Créer un projet** : Suivre le fichier `SUPABASE_SETUP.md` fourni
- **Noter** : Mot de passe et URL de connexion

---

## 📥 Installation de l'Application

### Étape 1 : Copier les fichiers

1. **Copier** le dossier `fideleatome` complet sur le PC
2. **Placer** dans un endroit accessible (ex: `C:\Applications\fideleatome` ou `~/Applications/fideleatome`)

### Étape 2 : Installer les dépendances

Ouvrir un **terminal** dans le dossier `fideleatome` :

**Sur Windows :**
- Clic droit dans le dossier → "Ouvrir dans le terminal"

**Sur Mac/Linux :**
- Applications → Terminal → `cd /chemin/vers/fideleatome`

Puis exécuter :

```bash
npm run install:all
```

⏱️ Cela prend 2-5 minutes (téléchargement des dépendances)

### Étape 3 : Configurer la base de données

1. **Ouvrir** le fichier `server/.env.example`
2. **Copier** et renommer en `server/.env`
3. **Remplir** avec vos informations Supabase :

```env
NODE_ENV=production
PORT=5001

# Remplacer par votre mot de passe et URL Supabase
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xyz.supabase.co:5432/postgres

JWT_SECRET=changez-moi-avec-un-secret-securise-123456789
JWT_EXPIRES_IN=24h
QR_SECRET=changez-moi-secret-qr-987654321

CORS_ORIGIN=http://localhost:5001
```

4. **Sauvegarder** le fichier

### Étape 4 : Créer les tables dans Supabase

1. **Aller** sur https://app.supabase.com
2. **Ouvrir** votre projet
3. **Cliquer** sur "SQL Editor" (dans le menu)
4. **Copier** tout le contenu du fichier `server/database/supabase-schema.sql`
5. **Coller** dans l'éditeur SQL
6. **Cliquer** sur "RUN"
7. **Vérifier** : Aller dans "Table Editor" → vous devez voir 6 tables

### Étape 5 : Builder le frontend

```bash
cd client
npm run build
cd ..
```

---

## 🚀 Lancement

### Première fois

```bash
./start-local.sh
```

**Sur Windows :**
```bash
bash start-local.sh
```

OU

```bash
cd server
npm start
```

### L'application sera accessible sur :

**http://localhost:5001**

---

## 📱 Accès depuis d'autres appareils (même WiFi)

1. **Trouver l'adresse IP du PC** :
   - Windows : `ipconfig` → Chercher "Adresse IPv4"
   - Mac/Linux : `ifconfig` → Chercher "inet"

   Exemple : `192.168.1.50`

2. **Sur les téléphones/tablettes** (même WiFi) :
   - Ouvrir : `http://192.168.1.50:5001`

---

## 🔄 Démarrage Automatique au Lancement du PC

### Sur Mac

1. Ouvrir "Préférences Système" → "Utilisateurs et groupes"
2. Cliquer sur "Ouverture"
3. Ajouter le script `start-local.sh`

### Sur Windows

1. Créer un fichier `start-fideleatome.bat` :
```batch
@echo off
cd C:\chemin\vers\fideleatome\server
npm start
```

2. Placer le fichier dans :
   `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup`

### Sur Linux

1. Créer un service systemd (avancé)
2. Ou ajouter dans `~/.bashrc` ou crontab

---

## 🛑 Arrêter l'Application

Dans le terminal où l'app tourne :
- **Ctrl + C**

---

## 🔧 Dépannage

### Erreur "Port already in use"
```bash
# Tuer le processus sur le port 5001
lsof -ti :5001 | xargs kill -9
```

### Erreur de connexion Supabase
- Vérifier le fichier `server/.env`
- Vérifier que les tables sont créées dans Supabase
- Vérifier le mot de passe dans DATABASE_URL

### Erreur "Cannot find module"
```bash
npm run install:all
```

### L'application ne se charge pas
- Vérifier que le build est fait : `cd client && npm run build`
- Vérifier le navigateur : http://localhost:5001

---

## 📞 Support

En cas de problème :
1. Vérifier ce guide
2. Consulter `SUPABASE_SETUP.md`
3. Vérifier les logs dans le terminal

---

## 📋 Checklist d'Installation

- [ ] Node.js installé (v18+)
- [ ] Projet Supabase créé
- [ ] Fichier `.env` configuré
- [ ] Tables créées dans Supabase
- [ ] Dépendances installées (`npm run install:all`)
- [ ] Frontend buildé (`cd client && npm run build`)
- [ ] Application lancée (`./start-local.sh`)
- [ ] Test : http://localhost:5001 fonctionne
- [ ] Test : Inscription client/entreprise
- [ ] Test : Scanner QR code

**✅ Installation complète !**
