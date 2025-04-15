const express = require('express');
const { getBrokerProfileWithLoads } = require('../services/brokerService');
const router = express.Router();

router.get('/broker/:brokerId', async (req, res) => {
    try {
        const data = await getBrokerProfileWithLoads(req.params.brokerId);

        if (!data.broker) {
            return res.status(404).json({ error: 'Broker not found' });
        }

        res.json(data);
    } catch (err) {
        console.error('Failed to fetch broker data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
