# 🚀 Manus Deployment Prompt - So Fluent Platform

**Copy this entire prompt into Manus to deploy and fix any issues:**

---

## 📋 Deployment Request

I need you to deploy the So Fluent Platform to Manus and ensure everything works correctly. The platform is a full-stack application with React frontend and Node.js backend.

### Project Structure:
```
sofluent-platform/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
├── scripts/         # Deployment scripts
└── docs/            # Documentation
```

---

## 🎯 Critical Requirements

### 1. Database Configuration (MySQL/TiDB)

**The platform uses a database adapter that auto-detects MySQL vs MongoDB:**

- **For Manus:** Set `DB_TYPE=mysql` in environment variables
- **The adapter will automatically:**
  - Connect to MySQL/TiDB
  - Run migrations (`002_mysql_schema.js` and `003_mysql_indexes.js`)
  - Create all 11 tables automatically

**Environment Variables Needed:**
```
DB_TYPE=mysql
DB_HOST=[Manus MySQL host]
DB_PORT=3306
DB_USER=[Manus MySQL user]
DB_PASSWORD=[Manus MySQL password]
DB_NAME=sofluent
```

**If MySQL connection fails:**
- Check that MySQL database exists
- Verify credentials are correct
- Ensure migrations run on first deployment
- The adapter falls back gracefully, but MySQL is required for production

---

### 2. Storage Configuration (S3)

**The platform uses a storage adapter that auto-detects S3 vs Cloudinary:**

- **For Manus:** Set `STORAGE_TYPE=s3` in environment variables
- **The adapter will automatically:**
  - Connect to S3
  - Use AWS SDK for uploads/downloads
  - Generate signed URLs for secure access

**Environment Variables Needed:**
```
STORAGE_TYPE=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=[Manus S3 access key]
AWS_SECRET_ACCESS_KEY=[Manus S3 secret key]
S3_BUCKET_NAME=sofluent-media
```

**If S3 connection fails:**
- Create S3 bucket: `sofluent-media`
- Configure CORS for the bucket
- Ensure credentials have upload/delete permissions
- The adapter falls back gracefully, but S3 is required for production

---

### 3. Backend Deployment

**Backend Location:** `server/` directory

**Build Command:** `npm install && npm start`

**Start Command:** `npm start`

**Port:** `3000`

**Health Check:** `/health`

**Expected Behavior:**
1. Server starts
2. Detects `DB_TYPE=mysql` → Connects to MySQL
3. Detects `STORAGE_TYPE=s3` → Connects to S3
4. Runs migrations automatically
5. Starts serving API requests

**If backend fails to start:**
- Check environment variables are set correctly
- Verify MySQL connection works
- Verify S3 connection works
- Check server logs for specific errors
- The server should start even without all secrets (with warnings)

---

### 4. Frontend Deployment

**Frontend Location:** `client/` directory

**Build Command:** `cd client && npm install && npm run build`

**Output Directory:** `client/dist/`

**Framework:** Vite

**Expected Behavior:**
1. Builds successfully
2. Creates `dist/` folder
3. All assets optimized
4. Ready for static hosting

**If frontend build fails:**
- Check for syntax errors in React components
- Verify all dependencies are installed
- Check Vite configuration
- Review build logs for specific errors

---

## 🔧 Common Issues & Fixes

### Issue 1: Database Adapter Not Connecting

**Symptoms:**
- Server starts but database operations fail
- Health check shows database status as "error"

**Fix:**
- Verify `DB_TYPE=mysql` is set
- Check MySQL credentials are correct
- Ensure MySQL database exists
- Check that migrations can run (permissions)

**Code Location:** `server/configs/database-adapter-manus.js`

---

### Issue 2: Storage Adapter Not Connecting

**Symptoms:**
- File uploads fail
- Health check shows storage status as "error"

**Fix:**
- Verify `STORAGE_TYPE=s3` is set
- Check S3 credentials are correct
- Ensure S3 bucket exists
- Verify bucket CORS configuration
- Check IAM permissions for S3 access

**Code Location:** `server/configs/storage-adapter-manus.js`

---

### Issue 3: Migrations Not Running

**Symptoms:**
- Tables don't exist
- Database queries fail with "table doesn't exist"

**Fix:**
- Check `RUN_MIGRATIONS` is not set to `false`
- Verify migrations directory exists: `server/migrations/`
- Check migration files: `002_mysql_schema.js`, `003_mysql_indexes.js`
- Run migrations manually if needed: `npm run migrate`
- Check MySQL user has CREATE TABLE permissions

**Code Location:** `server/migrations/`

---

### Issue 4: Dependencies Missing

**Symptoms:**
- `Cannot find module 'mysql2'`
- `Cannot find module '@aws-sdk/client-s3'`

**Fix:**
- Run `npm install` in `server/` directory
- Verify `package.json` includes:
  - `mysql2@^3.11.5`
  - `@aws-sdk/client-s3@^3.700.0`
  - `@aws-sdk/s3-request-presigner@^3.700.0`
- Check `node_modules/` exists

**Code Location:** `server/package.json`

---

### Issue 5: Environment Variables Not Set

**Symptoms:**
- Server starts but features don't work
- Authentication fails
- Payments fail

**Fix:**
- Set all required secrets in Manus Secret Manager
- Verify secrets are accessible: `process.env.SECRET_NAME`
- Check secret names match exactly (case-sensitive)
- Review `server/env.example` for all required variables

**Required Secrets:**
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENROUTER_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- Plus MySQL and S3 credentials

---

### Issue 6: CORS Errors

**Symptoms:**
- Frontend can't call backend API
- Browser console shows CORS errors

**Fix:**
- Verify `ALLOWED_ORIGINS` includes frontend URL
- Check backend CORS configuration in `server/server.js`
- Ensure frontend URL matches exactly
- Add both `https://sofluent.ai` and `https://www.sofluent.ai` if using custom domain

**Code Location:** `server/server.js` (CORS configuration)

---

### Issue 7: Health Check Fails

**Symptoms:**
- `/health` endpoint returns error
- `/health/detailed` shows failures

**Fix:**
- Check database connection
- Check storage connection
- Verify all adapters initialized correctly
- Review health check code: `server/routes/health.js`
- Check server logs for specific errors

**Code Location:** `server/routes/health.js`

---

## 🚀 Deployment Checklist

### Pre-Deployment:
- [ ] GitHub repository connected
- [ ] All secrets configured in Manus
- [ ] MySQL database created
- [ ] S3 bucket created
- [ ] CORS configured for S3 bucket

### Backend Deployment:
- [ ] Backend builds successfully (`npm install`)
- [ ] Server starts without errors
- [ ] MySQL connection successful
- [ ] S3 connection successful
- [ ] Migrations run automatically
- [ ] Health check passes: `GET /health`
- [ ] API endpoints respond: `GET /api/course`

### Frontend Deployment:
- [ ] Frontend builds successfully (`npm run build`)
- [ ] `dist/` folder created
- [ ] No build errors
- [ ] Static files deploy correctly
- [ ] Frontend loads in browser
- [ ] API calls work (no CORS errors)

### Post-Deployment:
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Course enrollment works
- [ ] Payments process correctly
- [ ] File uploads work
- [ ] Admin dashboard accessible

---

## 🔍 Debugging Commands

**Check backend logs:**
```bash
# In Manus console or logs
tail -f server.log
# Look for:
# - "✅ MySQL/TiDB connected"
# - "✅ S3 storage connected"
# - "✅ All migrations completed"
```

**Test database connection:**
```bash
# In Manus console
cd server
node -e "import('./configs/database-adapter-manus.js').then(async (db) => { await db.default.connect(); console.log('Connected!'); })"
```

**Test storage connection:**
```bash
# In Manus console
cd server
node -e "import('./configs/storage-adapter-manus.js').then(async (storage) => { await storage.default.connect(); console.log('Connected!'); })"
```

**Check environment variables:**
```bash
# In Manus console
env | grep DB_
env | grep AWS_
env | grep STORAGE_
```

---

## 📝 Code Locations for Fixes

**Database Adapter:**
- `server/configs/database-adapter-manus.js` - MySQL implementation
- `server/configs/database-adapter.js` - Exports Manus version

**Storage Adapter:**
- `server/configs/storage-adapter-manus.js` - S3 implementation
- `server/configs/storage-adapter.js` - Exports Manus version

**Migrations:**
- `server/migrations/002_mysql_schema.js` - Creates tables
- `server/migrations/003_mysql_indexes.js` - Creates indexes
- `server/migrations/migrationRunner.js` - Runs migrations

**Server Configuration:**
- `server/server.js` - Main server file
- `server/utils/envValidator.js` - Environment validation
- `server/configs/manusConfig.js` - Manus configuration helpers

**Health Checks:**
- `server/routes/health.js` - Health check endpoints

---

## 🎯 Success Criteria

**Deployment is successful when:**

1. ✅ Backend starts without errors
2. ✅ Health check returns `200 OK`: `GET /health`
3. ✅ Database connection works: Health check shows `"database": {"status": "ok"}`
4. ✅ Storage connection works: Health check shows `"storage": {"status": "ok"}`
5. ✅ Migrations completed: Logs show "✅ All migrations completed"
6. ✅ Frontend builds successfully: `dist/` folder created
7. ✅ Frontend loads: No console errors
8. ✅ API calls work: Frontend can call backend
9. ✅ Authentication works: Users can log in
10. ✅ Core features work: Courses, payments, etc.

---

## 🚨 If Something Fails

**Step 1: Check Logs**
- Review backend logs for errors
- Review frontend build logs
- Check Manus deployment logs

**Step 2: Verify Configuration**
- Check all environment variables are set
- Verify MySQL credentials
- Verify S3 credentials
- Check CORS configuration

**Step 3: Test Components**
- Test database connection separately
- Test storage connection separately
- Test API endpoints individually
- Test frontend build separately

**Step 4: Fix Issues**
- Update adapters if needed
- Fix migration scripts if needed
- Update environment variables
- Fix code issues

**Step 5: Redeploy**
- Commit fixes
- Push to GitHub
- Redeploy in Manus
- Verify fixes

---

## 📚 Reference Documentation

**In the repository:**
- `MANUS_100_PERCENT_READY.md` - Complete readiness guide
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment
- `server/env.example` - All environment variables
- `server/migrations/` - Database migrations

---

## 🎯 Your Task

1. **Deploy the backend** with MySQL and S3 configuration
2. **Deploy the frontend** with production build
3. **Verify everything works** using the success criteria
4. **Fix any issues** that arise using the fixes above
5. **Confirm deployment** is successful

**The code is ready - your job is to configure Manus correctly and fix any deployment-specific issues.**

---

**Good luck! The platform is 100% ready - just needs proper Manus configuration.** 🚀
