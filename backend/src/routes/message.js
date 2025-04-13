const express = require('express');
const { Message, User, Trucker, Broker } = require('../models');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Create a new message to a target user(protected)
// POST /reviews will only go through if the user is logged in and successfully authenticated
router.post('/', authenticate, async (req, res) => {
  try {
    const { senderId, senderType, targetId, targetType, content} = req.body;
    
    // Verify target exists
    let target = null;
    if (targetType === 'trucker') {
      target = await Trucker.findOne({ 
        where: { id: targetId },
        include: [{ model: User }]
      });
    } else if (targetType === 'broker') {
      target = await Broker.findOne({ 
        where: { id: targetId },
        include: [{ model: User }]
      });
    }
    
    if (!target) {
      return res.status(404).json({ error: `${targetType} not found` });
    }
    
    // Create Message
    const Message = await Message.create({
        content,
        senderId: req.user.id,
        senderType: req.user.role,
        targetId: target.User.id,
        targetType: target.User.role,
    });
    

    
    res.status(201).json({
      message: 'Message created successfully',
      data: Message
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(400).json({ error: error.message });
  }
});


router.get('/', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;  // Get the logged-in user's ID from the authenticated request
  
      // Fetch messages where the user is either the sender or the target
      const messages = await Message.findAll({
        where: {
          [Sequelize.Op.or]: [
            { senderId: userId },  // Messages sent by the logged-in user
            { targetId: userId },  // Messages sent to the logged-in user
          ]
        },
        include: [
          {
            model: User,   // Include sender details
            as: 'sender',
            attributes: ['id', 'name', 'username'],
          },
          {
            model: User,   // Include target details
            as: 'target',
            attributes: ['id', 'name', 'username'],
          },
        ],
        order: [['createdAt', 'DESC']], // Optional: Order by message creation date, most recent first
      });
  
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: error.message });
    }
});



router.get('/', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;  // Get the logged-in user's ID from the authenticated request
  
      // Fetch messages where the user is either the sender or the target
      const messages = await Message.findAll({
        where: { // [Sequelize.Op.or] specifies either conditionn can be true
          [Sequelize.Op.or]: [
            { senderId: userId },  // Messages sent by the logged-in user
            { targetId: userId },  // Messages sent to the logged-in user
          ]
        },
        include: [ //  include associated models when querying the database
          {
            model: User,   // Include sender details
            as: 'sender', // as is an alias to different between two models
            attributes: ['id', 'role', 'username'],
          },
          {
            model: User,   // Include target details
            as: 'target',
            attributes: ['id', 'role', 'username'],
          },
        ],
        order: [['createdAt', 'DESC']], // Order by message creation date, most recent first
      });
  
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: error.message });
    }
});



module.exports = router;