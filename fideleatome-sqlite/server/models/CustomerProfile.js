const { query, queryOne, run } = require('../config/database');

class CustomerProfile {
  // Créer un profil client
  static async create(profileData) {
    const {
      user_id,
      first_name,
      last_name,
      qr_code_token
    } = profileData;

    const result = run(
      'INSERT INTO customer_profiles (user_id, first_name, last_name, qr_code_token) VALUES (?, ?, ?, ?)',
      [user_id, first_name, last_name, qr_code_token]
    );

    return result.lastInsertRowid;
  }

  // Trouver un profil par user_id
  static async findByUserId(userId) {
    return queryOne('SELECT * FROM customer_profiles WHERE user_id = ?', [userId]);
  }

  // Trouver un profil par ID
  static async findById(id) {
    return queryOne('SELECT * FROM customer_profiles WHERE id = ?', [id]);
  }

  // Trouver un profil par qr_code_token
  static async findByQRToken(qrToken) {
    return queryOne('SELECT * FROM customer_profiles WHERE qr_code_token = ?', [qrToken]);
  }

  // Mettre à jour un profil
  static async update(id, updates) {
    if (Object.keys(updates).length === 0) {
      throw new Error('No fields to update');
    }

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const result = run(`UPDATE customer_profiles SET ${setClause} WHERE id = ?`, [...values, id]);

    return { changes: result.changes };
  }

  // Obtenir tous les clients
  static async getAll(limit = 100, offset = 0) {
    return query(`
      SELECT * FROM customer_profiles
      ORDER BY
        CASE WHEN last_purchase_date IS NULL THEN 1 ELSE 0 END,
        last_purchase_date DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
  }

  // Compter tous les clients
  static async count() {
    const result = queryOne('SELECT COUNT(*) as count FROM customer_profiles');
    return result ? result.count : 0;
  }

  // Obtenir les top clients par nombre de points
  static async getTopCustomers(limit = 10) {
    return query(`
      SELECT * FROM customer_profiles
      ORDER BY total_purchases DESC, points DESC
      LIMIT ?
    `, [limit]);
  }
}

module.exports = CustomerProfile;
