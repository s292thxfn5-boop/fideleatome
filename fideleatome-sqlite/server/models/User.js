const { query, queryOne, run, saveDatabase } = require('../config/database');

class User {
  // Créer un utilisateur
  static async create(userData) {
    const { email, password_hash, role } = userData;

    const result = run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, password_hash, role]
    );

    return result.lastInsertRowid;
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    return queryOne('SELECT * FROM users WHERE email = ?', [email]);
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    return queryOne('SELECT * FROM users WHERE id = ?', [id]);
  }

  // Vérifier si un email existe
  static async emailExists(email) {
    const user = await User.findByEmail(email);
    return !!user;
  }

  // Mettre à jour un utilisateur
  static async update(id, updates) {
    if (Object.keys(updates).length === 0) {
      throw new Error('No fields to update');
    }

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const result = run(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);

    return { changes: result.changes };
  }

  // Supprimer un utilisateur
  static async delete(id) {
    const result = run('DELETE FROM users WHERE id = ?', [id]);
    return { changes: result.changes };
  }

  // Obtenir tous les utilisateurs
  static async getAll() {
    return query('SELECT id, email, role, created_at FROM users');
  }
}

module.exports = User;
