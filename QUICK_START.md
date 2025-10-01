# FlowVeda - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

This guide will help you set up and run the FlowVeda Water Management System with the **Node.js backend** and **React frontend**.

## Prerequisites

- **Node.js** >= 14.0.0 ([Download](https://nodejs.org/))
- **npm** >= 6.0.0 (comes with Node.js)
- A code editor (VS Code recommended)
- Terminal/Command Prompt

## 📦 Installation

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the backend server
npm start
```

The backend will start on **http://localhost:8000**

✅ You should see:
```
✅ CSV data loaded successfully
✅ Database synced successfully
🚀 FlowVeda API server running on port 8000
📍 Environment: Development
```

### Step 2: Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will start on **http://localhost:3000**

## 🎯 Quick Test

### Test the Backend API

Open your browser or use curl:

```bash
# Health check
curl http://localhost:8000/api/health

# Get telemetry schema
curl http://localhost:8000/api/telemetry/schema

# Get latest water quality
curl http://localhost:8000/api/water-quality

# Get latest telemetry
curl http://localhost:8000/api/telemetry/latest
```

### Test the Frontend

1. Open **http://localhost:3000** in your browser
2. You should see the FlowVeda landing page
3. Click **"Register"** to create an account
4. Or use the admin login:
   - Email: `admin@municipality.gov.in`
   - Password: `admin123`

## 🔧 Troubleshooting

### Backend Issues

**Port already in use?**
```bash
# Change the port in .env
PORT=3001
```

**Database errors?**
```bash
# Delete and recreate database
rm db.sqlite3
npm start
```

**CSV file not found?**
- Ensure `backend/api/data/dataset1.csv` exists
- Check data files in `data/` directory

### Frontend Issues

**Can't connect to backend?**
- Make sure backend is running on port 8000
- Check `REACT_APP_API_BASE` in frontend `.env` file

**Module not found?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

### Create Your First Device

1. **Register a user** (if not already)
2. **Login** to get a token
3. **Create a device**:

```bash
curl -X POST http://localhost:8000/api/devices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Home Water Meter", "location": "Kitchen"}'
```

### View Water Quality Data

```bash
# Get latest water quality
curl http://localhost:8000/api/water-quality

# Get zone consumption forecast
curl http://localhost:8000/api/zone-consumption

# Check for tampering
curl http://localhost:8000/api/tampering-alert?threshold=10
```

### Access Telemetry Data

```bash
# Get pH data
curl "http://localhost:8000/api/telemetry?parameter=pH&limit=10"

# Get latest telemetry
curl http://localhost:8000/api/telemetry/latest
```

## 🎨 User Interfaces

### For Residents
- View water quality in real-time
- Monitor consumption
- Pay bills
- Check device status
- Receive alerts

### For Officials/Admins
- Monitor entire zone
- View consumption trends
- Detect tampering
- Generate reports
- Manage billing

## 📱 API Authentication

### Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure123",
    "user_type": "household"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "user_type": "household"
  }
}
```

### Use Token in Requests

```bash
curl http://localhost:8000/api/devices \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Sample Data

The system comes with sample CSV data:
- **dataset1.csv** - Sensor readings (pH, TDS, turbidity, etc.)
- **water_quality_zone1.csv** - Water quality metrics
- **final_billing_zone1.csv** - Billing information
- **final_zone_consumption_zone1.csv** - Consumption trends
- **final_tampering_zone1_daily.csv** - Tampering detection

## 🔐 Security Notes

- **JWT tokens** expire in 24 hours
- **Passwords** are hashed with bcrypt
- **CORS** is enabled for local development
- In production, update `SECRET_KEY` in `.env`

## 🚀 Deployment

### Backend Deployment (Heroku, AWS, etc.)

1. Set environment variables:
```bash
export DEBUG=false
export SECRET_KEY="your-production-secret-key"
export PORT=8000
```

2. Run:
```bash
npm start
```

### Frontend Deployment (Vercel, Netlify)

1. Update API endpoint:
```bash
# In .env
REACT_APP_API_BASE=https://your-api-domain.com/api
```

2. Build:
```bash
npm run build
```

## 📖 Documentation

- **Backend API**: See `backend/README.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`
- **Full API Docs**: See API endpoint comments in `backend/routes/`

## 💡 Tips

1. **Development Mode**: Use `npm run dev` for auto-reload
2. **Database Reset**: Delete `db.sqlite3` to start fresh
3. **Logs**: Check console for detailed error messages
4. **Testing**: Use Postman or curl for API testing
5. **Frontend State**: React DevTools for debugging

## 🎉 Success!

You should now have:
- ✅ Backend running on port 8000
- ✅ Frontend running on port 3000
- ✅ Database initialized
- ✅ CSV data loaded
- ✅ Authentication working
- ✅ API endpoints accessible

## 📞 Need Help?

- Check the console logs for errors
- Review the API documentation
- Ensure all CSV files are in place
- Verify Node.js version: `node --version`

---

**🎯 Enjoy your FlowVeda Water Management System!**

