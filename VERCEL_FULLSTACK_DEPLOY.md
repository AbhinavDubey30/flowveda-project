# 🚀 Deploy Full FlowVeda Project on Vercel (Frontend + Backend)

## ✅ Yes, You CAN Deploy Everything on Vercel!

You just need to switch from SQLite to a cloud database. Here's how:

---

## 🎯 Quick Setup (3 Steps)

### Step 1: Create Vercel Postgres Database (5 minutes)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login & Create Database**:
```bash
vercel login
cd backend
vercel link
vercel postgres create flowveda-db
```

3. **Pull environment variables**:
```bash
vercel env pull .env
```

This creates a `.env` file with `POSTGRES_URL` and other credentials.

### Step 2: Update Backend to Use PostgreSQL (10 minutes)

**Install PostgreSQL driver**:
```bash
cd backend
npm install pg pg-hstore
```

**Update `backend/config.js`**:

```javascript
require('dotenv').config();

const config = {
  PORT: process.env.PORT || 8000,
  DEBUG: process.env.NODE_ENV !== 'production',
  
  // Database configuration
  database: {
    // Use PostgreSQL in production, SQLite in development
    dialect: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
    storage: process.env.DATABASE_URL ? undefined : './db.sqlite3',
    
    // PostgreSQL connection (for production)
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    
    dialectOptions: process.env.DATABASE_URL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : undefined,
    
    logging: false,
  },
  
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
};

module.exports = config;
```

**Update `backend/models/index.js`** to use the new config:

```javascript
const { Sequelize } = require('sequelize');
const config = require('../config');

let sequelize;

if (config.database.url) {
  // PostgreSQL (production)
  sequelize = new Sequelize(config.database.url, {
    dialect: 'postgres',
    dialectOptions: config.database.dialectOptions,
    logging: config.database.logging,
  });
} else {
  // SQLite (development)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.database.storage,
    logging: config.database.logging,
  });
}

// Import models
const User = require('./User')(sequelize);
const Device = require('./Device')(sequelize);
const SensorReading = require('./SensorReading')(sequelize);
const Bill = require('./Bill')(sequelize);
const Subscription = require('./Subscription')(sequelize);
const Notification = require('./Notification')(sequelize);
const UserProfile = require('./UserProfile')(sequelize);

// Define associations
User.hasMany(Device, { foreignKey: 'userId' });
Device.belongsTo(User, { foreignKey: 'userId' });

Device.hasMany(SensorReading, { foreignKey: 'deviceId' });
SensorReading.belongsTo(Device, { foreignKey: 'deviceId' });

User.hasMany(Bill, { foreignKey: 'userId' });
Bill.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(UserProfile, { foreignKey: 'userId' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Device,
  SensorReading,
  Bill,
  Subscription,
  Notification,
  UserProfile,
};
```

**Commit changes**:
```bash
git add .
git commit -m "Add PostgreSQL support for Vercel deployment"
git push
```

### Step 3: Configure Vercel (Updated vercel.json)

**Update `vercel.json`** in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 4: Deploy to Vercel

**Method 1: Via Dashboard (Easier)**
1. Go to https://vercel.com
2. Import your GitHub repository
3. In **Environment Variables**, add:
   - `POSTGRES_URL`: (from Step 1, or create new Postgres in Vercel)
   - `JWT_SECRET`: (generate random string)
   - `REACT_APP_API_BASE`: `/api`
4. Deploy!

**Method 2: Via CLI**
```bash
vercel --prod
```

---

## 🎉 Alternative: Use Free Cloud Database

Don't want to use Vercel Postgres? Use these free options:

### Option A: Neon (Free PostgreSQL)
1. Go to https://neon.tech
2. Create free database
3. Copy connection string
4. Add to Vercel env vars as `DATABASE_URL`

### Option B: Supabase (Free PostgreSQL)
1. Go to https://supabase.com
2. Create project
3. Get connection string from Settings → Database
4. Add to Vercel env vars as `DATABASE_URL`

### Option C: Railway Postgres (Free tier)
1. Go to https://railway.app
2. New Project → PostgreSQL
3. Copy connection string
4. Add to Vercel env vars as `DATABASE_URL`

---

## 📋 Final Checklist

- [ ] Install `pg pg-hstore` in backend
- [ ] Update `backend/config.js` for PostgreSQL
- [ ] Update `backend/models/index.js`
- [ ] Create Vercel Postgres (or use alternative)
- [ ] Set environment variables in Vercel:
  - `POSTGRES_URL` or `DATABASE_URL`
  - `JWT_SECRET`
  - `REACT_APP_API_BASE=/api`
- [ ] Update `vercel.json`
- [ ] Push to GitHub
- [ ] Deploy on Vercel

---

## 🔧 Backend as Serverless API

Your backend will run as serverless functions on Vercel:
- ✅ Auto-scaling
- ✅ No server management
- ✅ Fast global CDN
- ⚠️ Cold starts (first request may be slower)
- ⚠️ 10-second timeout per request (hobby plan)

---

## 🌐 Final Structure

```
https://flowveda.vercel.app/          → Frontend (React)
https://flowveda.vercel.app/api/*     → Backend API (Node.js serverless)
```

Everything on one domain! 🎉

---

## 📊 Database Migration

After deployment, your database will be empty. To migrate data:

```bash
# Export from SQLite
sqlite3 backend/db.sqlite3 .dump > backup.sql

# Import to PostgreSQL (modify SQL for Postgres syntax)
# Or write a migration script
```

---

## 💰 Pricing

**Vercel Free (Hobby) Plan includes**:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function execution
- Custom domains

**Vercel Postgres Free includes**:
- 256 MB database
- 60 compute hours/month
- Perfect for testing/small projects

For larger usage, consider paid plans or free alternatives (Neon, Supabase).

---

**Yes, it WILL work on Vercel! Just need to switch the database. 🚀**

