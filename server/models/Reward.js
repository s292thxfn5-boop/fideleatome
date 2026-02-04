const { getDb } = require('../config/database');

class Reward {
  // Créer une récompense
  static async create(rewardData) {
    const { customer_id, business_id, purchase_id = null, reward_type = 'accessory' } = rewardData;

    const db = getDb();
    const { data, error } = await db
      .from('rewards')
      .insert([{ customer_id, business_id, purchase_id, reward_type }])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create reward: ${error.message}`);
    }

    return data.id;
  }

  // Obtenir les récompenses d'un client
  static async getByCustomer(customerId, limit = 50, offset = 0) {
    const db = getDb();
    const { data, error } = await db
      .from('rewards')
      .select(`
        *,
        business_profiles:business_id (business_name)
      `)
      .eq('customer_id', customerId)
      .order('reward_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get customer rewards: ${error.message}`);
    }

    return data || [];
  }

  // Obtenir les récompenses distribuées par une entreprise
  static async getByBusiness(businessId, limit = 50, offset = 0) {
    const db = getDb();
    const { data, error } = await db
      .from('rewards')
      .select(`
        *,
        customer_profiles:customer_id (first_name, last_name)
      `)
      .eq('business_id', businessId)
      .order('reward_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get business rewards: ${error.message}`);
    }

    return data || [];
  }

  // Compter les récompenses d'un client
  static async countByCustomer(customerId) {
    const db = getDb();
    const { count, error } = await db
      .from('rewards')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', customerId);

    if (error) {
      throw new Error(`Failed to count customer rewards: ${error.message}`);
    }

    return count || 0;
  }

  // Compter les récompenses distribuées par une entreprise
  static async countByBusiness(businessId) {
    const db = getDb();
    const { count, error } = await db
      .from('rewards')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId);

    if (error) {
      throw new Error(`Failed to count business rewards: ${error.message}`);
    }

    return count || 0;
  }

  // Obtenir une récompense par ID
  static async findById(id) {
    const db = getDb();
    const { data, error } = await db
      .from('rewards')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find reward: ${error.message}`);
    }

    return data;
  }
}

module.exports = Reward;
