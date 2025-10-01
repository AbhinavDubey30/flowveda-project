const express = require('express');
const cors = require('cors');
const path = require('path');

// Import backend app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamically require the backend models and routes
const { sequelize } = require('../backend/models');
const config = require('../backend/config');

// Import routes
const authRoutes = require('../backend/routes/auth');
const deviceRoutes = require('../backend/routes/devices');
const telemetryRoutes = require('../backend/routes/telemetry');
const waterRoutes = require('../backend/routes/water');
const billRoutes = require('../backend/routes/bills');
const subscriptionRoutes = require('../backend/routes/subscriptions');

// Initialize database on cold start
let dbInitialized = false;
async function initDatabase() {
  if (!dbInitialized) {
    try {
      await sequelize.sync({ alter: false });
      console.log('✅ Database synced successfully');
      dbInitialized = true;
    } catch (error) {
      console.error('❌ Database sync failed:', error);
    }
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api', waterRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/subscribe', subscriptionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FlowVeda API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.DEBUG && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel serverless
module.exports = async (req, res) => {
  await initDatabase();
  return app(req, res);
};

