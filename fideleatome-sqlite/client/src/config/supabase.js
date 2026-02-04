// Mode hors-ligne avec localStorage - remplace Supabase

// Clés de stockage
const STORAGE_KEYS = {
  USERS: 'fideleatome_users',
  CUSTOMER_PROFILES: 'fideleatome_customer_profiles',
  BUSINESS_PROFILES: 'fideleatome_business_profiles',
  PURCHASES: 'fideleatome_purchases',
  REWARDS: 'fideleatome_rewards',
  CURRENT_USER: 'fideleatome_current_user',
  CURRENT_SESSION: 'fideleatome_current_session',
};

// Fonctions utilitaires pour localStorage
const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Générer un ID unique
const generateId = () => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Mock de l'API Supabase Auth
const auth = {
  signUp: async ({ email, password }) => {
    const users = getStorageData(STORAGE_KEYS.USERS);

    if (users.find(u => u.email === email)) {
      return { data: null, error: { message: 'Cet email est déjà utilisé' } };
    }

    const newUser = {
      id: generateId(),
      email,
      password,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    setStorageData(STORAGE_KEYS.USERS, users);

    const session = { user: { id: newUser.id, email: newUser.email } };
    setStorageData(STORAGE_KEYS.CURRENT_USER, { id: newUser.id, email: newUser.email });
    setStorageData(STORAGE_KEYS.CURRENT_SESSION, session);

    return { data: { user: { id: newUser.id, email: newUser.email } }, error: null };
  },

  signInWithPassword: async ({ email, password }) => {
    const users = getStorageData(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { data: null, error: { message: 'Email ou mot de passe incorrect' } };
    }

    const session = { user: { id: user.id, email: user.email } };
    setStorageData(STORAGE_KEYS.CURRENT_USER, { id: user.id, email: user.email });
    setStorageData(STORAGE_KEYS.CURRENT_SESSION, session);

    return { data: { user: { id: user.id, email: user.email }, session }, error: null };
  },

  signOut: async () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    return { error: null };
  },

  getUser: async () => {
    const user = getStorageData(STORAGE_KEYS.CURRENT_USER);
    return { data: { user: user && user.id ? user : null } };
  },

  getSession: async () => {
    const session = getStorageData(STORAGE_KEYS.CURRENT_SESSION);
    return { data: { session: session && session.user ? session : null } };
  },

  onAuthStateChange: (callback) => {
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
};

// Mock de l'API Supabase pour les tables
const from = (tableName) => {
  let storageKey;
  switch (tableName) {
    case 'customer_profiles':
      storageKey = STORAGE_KEYS.CUSTOMER_PROFILES;
      break;
    case 'business_profiles':
      storageKey = STORAGE_KEYS.BUSINESS_PROFILES;
      break;
    case 'purchases':
      storageKey = STORAGE_KEYS.PURCHASES;
      break;
    case 'rewards':
      storageKey = STORAGE_KEYS.REWARDS;
      break;
    default:
      storageKey = `fideleatome_${tableName}`;
  }

  let filters = [];
  let orderField = null;
  let orderAsc = true;
  let limitCount = null;
  let insertData = null;
  let updateData = null;
  let isSingle = false;

  const executeQuery = () => {
    const queryData = getStorageData(storageKey);

    // INSERT
    if (insertData) {
      const allData = getStorageData(storageKey);
      const newItems = insertData.map(item => ({
        ...item,
        id: item.id || generateId(),
        created_at: item.created_at || new Date().toISOString(),
      }));
      allData.push(...newItems);
      setStorageData(storageKey, allData);

      if (isSingle) {
        return { data: newItems[0] || null, error: null };
      }
      return { data: newItems, error: null };
    }

    // UPDATE
    if (updateData) {
      const allData = getStorageData(storageKey);
      let updated = false;
      const newData = allData.map(item => {
        let matches = true;
        for (const filter of filters) {
          if (filter.type === 'eq' && item[filter.field] !== filter.value) {
            matches = false;
          }
        }
        if (matches) {
          updated = true;
          return { ...item, ...updateData };
        }
        return item;
      });
      if (updated) {
        setStorageData(storageKey, newData);
      }
      return { data: null, error: null };
    }

    // SELECT
    let result = [...queryData];

    // Appliquer les filtres
    for (const filter of filters) {
      if (filter.type === 'eq') {
        result = result.filter(item => item[filter.field] === filter.value);
      } else if (filter.type === 'in') {
        result = result.filter(item => filter.values.includes(item[filter.field]));
      } else if (filter.type === 'or') {
        const conditions = filter.condition.split(',');
        result = result.filter(item => {
          return conditions.some(cond => {
            const parts = cond.split('.');
            if (parts.length >= 3 && parts[1] === 'ilike') {
              const field = parts[0];
              const search = parts[2].replace(/%/g, '').toLowerCase();
              return item[field]?.toLowerCase().includes(search);
            }
            return false;
          });
        });
      }
    }

    // Trier
    if (orderField) {
      result.sort((a, b) => {
        const aVal = a[orderField];
        const bVal = b[orderField];
        if (orderAsc) return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });
    }

    // Limiter
    if (limitCount) {
      result = result.slice(0, limitCount);
    }

    if (isSingle) {
      return { data: result[0] || null, error: null };
    }

    return { data: result, error: null };
  };

  const chain = {
    select: (fields = '*') => {
      return chain;
    },

    insert: (data) => {
      insertData = Array.isArray(data) ? data : [data];
      return chain;
    },

    update: (data) => {
      updateData = data;
      return chain;
    },

    eq: (field, value) => {
      filters.push({ type: 'eq', field, value });
      return chain;
    },

    in: (field, values) => {
      filters.push({ type: 'in', field, values });
      return chain;
    },

    or: (condition) => {
      filters.push({ type: 'or', condition });
      return chain;
    },

    order: (field, options = {}) => {
      orderField = field;
      orderAsc = options.ascending !== false;
      return chain;
    },

    limit: (count) => {
      limitCount = count;
      return chain;
    },

    single: () => {
      isSingle = true;
      return Promise.resolve(executeQuery());
    },

    then: (resolve, reject) => {
      try {
        resolve(executeQuery());
      } catch (e) {
        if (reject) reject(e);
      }
    },
  };

  return chain;
};

// Export du mock Supabase
export const supabase = {
  auth,
  from,
};

// Initialiser des données de démonstration si vide
const initDemoData = () => {
  const users = getStorageData(STORAGE_KEYS.USERS);

  if (users.length === 0) {
    const demoCustomerUser = {
      id: 'demo_customer_user',
      email: 'client@demo.com',
      password: 'demo123',
      created_at: new Date().toISOString(),
    };

    const demoBusinessUser = {
      id: 'demo_business_user',
      email: 'commerce@demo.com',
      password: 'demo123',
      created_at: new Date().toISOString(),
    };

    setStorageData(STORAGE_KEYS.USERS, [demoCustomerUser, demoBusinessUser]);

    const demoCustomerProfile = {
      id: 'demo_customer_profile',
      user_id: 'demo_customer_user',
      first_name: 'Jean',
      last_name: 'Dupont',
      points: 7,
      created_at: new Date().toISOString(),
    };

    setStorageData(STORAGE_KEYS.CUSTOMER_PROFILES, [demoCustomerProfile]);

    const demoBusinessProfile = {
      id: 'demo_business_profile',
      user_id: 'demo_business_user',
      business_name: 'Boulangerie du Coin',
      contact_name: 'Marie Martin',
      phone: '01 23 45 67 89',
      created_at: new Date().toISOString(),
    };

    setStorageData(STORAGE_KEYS.BUSINESS_PROFILES, [demoBusinessProfile]);

    const demoPurchases = [
      {
        id: 'purchase_1',
        customer_id: 'demo_customer_profile',
        business_id: 'demo_business_profile',
        points_added: 1,
        is_reward: false,
        purchase_date: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'purchase_2',
        customer_id: 'demo_customer_profile',
        business_id: 'demo_business_profile',
        points_added: 2,
        is_reward: false,
        purchase_date: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'purchase_3',
        customer_id: 'demo_customer_profile',
        business_id: 'demo_business_profile',
        points_added: 4,
        is_reward: false,
        purchase_date: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    setStorageData(STORAGE_KEYS.PURCHASES, demoPurchases);

    console.log('Données de démonstration initialisées');
    console.log('Comptes de démo:');
    console.log('- Client: client@demo.com / demo123');
    console.log('- Commerce: commerce@demo.com / demo123');
  }
};

initDemoData();
