const express = require('express');
const { User } = require('../models');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Don't return passwords
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    // Don't return password in response
    const { password, ...userData } = user.toJSON();
    res.status(201).json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;