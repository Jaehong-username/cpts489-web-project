
const express = require('express');
const { Feedback} = require('../models');

const router = express.Router();

// Create a new feedback (protected)
router.post('/', async (req, res) => {
    
    const { first_name, last_name, email, content } = req.body //get the result from req.body in json.strigfy
    try {
      
        const feedback = await Feedback.create({
            firstName: first_name,
            lastName: last_name,
            email,
            content
        });
        
        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });
    

    } catch (error) {
    console.error('Error submitting the comment:', error);
    res.status(400).json({ error: error.message });
    }
});






module.exports = router;