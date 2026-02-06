const bcrypt = require('bcryptjs');
const User = require('../models/User');
const CustomerProfile = require('../models/CustomerProfile');
const BusinessProfile = require('../models/BusinessProfile');
const { generateToken } = require('../utils/generateToken');
const { generateQRToken } = require('../utils/crypto');

// Inscription client
async function registerCustomer(req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'All fields are required',
        required: ['email', 'password', 'firstName', 'lastName']
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered'
      });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const userId = await User.create({
      email,
      password_hash: passwordHash,
      role: 'customer'
    });

    // Générer un QR code token unique
    const qrCodeToken = generateQRToken(userId);

    // Créer le profil client
    const profileId = await CustomerProfile.create({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      qr_code_token: qrCodeToken
    });

    // Générer le JWT
    const token = generateToken({
      userId,
      email,
      role: 'customer',
      profileId
    });

    res.status(201).json({
      message: 'Customer registered successfully',
      token,
      user: {
        id: userId,
        email,
        role: 'customer',
        profile: {
          id: profileId,
          firstName,
          lastName,
          qrToken: qrCodeToken,
          points: 0,
          totalPurchases: 0
        }
      }
    });
  } catch (error) {
    console.error('Register customer error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Inscription entreprise (réservée à Atome 3D uniquement)
async function registerBusiness(req, res) {
  try {
    const { email, password, businessName, contactName, phone } = req.body;

    // Validation
    if (!email || !password || !businessName) {
      return res.status(400).json({
        error: 'Required fields missing',
        required: ['email', 'password', 'businessName']
      });
    }

    // Seule Atome 3D peut s'inscrire en tant qu'entreprise
    if (businessName.toLowerCase() !== 'atome 3d') {
      return res.status(403).json({
        error: 'Business registration is restricted to Atome 3D only'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered'
      });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const userId = await User.create({
      email,
      password_hash: passwordHash,
      role: 'business'
    });

    // Créer le profil entreprise
    const profileId = await BusinessProfile.create({
      user_id: userId,
      business_name: businessName,
      contact_name: contactName,
      phone
    });

    // Générer le JWT
    const token = generateToken({
      userId,
      email,
      role: 'business',
      profileId
    });

    res.status(201).json({
      message: 'Business registered successfully',
      token,
      user: {
        id: userId,
        email,
        role: 'business',
        profile: {
          id: profileId,
          businessName,
          contactName,
          phone
        }
      }
    });
  } catch (error) {
    console.error('Register business error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Connexion
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Trouver l'utilisateur
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Récupérer le profil selon le rôle
    let profile;
    if (user.role === 'customer') {
      profile = await CustomerProfile.findByUserId(user.id);
    } else if (user.role === 'business') {
      profile = await BusinessProfile.findByUserId(user.id);
    }

    if (!profile) {
      return res.status(500).json({
        error: 'Profile not found'
      });
    }

    // Générer le JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      profileId: profile.id
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.role === 'customer' ? {
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          qrToken: profile.qr_code_token,
          points: profile.points,
          totalPurchases: profile.total_purchases
        } : {
          id: profile.id,
          businessName: profile.business_name,
          contactName: profile.contact_name,
          phone: profile.phone
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
}

// Récupérer le profil de l'utilisateur connecté
async function getMe(req, res) {
  try {
    const { userId, role, profileId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Récupérer le profil complet
    let profile;
    if (role === 'customer') {
      profile = await CustomerProfile.findById(profileId);
    } else if (role === 'business') {
      profile = await BusinessProfile.findById(profileId);
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      profile: role === 'customer' ? {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        qrToken: profile.qr_code_token,
        points: profile.points,
        totalPurchases: profile.total_purchases,
        totalRewards: profile.total_rewards,
        firstPurchaseDate: profile.first_purchase_date,
        lastPurchaseDate: profile.last_purchase_date
      } : {
        id: profile.id,
        businessName: profile.business_name,
        contactName: profile.contact_name,
        phone: profile.phone
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  registerCustomer,
  registerBusiness,
  login,
  getMe
};
