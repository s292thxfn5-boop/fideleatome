const { getDb } = require('../config/database');

class BusinessProfile {
  // Créer un profil entreprise
  static async create(profileData) {
    const {
      user_id,
      business_name,
      contact_name = null,
      phone = null
    } = profileData;

    const db = getDb();
    const { data, error } = await db
      .from('business_profiles')
      .insert([{ user_id, business_name, contact_name, phone }])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create business profile: ${error.message}`);
    }

    return data.id;
  }

  // Trouver un profil par user_id
  static async findByUserId(userId) {
    const db = getDb();
    const { data, error } = await db
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find business profile: ${error.message}`);
    }

    return data;
  }

  // Trouver un profil par ID
  static async findById(id) {
    const db = getDb();
    const { data, error } = await db
      .from('business_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find business profile: ${error.message}`);
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
      .from('business_profiles')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to update business profile: ${error.message}`);
    }

    return { changes: data.length };
  }

  // Obtenir toutes les entreprises
  static async getAll(limit = 100, offset = 0) {
    const db = getDb();
    const { data, error } = await db
      .from('business_profiles')
      .select('*')
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get business profiles: ${error.message}`);
    }

    return data || [];
  }
}

module.exports = BusinessProfile;
