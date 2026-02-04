const { getDb } = require('../config/database');

class StatsService {
  // Obtenir les statistiques générales pour une entreprise
  static async getBusinessStats(businessId) {
    try {
      const db = getDb();

      // Récupérer tous les achats de cette entreprise
      const { data: purchases, error: purchasesError } = await db
        .from('purchases')
        .select('customer_id, points_added, is_reward, purchase_date')
        .eq('business_id', businessId);

      if (purchasesError) throw purchasesError;

      // Récupérer toutes les récompenses de cette entreprise
      const { data: rewards, error: rewardsError } = await db
        .from('rewards')
        .select('id')
        .eq('business_id', businessId);

      if (rewardsError) throw rewardsError;

      // Calculer les statistiques
      const uniqueCustomers = new Set(purchases.map(p => p.customer_id));
      const totalCustomers = uniqueCustomers.size;

      // Somme des points ajoutés (seulement les non-récompenses)
      const totalPurchases = purchases
        .filter(p => !p.is_reward)
        .reduce((sum, p) => sum + (p.points_added || 0), 0);

      const totalRewards = rewards ? rewards.length : 0;

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
      const db = getDb();

      // Date de début
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: purchases, error } = await db
        .from('purchases')
        .select('purchase_date, points_added')
        .eq('business_id', businessId)
        .eq('is_reward', false)
        .gte('purchase_date', startDate.toISOString());

      if (error) throw error;

      // Grouper par date
      const salesByDate = {};
      purchases.forEach(p => {
        const date = p.purchase_date.split('T')[0];
        if (!salesByDate[date]) {
          salesByDate[date] = 0;
        }
        salesByDate[date] += p.points_added || 0;
      });

      // Convertir en array et trier
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
      const db = getDb();

      // Récupérer tous les achats pour cette entreprise
      const { data: purchases, error: purchasesError } = await db
        .from('purchases')
        .select('customer_id')
        .eq('business_id', businessId);

      if (purchasesError) throw purchasesError;

      // Compter les achats par client
      const customerPurchases = {};
      purchases.forEach(p => {
        if (!customerPurchases[p.customer_id]) {
          customerPurchases[p.customer_id] = 0;
        }
        customerPurchases[p.customer_id]++;
      });

      // Obtenir les IDs des top clients
      const topCustomerIds = Object.entries(customerPurchases)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => parseInt(id));

      if (topCustomerIds.length === 0) {
        return [];
      }

      // Récupérer les infos des top clients
      const { data: customers, error: customersError } = await db
        .from('customer_profiles')
        .select('id, first_name, last_name, points, total_purchases, total_rewards, last_purchase_date')
        .in('id', topCustomerIds);

      if (customersError) throw customersError;

      // Ajouter le compteur et trier
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
