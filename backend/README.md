# FlowVeda Backend - Node.js API

This is the Node.js/Express backend for the FlowVeda Water Management System, migrated from Django.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Data Processing**: CSV parsing, AWS S3 integration

## Features

- 🔐 User authentication with JWT
- 💧 Real-time water quality monitoring
- 📊 Telemetry data processing
- 🏠 Household billing management
- 📈 Consumption forecasting
- ⚠️ Tampering detection alerts
- 🔔 Notification system

## Installation

### Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Initialize database:
```bash
npm run migrate
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:8000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Devices
- `GET /api/devices` - Get user devices
- `POST /api/devices` - Create device
- `GET /api/devices/readings/latest` - Get latest sensor readings

### Telemetry
- `GET /api/telemetry/schema` - Get CSV schema
- `GET /api/telemetry` - Get parameter data
- `GET /api/telemetry/latest` - Get latest telemetry
- `GET /api/telemetry/series` - Get time series data

### Water Management
- `GET /api/water-quality` - Get water quality data
- `GET /api/billing/:household_id` - Get household billing
- `GET /api/zone-consumption` - Get consumption data & forecast
- `GET /api/tampering-alert` - Check tampering alerts
- `POST /api/pay-bill` - Process bill payment

### Forecasting & Anomalies
- `GET /api/forecast` - Get consumption forecast (authenticated)
- `GET /api/anomalies` - Detect flow anomalies (authenticated)

### Bills & Subscriptions
- `GET /api/bills` - Get user bills
- `POST /api/bills` - Create bill
- `POST /api/bills/:bill_id/pay` - Pay bill
- `POST /api/subscribe` - Subscribe to plan

## Authentication

The API uses JWT tokens for authentication. Include the token in requests:

```
Authorization: Bearer <token>
```

Or (Django-compatible):
```
Authorization: Token <token>
```

## Database Models

- **User** - User accounts
- **UserProfile** - Extended user information
- **Device** - IoT devices
- **SensorReading** - Sensor data readings
- **Bill** - Billing information
- **Subscription** - User subscriptions
- **Notification** - System notifications

## Data Files

The system reads CSV files from:
- `../data/` directory for production data
- `./api/data/` directory for sensor telemetry

Required CSV files:
- `dataset1.csv` - Sensor telemetry data
- `water_quality_zone1.csv` - Water quality data
- `final_billing_zone1.csv` - Billing data
- `final_zone_consumption_zone1.csv` - Consumption data
- `final_tampering_zone1_daily.csv` - Tampering detection data

## Migration from Django

This backend replaces the Django REST framework implementation with:
- Express.js for routing
- Sequelize ORM instead of Django ORM
- JWT instead of Django Token Authentication
- Native JavaScript CSV parsing instead of pandas

All API endpoints maintain backward compatibility with the original Django API.

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Production

Set environment variables:
```bash
export DEBUG=false
export SECRET_KEY=<your-secret-key>
```

Run the server:
```bash
npm start
```

## License

MIT
