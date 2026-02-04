# 🎯 FideleAtome - Carte de Fidélité Digitale

Application web de carte de fidélité pour système de bobines.

**Système de Points :** 14 bobines achetées = 1 bobine offerte 🎁

---

## 🚀 Installation Rapide (Pour le Responsable)

### Méthode 1 : Installation Automatique (Recommandé)

```bash
./install.sh
```

Ce script va :
- ✅ Vérifier que Node.js est installé
- ✅ Installer toutes les dépendances
- ✅ Vous guider pour la configuration de la base de données
- ✅ Builder l'application

**Ensuite, consultez `INSTALLATION.md` pour configurer Supabase.**

### Méthode 2 : Installation Manuelle

Si vous préférez installer étape par étape, consultez : **`INSTALLATION.md`**

---

## 📱 Lancement de l'Application

Une fois l'installation terminée :

```bash
./start-local.sh
```

**L'application sera accessible sur :** http://localhost:5001

### Accès depuis d'autres appareils (même WiFi)

1. Trouvez l'adresse IP du PC :
   - Windows : `ipconfig`
   - Mac/Linux : `ifconfig`

2. Sur les téléphones/tablettes :
   - Ouvrir : `http://192.168.1.XXX:5001`

---

## 📚 Documentation Disponible

| Fichier | Description |
|---------|-------------|
| **`INSTALLATION.md`** | 📦 Guide complet d'installation avec toutes les étapes détaillées |
| **`SUPABASE_SETUP.md`** | 🗄️ Configuration de la base de données Supabase |
| **`README-LOCAL.md`** | 🚀 Guide de démarrage et d'utilisation quotidienne |

---

## ⚙️ Prérequis

Avant d'installer, assurez-vous d'avoir :

1. **Node.js** (v18 ou plus récent)
   - Télécharger : https://nodejs.org/fr

2. **Compte Supabase** (gratuit)
   - Créer un compte : https://app.supabase.com
   - Suivre les instructions dans `SUPABASE_SETUP.md`

---

## 🏗️ Architecture Technique

- **Frontend** : React + Vite + TailwindCSS
- **Backend** : Node.js + Express
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : JWT
- **QR Codes** : Génération et scan automatique

---

## 🆘 Besoin d'Aide ?

1. **Port déjà utilisé ?**
   ```bash
   lsof -ti :5001 | xargs kill -9
   ```

2. **Erreur de base de données ?**
   - Vérifiez `server/.env`
   - Consultez `SUPABASE_SETUP.md`

3. **L'application ne charge pas ?**
   ```bash
   cd client
   npm run build
   cd ..
   ./start-local.sh
   ```

---

## 📋 Checklist d'Installation Rapide

- [ ] Node.js installé
- [ ] Dossier `fideleatome` copié sur le PC
- [ ] `./install.sh` exécuté
- [ ] Projet Supabase créé (voir `SUPABASE_SETUP.md`)
- [ ] Fichier `server/.env` configuré
- [ ] Tables créées dans Supabase
- [ ] Application lancée avec `./start-local.sh`
- [ ] Test : http://localhost:5001 fonctionne ✅

---

## 🎯 Pour Commencer Immédiatement

**Si c'est votre première fois :**

1. Exécutez `./install.sh`
2. Suivez `SUPABASE_SETUP.md` pour créer votre base de données
3. Configurez `server/.env` avec vos identifiants Supabase
4. Lancez `./start-local.sh`
5. Ouvrez http://localhost:5001 dans votre navigateur

**C'est tout ! 🎉**

---

## 🔄 Mode Développement (Optionnel)

Si vous voulez modifier le code et voir les changements en temps réel :

```bash
npm run dev
```

Consultez `README-LOCAL.md` pour plus de détails.

---

## 📞 Support

En cas de problème, consultez dans l'ordre :

1. **Ce README** pour un aperçu général
2. **`INSTALLATION.md`** pour l'installation complète
3. **`SUPABASE_SETUP.md`** pour la configuration de la base de données
4. **`README-LOCAL.md`** pour l'utilisation quotidienne

---

**✨ Développé pour une expérience de fidélité client simple et efficace.**
