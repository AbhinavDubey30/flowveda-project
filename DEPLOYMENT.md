# FlowVeda Vercel Deployment Guide

## Prerequisites

1. GitHub account: **AbhinavDubey30**
2. Vercel account (sign up at https://vercel.com)
3. Backend hosting solution (see options below)

## Deployment Strategy

Since this is a full-stack application, we'll deploy:
- **Frontend**: Vercel (React app)
- **Backend**: Separate hosting service (Railway, Render, or Heroku)

### Why Not Deploy Backend on Vercel?

Your backend uses SQLite, which is a file-based database. Vercel's serverless functions have ephemeral filesystems, meaning the database would be reset on every deployment. You need a persistent database solution.

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - FlowVeda project"
```

2. Create a new repository on GitHub:
   - Go to https://github.com/AbhinavDubey30
   - Click "New repository"
   - Name it: `flowveda-project` (or your preferred name)
   - Don't initialize with README (you already have files)

3. Push your code:
```bash
git remote add origin https://github.com/AbhinavDubey30/flowveda-project.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend (Choose One Option)

### Option A: Railway (Recommended - Easiest)

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `flowveda-project` repository
5. Set root directory to `backend`
6. Add environment variables:
   - `PORT`: 8000
   - `NODE_ENV`: production
   - Any other variables from your config
7. Railway will automatically detect Node.js and deploy
8. Copy your Railway URL (e.g., `https://flowveda-backend.railway.app`)

### Option B: Render

1. Go to https://render.com
2. Sign in with GitHub
3. New → Web Service
4. Connect your repository
5. Settings:
   - Name: `flowveda-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables
7. Create Web Service
8. Copy your Render URL

### Option C: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create flowveda-backend`
4. Deploy:
```bash
cd backend
git init
git add .
git commit -m "Backend deployment"
heroku git:remote -a flowveda-backend
git push heroku main
```

## Step 3: Update Frontend API Configuration

Update `frontend/src/services/api.js` with your backend URL:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app';
```

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

Commit and push these changes:
```bash
git add .
git commit -m "Update API endpoint for production"
git push
```

## Step 4: Deploy Frontend to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your `flowveda-project` repository
5. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variables:
   - `REACT_APP_API_URL`: Your backend URL
7. Click "Deploy"

### Method 2: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

## Step 5: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Database Migration (Important!)

Your current SQLite database won't work in production. Choose one:

### Option 1: Vercel Postgres (Recommended for Vercel)
```bash
npm install -g vercel
vercel link
vercel postgres create
```

Then update `backend/config.js` to use PostgreSQL with the provided credentials.

### Option 2: Neon (Free PostgreSQL)
1. Go to https://neon.tech
2. Create a free database
3. Get connection string
4. Update backend configuration

### Option 3: Supabase
1. Go to https://supabase.com
2. Create project
3. Get PostgreSQL connection string
4. Update backend configuration

## Environment Variables Checklist

### Backend (Railway/Render/Heroku)
- `PORT` (usually auto-set)
- `NODE_ENV=production`
- `DATABASE_URL` (if using PostgreSQL)
- `JWT_SECRET` (generate a secure random string)
- Any AWS credentials if needed

### Frontend (Vercel)
- `REACT_APP_API_URL` (your backend URL)

## Testing Deployment

1. Visit your Vercel URL (e.g., `https://flowveda-project.vercel.app`)
2. Test user registration/login
3. Check browser console for any API errors
4. Verify all features work correctly

## Troubleshooting

### CORS Errors
Update backend CORS configuration to allow your Vercel domain:
```javascript
app.use(cors({
  origin: ['https://flowveda-project.vercel.app', 'http://localhost:3000']
}));
```

### API Not Connecting
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check backend is running (visit backend URL /api/health)
- Check browser console for errors

### Build Failures
- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

## Useful Commands

```bash
# Check Vercel deployments
vercel ls

# View deployment logs
vercel logs

# Rollback deployment
vercel rollback

# Check build locally
cd frontend && npm run build
```

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy backend to Railway/Render
3. ✅ Update frontend API URL
4. ✅ Deploy frontend to Vercel
5. ✅ Test all functionality
6. 🔄 Migrate to PostgreSQL (recommended)
7. 🎨 Add custom domain (optional)

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- GitHub Issues: Report issues in your repository

---

**Created for**: AbhinavDubey30's FlowVeda Project
**Last Updated**: October 2025

