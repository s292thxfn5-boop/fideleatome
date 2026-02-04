# 🚀 LANCEMENT RAPIDE - FideleAtome

## Pour le Responsable - Guide Ultra-Simple

### Étape 1 : Vérifier Node.js

Ouvrir un **terminal** et taper :

```bash
node --version
```

**Si ça affiche un numéro (ex: v18.x.x)** → ✅ C'est bon, passer à l'étape 2

**Si ça affiche une erreur** → ❌ Installer Node.js ici : https://nodejs.org/fr

---

### Étape 2 : Installer l'Application

Dans le terminal, aller dans le dossier `fideleatome` :

```bash
cd /chemin/vers/fideleatome
```

Puis exécuter :

```bash
./install.sh
```

⏱️ Attendre 2-5 minutes (téléchargement automatique)

---

### Étape 3 : Configurer la Base de Données

1. Créer un compte gratuit sur : https://app.supabase.com
2. Créer un nouveau projet
3. Suivre le guide : `SUPABASE_SETUP.md`
4. Remplir le fichier `server/.env` avec vos informations

---

### Étape 4 : Lancer l'Application

```bash
./start-local.sh
```

**L'application s'ouvre sur :** http://localhost:5001

---

## 📱 Utiliser sur Téléphone/Tablette (même WiFi)

### Sur le PC qui fait tourner l'app :

**Windows :**
```bash
ipconfig
```
Chercher "Adresse IPv4" (ex: 192.168.1.50)

**Mac/Linux :**
```bash
ifconfig
```
Chercher "inet" (ex: 192.168.1.50)

### Sur le téléphone/tablette :

Ouvrir le navigateur et aller sur :
```
http://192.168.1.50:5001
```
(Remplacer par votre IP)

---

## 🛑 Arrêter l'Application

Dans le terminal où l'app tourne : **Ctrl + C**

---

## ⚡ Résumé pour les Pressés

```bash
# 1. Installer
./install.sh

# 2. Configurer Supabase (voir SUPABASE_SETUP.md)

# 3. Lancer
./start-local.sh

# 4. Ouvrir
http://localhost:5001
```

**C'est tout ! 🎉**

---

## 🆘 Problèmes ?

- **Port déjà utilisé ?** → Redémarrer le PC
- **Erreur de connexion ?** → Vérifier `server/.env`
- **Rien ne s'affiche ?** → Consulter `INSTALLATION.md`
