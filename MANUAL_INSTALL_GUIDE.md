# Manual Installation Guide (For Proxy Issues)

## 🔧 Proxy Configuration (Try This First)

If npm install fails due to proxy, configure npm:

```bash
# Set proxy
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port

# Or bypass proxy for specific registries
npm config set registry https://registry.npmjs.org/

# Disable SSL verification (use with caution)
npm config set strict-ssl false
```

---

## 📦 Backend Dependencies

### Navigate to backend folder:
```bash
cd backend
```

### Core Dependencies (Install one by one):

```bash
npm install express
npm install cors
npm install morgan
npm install sequelize
npm install sqlite3
npm install bcryptjs
npm install jsonwebtoken
npm install csv-parser
npm install csv-parse
npm install aws-sdk
npm install dotenv
```

### Dev Dependencies:
```bash
npm install --save-dev nodemon
```

### **All at once (if proxy allows):**
```bash
npm install express cors morgan sequelize sqlite3 bcryptjs jsonwebtoken csv-parser csv-parse aws-sdk dotenv
npm install --save-dev nodemon
```

---

## 🎨 Frontend Dependencies

### Navigate to frontend folder:
```bash
cd frontend
```

### Core Dependencies:

```bash
npm install react@18.2.0
npm install react-dom@18.2.0
npm install react-scripts@5.0.1
npm install axios@1.4.0
npm install bootstrap@5.3.0
npm install chart.js@4.4.0
npm install react-chartjs-2@5.2.0
npm install recharts@2.8.0
npm install leaflet@1.9.4
npm install react-leaflet@4.2.1
npm install tailwindcss@3.3.0
npm install autoprefixer@10.4.14
npm install postcss@8.4.24
```

### **All at once (if proxy allows):**
```bash
npm install react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1 axios@1.4.0 bootstrap@5.3.0 chart.js@4.4.0 react-chartjs-2@5.2.0 recharts@2.8.0 leaflet@1.9.4 react-leaflet@4.2.1 tailwindcss@3.3.0 autoprefixer@10.4.14 postcss@8.4.24
```

---

## 🚀 Alternative: Use Yarn

If npm doesn't work, try Yarn (often works better with proxies):

### Install Yarn:
```bash
npm install -g yarn
```

### Backend:
```bash
cd backend
yarn install
```

### Frontend:
```bash
cd frontend
yarn install
```

---

## 🌐 Alternative: Offline Installation

If you're completely offline or proxy blocked:

### 1. Download on Another Machine
On a machine with internet:
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Copy node_modules folders
- Copy `backend/node_modules/` to your offline machine
- Copy `frontend/node_modules/` to your offline machine

---

## 🔥 Quick Start After Manual Install

### Backend:
```bash
cd backend
npm start
# Server runs on http://localhost:8000
```

### Frontend (in new terminal):
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

---

## 📋 Minimum Essential Dependencies

If you want JUST the core features to work:

### Backend (Minimal):
```bash
npm install express cors sequelize sqlite3 bcryptjs jsonwebtoken csv-parser dotenv
```

### Frontend (Minimal):
```bash
npm install react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1 axios@1.4.0
```

---

## ⚠️ Common Proxy Issues & Solutions

### Issue 1: ECONNREFUSED
```bash
npm config rm proxy
npm config rm https-proxy
npm cache clean --force
```

### Issue 2: Certificate errors
```bash
npm config set strict-ssl false
npm config set ca ""
```

### Issue 3: Timeout
```bash
npm config set fetch-timeout 600000
npm config set fetch-retries 5
```

### Issue 4: Use different registry
```bash
npm config set registry http://registry.npmjs.org/
# Or use a mirror
npm config set registry https://registry.npmmirror.com/
```

---

## 🎯 Verification

After installation, verify:

### Backend:
```bash
cd backend
node -e "console.log(require('./package.json').dependencies)"
```

### Frontend:
```bash
cd frontend
node -e "console.log(require('./package.json').dependencies)"
```

---

## 📞 Still Having Issues?

Try using **npx** instead of npm:
```bash
npx create-react-app test-app
```

Or use **pnpm** (faster alternative):
```bash
npm install -g pnpm
cd backend && pnpm install
cd ../frontend && pnpm install
```

---

**Good luck! 🚀**

