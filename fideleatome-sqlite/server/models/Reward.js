const { query, queryOne, run } = require('../config/database');

class Reward {
  // Créer une récompense
  static async create(rewardData) {
    const { customer_id, business_id, purchase_id = null } = rewardData;

    const result = run(
      'INSERT INTO rewards (customer_id, business_id, purchase_id) VALUES (?, ?, ?)',
      [customer_id, business_id, purchase_id]
    );

    return result.lastInsertRowid;
  }

  // Obtenir les récompenses d'un client
  static async getByCustomer(customerId, limit = 50, offset = 0) {
    return query(`
      SELECT r.*, bp.business_name
      FROM rewards r
      LEFT JOIN business_profiles bp ON r.business_id = bp.id
      WHERE r.customer_id = ?
      ORDER BY r.reward_date DESC
      LIMIT ? OFFSET ?
    `, [customerId, limit, offset]);
  }

  // Obtenir les récompenses distribuées par une entreprise
  static async getByBusiness(businessId, limit = 50, offset = 0) {
    return query(`
      SELECT r.*, cp.first_name, cp.last_name
      FROM rewards r
      LEFT JOIN customer_profiles cp ON r.customer_id = cp.id
      WHERE r.business_id = ?
      ORDER BY r.reward_date DESC
      LIMIT ? OFFSET ?
    `, [businessId, limit, offset]);
  }

  // Compter les récompenses d'un client
  static async countByCustomer(customerId) {
    const result = queryOne('SELECT COUNT(*) as count FROM rewards WHERE customer_id = ?', [customerId]);
    return result ? result.count : 0;
  }

  // Compter les récompenses distribuées par une entreprise
  static async countByBusiness(businessId) {
    const result = queryOne('SELECT COUNT(*) as count FROM rewards WHERE business_id = ?', [businessId]);
    return result ? result.count : 0;
  }

  // Obtenir une récompense par ID
  static async findById(id) {
    return queryOne('SELECT * FROM rewards WHERE id = ?', [id]);
  }
}

module.exports = Reward;
