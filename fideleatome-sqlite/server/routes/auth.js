const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  registerCustomer,
  registerBusiness,
  login,
  getMe
} = require('../controllers/authController');

// Routes publiques
router.post('/register/customer', registerCustomer);
router.post('/register/business', registerBusiness);
router.post('/login', login);

// Routes protégées
router.get('/me', authenticate, getMe);

module.exports = router;
