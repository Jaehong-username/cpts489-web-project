
const express = require('express');
const { User, Trucker } = require('../models');
const { authenticate, checkRole } = require('../middlewares/auth');

const router = express.Router();

// Get all truckers (public)
router.get('/', async (req, res) => {
  try {
    const truckers = await Trucker.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username']
        }
      ]
    });
    
    res.json(truckers);
  } catch (error) {
    console.error('Error fetching truckers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get trucker by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const trucker = await Trucker.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username']
        }
      ]
    });
    
    if (!trucker) {
      return res.status(404).json({ error: 'Trucker not found' });
    }
    
    res.json(trucker);
  } catch (error) {
    console.error('Error fetching trucker:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update trucker profile (protected)
router.put('/profile', authenticate, checkRole('trucker'), async (req, res) => {
  try {
    const trucker = await Trucker.findOne({ where: { userId: req.user.id } });
    
    if (!trucker) {
      return res.status(404).json({ error: 'Trucker profile not found' });
    }
    
    const updatedTrucker = await trucker.update(req.body);
    
    res.json({
      message: 'Profile updated successfully',
      trucker: updatedTrucker
    });
  } catch (error) {
    console.error('Error updating trucker profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update qualifications (protected)
router.put('/qualifications', authenticate, checkRole('trucker'), async (req, res) => {
  try {
    const trucker = await Trucker.findOne({ where: { userId: req.user.id } });
    
    if (!trucker) {
      return res.status(404).json({ error: 'Trucker profile not found' });
    }
    
    await trucker.update({ qualifications: req.body.qualifications });
    
    res.json({
      message: 'Qualifications updated successfully',
      qualifications: trucker.qualifications
    });
  } catch (error) {
    console.error('Error updating qualifications:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;