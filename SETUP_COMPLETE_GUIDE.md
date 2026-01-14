# Complete Setup Guide - Production Ready

## 🚀 Quick Start (5 Minutes)

### Step 1: Start Backend Server
```bash
cd server
npm install
npm start
```
**Keep this terminal open!**

### Step 2: Start Frontend
```bash
cd client
npm install
npm run dev
```

### Step 3: Configure Authentication (Required for Login)

1. **Create Clerk Account** (if not done)
   - Go to https://clerk.com
   - Sign up (free tier available)
   - Create new application

2. **Get Clerk Keys**
   - Copy **Publishable Key** (starts with `pk_`)
   - Copy **Secret Key** (starts with `sk_`)
   - Copy **Webhook Secret** (starts with `whsec_`)

3. **Set Environment Variables**

   **Frontend (`client/.env`):**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   VITE_BACKEND_URL=http://localhost:3000
   ```

   **Backend (`server/.env`):**
   ```env
   CLERK_SECRET_KEY=sk_test_your_key_here
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   MONGODB_URI=mongodb://localhost:27017/sofluent
   ```

4. **Configure Clerk Webhook**
   - In Clerk Dashboard → Webhooks
   - Add endpoint: `http://localhost:3000/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy webhook secret to `server/.env`

### Step 4: Create Admin User

**Option A: Via Script (Recommended)**
```bash
# 1. Sign up/login via Clerk in the app
# 2. Get your Clerk User ID from Clerk Dashboard
# 3. Run:
node scripts/create-admin-user.js <your-clerk-user-id> <your-email>
```

**Option B: Via Clerk Metadata**
1. Go to Clerk Dashboard → Users
2. Click on your user
3. Go to "Metadata" tab
4. Add to Public Metadata:
   ```json
   {
     "role": "master_admin"
   }
   ```
5. User will be created/updated on next login

### Step 5: Access Admin Dashboard
- Login with your admin account
- Navigate to: `http://localhost:5173/admin/dashboard`

---

## 🔧 Fixing Common Issues

### Issue 1: Course Page Stuck Loading
**Fix:** Ensure backend is running and `/api/course/:id` endpoint works
- Check backend logs for errors
- Verify MongoDB connection
- Check course data exists in database

### Issue 2: Navigation Shows ".nav"
**Fix:** Translation keys should now work. If not:
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for i18n errors
- Verify `client/src/locales/en/common.json` exists

### Issue 3: Login Button Not Working
**Fix:** 
- Verify Clerk keys are set in `.env` files
- Check browser console for Clerk errors
- Ensure backend webhook is configured
- Restart both frontend and backend after setting env vars

### Issue 4: Can't Access Admin
**Fix:**
- Run admin creation script (see Step 4)
- Or set role in Clerk metadata
- Verify role in database: `db.users.findOne({email: "your@email.com"})`

---

## 🔒 Security Checklist

- ✅ Authentication via Clerk
- ✅ Protected routes with role-based access
- ✅ API endpoints require authentication
- ✅ CORS configured for production domains
- ✅ Environment variables not committed
- ✅ Input validation on API endpoints
- ✅ SQL injection prevention (Mongoose)
- ✅ XSS prevention (React escapes by default)
- ⚠️ CSRF protection (consider adding)
- ⚠️ Rate limiting (consider adding)

---

## 📋 Production Deployment Checklist

### Before Deploying:

1. **Environment Variables**
   - [ ] All secrets in production environment
   - [ ] No hardcoded keys in code
   - [ ] CORS set to production domains only

2. **Database**
   - [ ] Production database configured
   - [ ] Migrations run
   - [ ] Backup strategy in place

3. **Authentication**
   - [ ] Clerk production keys configured
   - [ ] Webhook URL set to production
   - [ ] Admin users created

4. **Security**
   - [ ] HTTPS enabled
   - [ ] Security headers configured
   - [ ] Error messages don't leak sensitive info

5. **Performance**
   - [ ] Images optimized
   - [ ] Code minified
   - [ ] CDN configured (if applicable)

6. **Monitoring**
   - [ ] Error tracking (Sentry) configured
   - [ ] Analytics configured
   - [ ] Logging configured

---

## 🎨 Professional Polish Checklist

- [ ] Consistent spacing throughout
- [ ] Professional typography
- [ ] Smooth animations
- [ ] Loading states on all async operations
- [ ] Error handling everywhere
- [ ] Empty states for lists
- [ ] Professional imagery
- [ ] Mobile responsive
- [ ] Fast page loads
- [ ] Accessible (WCAG compliant)

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs
3. Verify environment variables
4. Check database connection
5. Review this guide

For production deployment, see `DEPLOYMENT_READINESS.md`
