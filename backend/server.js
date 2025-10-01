const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./models');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const telemetryRoutes = require('./routes/telemetry');
const waterRoutes = require('./routes/water');
const billRoutes = require('./routes/bills');
const subscriptionRoutes = require('./routes/subscriptions');

const app = express();

// Middleware - CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://flowveda-project1.vercel.app',
    /\.vercel\.app$/,  // Allow all Vercel preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

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

// Database sync and server start
const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    // Sync database
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced successfully');
    
    // Start server - bind to 0.0.0.0 for Railway
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 FlowVeda API server running on port ${PORT}`);
      console.log(`📍 Environment: ${config.DEBUG ? 'Development' : 'Production'}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;

