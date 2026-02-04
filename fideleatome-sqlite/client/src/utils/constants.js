// Nombre de points requis pour obtenir une récompense
export const POINTS_REQUIRED = 15;

// Rôles utilisateur
export const ROLES = {
  CUSTOMER: 'customer',
  BUSINESS: 'business'
};

// Routes de l'application
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER_CHOICE: '/register',
  REGISTER_CUSTOMER: '/register/customer',
  REGISTER_BUSINESS: '/register/business',

  // Routes client
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_QRCODE: '/customer/qrcode',
  CUSTOMER_PROGRESS: '/customer/progress',
  CUSTOMER_HISTORY: '/customer/history',

  // Routes entreprise
  BUSINESS_DASHBOARD: '/business/dashboard',
  BUSINESS_SCANNER: '/business/scanner',
  BUSINESS_CUSTOMERS: '/business/customers',
  BUSINESS_STATISTICS: '/business/statistics'
};

// Messages
export const MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  ERROR_NETWORK: 'Erreur de connexion au serveur',
  ERROR_UNAUTHORIZED: 'Session expirée, veuillez vous reconnecter',
  REWARD_EARNED: 'Félicitations ! Bobine gratuite obtenue !',
  POINT_ADDED: 'Point ajouté avec succès'
};

// API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
