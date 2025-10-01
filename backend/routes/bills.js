const express = require('express');
const router = express.Router();
const { Bill } = require('../models');
const { verifyToken } = require('../middleware/auth');

// All bill routes require authentication
router.use(verifyToken);

// Get all bills for authenticated user
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(bills);
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Create new bill
router.post('/', async (req, res) => {
  try {
    const { amount, due_date, consumption } = req.body;

    const bill = await Bill.create({
      userId: req.user.id,
      amount: parseFloat(amount) || 100.0,
      dueDate: due_date || null,
      consumption: consumption || null,
      status: 'UNPAID'
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(400).json({ error: error.message || 'Failed to create bill' });
  }
});

// Pay bill
router.post('/:bill_id/pay', async (req, res) => {
  try {
    const { bill_id } = req.params;

    const bill = await Bill.findOne({
      where: {
        id: bill_id,
        userId: req.user.id
      }
    });

    if (!bill) {
      return res.status(404).json({ detail: 'Bill not found' });
    }

    bill.status = 'PAID';
    await bill.save();

    res.json({ detail: 'Paid', bill });
  } catch (error) {
    console.error('Pay bill error:', error);
    res.status(500).json({ error: 'Failed to pay bill' });
  }
});

module.exports = router;

