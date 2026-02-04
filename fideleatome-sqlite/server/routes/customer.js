const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { requireCustomer } = require('../middleware/roleCheck');
const {
  getProfile,
  getQRCode,
  getLoyaltyInfo,
  getPurchaseHistory,
  getRewardHistory
} = require('../controllers/customerController');

// Toutes les routes nécessitent l'authentification + rôle customer
router.use(authenticate);
router.use(requireCustomer);

// Routes
router.get('/profile', getProfile);
router.get('/qrcode', getQRCode);
router.get('/loyalty', getLoyaltyInfo);
router.get('/history', getPurchaseHistory);
router.get('/rewards', getRewardHistory);

module.exports = router;
