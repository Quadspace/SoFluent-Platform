# So Fluent Platform - Quick Start Guide

**Get your website running in 5 minutes!**

---

## 🚀 STEP-BY-STEP SETUP

### Step 1: Install Dependencies (2 minutes)

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### Step 2: Set Up Environment Variables (2 minutes)

**Create `server/.env`:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
CLERK_WEBHOOK_SECRET=whsec_placeholder
CLOUDINARY_NAME=placeholder
CLOUDINARY_API_KEY=placeholder
CLOUDINARY_SECRET_KEY=placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
CURRENCY=USD
```

**Create `client/.env`:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
VITE_API_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
```

**Note:** Replace `placeholder` values with real keys from Clerk, MongoDB, Cloudinary, Stripe.

### Step 3: Start Backend Server (1 minute)

```bash
cd server
npm start
```

**Keep this terminal open!** Backend must be running.

### Step 4: Start Frontend (1 minute)

**Open a NEW terminal:**
```bash
cd client
npm run dev
```

### Step 5: Open Website

Open browser: `http://localhost:5173` (or port shown in terminal)

---

## 🔐 AUTHENTICATION SETUP

### Why Login Doesn't Work Yet:

**The backend needs Clerk keys to work!**

### Quick Setup:

1. **Create Clerk Account** (free)
   - Go to [clerk.com](https://clerk.com)
   - Sign up
   - Create application

2. **Get Keys:**
   - Publishable Key → `client/.env` → `VITE_CLERK_PUBLISHABLE_KEY`
   - Webhook Secret → `server/.env` → `CLERK_WEBHOOK_SECRET`

3. **Configure Webhook:**
   - In Clerk dashboard → Webhooks
   - Add endpoint: `http://localhost:3000/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`

4. **Restart Servers:**
   - Stop both servers (Ctrl+C)
   - Start backend: `cd server && npm start`
   - Start frontend: `cd client && npm run dev`

5. **Test Login:**
   - Click "Create Account"
   - Sign up
   - Should work now!

---

## ⚠️ IMPORTANT NOTES

### Backend Must Be Running!

**Authentication will NOT work without backend:**
- Login/signup buttons won't work
- User data won't load
- Protected pages won't work

**Always start backend first:**
```bash
# Terminal 1
cd server
npm start

# Terminal 2 (new terminal)
cd client
npm run dev
```

### Database Required

**For full functionality, you need:**
- MongoDB running locally, OR
- MongoDB Atlas account

**Without database:**
- Website loads ✅
- Login won't create users ❌
- API calls will fail ❌

---

## 🎯 CURRENT STATUS

### What Works Without Setup:
- ✅ Website loads
- ✅ Pages display
- ✅ Navigation works
- ✅ Multilingual support
- ✅ Branding

### What Needs Setup:
- ⚠️ Authentication (needs Clerk keys)
- ⚠️ User data (needs backend + database)
- ⚠️ Courses (needs backend + database)
- ⚠️ Payments (needs Stripe keys)

---

## 📋 MINIMUM SETUP FOR TESTING

### Option 1: Full Setup (Recommended)
- Clerk account + keys
- MongoDB running
- Backend + Frontend running
- **Result:** Everything works

### Option 2: Frontend Only (Limited)
- No Clerk keys
- No backend
- **Result:** Website loads, but login doesn't work

### Option 3: Quick Demo (No Auth)
- No Clerk keys
- Backend running (optional)
- **Result:** Can view pages, but can't login

---

## 🐛 TROUBLESHOOTING

### "Cannot connect to database"
- **Solution:** Start MongoDB or use Atlas

### "Missing Publishable Key"
- **Solution:** Add `VITE_CLERK_PUBLISHABLE_KEY` to `client/.env`

### Login button does nothing
- **Solution:** Backend not running OR Clerk key not set

### Website loads but blank
- **Solution:** Check browser console (F12) for errors

---

## 📚 DETAILED GUIDES

- **Authentication:** See `AUTHENTICATION_SETUP.md`
- **Backend:** See `BACKEND_SETUP.md`
- **Deployment:** See `MANUS_DEPLOYMENT.md`

---

## ✅ CHECKLIST

Before testing login:
- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`cd client && npm install`)
- [ ] Backend server running (`cd server && npm start`)
- [ ] Frontend server running (`cd client && npm run dev`)
- [ ] Clerk account created
- [ ] Clerk keys in `.env` files
- [ ] MongoDB running or Atlas connected
- [ ] Webhook configured in Clerk

---

**Ready to test!** Follow the steps above and you'll have a working website with authentication. 🚀
