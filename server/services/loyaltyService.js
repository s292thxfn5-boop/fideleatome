const CustomerProfile = require('../models/CustomerProfile');
const Purchase = require('../models/Purchase');
const Reward = require('../models/Reward');

// Paliers de récompenses
const REWARD_TIERS = {
  ACCESSORY: { points: 7, name: 'Accessoire offert' },
  BOBINE: { points: 15, name: 'Bobine Bambu Lab (blanc ou noir) refill PLA' }
};

class LoyaltyService {
  // Ajouter un ou plusieurs points à un client
  static async addPoint(customerId, businessId, quantity = 1) {
    try {
      const customer = await CustomerProfile.findById(customerId);

      if (!customer) {
        return { success: false, error: 'Customer not found' };
      }

      // Valider la quantité
      const pointsToAdd = Math.max(1, Math.min(100, parseInt(quantity) || 1));

      // Créer l'achat
      const purchaseId = await Purchase.create({
        customer_id: customerId,
        business_id: businessId,
        points_added: pointsToAdd,
        is_reward: 0
      });

      // Calculer les récompenses gagnées
      // Cycle de 15 points : accessoire à 7, bobine à 15 (reset à 0)
      let currentPoints = customer.points || 0;
      let remaining = pointsToAdd;
      const rewards = [];

      while (remaining > 0) {
        if (currentPoints < REWARD_TIERS.ACCESSORY.points) {
          const gap = REWARD_TIERS.ACCESSORY.points - currentPoints;
          if (remaining >= gap) {
            remaining -= gap;
            currentPoints = REWARD_TIERS.ACCESSORY.points;
            rewards.push({ type: 'accessory', name: REWARD_TIERS.ACCESSORY.name });
          } else {
            currentPoints += remaining;
            remaining = 0;
          }
        }

        if (remaining > 0 && currentPoints >= REWARD_TIERS.ACCESSORY.points) {
          const gap = REWARD_TIERS.BOBINE.points - currentPoints;
          if (remaining >= gap) {
            remaining -= gap;
            currentPoints = 0;
            rewards.push({ type: 'bobine', name: REWARD_TIERS.BOBINE.name });
          } else {
            currentPoints += remaining;
            remaining = 0;
          }
        }
      }

      const newTotalPurchases = (customer.total_purchases || 0) + pointsToAdd;
      const newTotalRewards = (customer.total_rewards || 0) + rewards.length;
      const now = new Date().toISOString();

      // Créer les récompenses en base
      for (const reward of rewards) {
        await Reward.create({
          customer_id: customerId,
          business_id: businessId,
          purchase_id: purchaseId,
          reward_type: reward.type
        });
      }

      // Mettre à jour le profil
      await CustomerProfile.update(customerId, {
        points: currentPoints,
        total_purchases: newTotalPurchases,
        total_rewards: newTotalRewards,
        last_purchase_date: now,
        first_purchase_date: customer.first_purchase_date || now
      });

      if (rewards.length > 0) {
        return {
          success: true,
          rewardEarned: true,
          rewards: rewards.map(r => r.name),
          newPoints: currentPoints,
          totalPurchases: newTotalPurchases,
          totalRewards: newTotalRewards,
          message: `Félicitations ! ${rewards.map(r => r.name).join(' + ')}`
        };
      } else {
        const pointsAddedText = pointsToAdd > 1 ? `${pointsToAdd} points ajoutés` : 'Point ajouté';
        const nextThreshold = currentPoints < REWARD_TIERS.ACCESSORY.points
          ? REWARD_TIERS.ACCESSORY
          : REWARD_TIERS.BOBINE;
        const remainingPts = nextThreshold.points - currentPoints;

        return {
          success: true,
          rewardEarned: false,
          newPoints: currentPoints,
          remaining: remainingPts,
          nextReward: nextThreshold.name,
          totalPurchases: newTotalPurchases,
          totalRewards: newTotalRewards,
          message: `${pointsAddedText} ! ${currentPoints} points - Plus que ${remainingPts} pour ${nextThreshold.name}`
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

    const points = customer.points;
    let nextReward, remaining, progress;

    if (points < REWARD_TIERS.ACCESSORY.points) {
      nextReward = REWARD_TIERS.ACCESSORY.name;
      remaining = REWARD_TIERS.ACCESSORY.points - points;
      progress = (points / REWARD_TIERS.ACCESSORY.points) * 100;
    } else {
      nextReward = REWARD_TIERS.BOBINE.name;
      remaining = REWARD_TIERS.BOBINE.points - points;
      progress = (points / REWARD_TIERS.BOBINE.points) * 100;
    }

    return {
      points: points,
      tiers: REWARD_TIERS,
      nextReward: nextReward,
      remaining: remaining,
      totalPurchases: customer.total_purchases,
      totalRewards: customer.total_rewards,
      progress: Math.min(100, progress),
      firstPurchaseDate: customer.first_purchase_date,
      lastPurchaseDate: customer.last_purchase_date
    };
  }
}

module.exports = LoyaltyService;
