const express = require('express');
const { getCompanyPageData } = require('../services/companyService');
const router = express.Router();

router.get('/:companyId', async (req, res) => {
    try {
        const data = await getCompanyPageData(req.params.companyId);
        if (!data) return res.status(404).json({ error: 'Company not found' });

        res.json(data);
    } catch (err) {
        console.error('Error fetching company page:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
