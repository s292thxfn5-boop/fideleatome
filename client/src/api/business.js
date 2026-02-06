import { supabase } from '../config/supabase';
import CryptoJS from 'crypto-js';
import { getUser } from '../utils/storage';

const QR_SECRET = 'fideleatome-qr-secret-2024';

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
    console.log('Recherche client avec ID:', customerId);

    let { data: customer, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', customerId)
      .single();

    console.log('Résultat recherche client:', customer, error);

    if (!customer || error) {
      throw new Error('Client non trouvé (ID: ' + customerId + '). Le client doit d\'abord créer un compte.');
    }

    return {
      customer: {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        points: customer.points || 0,
        totalPurchases: customer.total_purchases || 0,
        totalRewards: customer.total_rewards || 0,
        lastPurchaseDate: customer.last_purchase_date,
      }
    };
  } catch (error) {
    console.error('Erreur scan:', error);
    throw error;
  }
};

// Ajouter un ou plusieurs points à un client
export const addPoint = async (customerId, quantity = 1) => {
  const user = getUser();
  if (!user) throw new Error('Non authentifié');

  const businessProfileId = user.profile?.id;
  if (!businessProfileId) throw new Error('Profil entreprise non trouvé');

  // Récupérer le client
  const { data: customer, error: customerError } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', customerId)
    .single();

  if (customerError || !customer) throw new Error('Client non trouvé');

  const pointsToAdd = Math.max(1, Math.min(100, parseInt(quantity) || 1));

  // Calculer les récompenses gagnées
  // Cycle de 15 points : accessoire à 7, bobine à 15 (reset à 0)
  let currentPoints = customer.points || 0;
  let remaining = pointsToAdd;
  const rewards = [];

  while (remaining > 0) {
    if (currentPoints < 7) {
      const gap = 7 - currentPoints;
      if (remaining >= gap) {
        remaining -= gap;
        currentPoints = 7;
        rewards.push({ type: 'accessory', name: 'Accessoire offert' });
      } else {
        currentPoints += remaining;
        remaining = 0;
      }
    }

    if (remaining > 0 && currentPoints >= 7) {
      const gap = 15 - currentPoints;
      if (remaining >= gap) {
        remaining -= gap;
        currentPoints = 0;
        rewards.push({ type: 'bobine', name: 'Bobine Bambu Lab' });
      } else {
        currentPoints += remaining;
        remaining = 0;
      }
    }
  }

  const newTotalPurchases = (customer.total_purchases || 0) + pointsToAdd;
  const newTotalRewards = (customer.total_rewards || 0) + rewards.length;
  const now = new Date().toISOString();

  // Mettre à jour le profil client
  const { error: updateError } = await supabase
    .from('customer_profiles')
    .update({
      points: currentPoints,
      total_purchases: newTotalPurchases,
      total_rewards: newTotalRewards,
      last_purchase_date: now,
      first_purchase_date: customer.first_purchase_date || now
    })
    .eq('id', customerId);

  if (updateError) throw new Error(updateError.message);

  // Créer l'achat
  const { error: purchaseError } = await supabase
    .from('purchases')
    .insert([{
      customer_id: customerId,
      business_id: businessProfileId,
      points_added: pointsToAdd,
      is_reward: false,
      purchase_date: now,
    }]);

  if (purchaseError) throw new Error(purchaseError.message);

  // Créer les récompenses
  if (rewards.length > 0) {
    const rewardRows = rewards.map(r => ({
      customer_id: customerId,
      business_id: businessProfileId,
      reward_type: r.type,
    }));

    const { error: rewardsError } = await supabase
      .from('rewards')
      .insert(rewardRows);

    if (rewardsError) throw new Error(rewardsError.message);
  }

  // Construire le message
  let message;
  if (rewards.length > 0) {
    message = `Félicitations ! ${rewards.map(r => r.name).join(' + ')}`;
  } else {
    const nextThreshold = currentPoints < 7 ? 7 : 15;
    const remainingPts = nextThreshold - currentPoints;
    const nextName = currentPoints < 7 ? 'Accessoire offert' : 'Bobine Bambu Lab';
    const addedText = pointsToAdd > 1 ? `${pointsToAdd} points ajoutés` : 'Point ajouté';
    message = `${addedText} ! ${currentPoints} points - Plus que ${remainingPts} pour ${nextName}`;
  }

  return {
    message,
    pointsAdded: pointsToAdd,
    newPoints: currentPoints,
    totalPurchases: newTotalPurchases,
    totalRewards: newTotalRewards,
    rewardsEarned: rewards.length,
  };
};

// Obtenir la liste des clients
export const getCustomers = async (params = {}) => {
  const user = getUser();
  if (!user) throw new Error('Non authentifié');

  const businessProfileId = user.profile?.id;
  if (!businessProfileId) throw new Error('Profil entreprise non trouvé');

  // Récupérer tous les achats de cette entreprise
  const { data: purchases } = await supabase
    .from('purchases')
    .select('customer_id')
    .eq('business_id', businessProfileId);

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

  return {
    customers: (customers || []).map(c => ({
      id: c.id,
      firstName: c.first_name,
      lastName: c.last_name,
      points: c.points || 0,
      totalPurchases: c.total_purchases || 0,
      totalRewards: c.total_rewards || 0,
      lastPurchaseDate: c.last_purchase_date,
    }))
  };
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
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      points: customer.points || 0,
      totalPurchases: customer.total_purchases || 0,
      totalRewards: customer.total_rewards || 0,
      lastPurchaseDate: customer.last_purchase_date,
      qrToken: qrData,
    },
  };
};

// Obtenir les statistiques
export const getBusinessStats = async () => {
  const user = getUser();
  if (!user) throw new Error('Non authentifié');

  const businessProfileId = user.profile?.id;
  if (!businessProfileId) throw new Error('Profil entreprise non trouvé');

  // Récupérer tous les achats
  const { data: purchases } = await supabase
    .from('purchases')
    .select('customer_id, points_added, is_reward, purchase_date')
    .eq('business_id', businessProfileId);

  // Récupérer toutes les récompenses
  const { data: rewards } = await supabase
    .from('rewards')
    .select('*')
    .eq('business_id', businessProfileId);

  // Calculer les statistiques
  const purchaseList = purchases || [];
  const uniqueCustomers = new Set(purchaseList.map(p => p.customer_id));
  const totalCustomers = uniqueCustomers.size;

  const totalPurchases = purchaseList
    .filter(p => !p.is_reward)
    .reduce((sum, p) => sum + (p.points_added || 0), 0);

  const totalRewards = rewards ? rewards.length : 0;

  // Ventes aujourd'hui
  const today = new Date().toISOString().split('T')[0];
  const todaySales = purchaseList
    .filter(p => !p.is_reward && p.purchase_date && p.purchase_date.startsWith(today))
    .reduce((sum, p) => sum + (p.points_added || 0), 0);

  return {
    totalCustomers,
    totalPurchases,
    totalRewards,
    todaySales,
  };
};
