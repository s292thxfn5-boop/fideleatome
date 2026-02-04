const { query, queryOne } = require('../config/database');

class StatsService {
  // Obtenir les statistiques générales pour une entreprise
  static async getBusinessStats(businessId) {
    try {
      // Récupérer tous les achats de cette entreprise
      const purchases = query(`
        SELECT customer_id, points_added, is_reward, purchase_date
        FROM purchases WHERE business_id = ?
      `, [businessId]);

      // Récupérer toutes les récompenses de cette entreprise
      const rewards = query('SELECT id FROM rewards WHERE business_id = ?', [businessId]);

      // Calculer les statistiques
      const uniqueCustomers = new Set(purchases.map(p => p.customer_id));
      const totalCustomers = uniqueCustomers.size;

      const totalPurchases = purchases
        .filter(p => !p.is_reward)
        .reduce((sum, p) => sum + (p.points_added || 0), 0);

      const totalRewards = rewards.length;

      // Ventes aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const todaySales = purchases
        .filter(p => !p.is_reward && p.purchase_date && p.purchase_date.startsWith(today))
        .reduce((sum, p) => sum + (p.points_added || 0), 0);

      return {
        totalCustomers,
        totalPurchases,
        totalRewards,
        todaySales
      };
    } catch (error) {
      console.error('Get business stats error:', error);
      throw error;
    }
  }

  // Obtenir les ventes par période
  static async getSalesByPeriod(businessId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const purchases = query(`
        SELECT purchase_date, points_added
        FROM purchases
        WHERE business_id = ? AND is_reward = 0 AND purchase_date >= ?
      `, [businessId, startDate.toISOString()]);

      // Grouper par date
      const salesByDate = {};
      purchases.forEach(p => {
        const date = p.purchase_date.split('T')[0];
        if (!salesByDate[date]) {
          salesByDate[date] = 0;
        }
        salesByDate[date] += p.points_added || 0;
      });

      return Object.keys(salesByDate)
        .map(date => ({
          date,
          count: salesByDate[date]
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Get sales by period error:', error);
      throw error;
    }
  }

  // Obtenir les meilleurs clients
  static async getTopCustomers(businessId, limit = 10) {
    try {
      const purchases = query('SELECT customer_id FROM purchases WHERE business_id = ?', [businessId]);

      const customerPurchases = {};
      purchases.forEach(p => {
        if (!customerPurchases[p.customer_id]) {
          customerPurchases[p.customer_id] = 0;
        }
        customerPurchases[p.customer_id]++;
      });

      const topCustomerIds = Object.entries(customerPurchases)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => parseInt(id));

      if (topCustomerIds.length === 0) {
        return [];
      }

      const placeholders = topCustomerIds.map(() => '?').join(',');
      const customers = query(`
        SELECT id, first_name, last_name, points, total_purchases, total_rewards, last_purchase_date
        FROM customer_profiles
        WHERE id IN (${placeholders})
      `, topCustomerIds);

      return customers
        .map(c => ({
          id: c.id,
          firstName: c.first_name,
          lastName: c.last_name,
          points: c.points,
          totalPurchases: c.total_purchases,
          totalRewards: c.total_rewards,
          lastPurchaseDate: c.last_purchase_date,
          purchaseCount: customerPurchases[c.id]
        }))
        .sort((a, b) => b.purchaseCount - a.purchaseCount);
    } catch (error) {
      console.error('Get top customers error:', error);
      throw error;
    }
  }
}

module.exports = StatsService;
