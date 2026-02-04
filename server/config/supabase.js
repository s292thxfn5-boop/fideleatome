const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file'
  );
}

// Créer le client Supabase avec la clé service role (pour le backend)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Fonction helper pour les requêtes SQL brutes
async function query(sql, params = []) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      query: sql,
      params: params
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Wrapper pour une seule ligne
async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Wrapper pour les insertions/updates/deletes avec RETURNING
async function run(sql, params = []) {
  const results = await query(sql, params);
  return {
    lastID: results.length > 0 && results[0].id ? results[0].id : null,
    changes: results.length
  };
}

module.exports = {
  supabase,
  query,
  queryOne,
  run
};
