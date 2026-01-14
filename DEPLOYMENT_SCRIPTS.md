# 🚀 Deployment Scripts Guide

**Date:** January 10, 2026  
**Purpose:** Automated scripts for deployment verification and checks

---

## 📦 Available Scripts

### **1. Pre-Deployment Check**
**File:** `scripts/pre-deploy-check.js`

**Purpose:** Verify code is ready for deployment

**Usage:**
```bash
node scripts/pre-deploy-check.js
```

**Checks:**
- ✅ Code quality (no console.logs, error handling)
- ✅ Architecture (adapters, design system)
- ✅ Documentation (guides, API docs)
- ✅ Environment files (.env.example)
- ✅ Backend (server, migrations, email)
- ✅ Frontend (App, ErrorBoundary, SEO)
- ✅ Manus readiness (configs, adapters)

**Output:** Pass/fail with detailed checklist

---

### **2. Production Build Verification**
**File:** `scripts/build-production.js`

**Purpose:** Verify production build is ready

**Usage:**
```bash
node scripts/build-production.js
```

**Checks:**
- ✅ Build output exists (`client/dist/`)
- ✅ Bundle sizes (< 500KB JS, < 100KB CSS)
- ✅ Environment files present
- ✅ Documentation complete
- ✅ Dependencies installed
- ✅ Code quality (ESLint)

**Output:** Build verification report

---

### **3. Deployment Verification**
**File:** `scripts/verify-deployment.js`

**Purpose:** Verify deployment after going live

**Usage:**
```bash
# Set environment variables
export BACKEND_URL=https://api.sofluent.ai
export FRONTEND_URL=https://sofluent.ai

# Run verification
node scripts/verify-deployment.js
```

**Checks:**
- ✅ Health endpoints (`/health`, `/health/detailed`, `/health/ready`, `/health/live`)
- ✅ API endpoints (Swagger docs, public routes)
- ✅ Frontend (loads, no errors)
- ✅ Performance (response times < 500ms)
- ✅ Environment variables (all required set)

**Output:** Comprehensive deployment report

---

## 🔧 Adding Scripts to package.json

### **Root package.json:**
```json
{
  "scripts": {
    "pre-deploy": "node scripts/pre-deploy-check.js",
    "verify-build": "node scripts/build-production.js",
    "verify-deployment": "node scripts/verify-deployment.js",
    "deploy:check": "npm run pre-deploy && npm run verify-build"
  }
}
```

### **Server package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "node -e \"import('./migrations/migrationRunner.js').then(m => m.default.runMigrations())\"",
    "migrate:rollback": "node -e \"import('./migrations/migrationRunner.js').then(m => m.default.rollbackLast())\"",
    "health": "curl http://localhost:3000/health"
  }
}
```

### **Client package.json:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

---

## 🎯 Deployment Workflow

### **Step 1: Pre-Deployment**
```bash
npm run pre-deploy
```
**Expected:** All checks pass ✅

### **Step 2: Build**
```bash
cd client && npm run build
npm run verify-build
```
**Expected:** Build successful, bundle sizes acceptable ✅

### **Step 3: Deploy to Manus**
- Follow `MANUS_DEPLOYMENT_COMPLETE_GUIDE.md`
- Deploy backend first
- Deploy frontend second

### **Step 4: Post-Deployment Verification**
```bash
export BACKEND_URL=https://api.sofluent.ai
export FRONTEND_URL=https://sofluent.ai
npm run verify-deployment
```
**Expected:** All checks pass ✅

---

## 📊 Health Check Endpoints

### **Basic Health**
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-10T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### **Detailed Health**
```
GET /health/detailed
```
**Response:**
```json
{
  "status": "ok",
  "checks": {
    "server": { "status": "ok", "uptime": 3600 },
    "database": { "status": "ok", "responseTime": 45 },
    "storage": { "status": "ok", "responseTime": 12 },
    "secrets": { "status": "ok", "missing": [] }
  }
}
```

### **Readiness Check** (Kubernetes/Manus)
```
GET /health/ready
```
**Response:**
```json
{
  "status": "ready",
  "timestamp": "2026-01-10T12:00:00.000Z"
}
```

### **Liveness Check** (Kubernetes/Manus)
```
GET /health/live
```
**Response:**
```json
{
  "status": "alive",
  "timestamp": "2026-01-10T12:00:00.000Z",
  "uptime": 3600
}
```

---

## 🚨 Troubleshooting

### **Pre-Deploy Check Fails**
- Review error messages
- Fix missing files/components
- Re-run check

### **Build Verification Fails**
- Check bundle sizes
- Optimize large files
- Rebuild

### **Deployment Verification Fails**
- Check backend is running
- Verify URLs are correct
- Check environment variables
- Review server logs

---

## ✅ Success Criteria

**Pre-Deployment:**
- ✅ All critical checks pass
- ✅ No errors or warnings
- ✅ Documentation complete

**Build:**
- ✅ Build succeeds
- ✅ Bundle sizes acceptable
- ✅ No build errors

**Deployment:**
- ✅ Health checks pass
- ✅ API responds
- ✅ Frontend loads
- ✅ Performance acceptable

---

**Last Updated:** January 10, 2026  
**Status:** ✅ Ready to Use
