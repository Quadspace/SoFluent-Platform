# Google Classroom Setup Guide

**One-time setup to integrate Google Classroom with So Fluent**

---

## 📋 STEP-BY-STEP SETUP

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create Project**
   - Click "Select a project" → "New Project"
   - Name: "So Fluent Platform"
   - Click "Create"

3. **Enable Classroom API**
   - Go to "APIs & Services" → "Library"
   - Search: "Google Classroom API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "So Fluent Platform"
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback` (development)
     - `https://your-domain.com/auth/google/callback` (production)
   - Click "Create"
   - **Save Client ID and Client Secret**

### Step 2: Install Package

```bash
cd server
npm install googleapis
```

### Step 3: Environment Variables

Add to `server/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Step 4: Authorize Access

1. **Create Auth Route** (if not exists)
2. **Visit** `/auth/google`
3. **Authorize** So Fluent to access Classroom
4. **Refresh token** stored automatically

---

## ✅ VERIFICATION

### Test Integration:
```javascript
// Test getting courses
GET /api/products/:id/sync-classroom
{
  "googleClassroomId": "your_course_id"
}
```

---

## 🔒 SECURITY NOTES

- Keep credentials secure
- Never commit `.env` file
- Use environment variables
- Rotate credentials periodically

---

**Once set up, products can link to Classroom and enrollments sync automatically!** 🚀
