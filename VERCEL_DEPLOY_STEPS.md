# 🚀 Quick Vercel Deployment Steps for FlowVeda

## 📋 Prerequisites Checklist

- [x] GitHub Account: **AbhinavDubey30**
- [ ] Vercel Account (free): https://vercel.com
- [ ] Railway Account (free): https://railway.app (for backend)

---

## 🎯 Quick Deploy (5 Steps)

### Step 1: Push to GitHub (5 minutes)

```bash
# Initialize git if not done
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create repo on GitHub: https://github.com/new
# Name it: flowveda-project

# Push code
git remote add origin https://github.com/AbhinavDubey30/flowveda-project.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend on Railway (5 minutes)

1. **Go to**: https://railway.app
2. **Sign in** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: `flowveda-project`
5. **Root Directory**: `backend`
6. **Environment Variables** (Add these):
   ```
   PORT=8000
   NODE_ENV=production
   JWT_SECRET=your-random-secret-key-here
   ```
7. **Deploy** → Wait for deployment
8. **Copy URL**: `https://flowveda-production.up.railway.app` (example)

### Step 3: Update Frontend API URL (2 minutes)

Edit `frontend/src/services/api.js`:

Change line 3 from:
```javascript
const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000/api';
```

To:
```javascript
const API_BASE = process.env.REACT_APP_API_BASE || 'https://your-railway-url.up.railway.app/api';
```

**OR** set it in Vercel environment variables (recommended - see Step 4)

```bash
git add .
git commit -m "Update API endpoint for production"
git push
```

### Step 4: Deploy Frontend on Vercel (3 minutes)

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **Add New** → **Project**
4. **Import** `flowveda-project` repository
5. **Configure**:
   - Framework Preset: **Create React App**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `build`
6. **Environment Variables**:
   ```
   REACT_APP_API_BASE=https://your-railway-url.up.railway.app/api
   ```
7. **Deploy** → Wait 2-3 minutes

### Step 5: Update Backend CORS (2 minutes)

After Vercel gives you a URL (e.g., `https://flowveda.vercel.app`), update backend CORS:

1. Go to Railway project
2. Add environment variable:
   ```
   CORS_ORIGINS=https://flowveda.vercel.app,http://localhost:3000
   ```
3. **Or** manually update `backend/server.js` if needed

✅ **Done! Your app is live!**

---

## 🌐 Your Live URLs

- **Frontend**: https://flowveda-[random].vercel.app
- **Backend API**: https://flowveda-production.up.railway.app
- **API Health Check**: https://flowveda-production.up.railway.app/api/health

---

## ⚠️ Important Notes

### Database Issue (SQLite)
Your current SQLite database won't persist on Railway. You need to migrate to PostgreSQL:

**Quick Fix - Use Railway's PostgreSQL** (Recommended):
1. In Railway project, click **"+ New"** → **Database** → **PostgreSQL**
2. Railway will provide `DATABASE_URL` automatically
3. Update `backend/config.js` to use PostgreSQL instead of SQLite

### Alternative: Use Vercel Postgres
```bash
npm install -g vercel
vercel link
vercel postgres create
```

Then update your Sequelize config to use the provided PostgreSQL URL.

---

## 🐛 Troubleshooting

### "API request failed" error
- ✅ Check `REACT_APP_API_BASE` is set correctly in Vercel
- ✅ Visit backend URL to confirm it's running
- ✅ Check CORS settings in backend

### Build fails on Vercel
- ✅ Check build logs in Vercel dashboard
- ✅ Ensure all dependencies are in `frontend/package.json`
- ✅ Test local build: `cd frontend && npm run build`

### Backend not starting on Railway
- ✅ Check Railway logs
- ✅ Ensure `package.json` has correct start script
- ✅ Verify Node version compatibility

---

## 📝 Environment Variables Reference

### Vercel (Frontend)
```
REACT_APP_API_BASE=https://your-backend-url.railway.app/api
```

### Railway (Backend)
```
PORT=8000
NODE_ENV=production
JWT_SECRET=change-this-to-random-secret
DATABASE_URL=postgresql://... (if using PostgreSQL)
CORS_ORIGINS=https://your-frontend.vercel.app
```

---

## 🔄 Redeployment

Every time you push to GitHub main branch:
- ✅ Vercel automatically redeploys frontend
- ✅ Railway automatically redeploys backend

No manual steps needed!

---

## 🎨 Optional: Custom Domain

In Vercel dashboard:
1. Go to project **Settings**
2. **Domains** → Add your domain
3. Update DNS records as instructed
4. Update CORS settings in backend

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app  
- **React Deployment**: https://create-react-app.dev/docs/deployment

---

**Happy Deploying! 🎉**

Created by: AbhinavDubey30
Last Updated: October 2025

