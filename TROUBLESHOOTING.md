# 🔧 Vercel Deployment Troubleshooting

## Issue: Deployment Stuck on "Queued"

### Quick Fixes:

#### 1. **Wait 2-3 Minutes**
- Vercel queues deployments when busy
- Usually starts within 2-3 minutes
- Check if status changes

#### 2. **Cancel and Retry**
1. On Vercel dashboard, find your deployment
2. Click the **"..."** menu (three dots)
3. Click **"Cancel Deployment"**
4. Wait 30 seconds
5. Click **"Redeploy"** button

#### 3. **Check Build Settings**
Make sure these are set correctly:

**Framework Preset**: Other (or Create React App)
**Build Command**: `npm run build`
**Output Directory**: `frontend/build`
**Install Command**: `npm run install-all`
**Root Directory**: `./` (leave empty or set to root)

#### 4. **Simplify Configuration**
Try removing optional settings:
- Remove `buildCommand` from vercel.json (let Vercel auto-detect)
- Remove `installCommand` from vercel.json

#### 5. **Use Simpler vercel.json**
If still stuck, try this minimal configuration.

---

## Alternative: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

This often works when the dashboard is stuck.

---

## Common Issues:

### Issue: "Queued" for over 5 minutes
**Solution**: 
1. Cancel deployment
2. Check Vercel status: https://www.vercel-status.com
3. Try CLI deployment instead

### Issue: Fails after queue
**Solution**: Check the error logs and see specific error message

### Issue: Environment variables not set
**Solution**: 
1. Go to Settings → Environment Variables
2. Add required variables
3. Redeploy

---

## Need Immediate Deploy?

Try the **Vercel CLI method** (usually faster):

```bash
npm install -g vercel
vercel login
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (first time) or **Y** (if exists)
- What's your project's name? `flowveda`
- In which directory is your code? `./`
- Want to override settings? **Y**
- Build Command: `npm run build`
- Output Directory: `frontend/build`
- Development Command: `npm run dev:frontend`

This deploys directly from your local machine, bypassing GitHub integration issues.

