# 🚀 Configuration Supabase pour FideleAtome

## Étape 1 : Créer un projet Supabase

1. Allez sur https://app.supabase.com
2. Cliquez sur "New project"
3. Remplissez les informations :
   - **Name** : fideleatome
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez la région la plus proche (Europe West par exemple)
4. Cliquez sur "Create new project"
5. Attendez 2-3 minutes que le projet soit créé

## Étape 2 : Récupérer les informations de connexion

### Option A : Connection String (Recommandé)

1. Dans votre projet Supabase, allez dans **Settings** (⚙️) > **Database**
2. Sous "Connection string", sélectionnez **URI**
3. Copiez la chaîne qui ressemble à :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abc123xyz.supabase.co:5432/postgres
   ```
4. Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez choisi à l'étape 1

### Option B : Valeurs séparées (Alternative)

1. **SUPABASE_URL** : Dans **Settings** > **API** > Project URL
2. **SUPABASE_SERVICE_ROLE_KEY** : Dans **Settings** > **API** > service_role (secret)

## Étape 3 : Configurer le fichier .env

1. Ouvrez `/Users/abenhayoun/fideleatome/server/.env`
2. Ajoutez votre DATABASE_URL :

```env
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.abc123xyz.supabase.co:5432/postgres
```

**Exemple complet :**
```env
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://postgres:MonMotDePasse123!@db.xyzabc.supabase.co:5432/postgres

JWT_SECRET=mon-secret-jwt-tres-securise-123456
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=mon-refresh-secret-789
JWT_REFRESH_EXPIRES_IN=7d

QR_SECRET=mon-qr-secret-secure-456

CORS_ORIGIN=http://localhost:5173
```

## Étape 4 : Créer les tables dans Supabase

1. Dans votre projet Supabase, allez dans **SQL Editor** (icône </>)
2. Cliquez sur "New query"
3. Copiez TOUT le contenu du fichier `/Users/abenhayoun/fideleatome/server/database/supabase-schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **RUN** (ou Ctrl+Enter)
6. Vérifiez qu'il n'y a pas d'erreur

## Étape 5 : Vérifier la création des tables

1. Allez dans **Table Editor** (icône de tableau)
2. Vous devriez voir les tables :
   - ✅ users
   - ✅ customer_profiles
   - ✅ business_profiles
   - ✅ purchases
   - ✅ rewards
   - ✅ refresh_tokens

## Étape 6 : Démarrer l'application

```bash
cd /Users/abenhayoun/fideleatome
./start.sh
```

Ou manuellement :
```bash
cd /Users/abenhayoun/fideleatome
npm run dev
```

## ✅ Vérification

Si tout fonctionne, vous devriez voir dans le terminal :
```
🔌 Connecting to Supabase PostgreSQL...
✅ Connected to Supabase PostgreSQL
⏰ Server time: 2026-01-15T17:30:00.000Z
🚀 Server running on http://localhost:5000
```

## 🔧 Dépannage

### Erreur de connexion
- Vérifiez que votre DATABASE_URL est correcte
- Vérifiez que vous avez remplacé `[YOUR-PASSWORD]` par votre vrai mot de passe
- Vérifiez qu'il n'y a pas d'espaces au début/fin de la ligne DATABASE_URL

### Erreur "relation does not exist"
- Vous n'avez pas exécuté le script SQL à l'étape 4
- Retournez dans SQL Editor et exécutez le contenu de `supabase-schema.sql`

### Erreur "password authentication failed"
- Le mot de passe dans DATABASE_URL est incorrect
- Allez dans Settings > Database > Reset database password

## 📞 Besoin d'aide ?

Si vous avez des problèmes, vérifiez :
1. Que votre projet Supabase est bien créé et actif
2. Que le fichier `.env` existe et contient DATABASE_URL
3. Que les tables sont bien créées (Table Editor dans Supabase)
