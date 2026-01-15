# 📦 Push to Quadspace → Fork to HeloisaSoFluent

## Step 1: Create Repository on Your Quadspace Account

1. **Go to:** https://github.com/new
2. **Repository name:** `SoFluent-Platform`
3. **Description:** `So Fluent Platform - 100% Manus Ready`
4. **Visibility:** Private (recommended) or Public
5. **⚠️ IMPORTANT:** Do NOT initialize with README, .gitignore, or license
6. **Click:** "Create repository"

## Step 2: Push to Your Account

**Run the push script:**
```powershell
.\push-to-quadspace.ps1
```

**Or manually:**
```powershell
git push -u origin main
```

**When prompted:**
- Username: `Quadspace`
- Password: Your Personal Access Token (or password if 2FA is disabled)

## Step 3: Fork to HeloisaSoFluent

1. **Go to:** https://github.com/Quadspace/SoFluent-Platform
2. **Click:** "Fork" button (top right)
3. **Owner:** Select `HeloisaSoFluent`
4. **Repository name:** `SoFluent-Platform` (or keep default)
5. **Click:** "Create fork"

## Step 4: Transfer Ownership (Optional)

If you want to transfer full ownership instead of forking:

1. **Go to:** https://github.com/Quadspace/SoFluent-Platform/settings
2. Scroll down to **"Danger Zone"**
3. Click **"Transfer ownership"**
4. Enter: `HeloisaSoFluent`
5. Type repository name to confirm
6. Click **"I understand, transfer this repository"**

---

## Current Configuration

- **Remote:** https://github.com/Quadspace/SoFluent-Platform.git
- **Git User:** Quadspace
- **Git Email:** mike@quadspace.us

---

## Quick Commands

**Check status:**
```powershell
git remote -v
git status
```

**Push:**
```powershell
.\push-to-quadspace.ps1
```

**After forking, update Heloisa's local repo:**
```powershell
git remote set-url origin https://github.com/HeloisaSoFluent/SoFluent-Platform.git
git config user.name "HeloisaSoFluent"
git config user.email "heloisa@sofluent.ai"
```
