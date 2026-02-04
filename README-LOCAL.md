# 🚀 Lancement Local - FideleAtome

## Lancer l'application (Version Simple)

### Prérequis
- Base de données Supabase configurée (voir `SUPABASE_SETUP.md`)
- Fichier `server/.env` configuré avec vos identifiants

### Lancement en 1 clic

```bash
./start-local.sh
```

**C'est tout !** L'application sera accessible sur : **http://localhost:5001**

### Arrêter l'application

Appuyez sur **Ctrl+C** dans le terminal

---

## Mode Développement (pour modifier le code)

Si tu veux modifier le code et voir les changements en temps réel :

```bash
npm run dev
```

Cela lance :
- Backend : http://localhost:5001
- Frontend : http://localhost:5173 (avec hot reload)

---

## Rebuild après modifications

Si tu modifies le code et veux mettre à jour la version locale :

```bash
cd client
npm run build
cd ..
./start-local.sh
```

---

## Différences entre les deux modes

| Mode | Commande | Port(s) | Avantages |
|------|----------|---------|-----------|
| **Local (Production)** | `./start-local.sh` | 5001 | ✅ Simple, 1 seul serveur, rapide |
| **Développement** | `npm run dev` | 5001 + 5173 | ✅ Hot reload, debug facile |

---

## Dépannage

### Port déjà utilisé
```bash
# Tuer les processus sur le port 5001
lsof -ti :5001 | xargs kill -9
```

### Erreur de connexion à la base de données
- Vérifiez votre fichier `server/.env`
- Consultez `SUPABASE_SETUP.md`

### Les changements ne s'affichent pas
```bash
# Rebuild l'application
cd client && npm run build && cd ..
```
