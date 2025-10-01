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

// Import ONLY CSV-based routes (no database required!)
const authRoutes = require('../backend/routes/auth-simple');
const telemetryRoutes = require('../backend/routes/telemetry');
const waterRoutes = require('../backend/routes/water');

// No database initialization needed - using CSV data only!
console.log('🚀 Running in CSV-only mode (no database)');
console.log('✅ Auth, Telemetry, and Water routes loaded');

// Routes - all CSV-based
app.use('/api/auth', authRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api', waterRoutes);

// Note: Device, Bill, and Subscription routes are disabled (require database)
// Dashboard works with CSV data from telemetry and water routes

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

