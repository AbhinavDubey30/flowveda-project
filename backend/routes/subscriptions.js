const express = require('express');
const router = express.Router();
const { Subscription } = require('../models');
const { verifyToken } = require('../middleware/auth');

// Subscribe to a plan
router.post('/', verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;
    const selectedPlan = plan || 'premium';

    if (!['basic', 'premium'].includes(selectedPlan)) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // Calculate expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const subscription = await Subscription.create({
      userId: req.user.id,
      plan: selectedPlan,
      active: true,
      expiresAt
    });

    res.status(201).json(subscription);
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

module.exports = router;

