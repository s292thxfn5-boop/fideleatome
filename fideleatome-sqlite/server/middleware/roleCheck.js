// Middleware pour vérifier le rôle de l'utilisateur
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error: 'Access forbidden',
        message: `This route requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

// Middleware spécifique pour les clients
function requireCustomer(req, res, next) {
  return requireRole('customer')(req, res, next);
}

// Middleware spécifique pour les entreprises
function requireBusiness(req, res, next) {
  return requireRole('business')(req, res, next);
}

module.exports = {
  requireRole,
  requireCustomer,
  requireBusiness
};
