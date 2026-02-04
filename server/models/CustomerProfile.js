const { getDb } = require('../config/database');

class CustomerProfile {
  // Créer un profil client
  static async create(profileData) {
    const {
      user_id,
      first_name,
      last_name,
      qr_code_token
    } = profileData;

    const db = getDb();
    const { data, error } = await db
      .from('customer_profiles')
      .insert([{ user_id, first_name, last_name, qr_code_token }])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create customer profile: ${error.message}`);
    }

    return data.id;
  }

  // Trouver un profil par user_id
  static async findByUserId(userId) {
    const db = getDb();
    const { data, error } = await db
      .from('customer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find customer profile: ${error.message}`);
    }

    return data;
  }

  // Trouver un profil par ID
  static async findById(id) {
    const db = getDb();
    const { data, error } = await db
      .from('customer_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find customer profile: ${error.message}`);
    }

    return data;
  }

  // Trouver un profil par qr_code_token
  static async findByQRToken(qrToken) {
    const db = getDb();
    const { data, error } = await db
      .from('customer_profiles')
      .select('*')
      .eq('qr_code_token', qrToken)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find customer profile by QR token: ${error.message}`);
    }

    return data;
  }

  // Mettre à jour un profil
  static async update(id, updates) {
    if (Object.keys(updates).length === 0) {
      throw new Error('No fields to update');
    }

    const db = getDb();
    const { data, error } = await db
      .from('customer_profiles')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to update customer profile: ${error.message}`);
    }

    return { changes: data.length };
  }

  // Obtenir tous les clients
  static async getAll(limit = 100, offset = 0) {
    const db = getDb();
    const { data, error } = await db
      .from('customer_profiles')
      .select('*')
      .order('last_purchase_date', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get customer profiles: ${error.message}`);
    }

    return data || [];
  }

  // Compter tous les clients
  static async count() {
    const db = getDb();
    const { count, error } = await db
      .from('customer_profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to count customer profiles: ${error.message}`);
    }

    return count || 0;
  }

  // Obtenir les top clients par nombre de points
  static async getTopCustomers(limit = 10) {
    const db = getDb();
    const { data, error } = await db
      .from('customer_profiles')
      .select('*')
      .order('total_purchases', { ascending: false })
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get top customers: ${error.message}`);
    }

    return data || [];
  }
}

module.exports = CustomerProfile;
