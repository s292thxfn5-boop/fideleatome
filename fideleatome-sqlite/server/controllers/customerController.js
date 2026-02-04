const CustomerProfile = require('../models/CustomerProfile');
const Purchase = require('../models/Purchase');
const Reward = require('../models/Reward');
const QRCodeService = require('../services/qrCodeService');

// Obtenir le profil client complet
async function getProfile(req, res) {
  try {
    const { profileId } = req.user;

    const profile = await CustomerProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      points: profile.points,
      totalPurchases: profile.total_purchases,
      totalRewards: profile.total_rewards,
      firstPurchaseDate: profile.first_purchase_date,
      lastPurchaseDate: profile.last_purchase_date
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Générer un QR code pour le client
async function getQRCode(req, res) {
  try {
    const { profileId } = req.user;

    const profile = await CustomerProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const qrCodeData = QRCodeService.generateQRCode(
      profile.id,
      profile.qr_code_token
    );

    res.json({
      qrCode: qrCodeData,
      expiresIn: 300
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({
      error: 'Failed to generate QR code',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Obtenir les informations de fidélité
async function getLoyaltyInfo(req, res) {
  try {
    const { profileId } = req.user;

    const profile = await CustomerProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const POINTS_REQUIRED = 15;

    res.json({
      points: profile.points,
      pointsRequired: POINTS_REQUIRED,
      remaining: Math.max(0, POINTS_REQUIRED - profile.points),
      totalPurchases: profile.total_purchases,
      totalRewards: profile.total_rewards,
      progress: Math.min(100, (profile.points / POINTS_REQUIRED) * 100)
    });
  } catch (error) {
    console.error('Get loyalty info error:', error);
    res.status(500).json({
      error: 'Failed to get loyalty info',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Obtenir l'historique des achats
async function getPurchaseHistory(req, res) {
  try {
    const { profileId } = req.user;
    const { limit = 50, offset = 0 } = req.query;

    const purchases = await Purchase.getByCustomer(
      profileId,
      parseInt(limit),
      parseInt(offset)
    );

    const totalCount = await Purchase.countByCustomer(profileId);

    res.json({
      purchases: purchases.map(p => ({
        id: p.id,
        pointsAdded: p.points_added,
        isReward: p.is_reward === 1,
        purchaseDate: p.purchase_date,
        businessName: p.business_name,
        notes: p.notes
      })),
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + purchases.length) < totalCount
      }
    });
  } catch (error) {
    console.error('Get purchase history error:', error);
    res.status(500).json({
      error: 'Failed to get purchase history',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Obtenir l'historique des récompenses
async function getRewardHistory(req, res) {
  try {
    const { profileId } = req.user;
    const { limit = 50, offset = 0 } = req.query;

    const rewards = await Reward.getByCustomer(
      profileId,
      parseInt(limit),
      parseInt(offset)
    );

    const totalCount = await Reward.countByCustomer(profileId);

    res.json({
      rewards: rewards.map(r => ({
        id: r.id,
        rewardDate: r.reward_date,
        businessName: r.business_name
      })),
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + rewards.length) < totalCount
      }
    });
  } catch (error) {
    console.error('Get reward history error:', error);
    res.status(500).json({
      error: 'Failed to get reward history',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  getProfile,
  getQRCode,
  getLoyaltyInfo,
  getPurchaseHistory,
  getRewardHistory
};
