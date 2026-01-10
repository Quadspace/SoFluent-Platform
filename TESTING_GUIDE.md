# Testing Guide - Admin Dashboard

## 🚨 IF TESTING ISN'T WORKING

### Step 1: Check Server Status
```bash
# Make sure the dev server is running
cd client
npm run dev
```

You should see:
```
VITE v6.1.0  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any red errors
4. Share the error messages with me

### Step 3: Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for failed requests (red)
5. Check if files are loading

### Step 4: Clear Cache
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or clear browser cache

### Step 5: Check URL
Make sure you're going to:
- **Frontend:** http://localhost:5173
- **Dashboard:** http://localhost:5173/educator

---

## ✅ WHAT SHOULD WORK

### Dashboard Page (`/educator`)
- ✅ Should load without errors
- ✅ Should show 4 metric cards
- ✅ Should show Quick Actions
- ✅ Should show Upcoming Classes widget
- ✅ Should show Revenue Chart
- ✅ Should show Recent Activity feed
- ✅ Should work even without backend (uses mock data)

### Components Created
- ✅ `QuickActions` - 6 action buttons
- ✅ `UpcomingClasses` - Today's classes
- ✅ `RecentActivity` - Activity feed
- ✅ `RevenueChart` - 30-day chart
- ✅ `MetricCard` - Reusable metric display

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: Blank Page
**Fix:** 
- Check browser console for errors
- Make sure server is running
- Try hard refresh (Ctrl+Shift+R)

### Issue 2: Components Not Showing
**Fix:**
- Check if imports are correct
- Check browser console for import errors
- Verify files exist in `client/src/components/admin/`

### Issue 3: Styling Issues
**Fix:**
- Make sure Tailwind CSS is configured
- Check if `sofluent-pink` and `sofluent-accent` colors are defined
- Verify `tailwind.config.js` has the colors

### Issue 4: Icons Not Showing
**Fix:**
- Verify `lucide-react` is installed: `npm list lucide-react`
- Check if icons are imported correctly

---

## 🔍 DEBUGGING STEPS

1. **Check if server is running:**
   ```bash
   # Should show node processes
   Get-Process -Name node
   ```

2. **Check if port 5173 is listening:**
   ```bash
   netstat -ano | findstr ":5173"
   ```

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors
   - Check Network tab for failed requests

4. **Check file structure:**
   ```
   client/src/components/admin/
   ├── QuickActions.jsx ✅
   ├── UpcomingClasses.jsx ✅
   ├── RecentActivity.jsx ✅
   ├── RevenueChart.jsx ✅
   └── MetricCard.jsx ✅
   ```

5. **Verify imports:**
   - All components should import from correct paths
   - Check if `lucide-react` is installed
   - Check if `framer-motion` is installed

---

## 📝 WHAT TO REPORT

If testing still isn't working, please share:

1. **Browser Console Errors:**
   - Copy/paste any red error messages

2. **Network Tab:**
   - Any failed requests (red)
   - Status codes

3. **What You See:**
   - Blank page?
   - Error message?
   - Partial load?

4. **Server Status:**
   - Is `npm run dev` running?
   - Any errors in terminal?

---

## 🚀 QUICK FIXES

### Restart Everything:
```bash
# Stop all node processes
Get-Process -Name node | Stop-Process -Force

# Restart server
cd client
npm run dev
```

### Reinstall Dependencies:
```bash
cd client
rm -rf node_modules
npm install
npm run dev
```

### Check Dependencies:
```bash
cd client
npm list lucide-react framer-motion
```

---

## ✅ EXPECTED BEHAVIOR

When you open `http://localhost:5173/educator`:

1. **Page loads** (no blank screen)
2. **Shows dashboard** with:
   - Header: "Dashboard Overview"
   - 4 metric cards (Students, Revenue, Classes, Rating)
   - Quick Actions section (6 buttons)
   - Upcoming Classes widget (3 classes)
   - Revenue Chart (bar chart)
   - Recent Activity feed (6 activities)
3. **All components render** (no errors)
4. **Mock data displays** (works without backend)

---

**If you're still having issues, share the specific error message and I'll fix it immediately!** 🚀
