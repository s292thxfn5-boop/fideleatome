const { query, queryOne, run } = require('../config/database');

class BusinessProfile {
  // Créer un profil entreprise
  static async create(profileData) {
    const {
      user_id,
      business_name,
      contact_name = null,
      phone = null
    } = profileData;

    const result = run(
      'INSERT INTO business_profiles (user_id, business_name, contact_name, phone) VALUES (?, ?, ?, ?)',
      [user_id, business_name, contact_name, phone]
    );

    return result.lastInsertRowid;
  }

  // Trouver un profil par user_id
  static async findByUserId(userId) {
    return queryOne('SELECT * FROM business_profiles WHERE user_id = ?', [userId]);
  }

  // Trouver un profil par ID
  static async findById(id) {
    return queryOne('SELECT * FROM business_profiles WHERE id = ?', [id]);
  }

  // Mettre à jour un profil
  static async update(id, updates) {
    if (Object.keys(updates).length === 0) {
      throw new Error('No fields to update');
    }

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const result = run(`UPDATE business_profiles SET ${setClause} WHERE id = ?`, [...values, id]);

    return { changes: result.changes };
  }

  // Obtenir toutes les entreprises
  static async getAll(limit = 100, offset = 0) {
    return query('SELECT * FROM business_profiles LIMIT ? OFFSET ?', [limit, offset]);
  }
}

module.exports = BusinessProfile;
