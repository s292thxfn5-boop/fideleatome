import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, logout as apiLogout } from '../api/auth';
import { getToken, isTokenExpired, clearAuth } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();

        // Pas de token ou token expiré → pas connecté
        if (!token || isTokenExpired(token)) {
          clearAuth();
          setLoading(false);
          return;
        }

        // Token valide → récupérer le profil complet depuis le serveur
        const profile = await getProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logoutUser = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData) => {
    setUser({ ...user, ...updatedData });
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    loginUser,
    logoutUser,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
