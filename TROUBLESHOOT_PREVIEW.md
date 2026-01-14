# 🔧 Troubleshooting Preview - ERR_CONNECTION_REFUSED

## Problem
**Error:** `ERR_CONNECTION_REFUSED (-102)` on `http://localhost:5173`

This means the Vite dev server isn't running.

---

## ✅ Solution: Start the Server

### **Option 1: Quick Start (Recommended)**

**Open PowerShell or Command Prompt in the project root:**

```powershell
# Navigate to client folder
cd client

# Start the dev server
npm run dev
```

**Wait for output like:**
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Then open:** `http://localhost:5173` in your browser

---

### **Option 2: Use the Startup Script**

**Windows:**
```powershell
.\start-preview.bat
```

**Mac/Linux:**
```bash
chmod +x start-preview.sh
./start-preview.sh
```

---

## 🔍 Common Issues

### **1. Port 5173 Already in Use**

**Error:** Port already in use

**Solution:**
```powershell
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use a different port
cd client
npm run dev -- --port 5174
```

---

### **2. Dependencies Not Installed**

**Error:** Cannot find module or missing dependencies

**Solution:**
```powershell
cd client
npm install
npm run dev
```

---

### **3. Node Modules Missing**

**Check:**
```powershell
cd client
Test-Path node_modules
```

**If False, install:**
```powershell
npm install
```

---

### **4. Vite Not Found**

**Error:** 'vite' is not recognized

**Solution:**
```powershell
cd client
npm install vite --save-dev
npm run dev
```

---

## 🎯 Step-by-Step Fix

1. **Open Terminal/PowerShell**
2. **Navigate to client folder:**
   ```powershell
   cd C:\Users\MichaelSanders\SoFluent-Platform\client
   ```
3. **Check if node_modules exists:**
   ```powershell
   Test-Path node_modules
   ```
4. **If False, install dependencies:**
   ```powershell
   npm install
   ```
5. **Start dev server:**
   ```powershell
   npm run dev
   ```
6. **Wait for "ready" message**
7. **Open browser to the URL shown (usually http://localhost:5173)**

---

## 📋 Verify It's Working

**You should see:**
- ✅ Terminal shows "VITE ready"
- ✅ URL displayed (e.g., `http://localhost:5173/`)
- ✅ Browser loads the homepage
- ✅ No connection errors

---

## 🆘 Still Not Working?

### **Check These:**

1. **Firewall blocking?**
   - Windows Firewall might block Node.js
   - Allow Node.js through firewall

2. **Antivirus blocking?**
   - Some antivirus blocks localhost connections
   - Add exception for Node.js

3. **Proxy/VPN?**
   - Disable VPN/proxy temporarily
   - Some VPNs block localhost

4. **Browser cache?**
   - Clear browser cache
   - Try incognito/private mode

5. **Different browser?**
   - Try Chrome, Firefox, Edge
   - Check if issue is browser-specific

---

## 💡 Quick Test

**Test if server is running:**
```powershell
# Check if port is listening
netstat -ano | findstr :5173
```

**If you see output, server is running!**

**If no output, server isn't running - start it with `npm run dev`**

---

## 📞 Need More Help?

**Check these files:**
- `client/package.json` - Verify scripts
- `client/vite.config.js` - Check port configuration
- Browser console (F12) - Check for errors

**Common terminal errors:**
- "Cannot find module" → Run `npm install`
- "Port in use" → Kill process or use different port
- "Permission denied" → Run as administrator

---

**Once server is running, refresh your browser!** 🔄
