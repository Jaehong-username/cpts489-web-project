const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./database');
const routes = require('./routes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use('/api', routes);

// Start server
const startServer = async () => {
  try {
    // Sync database
    await sequelize.sync();
    console.log('Database synchronized');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();