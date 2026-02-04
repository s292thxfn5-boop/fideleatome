const { createClient } = require('@supabase/supabase-js');

let supabase = null;

// Initialiser la connexion Supabase
async function initDatabase() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file'
      );
    }

    console.log('🔌 Connecting to Supabase...');

    // Créer le client Supabase avec la clé service role
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });

    // Tester la connexion en essayant de lire la table users
    const { data, error } = await supabase.from('users').select('id').limit(1);

    // L'erreur PGRST116 signifie "table vide" ce qui est OK
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.warn('⚠️  Warning:', error.message);
    }

    console.log('✅ Connected to Supabase');
    return supabase;
  } catch (error) {
    console.error('❌ Error connecting to Supabase:', error.message);
    throw error;
  }
}

// Obtenir le client Supabase
function getDb() {
  if (!supabase) {
    throw new Error('Supabase not initialized. Call initDatabase() first.');
  }
  return supabase;
}

// Ces fonctions ne sont plus utilisées - on utilise directement l'API Supabase dans les modèles
// Conservées pour compatibilité mais non implémentées
async function query(sql, params = []) {
  throw new Error('Direct SQL queries not supported. Use Supabase API instead.');
}

async function queryOne(sql, params = []) {
  throw new Error('Direct SQL queries not supported. Use Supabase API instead.');
}

async function run(sql, params = []) {
  throw new Error('Direct SQL queries not supported. Use Supabase API instead.');
}

// Fermer la connexion (pas nécessaire avec Supabase)
async function closeDatabase() {
  console.log('✅ Supabase connection closed');
  supabase = null;
}

module.exports = {
  initDatabase,
  getDb,
  query,
  queryOne,
  run,
  closeDatabase
};
