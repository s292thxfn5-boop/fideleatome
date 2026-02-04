const jwt = require('jsonwebtoken');

// Générer un JWT pour l'authentification
function generateToken(payload, expiresIn = null) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const options = {};
  if (expiresIn) {
    options.expiresIn = expiresIn;
  } else {
    options.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  return jwt.sign(payload, secret, options);
}

// Générer un refresh token
function generateRefreshToken(payload) {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    payload,
    secret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
}

// Vérifier un JWT
function verifyToken(token, isRefreshToken = false) {
  const secret = isRefreshToken
    ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    : process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT secret is not defined');
  }

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken
};
