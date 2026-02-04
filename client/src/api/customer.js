import { supabase } from '../config/supabase';
import CryptoJS from 'crypto-js';
import { getUser } from '../utils/storage';

const QR_SECRET = 'fideleatome-qr-secret-2024';

// Obtenir le profil client
export const getProfile = async () => {
  const user = getUser();
  if (!user) throw new Error('Non authentifié');

  const profileId = user.profile?.id;
  if (!profileId) throw new Error('Profil non trouvé');

  const { data: profile, error } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) throw new Error(error.message);

  return { profile };
};

// Obtenir les informations de fidélité
export const getLoyaltyInfo = async () => {
  const user = getUser();
  if (!user) throw new Error('Non authentifié');

  const profileId = user.profile?.id;
  if (!profileId) throw new Error('Profil non trouvé');

  const { data: profile, error } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) throw new Error(error.message);

  const POINTS_REQUIRED = 15;
  const currentPoints = profile.points || 0;
  const progress = (currentPoints / POINTS_REQUIRED) * 100;

  return {
    points: currentPoints,
    pointsRequired: POINTS_REQUIRED,
    progress: Math.min(progress, 100),
  };
};

// Générer le QR Code Token
export const getQRCodeData = async () => {
  const user = getUser();
  if (!user) throw new Error('Non authentifié');

  const profileId = user.profile?.id;
  if (!profileId) throw new Error('Profil non trouvé');

  // Utiliser le qrToken stocké si disponible
  if (user.profile?.qrToken) {
    return {
      qrData: JSON.stringify({
        app: 'fideleatome',
        type: 'customer',
        id: profileId,
        token: user.profile.qrToken,
      }),
    };
  }

  // Sinon générer un nouveau
  const dataToEncrypt = JSON.stringify({
    customerId: profileId,
    timestamp: Date.now(),
  });

  const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, QR_SECRET).toString();

  return {
    qrData: JSON.stringify({
      app: 'fideleatome',
      type: 'customer',
      id: profileId,
      token: encrypted,
    }),
  };
};

// Obtenir l'historique des achats
export const getPurchaseHistory = async (params = {}) => {
  const user = getUser();
  if (!user) throw new Error('Non authentifié');

  const profileId = user.profile?.id;
  if (!profileId) throw new Error('Profil non trouvé');

  const limit = params.limit || 50;

  const { data: purchases, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('customer_id', profileId)
    .eq('is_reward', false)
    .order('purchase_date', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  // Enrichir avec les noms des commerces
  const { data: businesses } = await supabase.from('business_profiles').select('*');
  const businessMap = {};
  (businesses || []).forEach(b => { businessMap[b.id] = b; });

  const enrichedPurchases = (purchases || []).map(p => ({
    ...p,
    business: businessMap[p.business_id] ? { business_name: businessMap[p.business_id].business_name } : null,
  }));

  return { purchases: enrichedPurchases };
};

// Obtenir l'historique des récompenses
export const getRewardHistory = async (params = {}) => {
  const user = getUser();
  if (!user) throw new Error('Non authentifié');

  const profileId = user.profile?.id;
  if (!profileId) throw new Error('Profil non trouvé');

  const limit = params.limit || 50;

  const { data: rewards, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('customer_id', profileId)
    .order('earned_date', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  // Enrichir avec les noms des commerces
  const { data: businesses } = await supabase.from('business_profiles').select('*');
  const businessMap = {};
  (businesses || []).forEach(b => { businessMap[b.id] = b; });

  const enrichedRewards = (rewards || []).map(r => ({
    ...r,
    business: businessMap[r.business_id] ? { business_name: businessMap[r.business_id].business_name } : null,
  }));

  return { rewards: enrichedRewards };
};
