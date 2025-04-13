
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to verify JWT token if a request has a valid JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // if there is no token or it doesnt start with Bearer, reject the request
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token is missing' });
    }
    
    const token = authHeader.split(' ')[1]; // extract the JWT token after ' '
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    // Verifies and decodes the token. It uses a secret key from environment variables (or fallback).
    
    // fetches the user from the database, using the id stpred in the token
    const user = await User.findByPk(decoded.id);
    if (!user) { // if user doesn't exist
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Adds the user object to the req so that the next middlewares or route handlers can access
    // adding a new pair to the table
    req.user = user;
    next(); // everything is fine move on to the next middle ware
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if an unathenticated user has a specific role

// ... is a rest paramter in js. allows to accept an arbitary number of arguments and bundles them into array
const checkRole = (...roles) => { // ex: roles = ['user', 'admin'] etc
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Compares the user’s role (e.g., 'admin', 'driver') with the allowed roles for the route.
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = { authenticate, checkRole };