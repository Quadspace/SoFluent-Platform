# Manus Deployment Guide

**Important:** This project will be deployed to Manus for hosting. This guide outlines the deployment process and required adaptations.

---

## 🎯 Manus Deployment Overview

According to the execution plan, Phase 3 (Weeks 7-8) involves deploying to Manus using the **web-db-user scaffold**.

### Manus Infrastructure

- **Database:** MySQL/TiDB (not MongoDB)
- **Storage:** S3 (not Cloudinary)
- **Backend:** Node.js + Express
- **Authentication:** OAuth + email/password
- **Payments:** Stripe + Pix

---

## ⚠️ Key Differences from Current Setup

### Current Template Uses:
- ✅ MongoDB (via Mongoose)
- ✅ Cloudinary (for media storage)
- ✅ Clerk (for authentication)

### Manus Will Use:
- 🔄 MySQL/TiDB (needs migration)
- 🔄 S3 (needs migration from Cloudinary)
- 🔄 Manus authentication system (may replace Clerk)

---

## 📋 Pre-Deployment Checklist

### Phase 1-2: Development (Weeks 1-6)
- [x] Project structure set up
- [ ] Code developed and tested locally
- [ ] Features implemented
- [ ] Multilingual support working
- [ ] Branding integrated

### Phase 3: Manus Deployment Preparation

#### Database Migration Planning
- [ ] Document MongoDB schema/models
- [ ] Create MySQL/TiDB equivalent schema
- [ ] Plan data migration strategy
- [ ] Test migration scripts locally

#### Storage Migration Planning
- [ ] Document Cloudinary usage
- [ ] Plan S3 bucket structure
- [ ] Create migration script for existing media
- [ ] Update upload endpoints for S3

#### Authentication Migration
- [ ] Evaluate Clerk vs Manus auth
- [ ] Plan user migration if needed
- [ ] Update authentication middleware

---

## 🚀 Manus Deployment Steps

### Step 1: Initialize Manus Scaffold

**In Manus:**
```bash
# Initialize web-db-user scaffold
manus scaffold web-db-user sofluent-platform
```

**Scaffold Includes:**
- User authentication system
- MySQL/TiDB database setup
- Backend API structure
- S3 integration
- Payment processing (Stripe + Pix)

### Step 2: Database Migration

**Actions:**
1. Export data from MongoDB (if any)
2. Create MySQL/TiDB schema matching Manus structure
3. Migrate data to MySQL/TiDB
4. Update all database queries in codebase
5. Test database operations

**Migration Checklist:**
- [ ] User model migrated
- [ ] Course model migrated
- [ ] CourseProgress model migrated
- [ ] Purchase model migrated
- [ ] All relationships preserved

### Step 3: Storage Migration (Cloudinary → S3)

**Actions:**
1. Set up S3 bucket in Manus
2. Migrate existing media files from Cloudinary to S3
3. Update upload endpoints to use S3
4. Update media URLs throughout application
5. Test file uploads/downloads

**Files to Update:**
- `server/configs/cloudinary.js` → `server/configs/s3.js`
- All upload controllers
- All image/video references

### Step 4: Authentication Migration

**Options:**
- **Option A:** Keep Clerk, integrate with Manus backend
- **Option B:** Migrate to Manus authentication system

**If Migrating:**
- [ ] Export user data from Clerk
- [ ] Import users to Manus auth system
- [ ] Update frontend authentication
- [ ] Test login/signup flows

### Step 5: Backend Deployment

**In Manus:**
1. Push code to Manus repository
2. Configure environment variables
3. Run database migrations
4. Deploy backend API
5. Test API endpoints

**Environment Variables Needed:**
```env
# Database
DB_HOST=manus_db_host
DB_USER=manus_db_user
DB_PASSWORD=manus_db_password
DB_NAME=sofluent

# S3 Storage
AWS_ACCESS_KEY_ID=manus_s3_key
AWS_SECRET_ACCESS_KEY=manus_s3_secret
S3_BUCKET_NAME=sofluent-media

# Payments
STRIPE_SECRET_KEY=your_stripe_key
PIX_API_KEY=your_pix_key

# Authentication (if using Manus auth)
MANUS_AUTH_SECRET=manus_auth_secret
```

### Step 6: Frontend Deployment

**Actions:**
1. Build production version: `cd client && npm run build`
2. Deploy to Manus hosting
3. Configure custom domain (sofluent.ai)
4. Set up SSL certificate
5. Test live website

**Frontend Environment Variables:**
```env
VITE_API_URL=https://api.sofluent.ai
VITE_CLERK_PUBLISHABLE_KEY=your_key (if keeping Clerk)
```

### Step 7: Mobile App Deployment

**Actions:**
1. Build iOS and Android apps
2. Submit to App Store and Google Play
3. Configure push notifications
4. Test on real devices

---

## 🔄 Migration Strategy

### Database Migration Approach

**Option 1: Direct Migration Script**
- Write Node.js script to read from MongoDB
- Transform data to MySQL format
- Insert into MySQL/TiDB
- Run during deployment window

**Option 2: Gradual Migration**
- Set up dual-write (MongoDB + MySQL)
- Migrate data gradually
- Switch reads to MySQL
- Remove MongoDB writes

### Storage Migration Approach

1. **Export from Cloudinary:**
   ```bash
   # Use Cloudinary API to list all assets
   # Download all files
   ```

2. **Upload to S3:**
   ```bash
   # Use AWS CLI or SDK to upload
   # Maintain folder structure
   ```

3. **Update URLs:**
   - Replace Cloudinary URLs with S3 URLs
   - Update in database records
   - Update in frontend code

---

## 📝 Code Changes Required

### Database Layer Changes

**Current (MongoDB/Mongoose):**
```javascript
import mongoose from 'mongoose';
const User = mongoose.model('User', userSchema);
```

**Manus (MySQL):**
```javascript
// Will need to switch to MySQL client or ORM
// Options: mysql2, Sequelize, Prisma, etc.
```

### Storage Layer Changes

**Current (Cloudinary):**
```javascript
import { v2 as cloudinary } from 'cloudinary';
cloudinary.uploader.upload(file);
```

**Manus (S3):**
```javascript
import AWS from 'aws-sdk';
const s3 = new AWS.S3();
s3.upload(params).promise();
```

---

## 🧪 Testing Before Deployment

### Local Testing Checklist
- [ ] Test with MySQL database locally
- [ ] Test S3 uploads/downloads locally
- [ ] Test authentication flows
- [ ] Test payment processing
- [ ] Test all API endpoints
- [ ] Test frontend builds successfully

### Pre-Production Checklist
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Storage migration tested
- [ ] Authentication working
- [ ] Payments processing correctly
- [ ] SSL certificates ready
- [ ] Domain DNS configured

---

## 📊 Deployment Timeline

### Week 7: Deployment
- **Day 1-2:** Backend deployment
- **Day 3-4:** Frontend deployment
- **Day 5-7:** Mobile app submission

### Week 8: Launch
- **Day 1-2:** Pre-launch preparation
- **Day 3-5:** Official launch
- **Day 6-7:** Red Balloon partnership

---

## 🔧 Manus-Specific Configuration

### Recommended Project Structure for Manus

```
sofluent-platform/
├── client/              # Frontend (deployed separately)
├── server/              # Backend (Manus scaffold)
│   ├── configs/
│   │   ├── database.js  # MySQL/TiDB config
│   │   ├── s3.js        # S3 config
│   │   └── auth.js      # Manus auth config
│   ├── migrations/      # Database migrations
│   ├── models/          # MySQL models
│   └── ...
└── docs/
```

### Environment Variables Template for Manus

Create `server/manus.env.template`:
```env
# Manus Database
DB_HOST=manus_db_host
DB_PORT=3306
DB_USER=manus_user
DB_PASSWORD=manus_password
DB_NAME=sofluent

# S3 Storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=manus_key
AWS_SECRET_ACCESS_KEY=manus_secret
S3_BUCKET_NAME=sofluent-media

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PIX_API_KEY=pix_key
PIX_API_SECRET=pix_secret

# Authentication
MANUS_AUTH_SECRET=manus_auth_secret
JWT_SECRET=jwt_secret

# API
API_URL=https://api.sofluent.ai
FRONTEND_URL=https://sofluent.ai
```

---

## 🎯 Action Items Before Manus Deployment

### During Development (Weeks 1-6)
1. **Keep Manus in mind:**
   - Write database queries that can be easily migrated
   - Abstract storage layer (create adapter pattern)
   - Document all external dependencies

2. **Create Migration Scripts:**
   - Database migration scripts
   - Storage migration scripts
   - User migration scripts (if needed)

3. **Test Compatibility:**
   - Test with MySQL locally
   - Test S3 integration locally
   - Ensure code is Manus-compatible

### Week 7: Deployment Week
1. Initialize Manus scaffold
2. Run migrations
3. Deploy backend
4. Deploy frontend
5. Submit mobile apps

---

## 📚 Resources

- Manus Documentation: [Check Manus docs]
- MySQL Migration Guide: [To be added]
- S3 Integration Guide: [To be added]

---

## ⚠️ Important Notes

1. **Database:** Plan MongoDB → MySQL migration early
2. **Storage:** Cloudinary → S3 migration requires file transfer
3. **Authentication:** Decide on Clerk vs Manus auth early
4. **Testing:** Test all migrations thoroughly before production
5. **Backup:** Always backup data before migrations

---

**Next Steps:** Continue development with Manus deployment in mind. Create abstraction layers where possible to make migration easier.
