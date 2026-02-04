const jwt = require('jsonwebtoken');
const CustomerProfile = require('../models/CustomerProfile');

class QRCodeService {
  // Générer un QR code JWT temporaire pour un client
  static generateQRCode(customerId, qrToken) {
    const secret = process.env.QR_SECRET || process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('QR_SECRET is not defined in environment variables');
    }

    const payload = {
      customerId,
      qrToken,
      type: 'loyalty_card',
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, secret, { expiresIn: '5m' });
  }

  // Valider un QR code scanné
  static async validateQRCode(qrData) {
    try {
      const secret = process.env.QR_SECRET || process.env.JWT_SECRET;

      if (!secret) {
        return { valid: false, error: 'QR secret not configured' };
      }

      const decoded = jwt.verify(qrData, secret);

      if (decoded.type !== 'loyalty_card') {
        return { valid: false, error: 'Invalid QR code type' };
      }

      const customer = await CustomerProfile.findByQRToken(decoded.qrToken);

      if (!customer) {
        return { valid: false, error: 'Customer not found' };
      }

      if (customer.id !== decoded.customerId) {
        return { valid: false, error: 'QR code mismatch' };
      }

      return {
        valid: true,
        customerId: decoded.customerId,
        customer
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { valid: false, error: 'QR code expired. Please refresh your card.' };
      }

      if (error.name === 'JsonWebTokenError') {
        return { valid: false, error: 'Invalid QR code' };
      }

      return { valid: false, error: 'QR code validation failed' };
    }
  }
}

module.exports = QRCodeService;
