
const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./database');
const authRoutes = require('./routes/auth');
const truckerRoutes = require('./routes/trucker');
const brokerRoutes = require('./routes/broker');
const reviewRoutes = require('./routes/review');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedback');
const messageRoutes = require('./routes/message');
const userRoutes = require('./routes/users');

const cors = require('cors');


// Load environment variables  PORT, JWT_SECRET, DB_NAME, etc. from a .env file.
dotenv.config(); // loads into process.env

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001; //Gets the port from .env or defaults to 5000.

// Middleware
app.use(cors()); // enables requests from different origin like different port.
app.use(express.json()); // Parses incoming JSON requests and puts the data in req.body.

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/truckers', truckerRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/users', userRoutes);

// Test route
//  When a GET request is made to /api/test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Start server
const startServer = async () => {
  try {
    // Sync database
    await sequelize.sync(); // ensures that sequelize model is synced with the database
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