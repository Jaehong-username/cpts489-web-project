
const express = require('express');
const { Review, User, Trucker, Broker } = require('../models');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Create a new review (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const { targetId, targetType, content, rating } = req.body;
    
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
    
    // Create review
    const review = await Review.create({
      content,
      rating,
      reviewerId: req.user.id,
      targetId: target.User.id,
      targetType
    });
    
    // Update target's rating
    const allReviews = await Review.findAll({
      where: {
        targetId: target.User.id,
        targetType
      }
    });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    if (targetType === 'trucker') {
      await target.update({ rating: averageRating });
    } else if (targetType === 'broker') {
      await target.update({ rating: averageRating });
    }
    
    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get reviews for a user (public)
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { targetId: req.params.userId },
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'username']
        }
      ]
    });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;