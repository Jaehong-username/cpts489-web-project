const express = require('express');
const { Message, User, Trucker, Broker } = require('../models');
const { authenticate } = require('../middlewares/auth');
const { Op } = require('sequelize'); // Add this import for Sequelize operators
const router = express.Router();

// Create a new message to a target user (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const { targetId, targetType, content } = req.body;
    
    // Verify target exists
    let target = null;
    if (targetType === 'trucker') {
      target = await Trucker.findOne({
        where: { userId: targetId },
        include: [{ model: User }]
      });
    } else if (targetType === 'broker') {
      target = await Broker.findOne({
        where: { userId: targetId },
        include: [{ model: User }]
      });
    }
    
    if (!target) {
      return res.status(404).json({ message: `${targetType} with ID ${targetId} not found` });
    }
    
    // Create Message
    const newMessage = await Message.create({
      content,
      senderId: req.user.id,
      senderType: req.user.role,
      targetId: target.User.id,
      targetType: target.User.role,
    });
    
    res.status(201).json({
      message: 'Message created successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all messages for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { targetId: userId },
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'role', 'username'],
        },
        {
          model: User,
          as: 'target',
          attributes: ['id', 'role', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get messages targeted to a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { targetId: req.params.userId },
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a specific message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id, {
      attributes: ['content', 'senderId', 'senderType', 'targetId', 'targetType', 'createdAt'],
    });
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Error fetching the message:', error);
    res.status(500).json({ message: 'Failed to fetch the message' });
  }
});

module.exports = router;