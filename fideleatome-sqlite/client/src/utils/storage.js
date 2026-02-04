// Clé pour le token dans localStorage
const TOKEN_KEY = 'fideleatome_token';
const USER_KEY = 'fideleatome_user';

// Sauvegarder le token
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Récupérer le token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Supprimer le token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Sauvegarder les infos utilisateur
export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Récupérer les infos utilisateur
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Supprimer les infos utilisateur
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Déconnexion complète
export const clearAuth = () => {
  removeToken();
  removeUser();
};

// Décoder le JWT (base64)
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Vérifier si le token est expiré
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
