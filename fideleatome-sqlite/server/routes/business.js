const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authenticate = require('../middleware/auth');
const { requireBusiness } = require('../middleware/roleCheck');
const {
  getProfile,
  scanQRCode,
  addPoint,
  getCustomers,
  getCustomerDetails,
  getStats,
  getSalesStats,
  getTopCustomers
} = require('../controllers/businessController');

// Toutes les routes nécessitent l'authentification + rôle business
router.use(authenticate);
router.use(requireBusiness);

// Rate limiting pour add-point (max 60 requêtes par minute par IP)
const addPointLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please try again later.' }
});

// Routes
router.get('/profile', getProfile);

// Scanner et gestion des points
router.post('/scan', scanQRCode);
router.post('/add-point', addPointLimiter, addPoint);

// Gestion des clients
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerDetails);

// Statistiques
router.get('/stats', getStats);
router.get('/stats/sales', getSalesStats);
router.get('/stats/top-customers', getTopCustomers);

module.exports = router;
