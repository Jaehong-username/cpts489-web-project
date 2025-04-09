
const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./database');
const authRoutes = require('./routes/auth');
const truckerRoutes = require('./routes/trucker');
const brokerRoutes = require('./routes/broker');
const reviewRoutes = require('./routes/review');
const adminRoutes = require('./routes/admin');
const cors = require('cors');


// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/truckers', truckerRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

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