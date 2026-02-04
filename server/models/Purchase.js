const { getDb } = require('../config/database');

class Purchase {
  // Créer un achat
  static async create(purchaseData) {
    const {
      customer_id,
      business_id,
      points_added = 1,
      is_reward = false,
      notes = null
    } = purchaseData;

    const db = getDb();
    const { data, error } = await db
      .from('purchases')
      .insert([{ customer_id, business_id, points_added, is_reward, notes }])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create purchase: ${error.message}`);
    }

    return data.id;
  }

  // Obtenir l'historique des achats d'un client
  static async getByCustomer(customerId, limit = 50, offset = 0) {
    const db = getDb();
    const { data, error } = await db
      .from('purchases')
      .select(`
        *,
        business_profiles:business_id (business_name)
      `)
      .eq('customer_id', customerId)
      .order('purchase_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get customer purchases: ${error.message}`);
    }

    return data || [];
  }

  // Obtenir les achats d'une entreprise
  static async getByBusiness(businessId, limit = 50, offset = 0) {
    const db = getDb();
    const { data, error } = await db
      .from('purchases')
      .select(`
        *,
        customer_profiles:customer_id (first_name, last_name)
      `)
      .eq('business_id', businessId)
      .order('purchase_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get business purchases: ${error.message}`);
    }

    return data || [];
  }

  // Compter les achats d'un client
  static async countByCustomer(customerId) {
    const db = getDb();
    const { count, error } = await db
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', customerId);

    if (error) {
      throw new Error(`Failed to count customer purchases: ${error.message}`);
    }

    return count || 0;
  }

  // Compter les achats d'une entreprise
  static async countByBusiness(businessId) {
    const db = getDb();
    const { count, error } = await db
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId);

    if (error) {
      throw new Error(`Failed to count business purchases: ${error.message}`);
    }

    return count || 0;
  }

  // Obtenir le dernier achat d'un client
  static async getLastPurchase(customerId) {
    const db = getDb();
    const { data, error } = await db
      .from('purchases')
      .select('*')
      .eq('customer_id', customerId)
      .order('purchase_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get last purchase: ${error.message}`);
    }

    return data;
  }

  // Obtenir un achat par ID
  static async findById(id) {
    const db = getDb();
    const { data, error } = await db
      .from('purchases')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find purchase: ${error.message}`);
    }

    return data;
  }
}

module.exports = Purchase;
