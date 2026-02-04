import apiClient from './client';
import { saveToken, saveUser, clearAuth } from '../utils/storage';

// Inscription client
export const registerCustomer = async (data) => {
  const response = await apiClient.post('/auth/register/customer', {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName
  });

  const { token, user } = response.data;
  saveToken(token);
  saveUser(user);

  return user;
};

// Inscription entreprise
export const registerBusiness = async (data) => {
  const response = await apiClient.post('/auth/register/business', {
    email: data.email,
    password: data.password,
    businessName: data.businessName,
    contactName: data.contactName,
    phone: data.phone
  });

  const { token, user } = response.data;
  saveToken(token);
  saveUser(user);

  return user;
};

// Connexion
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password
  });

  const { token, user } = response.data;
  saveToken(token);
  saveUser(user);

  return user;
};

// Récupérer le profil utilisateur
export const getProfile = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// Déconnexion
export const logout = async () => {
  clearAuth();
};
