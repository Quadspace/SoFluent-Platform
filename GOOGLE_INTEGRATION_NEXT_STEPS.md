# 🚀 Google Integration - Next Steps

**Status:** Backend services created ✅  
**Next:** Frontend components and final integration

---

## ✅ COMPLETED (Backend)

### **Services Created:**
1. ✅ `server/services/googleClassroom.js` - Course management
2. ✅ `server/services/googleMeet.js` - Live class meetings
3. ✅ `server/services/openRouter.js` - AI features
4. ✅ `server/services/googleDrive.js` - File storage
5. ✅ `server/services/googleCalendar.js` - Class scheduling

### **Routes Created:**
1. ✅ `server/routes/googleRoutes.js` - Google API endpoints
2. ✅ `server/routes/openRouterRoutes.js` - AI endpoints

### **Server Integration:**
1. ✅ Routes added to `server/server.js`

---

## ⏳ NEXT STEPS (Priority Order)

### **1. Fix Server Import** (2 minutes) ⚠️ **CRITICAL**
**Issue:** Dynamic import in server.js won't work  
**Fix:** Change to static import

**File:** `server/server.js`
```javascript
// Change this:
app.use('/api/ai', await import('./routes/openRouterRoutes.js').then(m => m.default));

// To this:
import openRouterRoutes from './routes/openRouterRoutes.js';
// ... later in file ...
app.use('/api/ai', openRouterRoutes);
```

---

### **2. Create Frontend Components** (2-3 hours)

#### **A. Google Classroom Embed Component**
**File:** `client/src/components/google/GoogleClassroomEmbed.jsx`
- Embed Google Classroom iframe
- Handle authentication
- Show course content

#### **B. Google Meet Embed Component**
**File:** `client/src/components/google/GoogleMeetEmbed.jsx`
- Embed Google Meet for live classes
- Handle camera/microphone permissions
- Show class controls

#### **C. AI Chat Component**
**File:** `client/src/components/ai/AIChat.jsx`
- Chat interface for AI conversation partner
- Show conversation history
- Handle typing indicators

#### **D. AI Life Mirror Component**
**File:** `client/src/components/ai/AILifeMirror.jsx`
- Connect Instagram
- Show personalized lessons
- Display lesson content

---

### **3. Google Auth Integration** (1 hour)

#### **A. Google OAuth Setup**
**File:** `client/src/components/auth/GoogleLogin.jsx`
- One-click Google sign-in
- Handle OAuth callback
- Store tokens

#### **B. Backend Auth Route**
**File:** `server/routes/authRoutes.js`
- Verify Google token
- Create/update user
- Return JWT

---

### **4. Environment Variables** (15 minutes)

**Update:** `server/env.example`
```bash
# Google Workspace
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://sofluent.ai/api/google/callback
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GOOGLE_SUBJECT_EMAIL=admin@sofluent.ai

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key

# Timezone
TIMEZONE=America/Sao_Paulo
```

**Update:** `client/.env.example`
```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:3000
```

---

### **5. Update Controllers** (1 hour)

#### **A. Cohort Controller**
**File:** `server/controllers/cohortController.js`
- Auto-create Google Classroom course
- Sync students on enrollment

#### **B. Class Controller**
**File:** `server/controllers/classController.js`
- Auto-create Google Meet
- Send calendar invites

---

### **6. Documentation** (30 minutes)

#### **A. Setup Guide**
**File:** `GOOGLE_WORKSPACE_SETUP.md`
- Google Cloud Console setup
- API enablement
- OAuth configuration
- Service account setup

#### **B. Integration Guide**
**File:** `GOOGLE_INTEGRATION_GUIDE.md`
- How to use Google services
- API endpoints
- Frontend components
- Examples

---

## 📋 IMMEDIATE ACTION ITEMS

### **Today (30 minutes):**
1. ✅ Fix server.js import
2. ✅ Add environment variables to `.env.example`
3. ✅ Test backend routes locally

### **This Week (4-6 hours):**
4. ⏳ Create frontend components
5. ⏳ Implement Google Auth
6. ⏳ Update controllers for auto-sync
7. ⏳ Create documentation

---

## 🎯 RECOMMENDED APPROACH

### **Phase 1: Backend Testing** (Today)
1. Set up Google Cloud Console
2. Get API credentials
3. Test Google Classroom API
4. Test OpenRouter API
5. Verify routes work

### **Phase 2: Frontend Components** (This Week)
1. Create Google Classroom embed
2. Create Google Meet embed
3. Create AI chat interface
4. Test embedded services

### **Phase 3: Integration** (Next Week)
1. Connect frontend to backend
2. Test complete flows
3. Add error handling
4. Polish UX

---

## 🚨 CRITICAL FIXES NEEDED

### **1. Server Import** ⚠️
**File:** `server/server.js`  
**Line:** ~139  
**Issue:** Dynamic import won't work  
**Fix:** Use static import

### **2. Missing Dependencies**
**Check:** `server/package.json`  
**Need:** `googleapis`, `google-auth-library`  
**Add:** `npm install googleapis google-auth-library`

---

## 📚 RESOURCES

### **Google APIs:**
- [Google Classroom API Docs](https://developers.google.com/classroom)
- [Google Meet API Docs](https://developers.google.com/meet)
- [Google Drive API Docs](https://developers.google.com/drive)
- [Google Calendar API Docs](https://developers.google.com/calendar)

### **OpenRouter:**
- [OpenRouter Docs](https://openrouter.ai/docs)
- [Model Pricing](https://openrouter.ai/models)

---

## ✅ SUCCESS CRITERIA

**Integration is complete when:**
1. ✅ Teacher creates cohort → Google Classroom course auto-created
2. ✅ Student enrolls → Added to Google Classroom
3. ✅ Teacher schedules class → Google Meet created + Calendar invite
4. ✅ Student joins class → Google Meet embedded in So Fluent
5. ✅ Student uploads file → Stored in Google Drive
6. ✅ Student chats with AI → OpenRouter responds
7. ✅ Student connects Instagram → AI generates personalized lesson

---

**Ready to continue? Let's fix the server import first, then create the frontend components!**
