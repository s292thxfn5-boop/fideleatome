require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS
app.use(cors({
  origin: '*', // Autoriser toutes les origines en dev
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Désactiver Helmet en développement pour éviter les problèmes CORS
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
  }));
}

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger les requêtes en développement
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Handler explicite pour les requêtes OPTIONS (CORS preflight)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.sendStatus(200);
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FideleAtome API is running' });
});

// Routes
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const businessRoutes = require('./routes/business');

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/business', businessRoutes);

// Servir les fichiers statiques du build React en production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Toutes les routes non-API renvoient vers index.html (pour React Router)
app.get('*', (req, res) => {
  // Si c'est une route API non trouvée, renvoyer 404 JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  // Sinon, servir index.html pour le routing React
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialiser la base de données puis démarrer le serveur
initDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌐 Network: http://192.168.1.5:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });
