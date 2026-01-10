# Backend Setup & Testing Guide

**Critical:** The backend must be running for authentication and all API features to work.

---

## 🚀 QUICK START

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Set Up Environment Variables

Create `server/.env` file:
```env
# Server
PORT=3000
NODE_ENV=development

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# Clerk Authentication
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Cloudinary (Media Storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
CURRENCY=USD
```

### Step 3: Start Backend Server

```bash
npm start
```

**Expected Output:**
```
Server is running on 3000
Database connected successfully!
```

---

## ✅ VERIFY BACKEND IS WORKING

### Test 1: API Health Check
Open browser: `http://localhost:3000`

**Expected:** "So Fluent API is working fine!"

### Test 2: Check Database Connection
Look for in console: "Database connected successfully!"

### Test 3: Test API Endpoint
```bash
curl http://localhost:3000/api/course/all
```

**Expected:** JSON response with courses (or empty array)

---

## 🔐 AUTHENTICATION FLOW

### How It Works:

1. **User Signs Up via Clerk** (Frontend)
   - Clerk handles authentication
   - User gets JWT token

2. **Clerk Webhook** (Backend)
   - Clerk sends webhook to `/clerk` endpoint
   - Backend creates user in database
   - User record stored

3. **User Makes API Calls** (Frontend → Backend)
   - Frontend sends token in header: `Authorization: Bearer <token>`
   - Backend validates token via Clerk middleware
   - Backend processes request

### Required for Login to Work:

1. ✅ Backend server running
2. ✅ MongoDB connected
3. ✅ Clerk webhook configured
4. ✅ Environment variables set

---

## 🐛 COMMON ISSUES

### Issue: "Cannot connect to database"

**Solution:**
- Check MongoDB is running: `mongosh` or check MongoDB service
- Verify `MONGODB_URI` in `.env` is correct
- For Atlas: Check network access (whitelist IP)

### Issue: "Clerk webhook verification failed"

**Solution:**
- Verify `CLERK_WEBHOOK_SECRET` in `.env` matches Clerk dashboard
- Check webhook URL is correct in Clerk
- Ensure webhook is enabled

### Issue: Backend won't start

**Possible Causes:**
- Missing dependencies → Run `npm install`
- Port already in use → Change PORT in `.env`
- Missing environment variables → Check `.env` file

**Solution:**
```bash
# Check if port is in use
netstat -ano | findstr :3000

# Install dependencies
npm install

# Check .env file exists
ls server/.env
```

---

## 📋 BACKEND API ENDPOINTS

### Public Endpoints:
- `GET /` - Health check
- `GET /api/course/all` - Get all published courses

### Protected Endpoints (Require Authentication):
- `GET /api/user/data` - Get user data
- `GET /api/user/enrolled-courses` - Get user's enrolled courses
- `POST /api/user/purchase` - Purchase a course
- `POST /api/educator/update-role` - Become educator
- `GET /api/educator/courses` - Get educator's courses

### Webhooks:
- `POST /clerk` - Clerk user webhooks
- `POST /stripe` - Stripe payment webhooks

---

## 🔧 TESTING AUTHENTICATION

### Manual Test:

1. **Start Backend:**
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm run dev
   ```

3. **Test Login:**
   - Open `http://localhost:5173`
   - Click "Create Account"
   - Sign up with email
   - Check backend console for webhook

4. **Verify User Created:**
   - Check MongoDB: `db.users.find()`
   - Should see new user record

---

## 📝 ENVIRONMENT VARIABLES REFERENCE

### Required for Development:
- `MONGODB_URI` - Database connection
- `CLERK_WEBHOOK_SECRET` - Clerk webhook verification
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY` - Media storage

### Optional (for full functionality):
- `STRIPE_SECRET_KEY` - Payment processing
- `STRIPE_WEBHOOK_SECRET` - Payment webhooks
- `PORT` - Server port (default: 3000)

---

## 🎯 NEXT STEPS

1. **Set up Clerk** (see `AUTHENTICATION_SETUP.md`)
2. **Configure environment variables**
3. **Start backend server**
4. **Test authentication**
5. **Deploy to Manus** (when ready)

---

**Backend is ready!** Once environment variables are set and server is running, authentication will work. 🚀
