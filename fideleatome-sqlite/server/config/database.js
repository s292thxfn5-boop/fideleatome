const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
let SQL = null;
const dbPath = path.join(__dirname, '..', 'database', 'fideleatome.db');

// Sauvegarder la base de données sur le disque
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Auto-save toutes les 30 secondes
setInterval(() => {
  if (db) {
    saveDatabase();
  }
}, 30000);

// Sauvegarder avant de quitter
process.on('exit', saveDatabase);
process.on('SIGINT', () => {
  saveDatabase();
  process.exit();
});
process.on('SIGTERM', () => {
  saveDatabase();
  process.exit();
});

// Initialiser la connexion SQLite
async function initDatabase() {
  try {
    console.log('Connecting to SQLite database at:', dbPath);

    // Initialiser SQL.js
    SQL = await initSqlJs();

    // Charger la base existante ou créer une nouvelle
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('Loaded existing database');
    } else {
      db = new SQL.Database();
      console.log('Created new database');
    }

    // Activer les foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Créer les tables si elles n'existent pas
    createTables();

    // Sauvegarder après initialisation
    saveDatabase();

    console.log('Connected to SQLite database');
    return db;
  } catch (error) {
    console.error('Error connecting to SQLite:', error.message);
    throw error;
  }
}

// Créer les tables
function createTables() {
  // Table users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('customer', 'business', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table business_profiles
  db.run(`
    CREATE TABLE IF NOT EXISTS business_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      business_name TEXT NOT NULL,
      contact_name TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Table customer_profiles
  db.run(`
    CREATE TABLE IF NOT EXISTS customer_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      qr_code_token TEXT UNIQUE NOT NULL,
      points INTEGER DEFAULT 0,
      total_purchases INTEGER DEFAULT 0,
      total_rewards INTEGER DEFAULT 0,
      first_purchase_date DATETIME,
      last_purchase_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Table purchases
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      business_id INTEGER NOT NULL,
      points_added INTEGER DEFAULT 1,
      is_reward INTEGER DEFAULT 0,
      notes TEXT,
      purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE CASCADE
    )
  `);

  // Table rewards
  db.run(`
    CREATE TABLE IF NOT EXISTS rewards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      business_id INTEGER NOT NULL,
      purchase_id INTEGER,
      reward_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE SET NULL
    )
  `);

  // Créer des index pour améliorer les performances
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_customer_profiles_qr_token ON customer_profiles(qr_code_token)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_purchases_customer ON purchases(customer_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_purchases_business ON purchases(business_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_rewards_customer ON rewards(customer_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_rewards_business ON rewards(business_id)`);

  console.log('Database tables created/verified');
}

// Obtenir l'instance de la base de données
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Exécuter une requête SELECT et retourner tous les résultats
function query(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Exécuter une requête SELECT et retourner un seul résultat
function queryOne(sql, params = []) {
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Exécuter une requête INSERT/UPDATE/DELETE
function run(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
  return {
    lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] || 0,
    changes: db.getRowsModified()
  };
}

// Fermer la connexion
function closeDatabase() {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
    console.log('SQLite connection closed');
  }
}

module.exports = {
  initDatabase,
  getDb,
  query,
  queryOne,
  run,
  closeDatabase,
  saveDatabase
};
