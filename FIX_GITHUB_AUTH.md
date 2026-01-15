# 🔐 Fix GitHub Authentication

## Problem
Git is using the wrong GitHub account (`Quadspace`) but the repository belongs to `HeloisaSoFluent`.

## Solution Options

### Option 1: Use Personal Access Token (Recommended)

1. **Create Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Name: `SoFluent-Platform-Deploy`
   - Expiration: `90 days` (or `No expiration` for convenience)
   - Select scopes: ✅ **`repo`** (full control of private repositories)
   - Click **"Generate token"**
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push with Token:**
   ```powershell
   git push -u origin main
   ```
   - When prompted for username: Enter `HeloisaSoFluent`
   - When prompted for password: **Paste the token** (not your password!)

---

### Option 2: Update Git Credentials

**Clear old credentials:**
```powershell
git config --global --unset credential.helper
git credential-manager-core erase
```

**Or manually update:**
1. Go to: Windows Credential Manager
2. Search for: `github.com`
3. Remove old GitHub credentials
4. Try pushing again - it will prompt for new credentials

---

### Option 3: Use SSH (Most Secure)

1. **Generate SSH Key:**
   ```powershell
   ssh-keygen -t ed25519 -C "mike@quadspace.us"
   ```
   - Press Enter to accept default location
   - Optionally set a passphrase

2. **Copy Public Key:**
   ```powershell
   cat ~/.ssh/id_ed25519.pub
   ```
   Copy the output

3. **Add to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click **"New SSH key"**
   - Title: `SoFluent-Platform`
   - Paste the public key
   - Click **"Add SSH key"**

4. **Update Remote URL:**
   ```powershell
   git remote set-url origin git@github.com:HeloisaSoFluent/SoFluent-Platform.git
   ```

5. **Push:**
   ```powershell
   git push -u origin main
   ```

---

## Quick Fix (Try This First)

**Update remote URL to use SSH:**
```powershell
git remote set-url origin git@github.com:HeloisaSoFluent/SoFluent-Platform.git
git push -u origin main
```

**Or use HTTPS with token:**
```powershell
git remote set-url origin https://HeloisaSoFluent@github.com/HeloisaSoFluent/SoFluent-Platform.git
git push -u origin main
# When prompted, use Personal Access Token as password
```

---

## Verify Authentication

After fixing, verify:
```powershell
git remote -v
git push -u origin main
```

---

**Repository URL:** https://github.com/HeloisaSoFluent/SoFluent-Platform
