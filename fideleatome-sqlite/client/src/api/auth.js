import { supabase } from '../config/supabase';

// Inscription client
export const registerCustomer = async (data) => {
  // 1. Créer l'utilisateur avec Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) throw new Error(authError.message);

  // 2. Créer le profil client
  const { data: profile, error: profileError } = await supabase
    .from('customer_profiles')
    .insert([
      {
        user_id: authData.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        points: 0,
      },
    ])
    .select()
    .single();

  if (profileError) throw new Error(profileError.message);

  return {
    user: authData.user,
    profile,
    role: 'customer',
  };
};

// Inscription entreprise
export const registerBusiness = async (data) => {
  // 1. Créer l'utilisateur avec Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) throw new Error(authError.message);

  // 2. Créer le profil entreprise
  const { data: profile, error: profileError } = await supabase
    .from('business_profiles')
    .insert([
      {
        user_id: authData.user.id,
        business_name: data.businessName,
        contact_name: data.contactName,
        phone: data.phone,
      },
    ])
    .select()
    .single();

  if (profileError) throw new Error(profileError.message);

  return {
    user: authData.user,
    profile,
    role: 'business',
  };
};

// Connexion
export const login = async (email, password) => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw new Error(authError.message);

  // Récupérer le profil
  const profile = await getProfile();

  return {
    user: authData.user,
    ...profile,
  };
};

// Récupérer le profil utilisateur
export const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Non authentifié');

  // Chercher dans customer_profiles
  const { data: customerProfile } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (customerProfile) {
    return {
      role: 'customer',
      profile: customerProfile,
    };
  }

  // Chercher dans business_profiles
  const { data: businessProfile } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (businessProfile) {
    return {
      role: 'business',
      profile: businessProfile,
    };
  }

  throw new Error('Profil non trouvé');
};

// Déconnexion
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
