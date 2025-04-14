
const express = require('express');
const { User, Broker, Trucker, BrokerTrucker } = require('../models');
const { authenticate, checkRole } = require('../middlewares/auth');

const router = express.Router();

// Get all brokers (public)
router.get('/', async (req, res) => {
  try {
    const brokers = await Broker.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username']
        }
      ]
    });
    
    res.json(brokers);
  } catch (error) {
    console.error('Error fetching brokers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get broker by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const broker = await Broker.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username', 'email'] // make sure to also include the email
        },
        {
          model: Trucker,
          as: 'truckers',
          through: { attributes: ['status', 'startDate', 'endDate'] }
        }
      ]
    });
    
    if (!broker) {
      return res.status(404).json({ error: 'Broker not found' });
    }
    
    res.json(broker);
  } catch (error) {
    console.error('Error fetching broker:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update broker profile (protected)
router.put('/profile', authenticate, checkRole('broker'), async (req, res) => {
  try {
    const broker = await Broker.findOne({ where: { userId: req.user.id } });
    
    if (!broker) {
      return res.status(404).json({ error: 'Broker profile not found' });
    }
    
    const updatedBroker = await broker.update(req.body);
    
    res.json({
      message: 'Profile updated successfully',
      broker: updatedBroker
    });
  } catch (error) {
    console.error('Error updating broker profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Add trucker to broker's active list (protected)
router.post('/truckers/:truckerId', authenticate, checkRole('broker'), async (req, res) => {
  try {
    const broker = await Broker.findOne({ where: { userId: req.user.id } });
    
    if (!broker) {
      return res.status(404).json({ error: 'Broker profile not found' });
    }
    
    const trucker = await Trucker.findByPk(req.params.truckerId);
    
    if (!trucker) {
      return res.status(404).json({ error: 'Trucker not found' });
    }
    
    const relationship = await BrokerTrucker.create({
      brokerId: broker.id,
      truckerId: trucker.id,
      status: 'active',
      startDate: new Date()
    });
    
    res.status(201).json({
      message: 'Trucker added to your active list',
      relationship
    });
  } catch (error) {
    console.error('Error adding trucker to broker:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;