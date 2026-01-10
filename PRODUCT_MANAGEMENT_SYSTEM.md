# So Fluent Product Management System

**Integration:** Google Classroom + Loom Recordings + Store Management

---

## 🎯 PRODUCT STRUCTURE

### Product Types:
1. **Fluency Fit Academy** - Monthly subscription (R$297/month)
2. **VIP Plan** - Premium subscription (R$997/month)
3. **Challenges** - One-time purchases (R$97/challenge)
4. **Individual Courses** - Standalone courses
5. **Workshops** - Live sessions
6. **Kids' Corner** - Red Balloon partnership products

---

## 🔗 GOOGLE CLASSROOM INTEGRATION

### How It Works:
- **Google Classroom** = Course content delivery
- **Loom** = Video lectures/recordings
- **So Fluent Platform** = Storefront, enrollment, payment

### Integration Strategy:
1. Create Google Classroom for each product
2. Embed Loom videos in course content
3. Sync enrollments between platforms
4. Track progress across both systems

---

## 📦 PRODUCT MANAGEMENT APPROACH

### Option 1: Unified Product Catalog (Recommended)
- Single source of truth in database
- Products can link to Google Classroom
- Products can include Loom videos
- Easy to manage in Manus

### Option 2: Hybrid Approach
- Store products in So Fluent database
- Link to Google Classroom courses
- Embed Loom videos directly
- Sync data between systems

---

## 🛠️ IMPLEMENTATION PLAN

### Phase 1: Product Model Enhancement
- Add product types (Academy, VIP, Challenge, Course, Workshop)
- Add Google Classroom link field
- Add Loom video integration
- Add product metadata

### Phase 2: Google Classroom Integration
- OAuth setup for Google Classroom API
- Sync course enrollments
- Display Classroom content
- Track completion

### Phase 3: Loom Integration
- Embed Loom videos in course content
- Track video watch time
- Progress tracking

### Phase 4: Store Management
- Product catalog page
- Product detail pages
- Shopping cart (if needed)
- Checkout flow

---

## 💡 RECOMMENDED SOLUTION

**Unified Product Management System:**
- All products stored in database
- Google Classroom links stored per product
- Loom videos embedded in course content
- Single admin dashboard to manage everything
- Easy to deploy to Manus
