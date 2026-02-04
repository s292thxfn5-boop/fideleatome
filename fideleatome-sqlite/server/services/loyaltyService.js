const CustomerProfile = require('../models/CustomerProfile');
const Purchase = require('../models/Purchase');
const Reward = require('../models/Reward');

const POINTS_REQUIRED = 15;

class LoyaltyService {
  // Ajouter un ou plusieurs points à un client
  static async addPoint(customerId, businessId, quantity = 1) {
    try {
      const customer = await CustomerProfile.findById(customerId);

      if (!customer) {
        return { success: false, error: 'Customer not found' };
      }

      const pointsToAdd = Math.max(1, Math.min(100, parseInt(quantity) || 1));

      // Créer l'achat
      const purchaseId = await Purchase.create({
        customer_id: customerId,
        business_id: businessId,
        points_added: pointsToAdd,
        is_reward: 0
      });

      // Calculer les nouveaux points
      let currentPoints = customer.points + pointsToAdd;
      const newTotalPurchases = customer.total_purchases + pointsToAdd;
      const now = new Date().toISOString();
      let rewardsEarned = 0;

      // Calculer combien de récompenses ont été gagnées
      while (currentPoints >= POINTS_REQUIRED) {
        rewardsEarned++;
        currentPoints -= POINTS_REQUIRED;
      }

      // Créer les récompenses si nécessaire
      if (rewardsEarned > 0) {
        for (let i = 0; i < rewardsEarned; i++) {
          await Reward.create({
            customer_id: customerId,
            business_id: businessId,
            purchase_id: purchaseId
          });
        }

        await CustomerProfile.update(customerId, {
          points: currentPoints,
          total_purchases: newTotalPurchases,
          total_rewards: customer.total_rewards + rewardsEarned,
          last_purchase_date: now,
          first_purchase_date: customer.first_purchase_date || now
        });

        return {
          success: true,
          rewardEarned: true,
          rewardsCount: rewardsEarned,
          newPoints: currentPoints,
          totalPurchases: newTotalPurchases,
          totalRewards: customer.total_rewards + rewardsEarned,
          message: rewardsEarned > 1
            ? `Félicitations ! ${rewardsEarned} bobines gratuites obtenues !`
            : 'Félicitations ! Bobine gratuite obtenue !'
        };
      } else {
        await CustomerProfile.update(customerId, {
          points: currentPoints,
          total_purchases: newTotalPurchases,
          last_purchase_date: now,
          first_purchase_date: customer.first_purchase_date || now
        });

        const pointsAddedText = pointsToAdd > 1 ? `${pointsToAdd} points ajoutés` : 'Point ajouté';
        return {
          success: true,
          rewardEarned: false,
          newPoints: currentPoints,
          remaining: POINTS_REQUIRED - currentPoints,
          totalPurchases: newTotalPurchases,
          message: `${pointsAddedText} ! ${currentPoints}/${POINTS_REQUIRED}`
        };
      }
    } catch (error) {
      console.error('Add point error:', error);
      return {
        success: false,
        error: 'Failed to add point',
        details: error.message
      };
    }
  }

  // Obtenir les statistiques d'un client
  static async getCustomerStats(customerId) {
    const customer = await CustomerProfile.findById(customerId);

    if (!customer) {
      return null;
    }

    return {
      points: customer.points,
      pointsRequired: POINTS_REQUIRED,
      remaining: Math.max(0, POINTS_REQUIRED - customer.points),
      totalPurchases: customer.total_purchases,
      totalRewards: customer.total_rewards,
      progress: Math.min(100, (customer.points / POINTS_REQUIRED) * 100),
      firstPurchaseDate: customer.first_purchase_date,
      lastPurchaseDate: customer.last_purchase_date
    };
  }
}

module.exports = LoyaltyService;
