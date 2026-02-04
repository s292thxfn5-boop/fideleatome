const { verifyToken } = require('../utils/generateToken');

// Middleware pour vérifier le JWT
function authenticate(req, res, next) {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'No authorization token provided'
      });
    }

    // Format attendu: "Bearer TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Invalid authorization format. Expected: Bearer <token>'
      });
    }

    const token = parts[1];

    // Vérifier le token
    const decoded = verifyToken(token);

    // Ajouter les infos utilisateur à la requête
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      profileId: decoded.profileId
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(500).json({
      error: 'Authentication error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = authenticate;
