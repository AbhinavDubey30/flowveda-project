# FlowVeda Water Management System - Project Summary

## 🎯 Project Overview
FlowVeda is a comprehensive water quality monitoring and management system with a **Node.js/Express backend** and **React frontend**. The system provides real-time water quality monitoring, billing management, consumption forecasting, and tampering detection.

**Architecture**: CSV Data → Node.js API → React Dashboard

## 🏗️ Backend Architecture (Node.js)

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Data Processing**: CSV parsing, optional AWS S3 integration

### Key Features
- ✅ RESTful API with Express.js
- ✅ JWT-based authentication
- ✅ Real-time water quality monitoring
- ✅ Telemetry data processing from CSV
- ✅ Household billing management
- ✅ Consumption forecasting with linear regression
- ✅ Tampering detection and alerts
- ✅ User device management
- ✅ Subscription management

## 📊 Data Sources

### CSV Files
The system processes multiple CSV data sources:

1. **dataset1.csv** (Sensor Telemetry)
   - pH, TDS, turbidity, chlorine, hardness
   - Microbes, flow rate, battery level
   - Timestamped readings

2. **water_quality_zone1.csv** (Water Quality)
   - Contamination levels
   - Safety status indicators
   - Zone-specific quality metrics

3. **final_billing_zone1.csv** (Billing Data)
   - Household billing information
   - Consumption records
   - Payment status

4. **final_zone_consumption_zone1.csv** (Consumption Trends)
   - Monthly consumption data
   - Zone-level statistics
   - Historical trends

5. **final_tampering_zone1_daily.csv** (Tampering Detection)
   - Water released vs delivered
   - Daily tampering indicators
   - Alert thresholds

## 🚀 What's Been Built

### Backend Structure
```
backend/
├── server.js                    # Main Express server
├── config.js                    # Configuration settings
├── package.json                # Node.js dependencies
├── models/                     # Sequelize ORM models
│   ├── index.js               # Model initialization
│   ├── User.js                # User authentication
│   ├── UserProfile.js         # User profiles
│   ├── Device.js              # IoT devices
│   ├── SensorReading.js       # Sensor data
│   ├── Bill.js                # Billing
│   ├── Subscription.js        # Subscriptions
│   └── Notification.js        # Notifications
├── routes/                     # API endpoints
│   ├── auth.js                # Authentication
│   ├── devices.js             # Device management
│   ├── bills.js               # Billing
│   ├── subscriptions.js       # Subscriptions
│   ├── telemetry.js           # Sensor data
│   └── water.js               # Water management
├── middleware/                 # Custom middleware
│   └── auth.js                # JWT authentication
├── utils/                      # Utility modules
│   ├── csvReader.js           # CSV data parsing
│   └── s3DataAccess.js        # S3/local file access
└── api/data/                   # CSV data files
    └── dataset1.csv
```

### Frontend (React)
```
frontend/
├── src/
│   ├── App.js
│   ├── components/
│   │   ├── Landing.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── ResidentDashboard.js
│   │   ├── AdminDashboard.js
│   │   ├── Billing.js
│   │   └── Premium.js
│   └── services/
│       └── api.js              # API integration
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Devices & Readings
- `GET /api/devices` - List user devices
- `POST /api/devices` - Create device
- `GET /api/devices/readings/latest` - Latest sensor readings
- `GET /api/forecast` - Consumption forecast
- `GET /api/anomalies` - Flow anomaly detection

### Telemetry (Public)
- `GET /api/telemetry/schema` - Get CSV schema
- `GET /api/telemetry?parameter=pH&limit=200` - Parameter data
- `GET /api/telemetry/latest` - Latest readings
- `GET /api/telemetry/series?parameter=pH` - Time series

### Water Management (Public)
- `GET /api/water-quality` - Water quality status
- `GET /api/billing/:household_id` - Household billing
- `GET /api/zone-consumption` - Consumption trends & forecast
- `GET /api/tampering-alert?threshold=10` - Tampering alerts
- `POST /api/pay-bill` - Process payment

### Bills & Subscriptions
- `GET /api/bills` - User bills
- `POST /api/bills` - Create bill
- `POST /api/bills/:id/pay` - Pay bill
- `POST /api/subscribe` - Subscribe to plan

## 🛠️ Database Models

### Core Models
- **User** - Authentication (username, email, password)
- **UserProfile** - Extended info (user type, location, household size)
- **Device** - IoT devices (name, location, owner)
- **SensorReading** - Readings (pH, TDS, turbidity, etc.)
- **Bill** - Billing (amount, status, due date)
- **Subscription** - Plans (basic/premium)
- **Notification** - Alerts (water quality, battery, payments)

### Relationships
- User → UserProfile (1:1)
- User → Devices (1:many)
- Device → SensorReadings (1:many)
- User → Bills (1:many)
- User → Subscriptions (1:many)
- User → Notifications (1:many)

## 🚀 Getting Started

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start server
npm start              # Production
npm run dev           # Development with auto-reload
```

The backend runs on `http://localhost:8000`

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend runs on `http://localhost:3000`

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

```javascript
// Login request
POST /api/auth/login
{
  "username": "user",
  "password": "password"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com",
    "user_type": "household"
  }
}

// Use token in subsequent requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 📈 Smart Features

### 1. Water Safety Monitoring
Automated safety checks based on WHO standards:
- pH: 6.5-8.5
- TDS: 0-500 mg/L
- Turbidity: 0-1 NTU
- Chlorine: 0.2-4.0 mg/L

### 2. Consumption Forecasting
Linear regression model predicts next month's consumption based on historical trends.

### 3. Anomaly Detection
Detects unusual flow patterns (2x average) indicating possible leaks or tampering.

### 4. Tampering Alerts
Compares water released vs delivered, triggers alerts when difference exceeds threshold.

## 🎯 Migration from Django

This project has been **successfully migrated from Django to Node.js**:

### What Changed
- ✅ Django → Express.js
- ✅ Django ORM → Sequelize
- ✅ Django REST Framework → Express routes
- ✅ Token Auth → JWT
- ✅ Python → JavaScript
- ✅ requirements.txt → package.json

### What Stayed the Same
- ✅ All API endpoints (backward compatible)
- ✅ Database schema
- ✅ Business logic
- ✅ CSV data processing
- ✅ Frontend integration

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "sequelize": "^6.35.0",
  "sqlite3": "^5.1.6",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "csv-parser": "^3.0.0",
  "aws-sdk": "^2.1490.0"
}
```

### Frontend
- React
- Axios
- Tailwind CSS
- Recharts (for visualizations)

## 🔧 Configuration

### Environment Variables (.env)
```bash
PORT=8000
DEBUG=true
SECRET_KEY=your-secret-key
AWS_S3_BUCKET_NAME=flowveda-water-data
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## 📊 Performance Features

- ✅ In-memory caching for CSV data
- ✅ Efficient database queries with Sequelize
- ✅ JWT stateless authentication
- ✅ Async/await for non-blocking I/O
- ✅ CSV streaming for large files

## 🎉 Success Metrics

The system provides:
- **Real-time monitoring** of water quality
- **User management** with role-based access
- **Automated billing** and payment processing
- **Predictive analytics** for consumption
- **Alert system** for quality issues
- **REST API** for integration
- **Modern architecture** with Node.js

## 📞 Support & Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Debugging
- Backend logs: Console output or Morgan middleware
- Frontend: React DevTools
- Database: SQLite Browser

---

**🎯 You now have a complete, modern water management system with Node.js backend and React frontend!**
