const express = require('express');
const router = express.Router();
const { Device, SensorReading } = require('../models');
const { verifyToken } = require('../middleware/auth');

// All device routes require authentication
router.use(verifyToken);

// Get all devices for authenticated user
router.get('/', async (req, res) => {
  try {
    const devices = await Device.findAll({
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(devices);
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Create new device
router.post('/', async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Device name is required' });
    }

    const device = await Device.create({
      ownerId: req.user.id,
      name,
      location: location || ''
    });

    res.status(201).json(device);
  } catch (error) {
    console.error('Create device error:', error);
    res.status(400).json({ error: error.message || 'Failed to create device' });
  }
});

// Get latest readings for all user devices
router.get('/readings/latest', async (req, res) => {
  try {
    const devices = await Device.findAll({
      where: { ownerId: req.user.id },
      include: [{
        model: SensorReading,
        as: 'readings',
        limit: 1,
        order: [['createdAt', 'DESC']],
        separate: true
      }]
    });

    const result = devices.map(device => {
      const reading = device.readings && device.readings[0];
      
      if (!reading) {
        return null;
      }

      const safetyStatus = reading.isWaterSafe();
      
      return {
        device: device.name,
        reading: {
          ph: reading.ph,
          tds: reading.tds,
          turbidity: reading.turbidity,
          chlorine: reading.chlorine,
          hardness: reading.hardness,
          microbes: reading.microbes,
          flow_rate: reading.flowRate,
          battery: reading.battery,
          timestamp: reading.createdAt,
          is_safe: safetyStatus.safe,
          safety_message: safetyStatus.message
        }
      };
    }).filter(item => item !== null);

    res.json(result);
  } catch (error) {
    console.error('Get latest readings error:', error);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

module.exports = router;

