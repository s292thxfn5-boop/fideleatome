const crypto = require('crypto');

// Générer un QR code token unique
function generateQRToken(customerId) {
  const randomBytes = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();

  const hash = crypto
    .createHash('sha256')
    .update(`${customerId}-${randomBytes}-${timestamp}`)
    .digest('hex');

  return hash;
}

// Générer un ID unique
function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  generateQRToken,
  generateUniqueId
};
