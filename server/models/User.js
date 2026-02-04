const { getDb } = require('../config/database');

class User {
  // Créer un utilisateur
  static async create(userData) {
    const { email, password_hash, role } = userData;
    const db = getDb();

    const { data, error } = await db
      .from('users')
      .insert([{ email, password_hash, role }])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data.id;
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const db = getDb();

    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is OK
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data;
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const db = getDb();

    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data;
  }

  // Vérifier si un email existe
  static async emailExists(email) {
    const user = await User.findByEmail(email);
    return !!user;
  }

  // Mettre à jour un utilisateur
  static async update(id, updates) {
    if (Object.keys(updates).length === 0) {
      throw new Error('No fields to update');
    }

    const db = getDb();
    const { data, error } = await db
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return { changes: data.length };
  }

  // Supprimer un utilisateur
  static async delete(id) {
    const db = getDb();
    const { error } = await db
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return { changes: 1 };
  }

  // Obtenir tous les utilisateurs (admin uniquement)
  static async getAll() {
    const db = getDb();
    const { data, error } = await db
      .from('users')
      .select('id, email, role, created_at');

    if (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }

    return data || [];
  }
}

module.exports = User;
