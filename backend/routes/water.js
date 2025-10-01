const express = require('express');
const router = express.Router();
const { s3DataAccess } = require('../utils/s3DataAccess');
const config = require('../config');
const { optionalAuth, verifyToken } = require('../middleware/auth-simple');

// Water quality endpoint
router.get('/water-quality', optionalAuth, async (req, res) => {
  try {
    const latestQuality = await s3DataAccess.getLatestWaterQuality();
    
    if (!latestQuality) {
      return res.status(404).json({ error: 'No water quality data available' });
    }

    // Determine contamination level status
    const contaminationLevel = latestQuality.contamination_level || 1;
    const statusInfo = config.CONTAMINATION_LEVELS[contaminationLevel] || config.CONTAMINATION_LEVELS[1];

    res.json({
      latest_reading: latestQuality,
      status: statusInfo
    });
  } catch (error) {
    console.error('Get water quality error:', error);
    res.status(500).json({ error: error.message || 'Failed to get water quality data' });
  }
});

// Household billing endpoint
router.get('/billing/:household_id', optionalAuth, async (req, res) => {
  try {
    const { household_id } = req.params;
    const billingData = await s3DataAccess.getHouseholdBilling(household_id);

    if (!billingData) {
      return res.status(404).json({ error: 'Household billing data not found' });
    }

    res.json(billingData);
  } catch (error) {
    console.error('Get household billing error:', error);
    res.status(500).json({ error: error.message || 'Failed to get billing data' });
  }
});

// Zone consumption and forecast endpoint
router.get('/zone-consumption', optionalAuth, async (req, res) => {
  try {
    const consumptionData = await s3DataAccess.getMonthlyConsumptionTrend();

    if (!consumptionData || consumptionData.length === 0) {
      return res.status(404).json({ error: 'No consumption data available' });
    }

    // Simple linear regression forecast
    const months = consumptionData.map((_, index) => index);
    const consumptions = consumptionData.map(item => item.total_consumption_litres || 0);

    let forecastData;

    if (consumptions.length >= 2) {
      const n = consumptions.length;
      const sumX = months.reduce((a, b) => a + b, 0);
      const sumY = consumptions.reduce((a, b) => a + b, 0);
      const sumXY = months.reduce((acc, x, i) => acc + x * consumptions[i], 0);
      const sumX2 = months.reduce((acc, x) => acc + x * x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      const nextMonthConsumption = slope * n + intercept;

      forecastData = {
        historical_data: consumptionData,
        forecast: {
          next_month_predicted: Math.round(nextMonthConsumption),
          trend: slope > 0 ? 'increasing' : 'decreasing',
          slope: parseFloat(slope.toFixed(2))
        }
      };
    } else {
      forecastData = {
        historical_data: consumptionData,
        forecast: {
          next_month_predicted: consumptions[consumptions.length - 1] || 0,
          trend: 'stable',
          slope: 0
        }
      };
    }

    res.json(forecastData);
  } catch (error) {
    console.error('Get zone consumption error:', error);
    res.status(500).json({ error: error.message || 'Failed to get consumption data' });
  }
});

// Tampering alert endpoint
router.get('/tampering-alert', optionalAuth, async (req, res) => {
  try {
    const threshold = parseFloat(req.query.threshold) || config.TAMPERING_SETTINGS.default_threshold_percent;
    const [isTampering, alertData] = await s3DataAccess.checkTamperingAlert(threshold);

    res.json({
      tampering_detected: isTampering,
      threshold_percent: threshold,
      alert_data: alertData
    });
  } catch (error) {
    console.error('Get tampering alert error:', error);
    res.status(500).json({ error: error.message || 'Failed to check tampering' });
  }
});

// Pay bill endpoint
router.post('/pay-bill', optionalAuth, async (req, res) => {
  try {
    const { household_id, amount } = req.body;

    if (!household_id || !amount) {
      return res.status(400).json({ error: 'household_id and amount are required' });
    }

    const paymentData = {
      payment_id: `PAY_${household_id}_${Date.now()}`,
      household_id,
      amount,
      status: 'success',
      transaction_date: new Date().toISOString(),
      message: 'Payment processed successfully'
    };

    res.json(paymentData);
  } catch (error) {
    console.error('Pay bill error:', error);
    res.status(500).json({ error: error.message || 'Failed to process payment' });
  }
});

// Forecast endpoint (for user devices)
router.get('/forecast', verifyToken, async (req, res) => {
  try {
    const { Device, SensorReading } = require('../models');
    
    const devices = await Device.findAll({
      where: { ownerId: req.user.id },
      include: [{
        model: SensorReading,
        as: 'readings',
        limit: 30,
        order: [['createdAt', 'DESC']],
        separate: true
      }]
    });

    const series = devices.map(device => {
      const readings = device.readings || [];
      const flowRates = readings.map(r => r.flowRate || 0);
      const avg = flowRates.length > 0 
        ? flowRates.reduce((a, b) => a + b, 0) / flowRates.length 
        : 0;

      return { device: device.name, daily_avg: avg };
    });

    // Project next 7 days
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayVals = {};
      
      series.forEach(s => {
        dayVals[s.device] = parseFloat(s.daily_avg.toFixed(2));
      });

      forecast.push({
        date: date.toISOString().split('T')[0],
        predicted: dayVals
      });
    }

    res.json({ forecast });
  } catch (error) {
    console.error('Forecast error:', error);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

// Anomaly detection endpoint (for user devices)
router.get('/anomalies', verifyToken, async (req, res) => {
  try {
    const { Device, SensorReading } = require('../models');
    
    const devices = await Device.findAll({
      where: { ownerId: req.user.id },
      include: [{
        model: SensorReading,
        as: 'readings',
        limit: 10,
        order: [['createdAt', 'DESC']],
        separate: true
      }]
    });

    const anomalies = [];

    for (const device of devices) {
      const readings = device.readings || [];
      
      if (readings.length >= 2) {
        const latest = readings[0].flowRate || 0;
        const previous = readings.slice(1, 6).map(r => r.flowRate || 0);
        const avgPrev = previous.length > 0 
          ? previous.reduce((a, b) => a + b, 0) / previous.length 
          : 0;

        if (avgPrev > 0 && latest > 2 * avgPrev) {
          anomalies.push({
            device: device.name,
            type: 'flow_spike',
            latest,
            avg_prev: avgPrev,
            message: 'Recent spike in flow detected. Possible leak or blockage.'
          });
        }
      }
    }

    res.json({ anomalies });
  } catch (error) {
    console.error('Anomalies error:', error);
    res.status(500).json({ error: 'Failed to detect anomalies' });
  }
});

module.exports = router;

