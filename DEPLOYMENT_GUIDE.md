# 🚀 Complete Deployment Guide: GitHub → Manus → Production

**Date:** January 10, 2026  
**Purpose:** Step-by-step guide to deploy So Fluent Platform to production via GitHub and Manus

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ GitHub account and repository access
- ✅ Manus account and project created
- ✅ All API keys and secrets ready (see `server/env.example`)
- ✅ Domain configured (sofluent.ai) - optional but recommended
- ✅ Local testing completed

---

## Part 1: GitHub Upload

### Step 1.1: Final Code Preparation

```bash
# 1. Ensure you're in the project root
cd C:\Users\MichaelSanders\SoFluent-Platform

# 2. Verify .gitignore is correct (should ignore .env files)
cat .gitignore

# 3. Check for any uncommitted sensitive data
git status

# 4. Remove any console.logs (optional but recommended)
# See PRODUCTION_READINESS.md for details
```

### Step 1.2: Commit and Push

```bash
# 1. Stage all changes
git add .

# 2. Commit with descriptive message
git commit -m "Production-ready: Complete platform with Google integration, AI tools, and Learn-to-Earn system"

# 3. Push to GitHub
git push origin main

# If repository doesn't exist yet:
# git remote add origin https://github.com/YOUR_USERNAME/SoFluent-Platform.git
# git push -u origin main
```

### Step 1.3: Verify GitHub Upload

- ✅ Go to GitHub repository
- ✅ Verify all files are present
- ✅ Check that `.env` files are NOT committed (in `.gitignore`)
- ✅ Verify `README.md` is readable

---

## Part 2: Manus Project Setup

### Step 2.1: Create Manus Project

1. **Login to Manus Dashboard**
   - Go to https://manus.ai (or your Manus instance)
   - Login with your credentials

2. **Create New Project**
   - Click "New Project" or "+"
   - Name: `SoFluent-Platform`
   - Template: `Node.js + React` or `web-db-user`
   - Connect GitHub repository: Select your repo
   - Click "Create Project"

### Step 2.2: Configure Project Settings

**Backend Configuration:**
- **Root Directory:** `server/`
- **Build Command:** `npm install && npm start`
- **Start Command:** `npm start`
- **Port:** `3000`
- **Health Check Path:** `/health`

**Frontend Configuration:**
- **Root Directory:** `client/`
- **Build Command:** `npm install && npm run build`
- **Output Directory:** `dist/`
- **Framework:** `Vite`

---

## Part 3: Configure Secrets in Manus

### Step 3.1: Access Secret Manager

1. In Manus Dashboard, go to your project
2. Navigate to **Settings → Secrets** or **Environment Variables**
3. Click **Add Secret** for each required variable

### Step 3.2: Required Secrets

Add these secrets one by one:

#### **Authentication (Clerk)**
```
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
```

#### **Payment Processing (Stripe)**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### **Database**
```
MONGODB_URI=mongodb+srv://... (or MySQL connection string)
# OR if using Manus MySQL:
DB_HOST=manus_db_host
DB_PORT=3306
DB_USER=manus_user
DB_PASSWORD=manus_password
DB_NAME=sofluent
```

#### **Google Workspace Integration**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://sofluent.ai/api/google/callback
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GOOGLE_SUBJECT_EMAIL=admin@sofluent.ai
```

#### **AI Integration (OpenRouter)**
```
OPENROUTER_API_KEY=your_openrouter_api_key
```

#### **Storage (if not using Manus S3)**
```
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

#### **Optional but Recommended**
```
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
EMAIL_SERVICE_API_KEY=your_email_service_api_key
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@sofluent.ai
```

#### **Application Configuration**
```
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://sofluent.ai,https://www.sofluent.ai
CURRENCY=BRL
TIMEZONE=America/Sao_Paulo
```

### Step 3.3: Frontend Environment Variables

In Manus, configure frontend environment variables:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_API_URL=https://api.sofluent.ai
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
```

---

## Part 4: Database Setup

### Step 4.1: Create Database

1. In Manus Dashboard, go to **Database** section
2. Click **Create Database**
3. Choose **MySQL** or **TiDB**
4. Name: `sofluent`
5. Note the connection details

### Step 4.2: Run Migrations

**Option A: Via Manus Console**
```bash
# Access Manus console/SSH
cd server
npm run migrate
```

**Option B: Via Migration Script**
- Manus may auto-run migrations on first deployment
- Check deployment logs for migration status

### Step 4.3: Verify Database Connection

```bash
# Test connection (in Manus console)
node -e "import('./server/configs/database-adapter.js').then(() => console.log('Connected!'))"
```

---

## Part 5: Storage Setup

### Step 5.1: Create S3 Bucket (if using Manus S3)

1. In Manus Dashboard, go to **Storage** section
2. Click **Create Bucket**
3. Name: `sofluent-assets`
4. Region: Choose closest to your users
5. Configure CORS:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://sofluent.ai", "https://www.sofluent.ai"],
       "ExposeHeaders": []
     }
   ]
   ```

### Step 5.2: Update Storage Adapter

If not using Manus auto-configuration, ensure `server/configs/storage-adapter.js` uses S3:
```javascript
// Should detect Manus environment and use S3 automatically
```

---

## Part 6: Deploy Backend

### Step 6.1: Configure Backend Deployment

1. In Manus Dashboard, go to **Backend** or **API** section
2. Configure:
   - **Source:** GitHub repository (auto-connected)
   - **Branch:** `main`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Port:** `3000`
   - **Health Check:** `/health`

### Step 6.2: Deploy

1. Click **Deploy** or **Redeploy**
2. Monitor deployment logs
3. Wait for "Deployment successful" message
4. Note the backend URL (e.g., `https://api.sofluent.ai`)

### Step 6.3: Verify Backend

```bash
# Test health endpoint
curl https://api.sofluent.ai/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":123,"environment":"production"}
```

---

## Part 7: Deploy Frontend

### Step 7.1: Configure Frontend Deployment

1. In Manus Dashboard, go to **Frontend** or **Static Site** section
2. Configure:
   - **Source:** GitHub repository
   - **Branch:** `main`
   - **Build Command:** `cd client && npm install && npm run build`
   - **Output Directory:** `client/dist`
   - **Framework:** `Vite`

### Step 7.2: Configure Environment Variables

Ensure frontend has access to:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_URL` (should be your backend URL)
- `VITE_STRIPE_PUBLISHABLE_KEY`

### Step 7.3: Deploy

1. Click **Deploy** or **Redeploy**
2. Monitor build logs
3. Wait for "Build successful" message
4. Note the frontend URL (e.g., `https://sofluent.ai`)

### Step 7.4: Configure Custom Domain (Optional)

1. In Manus Dashboard, go to **Domains**
2. Add custom domain: `sofluent.ai`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic via Let's Encrypt)

---

## Part 8: Post-Deployment Verification

### Step 8.1: Health Checks

```bash
# Basic health
curl https://api.sofluent.ai/health

# Detailed health
curl https://api.sofluent.ai/health/detailed

# Readiness
curl https://api.sofluent.ai/health/ready

# Liveness
curl https://api.sofluent.ai/health/live
```

### Step 8.2: Frontend Verification

1. Visit `https://sofluent.ai`
2. Check browser console for errors
3. Verify:
   - ✅ Page loads
   - ✅ No console errors
   - ✅ Navigation works
   - ✅ Login button visible
   - ✅ API calls succeed

### Step 8.3: Feature Testing

Test critical features:
- [ ] User signup/login
- [ ] Course browsing
- [ ] Course enrollment
- [ ] Payment processing
- [ ] Admin dashboard access
- [ ] Google integration (if configured)
- [ ] AI features (if configured)

### Step 8.4: Monitoring Setup

1. **Sentry Error Tracking**
   - Verify errors are being logged
   - Set up alerts for critical errors

2. **Health Check Monitoring**
   - Configure Manus to monitor `/health` endpoint
   - Set up alerts for downtime

3. **Performance Monitoring**
   - Check response times
   - Monitor API usage
   - Review error rates

---

## Part 9: Webhook Configuration

### Step 9.1: Clerk Webhooks

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://api.sofluent.ai/clerk`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy webhook secret → Add to Manus secrets as `CLERK_WEBHOOK_SECRET`

### Step 9.2: Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://api.sofluent.ai/api/webhooks/stripe`
3. Subscribe to events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
4. Copy webhook secret → Add to Manus secrets as `STRIPE_WEBHOOK_SECRET`

---

## Part 10: Admin User Creation

### Step 10.1: Create Admin via Clerk

1. Sign up a user through the frontend
2. Go to Clerk Dashboard → Users
3. Find the user
4. Edit → Public Metadata
5. Add: `{"role": "master_admin"}`

### Step 10.2: Verify Admin Access

1. Log in as the admin user
2. Navigate to `/admin/dashboard`
3. Verify admin features are accessible

---

## 🚨 Troubleshooting

### Backend Won't Start
- Check deployment logs in Manus
- Verify all required secrets are set
- Check database connection
- Verify PORT is set correctly

### Frontend Build Fails
- Check build logs
- Verify all dependencies are in `package.json`
- Check for syntax errors
- Verify environment variables are set

### Database Connection Issues
- Verify `MONGODB_URI` or MySQL credentials
- Check database is accessible from Manus
- Verify network/firewall settings

### API Calls Failing
- Check CORS configuration
- Verify `ALLOWED_ORIGINS` includes frontend URL
- Check API URL in frontend environment variables
- Verify backend is running

### Webhooks Not Working
- Verify webhook URLs are correct
- Check webhook secrets match
- Review webhook logs in Clerk/Stripe dashboards
- Check backend logs for webhook errors

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Backend health checks return `200 OK`
- ✅ Frontend loads without errors
- ✅ Users can sign up and log in
- ✅ Payments process successfully
- ✅ Admin dashboard is accessible
- ✅ No critical errors in Sentry
- ✅ All webhooks are receiving events

---

## 📚 Additional Resources

- **Production Readiness:** See `PRODUCTION_READINESS.md`
- **Security Audit:** See `SECURITY_AUDIT.md`
- **Setup Guide:** See `SETUP_COMPLETE_GUIDE.md`
- **Manus Documentation:** See `MANUS_DEPLOYMENT.md`

---

**Last Updated:** January 10, 2026  
**Status:** Ready for deployment (after console.log cleanup)
