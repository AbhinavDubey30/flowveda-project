# FlowVeda - Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

This project has been configured for seamless Vercel deployment with both frontend and backend.

### What's Been Configured:

1. ✅ **Modern Vercel Configuration** (`vercel.json`)
   - Serverless API functions
   - Proper routing for frontend and backend
   - Build optimizations

2. ✅ **Serverless API** (`/api/index.js`)
   - Express backend converted to serverless function
   - Auto-initializing database on cold starts
   - All routes properly configured

3. ✅ **Build Scripts**
   - Root `package.json` with vercel-build script
   - Frontend build configuration
   - Proper dependency management

4. ✅ **Optimized Deployment** (`.vercelignore`)
   - Excludes unnecessary files
   - Reduces deployment size
   - Faster build times

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AbhinavDubey30/flowveda-project.git)

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 3: GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect settings
5. Click "Deploy"

## 🔧 Environment Variables

Set these in Vercel Dashboard (Settings → Environment Variables):

### Required:
```
NODE_ENV=production
SECRET_KEY=your-secure-secret-key-here
```

### Optional (for AWS S3 integration):
```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=flowveda-water-data
AWS_REGION=us-east-1
```

## 📁 Project Structure

```
flowveda-project/
├── api/                    # Serverless API functions
│   ├── index.js           # Main API handler
│   └── package.json       # API dependencies
├── backend/               # Backend source code
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & other middleware
│   └── server.js         # Original Express server
├── frontend/             # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── data/                 # CSV datasets
├── vercel.json          # Vercel configuration
├── package.json         # Root package file
└── .vercelignore       # Files to exclude from deployment
```

## 🔍 How It Works

1. **Frontend**: React app is built and served as static files
2. **Backend**: Express app runs as serverless function at `/api/*`
3. **Database**: SQLite runs in-memory (resets on cold starts)
4. **Data**: CSV files are bundled with deployment

### API Routes

All backend routes are accessible at:
- `/api/auth/*` - Authentication
- `/api/devices/*` - Device management
- `/api/telemetry/*` - Telemetry data
- `/api/bills/*` - Billing
- `/api/subscribe/*` - Subscriptions
- `/api/health` - Health check

## ⚡ Performance Tips

1. **Cold Starts**: First request may be slow (3-5s). Subsequent requests are fast.
2. **Memory**: Configured for 1024MB (adjustable in vercel.json)
3. **Timeout**: 10 seconds max (Hobby plan limit)
4. **Database**: In-memory SQLite (consider external DB for production)

## 🔒 Security Recommendations

1. ✅ Update `SECRET_KEY` in environment variables
2. ✅ Enable HTTPS (automatic on Vercel)
3. ✅ Configure CORS properly for production domain
4. ⚠️ Consider external database for persistent data
5. ⚠️ Review and update default admin credentials

## 🐛 Troubleshooting

### Build Failures

```bash
# Clear cache and retry
vercel --force

# Check build logs in Vercel dashboard
```

### API Not Working

1. Check environment variables are set
2. Check function logs in Vercel dashboard
3. Verify routes match frontend API calls

### Database Issues

- Database is in-memory and resets on cold starts
- For production, use external database (PostgreSQL, MySQL, MongoDB)
- Update `backend/config.js` to use production database

## 📊 Monitoring

- **Vercel Analytics**: Auto-enabled for performance metrics
- **Function Logs**: Available in Vercel dashboard
- **Error Tracking**: Check runtime logs for errors

## 🔄 Updates & CI/CD

Vercel auto-deploys on:
- Push to `main` branch → Production
- Push to other branches → Preview deployments
- Pull Requests → Preview deployments

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)

## 🆘 Support

If you encounter issues:
1. Check Vercel function logs
2. Review build logs
3. Verify environment variables
4. Check GitHub issues

---

**Ready to Deploy!** 🎉

Your project is now fully configured for Vercel deployment. Click the deploy button above or follow the CLI instructions.

