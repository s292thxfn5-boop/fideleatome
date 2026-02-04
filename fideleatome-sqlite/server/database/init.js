const { initDatabase, closeDatabase } = require('../config/database');

console.log('Initializing FideleAtome SQLite database...');

initDatabase()
  .then(() => {
    console.log('Database initialized successfully!');
    closeDatabase();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
