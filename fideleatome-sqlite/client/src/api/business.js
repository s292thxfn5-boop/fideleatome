import { supabase } from '../config/supabase';
import CryptoJS from 'crypto-js';

const QR_SECRET = 'fideleatome-qr-secret-2024';
const POINTS_REQUIRED = 15;

// Scanner un QR code client
export const scanQRCode = async (qrData) => {
  try {
    console.log('QR Data reçu:', qrData);

    let parsed;
    try {
      parsed = JSON.parse(qrData);
    } catch (e) {
      console.error('Erreur parsing JSON:', e);
      throw new Error('QR Code non reconnu (pas du JSON)');
    }

    console.log('QR Data parsé:', parsed);

    if (parsed.app !== 'fideleatome' || parsed.type !== 'customer') {
      console.error('App ou type invalide:', parsed.app, parsed.type);
      throw new Error('QR Code invalide (app: ' + parsed.app + ', type: ' + parsed.type + ')');
    }

    // Utiliser l'ID directement (mode local) ou décrypter le token
    let customerId = parsed.id || parsed.token;

    // Si le token ressemble à du crypté, essayer de le décrypter
    if (customerId && customerId.length > 50) {
      try {
        const decrypted = CryptoJS.AES.decrypt(customerId, QR_SECRET);
        const decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        customerId = decryptedData.customerId;
      } catch (e) {
        // Pas crypté, utiliser tel quel
      }
    }

    console.log('Customer ID:', customerId);

    if (!customerId) {
      throw new Error('ID client manquant dans le QR code');
    }

    // Récupérer le profil client
    let { data: customer, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', customerId)
      .single();

    console.log('Résultat recherche client:', customer, error);

    // Si le client n'existe pas, le créer automatiquement avec les infos du QR code
    if (!customer && parsed.first_name && parsed.last_name) {
      console.log('Client non trouvé, création automatique...');

      const newCustomer = {
        id: customerId,
        user_id: customerId,
        first_name: parsed.first_name,
        last_name: parsed.last_name,
        points: parsed.points || 0,
      };

      const { data: createdCustomer, error: createError } = await supabase
        .from('customer_profiles')
        .insert([newCustomer])
        .select()
        .single();

      if (createError) {
        console.error('Erreur création client:', createError);
        throw new Error('Impossible de créer le client');
      }

      customer = createdCustomer || newCustomer;
      console.log('Client créé:', customer);
    }

    if (!customer) {
      throw new Error('Client non trouvé (ID: ' + customerId + ')');
    }

    return { customer };
  } catch (error) {
    console.error('Erreur scan:', error);
    throw error;
  }
};

// Ajouter un ou plusieurs points à un client
export const addPoint = async (customerId, quantity = 1) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: businessProfile } = await supabase
    .from('business_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!businessProfile) throw new Error('Profil entreprise non trouvé');

  // Récupérer le client
  const { data: customer, error: customerError } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', customerId)
    .single();

  if (customerError || !customer) throw new Error('Client non trouvé');

  const pointsToAdd = Math.max(1, Math.min(100, parseInt(quantity) || 1));
  let currentPoints = (customer.points || 0) + pointsToAdd;
  let rewardsEarned = 0;

  // Calculer combien de récompenses ont été gagnées
  while (currentPoints >= POINTS_REQUIRED) {
    rewardsEarned++;
    currentPoints -= POINTS_REQUIRED;
  }

  // Mettre à jour les points du client
  const { error: updateError } = await supabase
    .from('customer_profiles')
    .update({ points: currentPoints })
    .eq('id', customerId);

  if (updateError) throw new Error(updateError.message);

  // Créer l'achat
  const { error: purchaseError } = await supabase
    .from('purchases')
    .insert([{
      customer_id: customerId,
      business_id: businessProfile.id,
      points_added: pointsToAdd,
      is_reward: false,
      purchase_date: new Date().toISOString(),
    }]);

  if (purchaseError) throw new Error(purchaseError.message);

  // Créer les récompenses si nécessaire
  if (rewardsEarned > 0) {
    const rewards = Array.from({ length: rewardsEarned }, () => ({
      customer_id: customerId,
      business_id: businessProfile.id,
      points_used: POINTS_REQUIRED,
      earned_date: new Date().toISOString(),
    }));

    const { error: rewardsError } = await supabase
      .from('rewards')
      .insert(rewards);

    if (rewardsError) throw new Error(rewardsError.message);
  }

  return {
    message: 'Points ajoutés avec succès',
    pointsAdded: pointsToAdd,
    newPoints: currentPoints,
    rewardsEarned,
  };
};

// Obtenir la liste des clients
export const getCustomers = async (params = {}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: businessProfile } = await supabase
    .from('business_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!businessProfile) throw new Error('Profil entreprise non trouvé');

  // Récupérer tous les achats de cette entreprise
  const { data: purchases } = await supabase
    .from('purchases')
    .select('customer_id')
    .eq('business_id', businessProfile.id);

  if (!purchases || purchases.length === 0) {
    return { customers: [] };
  }

  // Extraire les IDs uniques des clients
  const customerIds = [...new Set(purchases.map(p => p.customer_id))];

  // Récupérer les profils clients
  let query = supabase
    .from('customer_profiles')
    .select('*')
    .in('id', customerIds);

  // Filtrer par recherche si fourni
  if (params.search) {
    query = query.or(`first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%`);
  }

  const { data: customers, error } = await query;

  if (error) throw new Error(error.message);

  return { customers: customers || [] };
};

// Obtenir les détails d'un client
export const getCustomerDetails = async (customerId) => {
  const { data: customer, error } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', customerId)
    .single();

  if (error) throw new Error(error.message);

  // Générer le QR Code pour ce client
  const dataToEncrypt = JSON.stringify({
    customerId: customer.id,
    timestamp: Date.now(),
  });

  const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, QR_SECRET).toString();

  const qrData = JSON.stringify({
    app: 'fideleatome',
    type: 'customer',
    token: encrypted,
  });

  return {
    customer: {
      ...customer,
      qrToken: qrData,
    },
  };
};

// Obtenir les statistiques
export const getBusinessStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: businessProfile } = await supabase
    .from('business_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!businessProfile) throw new Error('Profil entreprise non trouvé');

  // Récupérer tous les achats
  const { data: purchases } = await supabase
    .from('purchases')
    .select('customer_id, points_added, is_reward, purchase_date')
    .eq('business_id', businessProfile.id);

  // Récupérer toutes les récompenses
  const { data: rewards } = await supabase
    .from('rewards')
    .select('*')
    .eq('business_id', businessProfile.id);

  // Calculer les statistiques
  const uniqueCustomers = new Set(purchases.map(p => p.customer_id));
  const totalCustomers = uniqueCustomers.size;

  const totalPurchases = purchases
    .filter(p => !p.is_reward)
    .reduce((sum, p) => sum + (p.points_added || 0), 0);

  const totalRewards = rewards ? rewards.length : 0;

  // Ventes aujourd'hui
  const today = new Date().toISOString().split('T')[0];
  const todaySales = purchases
    .filter(p => !p.is_reward && p.purchase_date && p.purchase_date.startsWith(today))
    .reduce((sum, p) => sum + (p.points_added || 0), 0);

  return {
    totalCustomers,
    totalPurchases,
    totalRewards,
    todaySales,
  };
};
