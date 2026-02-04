const BusinessProfile = require('../models/BusinessProfile');
const CustomerProfile = require('../models/CustomerProfile');
const LoyaltyService = require('../services/loyaltyService');
const StatsService = require('../services/statsService');
const { query, queryOne } = require('../config/database');

// Obtenir le profil entreprise
async function getProfile(req, res) {
  try {
    const { profileId } = req.user;

    const profile = await BusinessProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      id: profile.id,
      businessName: profile.business_name,
      contactName: profile.contact_name,
      phone: profile.phone
    });
  } catch (error) {
    console.error('Get business profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Scanner un QR code client
async function scanQRCode(req, res) {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ error: 'QR data is required' });
    }

    let parsedData;
    try {
      parsedData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid QR code format' });
    }

    if (parsedData.app !== 'fideleatome' || parsedData.type !== 'customer') {
      return res.status(400).json({ error: 'Invalid QR code' });
    }

    const customer = await CustomerProfile.findByQRToken(parsedData.token);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    if (customer.id !== parsedData.id) {
      return res.status(400).json({ error: 'QR code mismatch' });
    }

    const stats = await LoyaltyService.getCustomerStats(customer.id);

    res.json({
      success: true,
      customer: {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        points: customer.points,
        totalPurchases: customer.total_purchases,
        totalRewards: customer.total_rewards,
        lastPurchaseDate: customer.last_purchase_date
      },
      stats
    });
  } catch (error) {
    console.error('Scan QR code error:', error);
    res.status(500).json({
      error: 'Failed to scan QR code',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Ajouter un ou plusieurs points à un client
async function addPoint(req, res) {
  try {
    const { customerId, quantity = 1 } = req.body;
    const { profileId } = req.user;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const pointsToAdd = Math.max(1, Math.min(100, parseInt(quantity) || 1));

    const result = await LoyaltyService.addPoint(customerId, profileId, pointsToAdd);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error('Add point error:', error);
    res.status(500).json({
      error: 'Failed to add point',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Obtenir la liste des clients
async function getCustomers(req, res) {
  try {
    const { profileId } = req.user;
    const { limit = 50, offset = 0, search = '' } = req.query;

    // Récupérer tous les achats de cette entreprise pour identifier les clients
    const purchases = query('SELECT customer_id FROM purchases WHERE business_id = ?', [profileId]);

    const customerIds = [...new Set(purchases.map(p => p.customer_id))];

    if (customerIds.length === 0) {
      return res.json({
        customers: [],
        pagination: {
          total: 0,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: false
        }
      });
    }

    const placeholders = customerIds.map(() => '?').join(',');
    let queryStr = `
      SELECT * FROM customer_profiles
      WHERE id IN (${placeholders})
    `;
    let params = [...customerIds];

    if (search) {
      queryStr += ` AND (first_name LIKE ? OR last_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    queryStr += ` ORDER BY CASE WHEN last_purchase_date IS NULL THEN 1 ELSE 0 END, last_purchase_date DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const customers = query(queryStr, params);

    // Compter le total
    let countQuery = `SELECT COUNT(*) as count FROM customer_profiles WHERE id IN (${placeholders})`;
    let countParams = [...customerIds];
    if (search) {
      countQuery += ` AND (first_name LIKE ? OR last_name LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const countResult = queryOne(countQuery, countParams);
    const total = countResult ? countResult.count : 0;

    res.json({
      customers: customers.map(c => ({
        id: c.id,
        firstName: c.first_name,
        lastName: c.last_name,
        points: c.points,
        totalPurchases: c.total_purchases,
        totalRewards: c.total_rewards,
        lastPurchaseDate: c.last_purchase_date
      })),
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + customers.length) < total
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      error: 'Failed to get customers',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Obtenir les détails d'un client
async function getCustomerDetails(req, res) {
  try {
    const { id } = req.params;

    const customer = await CustomerProfile.findById(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const stats = await LoyaltyService.getCustomerStats(id);

    res.json({
      customer: {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        qrToken: customer.qr_code_token,
        points: customer.points,
        totalPurchases: customer.total_purchases,
        totalRewards: customer.total_rewards,
        firstPurchaseDate: customer.first_purchase_date,
        lastPurchaseDate: customer.last_purchase_date
      },
      stats
    });
  } catch (error) {
    console.error('Get customer details error:', error);
    res.status(500).json({
      error: 'Failed to get customer details',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Obtenir les statistiques générales
async function getStats(req, res) {
  try {
    const { profileId } = req.user;

    const stats = await StatsService.getBusinessStats(profileId);

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get stats',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Obtenir les statistiques de ventes par période
async function getSalesStats(req, res) {
  try {
    const { profileId } = req.user;
    const { days = 30 } = req.query;

    const sales = await StatsService.getSalesByPeriod(profileId, parseInt(days));

    res.json({ sales });
  } catch (error) {
    console.error('Get sales stats error:', error);
    res.status(500).json({
      error: 'Failed to get sales stats',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Obtenir les meilleurs clients
async function getTopCustomers(req, res) {
  try {
    const { profileId } = req.user;
    const { limit = 10 } = req.query;

    const customers = await StatsService.getTopCustomers(profileId, parseInt(limit));

    res.json({ customers });
  } catch (error) {
    console.error('Get top customers error:', error);
    res.status(500).json({
      error: 'Failed to get top customers',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  getProfile,
  scanQRCode,
  addPoint,
  getCustomers,
  getCustomerDetails,
  getStats,
  getSalesStats,
  getTopCustomers
};
