const express = require('express');
const cors = require('cors');
const path = require('path');

// Import backend app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load config (no database needed!)
const config = require('../backend/config');

// Import routes - use simple auth (no database)
const authRoutes = require('../backend/routes/auth-simple');
const telemetryRoutes = require('../backend/routes/telemetry');
const waterRoutes = require('../backend/routes/water');

// Import optional routes (gracefully handle if they fail)
let deviceRoutes, billRoutes, subscriptionRoutes;
try {
  deviceRoutes = require('../backend/routes/devices');
  billRoutes = require('../backend/routes/bills');
  subscriptionRoutes = require('../backend/routes/subscriptions');
  console.log('✅ All routes loaded');
} catch (error) {
  console.warn('⚠️ Some optional routes not available:', error.message);
}

// No database initialization needed - using CSV data only!
console.log('🚀 Running in CSV-only mode (no database)');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api', waterRoutes);

// Optional routes (only if loaded)
if (deviceRoutes) app.use('/api/devices', deviceRoutes);
if (billRoutes) app.use('/api/bills', billRoutes);
if (subscriptionRoutes) app.use('/api/subscribe', subscriptionRoutes);

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

// Export for Vercel serverless (no database init needed!)
module.exports = app;

