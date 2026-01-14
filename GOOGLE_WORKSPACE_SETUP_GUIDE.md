# 🚀 Google Workspace Setup Guide - Step by Step

**Goal:** Set up Google Workspace integration in 30 minutes  
**Difficulty:** Easy (follow step-by-step)  
**Result:** Fully integrated Google Classroom, Meet, Drive, and Calendar

---

## 📋 PREREQUISITES

- Google account (Gmail or Google Workspace)
- Access to Google Cloud Console
- 30 minutes of time

---

## 🎯 STEP 1: CREATE GOOGLE CLOUD PROJECT (5 minutes)

### **1.1 Go to Google Cloud Console**
1. Visit: [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. Click **"Select a project"** → **"New Project"**

### **1.2 Create Project**
- **Project Name:** `So Fluent Production`
- **Organization:** (Leave default or select your organization)
- **Location:** (Leave default)
- Click **"Create"**

### **1.3 Select Project**
- Wait for project creation (10-30 seconds)
- Select the new project from the project dropdown

**✅ Step 1 Complete!**

---

## 🔌 STEP 2: ENABLE REQUIRED APIs (5 minutes)

### **2.1 Enable Google Classroom API**
1. Go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Classroom API"**
3. Click **"Enable"**
4. Wait for activation (10 seconds)

### **2.2 Enable Google Calendar API**
1. Search for **"Google Calendar API"**
2. Click **"Enable"**
3. Wait for activation

### **2.3 Enable Google Drive API**
1. Search for **"Google Drive API"**
2. Click **"Enable"**
3. Wait for activation

### **2.4 Enable Google OAuth2 API**
1. Search for **"Google OAuth2 API"**
2. Click **"Enable"**
3. Wait for activation

**✅ Step 2 Complete!**

---

## 🔐 STEP 3: CREATE OAUTH 2.0 CREDENTIALS (10 minutes)

### **3.1 Go to Credentials**
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**

### **3.2 Configure OAuth Consent Screen** (First time only)
If prompted:
1. **User Type:** External (or Internal if you have Google Workspace)
2. Click **"Create"**
3. **App Information:**
   - App name: `So Fluent`
   - User support email: `support@sofluent.ai`
   - Developer contact: `dev@sofluent.ai`
4. Click **"Save and Continue"**
5. **Scopes:** Click **"Add or Remove Scopes"**
   - Select:
     - `.../auth/classroom.courses`
     - `.../auth/classroom.rosters`
     - `.../auth/calendar`
     - `.../auth/drive.file`
     - `.../auth/userinfo.email`
   - Click **"Update"** → **"Save and Continue"**
6. **Test users:** Add your email → **"Save and Continue"**
7. **Summary:** Review → **"Back to Dashboard"**

### **3.3 Create OAuth Client ID**
1. **Application type:** Web application
2. **Name:** `So Fluent Web Client`
3. **Authorized JavaScript origins:**
   - `http://localhost:5173` (development)
   - `https://sofluent.ai` (production)
   - `https://www.sofluent.ai` (production)
4. **Authorized redirect URIs:**
   - `http://localhost:3000/api/google/callback` (development)
   - `https://sofluent.ai/api/google/callback` (production)
5. Click **"Create"**

### **3.4 Copy Credentials**
- **Client ID:** Copy this value
- **Client Secret:** Copy this value (click "Show" if hidden)
- **Save both** - you'll need them!

**✅ Step 3 Complete!**

---

## 👤 STEP 4: CREATE SERVICE ACCOUNT (10 minutes)

### **4.1 Create Service Account**
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"Service account"**
3. **Service account details:**
   - Name: `sofluent-service-account`
   - ID: `sofluent-service-account` (auto-generated)
   - Description: `Service account for So Fluent platform`
4. Click **"Create and Continue"**

### **4.2 Grant Roles** (Optional)
- Skip for now (click **"Continue"**)

### **4.3 Grant Access** (Optional)
- Skip for now (click **"Done"**)

### **4.4 Enable Domain-Wide Delegation**
1. Click on the service account you just created
2. Go to **"Details"** tab
3. Check **"Enable Google Workspace Domain-wide Delegation"**
4. Click **"Save"**

### **4.5 Download Service Account Key**
1. Click **"Keys"** tab
2. Click **"Add Key"** → **"Create new key"**
3. **Key type:** JSON
4. Click **"Create"**
5. **JSON file downloads automatically** - Save it securely!

### **4.6 Grant API Scopes** (If using Google Workspace)
1. Go to [admin.google.com](https://admin.google.com)
2. **Security** → **API Controls** → **Domain-wide Delegation**
3. Click **"Add new"**
4. **Client ID:** From service account JSON (field: `client_id`)
5. **OAuth Scopes:** Add these (one per line):
   ```
   https://www.googleapis.com/auth/classroom.courses
   https://www.googleapis.com/auth/classroom.rosters
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/drive.file
   ```
6. Click **"Authorize"**

**✅ Step 4 Complete!**

---

## 📝 STEP 5: CONFIGURE ENVIRONMENT VARIABLES (5 minutes)

### **5.1 Open Service Account JSON**
Open the downloaded JSON file. It looks like:
```json
{
  "type": "service_account",
  "project_id": "sofluent-production",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "sofluent-service-account@sofluent-production.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### **5.2 Update server/.env**
```bash
# Google Workspace Integration
GOOGLE_CLIENT_ID=your_client_id_from_step_3
GOOGLE_CLIENT_SECRET=your_client_secret_from_step_3
GOOGLE_REDIRECT_URI=https://sofluent.ai/api/google/callback
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
GOOGLE_SUBJECT_EMAIL=your_admin_email@sofluent.ai

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_key

# Timezone
TIMEZONE=America/Sao_Paulo
```

**Important:** 
- Replace `GOOGLE_SERVICE_ACCOUNT_KEY` with the **entire JSON as a single string** (escape quotes)
- Or use a JSON file path (we'll create a helper for this)

### **5.3 Update client/.env**
```bash
VITE_GOOGLE_CLIENT_ID=your_client_id_from_step_3
```

**✅ Step 5 Complete!**

---

## 🧪 STEP 6: VERIFY SETUP (5 minutes)

### **6.1 Test Google APIs**
Run the verification script:
```bash
node scripts/verify-google-setup.js
```

**Expected Output:**
```
✅ Google Client ID configured
✅ Google Client Secret configured
✅ Service Account Key configured
✅ All APIs enabled
✅ Setup complete!
```

### **6.2 Test Backend Routes**
```bash
# Start server
cd server
npm run dev

# In another terminal, test health
curl http://localhost:3000/health

# Test Google Classroom (will fail without real credentials, but should not crash)
curl -X POST http://localhost:3000/api/google/classroom/create-course \
  -H "Content-Type: application/json" \
  -d '{"teacherEmail":"test@example.com","courseName":"Test","description":"Test"}'
```

**✅ Step 6 Complete!**

---

## 🎉 SETUP COMPLETE!

**You now have:**
- ✅ Google Cloud Project created
- ✅ All APIs enabled
- ✅ OAuth credentials configured
- ✅ Service account created
- ✅ Environment variables set
- ✅ Setup verified

**Next Steps:**
1. Set up OpenRouter (see `OPENROUTER_SETUP.md`)
2. Test integration
3. Deploy to production

---

## 🆘 TROUBLESHOOTING

### **Issue: "API not enabled"**
**Fix:** Go to APIs & Services → Library → Enable the API

### **Issue: "Invalid credentials"**
**Fix:** Double-check `.env` file has correct values

### **Issue: "Redirect URI mismatch"**
**Fix:** Ensure redirect URI in OAuth client matches exactly

### **Issue: "Service account permission denied"**
**Fix:** Enable domain-wide delegation and grant scopes

---

## 📚 ADDITIONAL RESOURCES

- [Google Classroom API Docs](https://developers.google.com/classroom)
- [Google Calendar API Docs](https://developers.google.com/calendar)
- [Google Drive API Docs](https://developers.google.com/drive)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

---

**Setup Time:** ~30 minutes  
**Difficulty:** Easy  
**Status:** ✅ Ready to use!
