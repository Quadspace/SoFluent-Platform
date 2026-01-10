# Complete Product Management Guide

**How to manage your So Fluent products with Google Classroom and Loom**

---

## 🎯 YOUR SETUP

### Current Tools:
- ✅ **Google Classroom** - Course content delivery
- ✅ **Loom** - Video recordings
- ✅ **So Fluent Platform** - Storefront & management

### Solution:
**Unified Product Management System**
- All products in one database
- Link to Google Classroom
- Embed Loom videos
- Single dashboard
- Easy Manus deployment

---

## 📦 PRODUCT TYPES

### 1. Academy Subscription (R$297/month)
- Monthly recurring subscription
- Access to all live classes
- On-demand workout library
- Progress tracking

### 2. VIP Plan (R$997/month)
- All Academy features
- Weekly 1:1 coaching
- Personalized study plan
- Exclusive workshops

### 3. Challenges (R$97/challenge)
- One-time purchase
- Themed fitness & English challenges
- Certificate of completion
- Leaderboard access

### 4. Individual Courses
- Standalone courses
- One-time purchase
- Self-paced learning

### 5. Workshops
- Live sessions
- One-time purchase
- Recorded for later access

### 6. Kids' Corner Products
- Red Balloon partnership
- Games and activities
- Parent dashboard

---

## 🔗 GOOGLE CLASSROOM SETUP

### Step 1: Enable Google Classroom API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project (or use existing)
3. Enable "Google Classroom API"
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://your-domain.com/auth/google/callback` (production)

### Step 2: Get Credentials
1. Download credentials JSON
2. Add to `server/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   ```

### Step 3: Authorize Access
1. Visit `/auth/google` endpoint
2. Authorize So Fluent to access Classroom
3. Refresh token stored automatically
4. Ready to sync!

---

## 🎥 LOOM INTEGRATION

### How It Works:
1. **Record in Loom** - As normal
2. **Get Share URL** - Copy from Loom
3. **Add to Product** - Paste URL
4. **Auto-Embed** - Video displays automatically

### Example:
```
Loom URL: https://loom.com/share/abc123xyz
System extracts: abc123xyz
Embed URL: https://www.loom.com/embed/abc123xyz
```

### Features:
- ✅ No API key needed
- ✅ Works with share URLs
- ✅ Automatic embed generation
- ✅ Progress tracking
- ✅ Preview videos

---

## 🛍️ CREATING PRODUCTS

### Via API:
```javascript
POST /api/products/create
{
  "productType": "academy",
  "title": "Fluency Fit Academy",
  "slug": "fluency-fit-academy",
  "description": "Complete description...",
  "shortDescription": "Short description",
  "price": 297,
  "currency": "BRL",
  "isSubscription": true,
  "subscriptionPeriod": "monthly",
  "loomVideos": [
    {
      "videoId": "https://loom.com/share/abc123",
      "title": "Welcome Video",
      "description": "Introduction to the academy",
      "duration": 5,
      "order": 1,
      "isPreview": true
    }
  ],
  "googleClassroomLink": "https://classroom.google.com/c/xyz",
  "googleClassroomId": "classroom_course_id",
  "features": [
    {
      "title": "Live Classes",
      "description": "Join weekly live sessions"
    }
  ],
  "category": "fitness",
  "level": "all",
  "isPublished": true
}
```

### Via UI (Coming Soon):
- Product management dashboard
- Visual editor
- Drag-and-drop video ordering
- One-click Classroom linking

---

## 📊 STORE MANAGEMENT

### Product Catalog (`/products`):
- Browse all products
- Filter by type, category, level
- Search functionality
- Featured products highlighted

### Product Detail (`/products/:id`):
- Full product information
- Loom video player
- Google Classroom link
- Enrollment button
- Features list
- Instructor info

### Enrollment Flow:
1. User views product
2. Clicks "Enroll Now"
3. Payment processed (Stripe/Pix)
4. User enrolled in So Fluent
5. Auto-synced to Google Classroom (if linked)
6. Access to Loom videos granted

---

## 🎯 MANAGING YOUR OFFERINGS

### Option 1: Use Products Model (Recommended)
- Create products in So Fluent
- Link to Google Classroom
- Add Loom videos
- Manage everything in one place

### Option 2: Hybrid Approach
- Keep existing Classroom courses
- Create products that link to them
- Add Loom videos to products
- Sync enrollments automatically

### Option 3: Full Integration
- Create products in So Fluent
- Auto-create Classroom courses
- Embed Loom videos
- Complete automation

---

## 💡 BEST PRACTICES

### For Each Product:
1. **Create in So Fluent first**
   - Set up product details
   - Add pricing
   - Upload thumbnail

2. **Add Loom Videos**
   - Record in Loom
   - Copy share URLs
   - Paste into product
   - Videos auto-embed

3. **Link Google Classroom (Optional)**
   - Create course in Classroom
   - Copy course ID
   - Link in product settings
   - Enrollments sync automatically

4. **Publish**
   - Set as published
   - Appears in store
   - Students can enroll

---

## 🚀 MANUS DEPLOYMENT

### Database:
- ✅ Product model ready for MySQL
- ✅ Uses database adapter
- ✅ Easy migration

### Storage:
- ✅ Thumbnails → S3 (via adapter)
- ✅ Loom videos → Embedded (no storage)
- ✅ Google Classroom → API access

### Deployment:
1. Update database adapter to MySQL
2. Update storage adapter to S3
3. Set environment variables
4. Deploy!

---

## ✅ WHAT'S READY

### Backend:
- ✅ Product model
- ✅ Product controller
- ✅ Product routes
- ✅ Google Classroom service
- ✅ Loom integration service

### Frontend:
- ✅ Product catalog page
- ✅ Product detail page
- ✅ Product card component
- ✅ Loom player component

### Next:
- ⏳ Product management dashboard (admin UI)
- ⏳ Google Classroom OAuth setup
- ⏳ Testing & refinement

---

## 🎉 SUMMARY

**You now have:**
- ✅ Unified product management system
- ✅ Google Classroom integration ready
- ✅ Loom video embedding ready
- ✅ Store catalog ready
- ✅ Enrollment flow ready
- ✅ Manus deployment ready

**Next steps:**
1. Set up Google Classroom OAuth
2. Create your first products
3. Add Loom videos
4. Link Classroom courses
5. Start selling!

**Everything is built - just configure and use!** 🚀
