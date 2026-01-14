# Manus Compliance Guide
## Ensuring All Features Maintain Manus Compatibility

**CRITICAL:** Every feature built MUST maintain Manus compliance for deployment.

---

## 🎯 Core Compliance Rules

### 1. Database Operations - ALWAYS Use Adapters ✅

**❌ NEVER DO THIS:**
```javascript
// Direct MongoDB call - NOT Manus compliant
const user = await User.findOne({ email });
const courses = await Course.find({ educator: educatorId });
```

**✅ ALWAYS DO THIS:**
```javascript
// Use database adapter - Manus compliant
import dbAdapter from '../configs/database-adapter.js';

const user = await dbAdapter.findOne(User, { email });
const courses = await dbAdapter.find(Course, { educator: educatorId });
// OR use model-specific methods
const user = await dbAdapter.users.findByEmail(email);
const courses = await dbAdapter.courses.findByEducator(educatorId);
```

**Available Adapter Methods:**
- `dbAdapter.findOne(Model, filter, options)` - Generic find one
- `dbAdapter.find(Model, filter, options)` - Generic find many
- `dbAdapter.updateOne(Model, filter, update, options)` - Generic update
- `dbAdapter.create(Model, data)` - Generic create
- `dbAdapter.count(Model, filter)` - Generic count
- `dbAdapter.users.findById(id)` - User-specific
- `dbAdapter.courses.findAll(filters, options)` - Course-specific
- `dbAdapter.classes.findAll(filters, options)` - Class-specific
- `dbAdapter.purchases.findByUser(userId)` - Purchase-specific

---

### 2. Storage Operations - ALWAYS Use Adapters ✅

**❌ NEVER DO THIS:**
```javascript
// Direct Cloudinary call - NOT Manus compliant
const result = await cloudinary.uploader.upload(file);
```

**✅ ALWAYS DO THIS:**
```javascript
// Use storage adapter - Manus compliant
import storageAdapter from '../configs/storage-adapter.js';

const result = await storageAdapter.upload(file, 'folder-name', options);
```

**Available Storage Methods:**
- `storageAdapter.upload(file, folder, options)` - Upload file
- `storageAdapter.delete(publicId)` - Delete file
- `storageAdapter.getUrl(publicId, options)` - Get file URL

---

### 3. Model Definitions - MySQL-Compatible Schemas ✅

**✅ CORRECT - MySQL-Compatible:**
```javascript
const lessonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  vocabulary: [String], // Array → JSON column in MySQL
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

**MySQL Conversion:**
```sql
CREATE TABLE lessons (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  vocabulary JSON, -- Array stored as JSON
  completed BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

**❌ AVOID:**
- Complex nested objects without clear MySQL mapping
- Mongoose-specific features that don't translate to MySQL
- Direct MongoDB operators in queries (use adapter methods instead)

---

### 4. API Responses - Always JSON ✅

**✅ CORRECT:**
```javascript
// All APIs return JSON
res.json({ success: true, data: result });
res.json({ success: false, message: 'Error message' });
```

**❌ NEVER:**
```javascript
// HTML responses - NOT compatible with mobile/manus
res.send('<html>...</html>');
res.render('template', data);
```

---

### 5. Authentication - Token-Based ✅

**✅ CORRECT:**
```javascript
// JWT tokens work with Manus
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Manus Compatibility:**
- JWT tokens work perfectly
- Clerk authentication works (already integrated)
- Token-based auth is mobile-compatible

---

## 📋 Feature-by-Feature Compliance Checklist

### Feature 1: AI Life Mirror™
- ✅ Database: Use `dbAdapter.findOne()`, `dbAdapter.create()` for lessons
- ✅ Storage: Use `storageAdapter.upload()` for Instagram images
- ✅ API: JSON responses only
- ✅ Models: MySQL-compatible schema

### Feature 2: Workout-to-Fluency™
- ✅ Database: Use `dbAdapter.classes.findAll()`, `dbAdapter.classes.create()`
- ✅ Storage: Use `storageAdapter.upload()` for recordings
- ✅ API: JSON responses only
- ✅ Models: MySQL-compatible schema

### Feature 3: Social Learning Feed™
- ✅ Database: Use `dbAdapter.find()`, `dbAdapter.updateOne()` for posts
- ✅ Storage: Use `storageAdapter.upload()` for images/audio
- ✅ API: JSON responses only
- ✅ Models: MySQL-compatible schema

### Feature 4: Real-World Mission System™
- ✅ Database: Use `dbAdapter.findOne()`, `dbAdapter.updateOne()` for missions
- ✅ Storage: Use `storageAdapter.upload()` for proof submissions
- ✅ API: JSON responses only
- ✅ Models: MySQL-compatible schema

### Feature 5: AI Conversation Partner™
- ✅ Database: Use `dbAdapter.create()` for conversation logs
- ✅ Storage: Use `storageAdapter.upload()` for audio recordings
- ✅ API: JSON responses only
- ✅ Models: MySQL-compatible schema

### Feature 6: Career English Accelerator™
- ✅ Database: Use `dbAdapter.findOne()`, `dbAdapter.create()` for LinkedIn data
- ✅ Storage: Use `storageAdapter.upload()` if needed
- ✅ API: JSON responses only
- ✅ Models: MySQL-compatible schema

### Feature 7: AI Pronunciation Coach™
- ✅ Database: Use `dbAdapter.create()` for pronunciation records
- ✅ Storage: Use `storageAdapter.upload()` for audio files
- ✅ API: JSON responses only
- ✅ Models: MySQL-compatible schema

### Feature 8: Smart Study Buddy™
- ✅ Database: Use `dbAdapter.findOne()`, `dbAdapter.updateOne()` for vocabulary
- ✅ Storage: Not needed
- ✅ API: JSON responses only
- ✅ Models: MySQL-compatible schema

### Feature 9: Success Story Generator™
- ✅ Database: Use `dbAdapter.find()` for user progress data
- ✅ Storage: Use `storageAdapter.upload()` for generated videos
- ✅ API: JSON responses only
- ✅ Models: MySQL-compatible schema

---

## 🔧 Code Templates for Manus Compliance

### Controller Template
```javascript
import dbAdapter from '../configs/database-adapter.js';
import storageAdapter from '../configs/storage-adapter.js';
import Model from '../models/Model.js';

export const getItems = async (req, res) => {
  try {
    // ✅ Use adapter
    const items = await dbAdapter.find(Model, { userId: req.user.userId });
    
    res.json({ success: true, items });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    // ✅ Use adapter
    const item = await dbAdapter.create(Model, {
      userId: req.user.userId,
      ...req.body
    });
    
    res.json({ success: true, item });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const uploadFile = async (req, res) => {
  try {
    // ✅ Use storage adapter
    const result = await storageAdapter.upload(
      req.file,
      'folder-name',
      { resource_type: 'auto' }
    );
    
    res.json({ success: true, url: result.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
```

### Model Template
```javascript
import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed }, // JSON in MySQL
  arrayField: [String], // JSON array in MySQL
  booleanField: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Model', modelSchema);
```

---

## ✅ Pre-Deployment Checklist

Before deploying to Manus, verify:

- [ ] All database operations use `dbAdapter` methods
- [ ] All storage operations use `storageAdapter` methods
- [ ] No direct MongoDB calls (`User.find()`, `Course.findOne()`, etc.)
- [ ] No direct Cloudinary calls (`cloudinary.uploader.upload()`)
- [ ] All API responses are JSON (`res.json()`)
- [ ] All models have MySQL-compatible schemas
- [ ] No Mongoose-specific features that won't translate to MySQL
- [ ] All file uploads use `storageAdapter.upload()`
- [ ] All queries use adapter methods (not direct model methods)

---

## 🚨 Common Mistakes to Avoid

### Mistake 1: Direct Model Calls
```javascript
// ❌ WRONG
const user = await User.findOne({ email });

// ✅ CORRECT
const user = await dbAdapter.findOne(User, { email });
// OR
const user = await dbAdapter.users.findByEmail(email);
```

### Mistake 2: Direct Storage Calls
```javascript
// ❌ WRONG
const result = await cloudinary.uploader.upload(file);

// ✅ CORRECT
const result = await storageAdapter.upload(file, 'folder');
```

### Mistake 3: HTML Responses
```javascript
// ❌ WRONG
res.send('<html>...</html>');

// ✅ CORRECT
res.json({ success: true, data: result });
```

### Mistake 4: Mongoose-Specific Queries
```javascript
// ❌ WRONG - Mongoose-specific
const users = await User.find().populate('courses').exec();

// ✅ CORRECT - Use adapter with populate option
const users = await dbAdapter.find(User, {}, {
  populate: 'courses'
});
```

---

## 📊 Compliance Verification

Run this check before every commit:

```bash
# Check for direct MongoDB calls
grep -r "\.find(" server/controllers/ | grep -v "dbAdapter"
grep -r "\.findOne(" server/controllers/ | grep -v "dbAdapter"
grep -r "\.create(" server/controllers/ | grep -v "dbAdapter"

# Check for direct Cloudinary calls
grep -r "cloudinary" server/controllers/

# Check for HTML responses
grep -r "res\.send\|res\.render" server/routes/
```

**All results should be empty or only show adapter usage!**

---

## 🎯 Summary

**Golden Rules:**
1. ✅ Always use `dbAdapter` for database operations
2. ✅ Always use `storageAdapter` for file operations
3. ✅ Always return JSON from APIs
4. ✅ Always use MySQL-compatible schemas
5. ✅ Never use direct MongoDB/Cloudinary calls

**Following these rules ensures 100% Manus compatibility!** 🚀
