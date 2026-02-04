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

      // Calculer les nouveaux points
      let currentPoints = customer.points + pointsToAdd;
      const newTotalPurchases = customer.total_purchases + pointsToAdd;
      const now = new Date().toISOString();

      let rewards = [];
      let totalNewRewards = 0;

      // Vérifier les récompenses gagnées (du plus haut au plus bas)
      while (currentPoints >= REWARD_TIERS.BOBINE.points) {
        rewards.push(REWARD_TIERS.BOBINE.name);
        totalNewRewards++;
        currentPoints -= REWARD_TIERS.BOBINE.points;

        await Reward.create({
          customer_id: customerId,
          business_id: businessId,
          purchase_id: purchaseId,
          reward_type: 'bobine'
        });
      }

      while (currentPoints >= REWARD_TIERS.ACCESSORY.points) {
        rewards.push(REWARD_TIERS.ACCESSORY.name);
        totalNewRewards++;
        currentPoints -= REWARD_TIERS.ACCESSORY.points;

        await Reward.create({
          customer_id: customerId,
          business_id: businessId,
          purchase_id: purchaseId,
          reward_type: 'accessory'
        });
      }

      // Mettre à jour le profil
      await CustomerProfile.update(customerId, {
        points: currentPoints,
        total_purchases: newTotalPurchases,
        total_rewards: customer.total_rewards + totalNewRewards,
        last_purchase_date: now,
        first_purchase_date: customer.first_purchase_date || now
      });

      if (rewards.length > 0) {
        return {
          success: true,
          rewardEarned: true,
          rewards: rewards,
          newPoints: currentPoints,
          totalPurchases: newTotalPurchases,
          totalRewards: customer.total_rewards + totalNewRewards,
          message: `Félicitations ! ${rewards.join(' + ')}`
        };
      } else {
        const pointsAddedText = pointsToAdd > 1 ? `${pointsToAdd} points ajoutés` : 'Point ajouté';
        const nextReward = currentPoints < REWARD_TIERS.ACCESSORY.points
          ? { name: REWARD_TIERS.ACCESSORY.name, remaining: REWARD_TIERS.ACCESSORY.points - currentPoints }
          : { name: REWARD_TIERS.BOBINE.name, remaining: REWARD_TIERS.BOBINE.points - currentPoints };

        return {
          success: true,
          rewardEarned: false,
          newPoints: currentPoints,
          remaining: nextReward.remaining,
          nextReward: nextReward.name,
          totalPurchases: newTotalPurchases,
          message: `${pointsAddedText} ! ${currentPoints} points - Plus que ${nextReward.remaining} pour ${nextReward.name}`
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
