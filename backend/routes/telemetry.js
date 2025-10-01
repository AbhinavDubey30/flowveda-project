const express = require('express');
const router = express.Router();
const { csvReader } = require('../utils/csvReader');
const { optionalAuth } = require('../middleware/auth-simple');

// All telemetry routes are public (use optionalAuth)
router.use(optionalAuth);

// Get CSV schema
router.get('/schema', async (req, res) => {
  try {
    const schema = csvReader.getSchema();
    res.json(schema);
  } catch (error) {
    console.error('Get schema error:', error);
    res.status(500).json({ error: error.message || 'Failed to get schema' });
  }
});

// Get parameter data
router.get('/', async (req, res) => {
  try {
    const { parameter, limit } = req.query;

    if (!parameter) {
      return res.status(400).json({ error: 'Parameter name is required' });
    }

    const dataLimit = parseInt(limit) || 200;
    const data = csvReader.getParameterData(parameter, dataLimit);

    res.json(data);
  } catch (error) {
    console.error('Get parameter data error:', error);
    if (error.message.includes('not found')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Failed to get parameter data' });
  }
});

// Get latest telemetry
router.get('/latest', async (req, res) => {
  try {
    const data = csvReader.getLatestTelemetry();
    res.json(data);
  } catch (error) {
    console.error('Get latest telemetry error:', error);
    res.status(500).json({ error: error.message || 'Failed to get latest telemetry' });
  }
});

// Get time series for parameter
router.get('/series', async (req, res) => {
  try {
    const { parameter, limit } = req.query;

    if (!parameter) {
      return res.status(400).json({ error: 'Parameter name is required' });
    }

    const dataLimit = parseInt(limit) || 200;
    const data = csvReader.getParameterData(parameter, dataLimit);

    res.json(data);
  } catch (error) {
    console.error('Get series error:', error);
    if (error.message.includes('not found')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Failed to get series data' });
  }
});

module.exports = router;

