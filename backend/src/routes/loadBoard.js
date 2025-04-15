const express = require('express');
const { Load } = require('../models');

const router = express.Router();

// GET /api/loads?page=1&limit=20
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: loads } = await Load.findAndCountAll({
      attributes: [
        'id', 'pickup_city', 'pickup_state', 'dropoff_city', 'dropoff_state',
        'pickup_date', 'pickup_time_window_start', 'pickup_time_window_end',
        'dropoff_date_start', 'dropoff_date_end', 'distance_miles',
        'weight_lbs', 'oversized', 'hazmat', 'equipment_required',
        'broker_name', 'broker_rating', 'broker_email', 'broker_phone',
        'brokerage_name', 'brokerage_rating'
      ],
      order: [['pickup_date', 'ASC']],
      limit,
      offset
    });

    res.json({
      page,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
      loads
    });
  } catch (error) {
    console.error('Error fetching paginated loads:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;