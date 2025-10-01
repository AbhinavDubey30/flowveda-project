# 🔐 FlowVeda Login Credentials

All users use the same password: **`admin123`**

---

## 👔 Authority/Admin Login

**For Municipal Dashboard (Full Admin Access)**

- **Email:** `admin@municipality.gov.in`
- **Password:** `admin123`
- **Role:** Municipal Admin
- **Access:** Full admin dashboard with all zones, tampering alerts, consumption data

---

## 🏠 Household User Logins

**For Resident Dashboard (Personal Water Monitoring)**

### User 1 - Rajesh Kumar
- **Username:** `User-1`
- **Email:** `user1@example.com`
- **Password:** `admin123`
- **Location:** Andheri, Mumbai
- **Household Size:** 4 people
- **Device ID:** FLV-1001

### User 2 - Priya Sharma
- **Username:** `User-2`
- **Email:** `user2@example.com`
- **Password:** `admin123`
- **Location:** Bandra, Mumbai
- **Household Size:** 3 people
- **Device ID:** FLV-1002

### User 3 - Amit Patel
- **Username:** `User-3`
- **Email:** `user3@example.com`
- **Password:** `admin123`
- **Location:** Powai, Mumbai
- **Household Size:** 5 people
- **Device ID:** FLV-1003

### Demo Resident (Easy to remember!)
- **Username:** `resident`
- **Email:** `resident@example.com`
- **Password:** `admin123`
- **Location:** Mumbai, Maharashtra
- **Household Size:** 2 people
- **Device ID:** FLV-DEMO

---

## 📋 Quick Reference

| User Type | Username | Password | Dashboard Access |
|-----------|----------|----------|------------------|
| Admin | `admin@municipality.gov.in` | `admin123` | Full Admin Dashboard |
| Household | `User-1` | `admin123` | Resident Dashboard |
| Household | `User-2` | `admin123` | Resident Dashboard |
| Household | `User-3` | `admin123` | Resident Dashboard |
| Household | `resident` | `admin123` | Resident Dashboard |

---

## 🎯 How to Login

### Authority Login:
1. Go to your Vercel URL
2. Click "Login"
3. Select **"Authority"** radio button
4. Enter: `admin@municipality.gov.in`
5. Password: `admin123`
6. Click "Login to Authority Dashboard"

### Household Login:
1. Go to your Vercel URL
2. Click "Login"
3. Select **"Household"** radio button
4. Enter Device ID: `FLV-1001` (or any device ID above)
5. Enter Mobile: `9876543210` (or corresponding mobile number)
6. Click "Login to Household Dashboard"

**OR use username/email:**
1. Login with username: `User-1` (or `resident`)
2. Password: `admin123`

---

## 📊 What Each User Sees

### Admin Dashboard:
- ✅ Real-time water quality monitoring
- ✅ Zone consumption trends and forecasts
- ✅ Tampering detection alerts
- ✅ Interactive map with sensor locations
- ✅ Monthly consumption charts
- ✅ System-wide statistics

### Resident Dashboard:
- ✅ Current water quality status
- ✅ Personal billing information
- ✅ Household consumption data
- ✅ Payment status
- ✅ Water safety indicators
- ✅ Real-time parameter monitoring

---

## 🔄 Register New Users

Users can also register new accounts with any details they want - the system will accept any registration and create a new mock user on the fly!

---

## 📝 Notes

- All passwords are the same (`admin123`) for demo purposes
- These are mock/hardcoded users (no database)
- Dashboard data comes from your CSV files
- New users can be registered dynamically
- All registered users persist during the serverless function lifetime

---

**Your FlowVeda dashboard is now fully functional!** 🎉

