# Backend Fix Guide - Getting Backend Working

## 🔍 Issues Identified

1. **Missing `.env` file** - Server can't start without environment variables
2. **Environment validation** - May be too strict for development
3. **Database connection** - May fail if MongoDB not running
4. **Clerk middleware** - May block requests if not configured

---

## ✅ Quick Fix Steps

### Step 1: Create `.env` File

Create `server/.env` file with minimum required variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Connection (MongoDB)
MONGODB_URI=mongodb://localhost:27017/sofluent

# Clerk Authentication (Get from Clerk Dashboard)
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_clerk_webhook_secret

# Stripe (Optional for basic testing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# CORS (for local development)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 2: Make Environment Validation More Lenient

The `envValidator.js` currently requires all production variables even in development. We need to make it more lenient.

### Step 3: Start MongoDB

Ensure MongoDB is running:
```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

### Step 4: Test Backend

```bash
cd server
npm start
```

Should see: `✅ Server running on port 3000`

### Step 5: Test Health Endpoint

```bash
curl http://localhost:3000/health
```

Should return: `{"status":"ok","timestamp":"...","uptime":...}`

---

## 🛠️ Detailed Fixes

### Fix 1: Make Environment Validation Development-Friendly

The validator currently requires `CLERK_SECRET_KEY` and `STRIPE_SECRET_KEY` even in development. We should make these optional for development.

### Fix 2: Handle Missing Database Gracefully

If MongoDB isn't running, the server should still start but show warnings.

### Fix 3: Make Clerk Middleware Optional in Development

Clerk middleware might be blocking requests. We should make it optional for development/testing.

---

## 🚨 Common Errors & Solutions

### Error: "Missing required environment variables"
**Solution:** Create `server/.env` file with minimum variables (see Step 1)

### Error: "Database connection failed"
**Solution:** 
- Start MongoDB: `mongod --dbpath "C:\data\db"`
- Or use MongoDB Atlas and update `MONGODB_URI`

### Error: "Clerk middleware error"
**Solution:** 
- Get Clerk keys from https://clerk.com dashboard
- Add to `.env` file
- Or make Clerk optional in development (see Fix 3)

### Error: "Cannot find module"
**Solution:** 
```bash
cd server
npm install
```

---

## 📋 Testing Checklist

- [ ] `.env` file created with required variables
- [ ] MongoDB running (or Atlas connection configured)
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors
- [ ] Health endpoint responds: `GET /health`
- [ ] Basic API endpoint works: `GET /api/course`
- [ ] CORS allows frontend requests

---

## 🔧 Next Steps

1. Create `.env` file
2. Update environment validator to be development-friendly
3. Make Clerk middleware optional in development
4. Test all endpoints
5. Document any remaining issues
