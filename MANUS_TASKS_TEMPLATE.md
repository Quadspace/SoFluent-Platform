# 📋 Manus Tasks Template

Copy and paste these tasks into Manus Dashboard for efficient deployment.

---

## Task 1: Database Migration (MongoDB → MySQL/TiDB)

**Priority:** High  
**Estimated Time:** 2-4 hours  
**Estimated Cost:** $50-100

**Description:**
Migrate database from MongoDB to MySQL/TiDB for Manus compatibility.

**Steps:**
1. Review `server/configs/database-adapter.js`
2. Install MySQL/TiDB driver: `npm install mysql2` or TiDB client
3. Replace Mongoose with MySQL driver
4. Convert MongoDB queries to SQL:
   - `find()` → `SELECT`
   - `create()` → `INSERT`
   - `updateOne()` → `UPDATE`
   - `deleteOne()` → `DELETE`
5. Update connection logic to use `${MYSQL_URI}` secret
6. Create database schema (run migrations)
7. Test all CRUD operations
8. Verify indexes are created

**Files to Update:**
- `server/configs/database-adapter.js`
- `server/models/*.js` (if using Mongoose models)

**Testing:**
```bash
# Test connection
node -e "require('./server/configs/database-adapter.js').connect()"

# Test queries
# Run API endpoints and verify data operations
```

**Acceptance Criteria:**
- [ ] Database connects successfully
- [ ] All CRUD operations work
- [ ] Migrations run successfully
- [ ] No data loss
- [ ] Performance acceptable (< 100ms queries)

---

## Task 2: Storage Migration (Cloudinary → AWS S3)

**Priority:** High  
**Estimated Time:** 1-2 hours  
**Estimated Cost:** $30-50

**Description:**
Migrate file storage from Cloudinary to AWS S3 for Manus compatibility.

**Steps:**
1. Review `server/configs/storage-adapter.js`
2. Install AWS SDK: `npm install @aws-sdk/client-s3`
3. Replace Cloudinary SDK with S3 SDK
4. Update `upload()` method:
   ```javascript
   // Old: cloudinary.uploader.upload()
   // New: s3Client.putObject()
   ```
5. Update `getUrl()` method:
   ```javascript
   // Generate S3 presigned URLs or public URLs
   ```
6. Configure S3 bucket:
   - Create bucket: `sofluent-assets`
   - Set CORS policy
   - Set public read permissions (if needed)
7. Update secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET_NAME`
   - `AWS_S3_REGION`
8. Test file uploads/downloads

**Files to Update:**
- `server/configs/storage-adapter.js`

**S3 Bucket Configuration:**
```json
{
  "CORSConfiguration": {
    "CORSRules": [
      {
        "AllowedOrigins": ["https://sofluent.ai"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedHeaders": ["*"],
        "MaxAgeSeconds": 3000
      }
    ]
  }
}
```

**Testing:**
```bash
# Test upload
curl -X POST https://api.sofluent.ai/api/upload \
  -F "file=@test.jpg"

# Verify file in S3 bucket
```

**Acceptance Criteria:**
- [ ] Files upload to S3 successfully
- [ ] Files are accessible via URLs
- [ ] CORS configured correctly
- [ ] No broken image links
- [ ] Performance acceptable

---

## Task 3: Configure Manus Secrets

**Priority:** High  
**Estimated Time:** 30 minutes  
**Estimated Cost:** $0

**Description:**
Set up all environment variables in Manus Secret Manager.

**Reference:** `MANUS_SECRETS_GUIDE.md`

**Required Secrets:**

### Database
- `MYSQL_URI` - MySQL/TiDB connection string

### Storage
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET_NAME` - S3 bucket name (e.g., `sofluent-assets`)
- `AWS_S3_REGION` - AWS region (e.g., `us-east-1`)

### Authentication
- `CLERK_SECRET_KEY` - Clerk secret key (or use Manus Auth)
- `JWT_SECRET` - JWT signing secret

### Payments
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `PIX_KEY` - Pix payment key
- `PIX_SECRET` - Pix secret

### AI Services
- `OPENROUTER_API_KEY` - OpenRouter API key

### Email
- `EMAIL_SERVICE` - `sendgrid` or `aws-ses`
- `SENDGRID_API_KEY` - SendGrid API key (if using SendGrid)
- `AWS_SES_REGION` - AWS SES region (if using SES)
- `AWS_SES_ACCESS_KEY` - AWS SES access key
- `AWS_SES_SECRET_KEY` - AWS SES secret key

### Frontend
- `VITE_BACKEND_URL` - Backend API URL
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

**Steps:**
1. Go to Manus Dashboard → Project → Secrets
2. Add each secret from the list above
3. Verify secret names match code references
4. Test secret access in Manus console

**Acceptance Criteria:**
- [ ] All secrets added
- [ ] Secret names match code
- [ ] Secrets accessible in code
- [ ] No hardcoded secrets

---

## Task 4: Run Database Migrations

**Priority:** High  
**Estimated Time:** 30 minutes  
**Estimated Cost:** $0

**Description:**
Run database migrations to set up schema.

**Steps:**
1. Ensure database is connected
2. Run migration script:
   ```bash
   npm run migrate
   ```
3. Verify migrations completed:
   - Check migration log
   - Verify tables created
   - Verify indexes created
4. Test rollback (if needed):
   ```bash
   npm run migrate:rollback
   ```

**Files:**
- `server/migrations/migrationRunner.js`
- `server/migrations/001_initial_schema.js`

**Acceptance Criteria:**
- [ ] Migrations run successfully
- [ ] All tables created
- [ ] All indexes created
- [ ] No errors in migration log

---

## Task 5: Deploy Backend API

**Priority:** High  
**Estimated Time:** 1 hour  
**Estimated Cost:** $0 (hosting)

**Description:**
Deploy Express.js backend to Manus.

**Steps:**
1. Manus auto-detects `server/` directory
2. Configure build command: `npm install && npm start`
3. Set environment variables (from secrets)
4. Configure port: `process.env.PORT || 3000`
5. Deploy to production
6. Verify health check: `GET /health`
7. Verify Swagger docs: `GET /api-docs`

**Expected Endpoints:**
- `GET /health` - Health check
- `GET /api-docs` - Swagger documentation
- `POST /api/auth/login` - Authentication
- `GET /api/courses` - Courses list
- ... (26 total routes)

**Acceptance Criteria:**
- [ ] Backend deploys successfully
- [ ] Health check returns 200
- [ ] Swagger docs accessible
- [ ] All API routes respond
- [ ] No startup errors

---

## Task 6: Deploy Frontend

**Priority:** High  
**Estimated Time:** 1 hour  
**Estimated Cost:** $0 (hosting)

**Description:**
Deploy React frontend to Manus CDN.

**Steps:**
1. Manus auto-detects `client/` directory
2. Configure build command: `npm install && npm run build`
3. Set environment variables:
   - `VITE_BACKEND_URL` - Backend API URL
   - `VITE_CLERK_PUBLISHABLE_KEY` - Clerk key
   - `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe key
   - All other frontend env vars
4. Build production bundle
5. Deploy to CDN
6. Configure custom domain: `sofluent.ai`
7. Configure SSL certificate

**Expected Result:**
- Frontend accessible at `https://sofluent.ai`
- All routes working
- API calls successful
- Assets loading correctly

**Acceptance Criteria:**
- [ ] Frontend builds successfully
- [ ] Deploys to CDN
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] All pages load
- [ ] No console errors

---

## Task 7: API Integration Testing

**Priority:** Medium  
**Estimated Time:** 1-2 hours  
**Estimated Cost:** $20-50

**Description:**
Test all API endpoints after deployment.

**Steps:**
1. Use Swagger UI: `https://api.sofluent.ai/api-docs`
2. Test authentication endpoints
3. Test CRUD operations for each resource
4. Test file upload endpoints
5. Test email sending
6. Test payment processing (test mode)
7. Verify error handling
8. Check response times (< 500ms)

**Test Cases:**
- [ ] User registration/login
- [ ] Course CRUD operations
- [ ] Student enrollment
- [ ] File upload/download
- [ ] Email sending
- [ ] Payment processing
- [ ] Admin operations
- [ ] Error responses

**Acceptance Criteria:**
- [ ] All endpoints respond correctly
- [ ] Authentication works
- [ ] Error handling works
- [ ] Response times acceptable
- [ ] No 500 errors

---

## Task 8: Performance Optimization

**Priority:** Medium  
**Estimated Time:** 1-2 hours  
**Estimated Cost:** $30-50

**Description:**
Optimize performance for production.

**Steps:**
1. Run Lighthouse audit
2. Optimize images (WebP, lazy loading)
3. Enable gzip compression
4. Configure CDN caching
5. Optimize database queries
6. Add database indexes (if missing)
7. Enable HTTP/2
8. Configure caching headers

**Target Metrics:**
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- API Response Time: < 500ms

**Acceptance Criteria:**
- [ ] Lighthouse score > 90
- [ ] Page load < 2s
- [ ] API responses < 500ms
- [ ] No performance regressions

---

## Task 9: Security Hardening

**Priority:** High  
**Estimated Time:** 1 hour  
**Estimated Cost:** $0

**Description:**
Implement security best practices.

**Steps:**
1. Enable HTTPS (SSL certificate)
2. Configure CORS correctly
3. Verify secrets not exposed
4. Enable rate limiting
5. Configure security headers:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Strict-Transport-Security: max-age=31536000`
6. Verify authentication on protected routes
7. Test SQL injection prevention
8. Test XSS prevention

**Acceptance Criteria:**
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Security headers set
- [ ] Rate limiting active
- [ ] No security vulnerabilities

---

## Task 10: Monitoring Setup

**Priority:** Medium  
**Estimated Time:** 1 hour  
**Estimated Cost:** $0-20/month

**Description:**
Set up monitoring and logging.

**Steps:**
1. Configure error logging (Sentry or Manus logs)
2. Set up uptime monitoring
3. Configure performance monitoring
4. Set up alerting for:
   - Server errors (5xx)
   - High response times
   - Database connection failures
   - Storage failures
5. Configure log retention

**Acceptance Criteria:**
- [ ] Error logging active
- [ ] Uptime monitoring active
- [ ] Alerts configured
- [ ] Logs accessible

---

## 📊 TASK SUMMARY

| Task | Priority | Time | Cost | Status |
|------|----------|------|------|--------|
| 1. Database Migration | High | 2-4h | $50-100 | ⏳ Pending |
| 2. Storage Migration | High | 1-2h | $30-50 | ⏳ Pending |
| 3. Configure Secrets | High | 30m | $0 | ⏳ Pending |
| 4. Run Migrations | High | 30m | $0 | ⏳ Pending |
| 5. Deploy Backend | High | 1h | $0 | ⏳ Pending |
| 6. Deploy Frontend | High | 1h | $0 | ⏳ Pending |
| 7. API Testing | Medium | 1-2h | $20-50 | ⏳ Pending |
| 8. Performance | Medium | 1-2h | $30-50 | ⏳ Pending |
| 9. Security | High | 1h | $0 | ⏳ Pending |
| 10. Monitoring | Medium | 1h | $0-20/mo | ⏳ Pending |

**Total Estimated:** 10-15 hours, $130-250 (one-time) + $0-20/month

---

## 🎯 PRIORITY ORDER

1. **Task 3** - Configure Secrets (30 min) - Do first!
2. **Task 1** - Database Migration (2-4h)
3. **Task 2** - Storage Migration (1-2h)
4. **Task 4** - Run Migrations (30 min)
5. **Task 5** - Deploy Backend (1h)
6. **Task 6** - Deploy Frontend (1h)
7. **Task 7** - API Testing (1-2h)
8. **Task 9** - Security (1h)
9. **Task 8** - Performance (1-2h)
10. **Task 10** - Monitoring (1h)

---

**Copy these tasks into Manus Dashboard and assign to your team!**
