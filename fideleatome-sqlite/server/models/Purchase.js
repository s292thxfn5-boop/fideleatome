const { query, queryOne, run } = require('../config/database');

class Purchase {
  // Créer un achat
  static async create(purchaseData) {
    const {
      customer_id,
      business_id,
      points_added = 1,
      is_reward = 0,
      notes = null
    } = purchaseData;

    const result = run(
      'INSERT INTO purchases (customer_id, business_id, points_added, is_reward, notes) VALUES (?, ?, ?, ?, ?)',
      [customer_id, business_id, points_added, is_reward, notes]
    );

    return result.lastInsertRowid;
  }

  // Obtenir l'historique des achats d'un client
  static async getByCustomer(customerId, limit = 50, offset = 0) {
    return query(`
      SELECT p.*, bp.business_name
      FROM purchases p
      LEFT JOIN business_profiles bp ON p.business_id = bp.id
      WHERE p.customer_id = ?
      ORDER BY p.purchase_date DESC
      LIMIT ? OFFSET ?
    `, [customerId, limit, offset]);
  }

  // Obtenir les achats d'une entreprise
  static async getByBusiness(businessId, limit = 50, offset = 0) {
    return query(`
      SELECT p.*, cp.first_name, cp.last_name
      FROM purchases p
      LEFT JOIN customer_profiles cp ON p.customer_id = cp.id
      WHERE p.business_id = ?
      ORDER BY p.purchase_date DESC
      LIMIT ? OFFSET ?
    `, [businessId, limit, offset]);
  }

  // Compter les achats d'un client
  static async countByCustomer(customerId) {
    const result = queryOne('SELECT COUNT(*) as count FROM purchases WHERE customer_id = ?', [customerId]);
    return result ? result.count : 0;
  }

  // Compter les achats d'une entreprise
  static async countByBusiness(businessId) {
    const result = queryOne('SELECT COUNT(*) as count FROM purchases WHERE business_id = ?', [businessId]);
    return result ? result.count : 0;
  }

  // Obtenir le dernier achat d'un client
  static async getLastPurchase(customerId) {
    return queryOne(`
      SELECT * FROM purchases
      WHERE customer_id = ?
      ORDER BY purchase_date DESC
      LIMIT 1
    `, [customerId]);
  }

  // Obtenir un achat par ID
  static async findById(id) {
    return queryOne('SELECT * FROM purchases WHERE id = ?', [id]);
  }
}

module.exports = Purchase;
