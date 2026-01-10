# Authentication Setup Guide

**Critical:** This guide explains how authentication works and how to set it up for login/signup to function.

---

## 🔐 How Authentication Works

### Current Setup: Clerk Authentication

The platform uses **Clerk** for authentication, which provides:
- User signup/login
- Email/password authentication
- Social login (Google, etc.)
- User management
- Session management

### Authentication Flow:

1. **User Signs Up/Logs In** (Frontend)
   - User clicks "Create Account" or "Sign In"
   - Clerk modal opens
   - User authenticates via Clerk

2. **Clerk Webhook** (Backend)
   - When user signs up, Clerk sends webhook to `/clerk` endpoint
   - Backend creates user record in database
   - User is now in your system

3. **User Access** (Frontend + Backend)
   - Frontend gets user info from Clerk
   - Backend validates user via Clerk token
   - User can access protected routes

---

## ⚠️ CRITICAL: Backend Must Be Running

**Authentication will NOT work without the backend server running!**

### Why?
- Clerk webhooks need backend to create users in database
- API calls need backend to fetch user data
- Protected routes need backend to validate tokens

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Set Up Clerk Account

1. **Create Clerk Account**
   - Go to [clerk.com](https://clerk.com)
   - Sign up for free account
   - Create new application

2. **Get API Keys**
   - Go to API Keys section
   - Copy **Publishable Key** → `client/.env`
   - Copy **Secret Key** → `server/.env` (for webhooks)

3. **Configure Webhook**
   - Go to Webhooks section
   - Add endpoint: `http://localhost:3000/clerk` (development)
   - Add endpoint: `https://your-api-domain.com/clerk` (production)
   - Subscribe to events:
     - `user.created`
     - `user.updated`
     - `user.deleted`
   - Copy **Webhook Secret** → `server/.env`

### Step 2: Configure Environment Variables

#### Frontend (`client/.env`):
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
VITE_API_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
```

#### Backend (`server/.env`):
```env
# Clerk Authentication
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Database
MONGODB_URI=mongodb://localhost:27017

# Storage (Cloudinary)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
CURRENCY=USD

# Server
PORT=3000
```

### Step 3: Start Backend Server

**CRITICAL:** Backend must be running for authentication to work!

```bash
cd server
npm install
npm start
```

**Expected Output:**
```
Server is running on 3000
Database connected successfully!
```

### Step 4: Start Frontend

```bash
cd client
npm install
npm run dev
```

### Step 5: Test Authentication

1. Open `http://localhost:5173` (or your dev port)
2. Click "Create Account" button
3. Clerk modal should open
4. Sign up with email/password
5. Check backend logs - should see webhook received
6. Check database - user should be created

---

## 🔧 TROUBLESHOOTING

### Issue: "Missing Publishable Key" Error

**Solution:**
- Create `client/.env` file
- Add `VITE_CLERK_PUBLISHABLE_KEY=your_key`
- Restart dev server

### Issue: Login Button Does Nothing

**Possible Causes:**
1. Backend not running → **Start backend server**
2. Clerk key not set → **Set environment variable**
3. CORS issue → **Check backend CORS settings**

**Solution:**
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
cd client
npm run dev
```

### Issue: User Created But Can't Access Data

**Possible Causes:**
1. Webhook not configured → **Set up Clerk webhook**
2. Webhook secret wrong → **Check server/.env**
3. Database connection issue → **Check MongoDB connection**

**Solution:**
- Verify webhook endpoint in Clerk dashboard
- Check `server/.env` has correct `CLERK_WEBHOOK_SECRET`
- Check backend logs for webhook errors

### Issue: "User not found" After Login

**Possible Causes:**
1. Webhook didn't fire → **Check Clerk webhook logs**
2. Database connection issue → **Check MongoDB**
3. User creation failed → **Check backend logs**

**Solution:**
- Check Clerk dashboard → Webhooks → Recent events
- Check backend logs for errors
- Manually create user in database if needed

---

## 📋 AUTHENTICATION CHECKLIST

### Before Testing:
- [ ] Clerk account created
- [ ] Publishable key in `client/.env`
- [ ] Webhook secret in `server/.env`
- [ ] Webhook endpoint configured in Clerk
- [ ] Backend server running
- [ ] Frontend server running
- [ ] MongoDB running (or Atlas connected)

### Test Authentication:
- [ ] Click "Create Account" → Clerk modal opens
- [ ] Sign up with email → User created
- [ ] Check backend logs → Webhook received
- [ ] Check database → User record exists
- [ ] Login works → User can access site
- [ ] Protected routes work → User data loads

---

## 🔄 FOR MANUS DEPLOYMENT

### Option 1: Keep Clerk (Recommended)
- Set up Clerk production keys
- Configure production webhook URL
- Update environment variables

### Option 2: Use Manus Auth
- Migrate from Clerk to Manus auth system
- Update authentication middleware
- Update frontend to use Manus auth

**Recommendation:** Keep Clerk for now, migrate later if needed.

---

## 📝 CURRENT AUTHENTICATION STATUS

### ✅ What's Working:
- Clerk integration in frontend
- Clerk middleware in backend
- Webhook handler for user creation
- User data fetching
- Protected routes

### ⚠️ What Needs Setup:
- Clerk account and keys
- Environment variables
- Backend server running
- Webhook configuration

---

## 🚨 IMPORTANT NOTES

1. **Backend MUST be running** for authentication to work
2. **Webhook MUST be configured** for users to be created in database
3. **Environment variables MUST be set** for Clerk to work
4. **Database MUST be connected** for user storage

**Without these, users can authenticate with Clerk but won't be in your database!**

---

## 🎯 QUICK START

1. **Set up Clerk** (5 minutes)
   - Create account
   - Get keys
   - Configure webhook

2. **Set environment variables** (2 minutes)
   - `client/.env` → Clerk publishable key
   - `server/.env` → Clerk webhook secret + MongoDB

3. **Start servers** (1 minute)
   - Backend: `cd server && npm start`
   - Frontend: `cd client && npm run dev`

4. **Test login** (1 minute)
   - Click "Create Account"
   - Sign up
   - Verify user created

**Total Setup Time: ~10 minutes**

---

**Need help?** Check the troubleshooting section or verify all environment variables are set correctly.
