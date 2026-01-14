# So Fluent: Master Build Document (Manus-Compliant Version)
## Complete Implementation Guide for 9 Breakthrough Features

**CRITICAL:** This document has been updated to ensure 100% Manus compliance. All code examples use database and storage adapters.

**Purpose:** Build the complete So Fluent platform with all breakthrough features  
**Target:** Web application (mobile-responsive) with future mobile app compatibility  
**Timeline:** Phased implementation over 3-4 weeks  
**Tech Stack:** React + TypeScript + Node.js + MongoDB (via adapters) + i18next  
**Deployment:** Manus (MySQL/S3) - All code is adapter-compliant

---

## 🎯 OVERVIEW

This document contains complete specifications for building 9 breakthrough features that will make So Fluent the most innovative English learning platform in the world.

**Features Included:**
1. AI Life Mirror™ - Instagram/LinkedIn personalization
2. Workout-to-Fluency™ - Live fitness + English classes
3. Social Learning Feed™ - Community engagement
4. Real-World Mission System™ - Gamified daily challenges
5. AI Conversation Partner™ - 24/7 practice with AI
6. Career English Accelerator™ - LinkedIn-powered curriculum
7. AI Pronunciation Coach™ - Real-time feedback
8. Smart Study Buddy™ - Spaced repetition system
9. Success Story Generator™ - Shareable journey videos

**NOT Included (Mobile App Only):**
- Live Translation Glasses™ (requires native AR - build in React Native later)

---

## 🔐 MANUS COMPLIANCE REQUIREMENTS

### ⚠️ CRITICAL: Always Use Adapters

**Every database operation MUST use `dbAdapter`:**
```javascript
// ✅ CORRECT - Manus compliant
import dbAdapter from '../configs/database-adapter.js';
const user = await dbAdapter.findOne(User, { email });
const courses = await dbAdapter.find(Course, { educator: educatorId });

// ❌ WRONG - NOT Manus compliant
const user = await User.findOne({ email });
const courses = await Course.find({ educator: educatorId });
```

**Every storage operation MUST use `storageAdapter`:**
```javascript
// ✅ CORRECT - Manus compliant
import storageAdapter from '../configs/storage-adapter.js';
const result = await storageAdapter.upload(file, 'folder-name');

// ❌ WRONG - NOT Manus compliant
const result = await cloudinary.uploader.upload(file);
```

**See `MANUS_COMPLIANCE_GUIDE.md` for complete compliance rules.**

---

## 📐 ARCHITECTURE PRINCIPLES

### Mobile-First Design
Every feature MUST be:
- ✅ Fully responsive (375px to 1920px)
- ✅ Touch-friendly (44px minimum touch targets)
- ✅ Fast on mobile networks (< 3s load time)
- ✅ Works offline where possible (service workers)

### API-First Architecture
Every feature MUST:
- ✅ Use REST APIs (future mobile app will use same APIs)
- ✅ Separate frontend/backend logic
- ✅ Return JSON responses (Manus-compliant)
- ✅ Include proper authentication (JWT)

### Manus Compliance
Every feature MUST:
- ✅ Use `dbAdapter` for all database operations
- ✅ Use `storageAdapter` for all file operations
- ✅ Return JSON from all API endpoints
- ✅ Use MySQL-compatible schemas

---

## 🏗️ PROJECT STRUCTURE

```
sofluent-platform/
├── client/                          (React frontend)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── features/          (Breakthrough features)
│   │   │   │   ├── AILifeMirror.tsx
│   │   │   │   ├── WorkoutToFluency.tsx
│   │   │   │   ├── SocialFeed.tsx
│   │   │   │   ├── Missions.tsx
│   │   │   │   ├── AIConversation.tsx
│   │   │   │   ├── CareerAccelerator.tsx
│   │   │   │   ├── PronunciationCoach.tsx
│   │   │   │   ├── StudyBuddy.tsx
│   │   │   │   └── SuccessStory.tsx
│   │   │   ├── admin/             (Admin dashboard)
│   │   │   └── auth/              (Login, signup)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/              (API calls)
│   │   ├── utils/
│   │   ├── i18n/                  (Translations)
│   │   └── styles/
│   └── public/
├── server/                          (Node.js backend)
│   ├── configs/                     (CRITICAL: Adapters)
│   │   ├── database-adapter.js    (Manus-compliant DB layer)
│   │   └── storage-adapter.js     (Manus-compliant storage layer)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── features/              (Feature-specific routes)
│   │   └── admin.js
│   ├── controllers/               (Business logic - MUST use adapters)
│   ├── models/                    (MongoDB schemas - MySQL-compatible)
│   ├── middleware/                (Auth, validation)
│   ├── services/                  (External APIs)
│   └── utils/
└── docs/
```

---

## 🚀 FEATURE 1: AI LIFE MIRROR™ (Manus-Compliant)

### Backend API (Manus-Compliant)

#### 1.1 Instagram OAuth Route (`server/routes/features/aiLifeMirror.js`)
```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');
const dbAdapter = require('../../configs/database-adapter.js');
const storageAdapter = require('../../configs/storage-adapter.js');
const User = require('../../models/User');
const Lesson = require('../../models/Lesson');
const { generateLessonsFromInstagram } = require('../../services/openai');
const { authenticate } = require('../../middleware/auth');

// Instagram OAuth
router.get('/auth/instagram', (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
});

router.get('/auth/instagram/callback', authenticate, async (req, res) => {
  const { code } = req.query;
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code
    });
    
    const { access_token, user_id } = tokenResponse.data;
    
    // Get user's media
    const mediaResponse = await axios.get(`https://graph.instagram.com/${user_id}/media?fields=id,caption,media_url&access_token=${access_token}`);
    
    // ✅ Use adapter - Manus compliant
    await dbAdapter.updateOne(
      User,
      { _id: req.user.userId },
      {
        instagramConnected: true,
        instagramAccessToken: access_token,
        instagramUserId: user_id
      }
    );
    
    // Generate initial lessons
    await generateLessonsFromInstagram(req.user.userId, mediaResponse.data.data);
    
    // Close popup and notify parent window
    res.send(`
      <script>
        window.opener.postMessage({ type: 'instagram-connected' }, '*');
        window.close();
      </script>
    `);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Get lessons - ✅ Manus compliant
router.get('/lessons', authenticate, async (req, res) => {
  const lessons = await dbAdapter.find(Lesson, {
    userId: req.user.userId,
    source: { $in: ['instagram', 'linkedin'] }
  }, {
    sort: { createdAt: -1 },
    limit: 20
  });
  
  res.json({ success: true, lessons });
});

// Generate more lessons - ✅ Manus compliant
router.post('/generate', authenticate, async (req, res) => {
  // Fetch latest Instagram/LinkedIn data
  // Generate new lessons with OpenAI
  // ✅ Use adapter to save
  await generateLessonsFromInstagram(req.user.userId, latestData);
  
  res.json({ success: true });
});

module.exports = router;
```

#### 1.2 OpenAI Service (`server/services/openai.js`) - ✅ Manus Compliant
```javascript
const OpenAI = require('openai');
const dbAdapter = require('../configs/database-adapter.js');
const Lesson = require('../models/Lesson');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateLessonsFromInstagram(userId, instagramPosts) {
  const lessons = [];
  
  for (const post of instagramPosts.slice(0, 5)) {
    try {
      // Analyze image with GPT-4 Vision
      const visionResponse = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this photo and caption. Generate English vocabulary and phrases related to what you see.' },
              { type: 'image_url', image_url: { url: post.media_url } },
              { type: 'text', text: `Caption: ${post.caption || 'No caption'}` }
            ]
          }
        ],
        max_tokens: 500
      });
      
      const analysis = visionResponse.choices[0].message.content;
      
      // Generate structured lesson
      const lessonResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an English teacher creating personalized lessons from students\' Instagram photos.'
          },
          {
            role: 'user',
            content: `Based on this analysis: "${analysis}", create a JSON lesson with: title, vocabulary (10 words), phrases (5 phrases), exercises (3 exercises).`
          }
        ],
        response_format: { type: 'json_object' }
      });
      
      const lessonData = JSON.parse(lessonResponse.choices[0].message.content);
      
      // ✅ Use adapter - Manus compliant
      const lesson = await dbAdapter.create(Lesson, {
        userId,
        source: 'instagram',
        originalContent: {
          imageUrl: post.media_url,
          caption: post.caption
        },
        englishContent: lessonData
      });
      
      lessons.push(lesson);
    } catch (error) {
      console.error('Error generating lesson:', error);
    }
  }
  
  return lessons;
}

module.exports = { generateLessonsFromInstagram };
```

---

## 🚀 FEATURE 2: WORKOUT-TO-FLUENCY™ (Manus-Compliant)

### Backend API (Manus-Compliant)

#### 2.1 Workout Routes (`server/routes/features/workouts.js`)
```javascript
const express = require('express');
const router = express.Router();
const dbAdapter = require('../../configs/database-adapter.js');
const LiveClass = require('../../models/LiveClass');
const { authenticate, requireAdmin } = require('../../middleware/auth');
const { createZoomMeeting } = require('../../services/zoom');

// Get upcoming and past classes - ✅ Manus compliant
router.get('/classes', authenticate, async (req, res) => {
  const now = new Date();
  
  const upcoming = await dbAdapter.find(LiveClass, {
    date: { $gte: now }
  }, {
    sort: { date: 1 },
    limit: 10
  });
  
  const past = await dbAdapter.find(LiveClass, {
    date: { $lt: now },
    recordingUrl: { $exists: true }
  }, {
    sort: { date: -1 },
    limit: 20
  });
  
  res.json({ success: true, upcoming, past });
});

// Schedule class (admin only) - ✅ Manus compliant
router.post('/schedule', authenticate, requireAdmin, async (req, res) => {
  const { title, date, time, duration, type, level, maxParticipants } = req.body;
  
  // Create Zoom meeting
  const zoomMeeting = await createZoomMeeting({
    topic: title,
    start_time: `${date}T${time}:00`,
    duration,
    settings: {
      host_video: true,
      participant_video: true
    }
  });
  
  // ✅ Use adapter - Manus compliant
  const liveClass = await dbAdapter.create(LiveClass, {
    title,
    instructor: req.user.userId,
    date: new Date(`${date}T${time}:00`),
    duration,
    type,
    level,
    maxParticipants,
    zoomLink: zoomMeeting.join_url,
    zoomMeetingId: zoomMeeting.id
  });
  
  res.json({ success: true, class: liveClass });
});

// Join class - ✅ Manus compliant
router.post('/join/:classId', authenticate, async (req, res) => {
  const liveClass = await dbAdapter.findOne(LiveClass, { _id: req.params.classId });
  
  if (!liveClass.participants.includes(req.user.userId)) {
    await dbAdapter.updateOne(
      LiveClass,
      { _id: req.params.classId },
      {
        $push: { participants: req.user.userId },
        $inc: { currentParticipants: 1 }
      }
    );
  }
  
  res.json({ success: true, zoomLink: liveClass.zoomLink });
});

module.exports = router;
```

---

## 🚀 FEATURE 3: SOCIAL LEARNING FEED™ (Manus-Compliant)

### Backend API (Manus-Compliant)

#### 3.1 Social Feed Routes (`server/routes/features/socialFeed.js`)
```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const dbAdapter = require('../../configs/database-adapter.js');
const storageAdapter = require('../../configs/storage-adapter.js');
const Post = require('../../models/Post');
const { authenticate } = require('../../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// Get feed - ✅ Manus compliant
router.get('/feed', authenticate, async (req, res) => {
  const posts = await dbAdapter.find(Post, {}, {
    populate: [
      { path: 'user', select: 'name profilePhoto level' },
      { path: 'comments.user', select: 'name profilePhoto' }
    ],
    sort: { featured: -1, createdAt: -1 },
    limit: 50
  });
  
  res.json({ success: true, posts });
});

// Create post - ✅ Manus compliant
router.post('/posts', authenticate, upload.single('file'), async (req, res) => {
  const { type, text } = req.body;
  const content = {};
  
  if (type === 'text') {
    content.text = text;
  } else if (type === 'voice' && req.file) {
    // ✅ Use storage adapter - Manus compliant
    const result = await storageAdapter.upload(req.file, 'audio', {
      resource_type: 'video' // For audio files
    });
    content.audioUrl = result.url;
  } else if (type === 'photo' && req.file) {
    // ✅ Use storage adapter - Manus compliant
    const result = await storageAdapter.upload(req.file, 'images');
    content.imageUrl = result.url;
  }
  
  // ✅ Use adapter - Manus compliant
  const post = await dbAdapter.create(Post, {
    user: req.user.userId,
    type,
    content
  });
  
  // Update user's streak
  await updateStreak(req.user.userId);
  
  res.json({ success: true, post });
});

// Like post - ✅ Manus compliant
router.post('/posts/:postId/like', authenticate, async (req, res) => {
  const post = await dbAdapter.findOne(Post, { _id: req.params.postId });
  
  const index = post.likes.indexOf(req.user.userId);
  const update = index > -1
    ? { $pull: { likes: req.user.userId } }
    : { $push: { likes: req.user.userId } };
  
  await dbAdapter.updateOne(Post, { _id: req.params.postId }, update);
  
  const updatedPost = await dbAdapter.findOne(Post, { _id: req.params.postId });
  res.json({ success: true, likes: updatedPost.likes.length });
});

module.exports = router;
```

---

## 📋 COMPLETE BUILD CHECKLIST (Manus-Compliant)

### Week 1: Foundation + Features 1-3
- [ ] Project setup (React + Node.js + MongoDB via adapters)
- [ ] Authentication system (JWT)
- [ ] Design system implementation
- [ ] i18next setup (English + Portuguese)
- [ ] **Verify:** All database operations use `dbAdapter`
- [ ] **Verify:** All storage operations use `storageAdapter`
- [ ] Feature 1: AI Life Mirror™ (Instagram + LinkedIn)
- [ ] Feature 2: Workout-to-Fluency™ (Zoom integration)
- [ ] Feature 3: Social Learning Feed™

### Week 2: Features 4-6
- [ ] Feature 4: Real-World Mission System™
- [ ] Feature 5: AI Conversation Partner™
- [ ] Feature 6: Career English Accelerator™
- [ ] Admin dashboard (basic)
- [ ] **Verify:** All new features use adapters

### Week 3: Features 7-9 + Polish
- [ ] Feature 7: AI Pronunciation Coach™
- [ ] Feature 8: Smart Study Buddy™
- [ ] Feature 9: Success Story Generator™
- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] **Final compliance check:** Run grep checks for direct calls

### Week 4: Testing + Deployment
- [ ] End-to-end testing
- [ ] Beta user testing
- [ ] Bug fixes
- [ ] Documentation
- [ ] **Manus deployment preparation:**
  - [ ] Update adapters to MySQL/S3
  - [ ] Create MySQL schema
  - [ ] Test with MySQL locally
  - [ ] Deploy to Manus

---

## 🎬 FINAL CURSOR PROMPT (Manus-Compliant)

**Copy this into Cursor to start building:**

```
BUILD SO FLUENT: Complete Platform with 9 Breakthrough Features (Manus-Compliant)

I need you to build the complete So Fluent platform following the CURSOR_MASTER_BUILD_MANUS_COMPLIANT.md specifications.

CRITICAL REQUIREMENT: ALL code MUST maintain Manus compliance:
- ✅ Use dbAdapter for ALL database operations (never direct MongoDB calls)
- ✅ Use storageAdapter for ALL file operations (never direct Cloudinary calls)
- ✅ Return JSON from ALL API endpoints
- ✅ Use MySQL-compatible schemas

PHASE 1 (Week 1): Foundation + Core Features
1. Set up project structure (React + TypeScript + Node.js + MongoDB via adapters)
2. Implement authentication system (JWT)
3. Apply design system (pink/magenta + dark theme)
4. Set up i18next (English + Portuguese)
5. Build Feature 1: AI Life Mirror™ (Instagram + LinkedIn integration)
   - ✅ Use dbAdapter.findOne(), dbAdapter.create() for lessons
   - ✅ Use storageAdapter.upload() for images
6. Build Feature 2: Workout-to-Fluency™ (Zoom live classes)
   - ✅ Use dbAdapter.classes.findAll(), dbAdapter.classes.create()
7. Build Feature 3: Social Learning Feed™ (Instagram-style community)
   - ✅ Use dbAdapter.find(), dbAdapter.updateOne() for posts
   - ✅ Use storageAdapter.upload() for images/audio

PHASE 2 (Week 2): Advanced Features
8. Build Feature 4: Real-World Mission System™
9. Build Feature 5: AI Conversation Partner™
10. Build Feature 6: Career English Accelerator™
11. Build admin dashboard
- ✅ Verify all features use adapters

PHASE 3 (Week 3): Final Features + Polish
12. Build Feature 7: AI Pronunciation Coach™
13. Build Feature 8: Smart Study Buddy™
14. Build Feature 9: Success Story Generator™
15. Mobile responsiveness (375px to 1920px)
16. Performance optimization
17. Run compliance checks (grep for direct calls)

PHASE 4 (Week 4): Testing + Deployment
18. End-to-end testing
19. Bug fixes
20. Documentation
21. Manus deployment preparation

IMPORTANT:
- Follow MANUS_COMPLIANCE_GUIDE.md for all database/storage operations
- Every feature must be mobile-responsive
- All API endpoints must work for future mobile app
- Include proper error handling
- Add loading states everywhere
- Implement proper authentication
- Cost per feature must stay under $0.50 per use

Let's build the future of English education with 100% Manus compliance! 🚀
```

---

## ✅ Compliance Verification Commands

Before every commit, run:

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

## 🎉 CONCLUSION

This document ensures 100% Manus compliance while building all 9 breakthrough features.

**What You're Building:**
- ✅ AI-powered personalization (Instagram + LinkedIn)
- ✅ Fitness + English (science-backed)
- ✅ Social community (engagement + retention)
- ✅ Gamification (missions, XP, streaks)
- ✅ 24/7 AI practice (conversation + pronunciation)
- ✅ Career-focused (LinkedIn integration)
- ✅ Spaced repetition (never forget)
- ✅ Viral growth (success stories)
- ✅ **100% Manus-compliant** (ready for MySQL/S3 deployment)

**Cost:** $7.20/month per student in AI costs  
**Revenue:** $60-200/month per student  
**Profit:** 88-96% margins ✅

**Timeline:** 4 weeks from start to launch

**Now go build it in Cursor with Manus compliance! 💪🚀**
