const express = require('express');
const { User, Trucker, Broker } = require('../models');
const { authenticate, checkRole } = require('../middlewares/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticate, checkRole('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
   
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete user (admin only) - Updated from deactivate
router.delete('/users/:id', authenticate, checkRole('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
   
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check user role to determine if related records need to be deleted
    if (user.role === 'trucker') {
      // Delete associated trucker record
      await Trucker.destroy({ where: { userId: user.id } });
    } else if (user.role === 'broker') {
      // Delete associated broker record
      await Broker.destroy({ where: { userId: user.id } });
    }
    
    // Delete the user record
    await user.destroy();
   
    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all truckers with their details (admin only)
router.get('/truckers', authenticate, checkRole('admin'), async (req, res) => {
  try {
    const truckers = await Trucker.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email', 'username'] }]
    });
   
    res.json(truckers);
  } catch (error) {
    console.error('Error fetching truckers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all brokers with their details (admin only)
router.get('/brokers', authenticate, checkRole('admin'), async (req, res) => {
  try {
    const brokers = await Broker.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email', 'username'] }]
    });
   
    res.json(brokers);
  } catch (error) {
    console.error('Error fetching brokers:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;