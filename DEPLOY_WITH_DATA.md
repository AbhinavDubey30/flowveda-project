# 🚀 Deploy FlowVeda with REAL CSV Data - 5 Minutes

Your CSV files are already configured! The backend reads them locally - NO cloud credentials needed.

## Quick Deploy (2 Steps)

### Step 1: Push to GitHub (2 min)

```bash
git init
git add .
git commit -m "FlowVeda with real water data"
git branch -M main
```

Go to: https://github.com/new
- Repository: `flowveda-project`
- Public
- Create repository

```bash
git remote add origin https://github.com/AbhinavDubey30/flowveda-project.git
git push -u origin main
```

### Step 2A: Deploy Backend on Railway (2 min)

1. **Go to**: https://railway.app
2. **Login** with GitHub (it's FREE, no credit card)
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: `flowveda-project`
5. **Settings**:
   - Root Directory: `/backend`
   - Start Command: `npm start`
6. **Variables** tab → Add:
   ```
   PORT=8000
   NODE_ENV=production
   ```
7. **Deploy** → Copy your URL: `https://flowveda-production.up.railway.app`

### Step 2B: Deploy Frontend on Vercel (1 min)

1. **Go to**: https://vercel.com
2. **Login** with GitHub
3. **Import Project** → Select `flowveda-project`
4. **Settings**:
   - Root Directory: `frontend`
   - Framework: Create React App
5. **Environment Variables**:
   ```
   REACT_APP_API_BASE=https://YOUR-RAILWAY-URL.up.railway.app/api
   ```
   (Replace with your actual Railway URL from Step 2A)
6. **Deploy**

## ✅ DONE!

Your dashboard with **REAL CSV DATA** is live!

- **Frontend**: https://flowveda-xxx.vercel.app
- **Backend**: https://flowveda-production.up.railway.app
- **Test API**: Visit `https://YOUR-RAILWAY-URL.up.railway.app/api/health`

## 📊 Your Real Data Included:

✅ `water_quality_zone1.csv` - Water quality metrics
✅ `final_billing_zone1.csv` - Billing data
✅ `final_zone_consumption_zone1.csv` - Consumption trends
✅ `final_tampering_zone1_daily.csv` - Tampering detection
✅ `zoneA_consumption_250houses_JanSep2025.csv` - Household data

All CSV files deploy automatically with the backend!

## 🎉 What You'll See:

- Real water quality readings
- Actual consumption charts
- Live billing data
- Tampering detection alerts
- All from YOUR CSV files!

---

**Total Time: ~5 minutes** ⚡
**Cost: $0** (both services are free)
**Credentials Needed: ZERO** ✨

