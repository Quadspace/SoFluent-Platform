# 🔐 Setup GitHub for HeloisaSoFluent

## Current Status
- ✅ Repository created: https://github.com/HeloisaSoFluent/SoFluent-Platform
- ✅ Git config updated: HeloisaSoFluent / heloisa@sofluent.com
- ⚠️ Authentication issue: Windows is using cached Quadspace credentials

## Solution: Use Personal Access Token

### Step 1: Create Personal Access Token

1. **Sign in to GitHub as HeloisaSoFluent:**
   - Go to: https://github.com/login
   - Sign in with HeloisaSoFluent account

2. **Create Token:**
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - **Note:** `SoFluent-Platform-Deploy`
   - **Expiration:** 90 days (or No expiration)
   - **Select scopes:** ✅ **`repo`** (Full control of private repositories)
   - Click **"Generate token"**
   - **⚠️ COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2: Clear Old Credentials

**Option A: Use Windows Credential Manager (GUI)**
1. Press `Windows Key` + `R`
2. Type: `control /name Microsoft.CredentialManager`
3. Click **"Windows Credentials"**
4. Find entries with `github.com` or `Quadspace`
5. Click each one → **"Remove"**

**Option B: Use Command Line**
```powershell
# List all GitHub credentials
cmdkey /list | Select-String -Pattern "github"

# Delete each one (replace TARGET_NAME with actual target)
cmdkey /delete:"TARGET_NAME"
```

### Step 3: Push Code

**Run the push script:**
```powershell
.\push-heloisa-repo.ps1
```

**Or push manually:**
```powershell
git push -u origin main
```

**When prompted:**
- **Username:** `HeloisaSoFluent`
- **Password:** **Paste your Personal Access Token** (not your GitHub password!)

---

## Alternative: Use SSH (More Secure)

### Step 1: Generate SSH Key
```powershell
ssh-keygen -t ed25519 -C "heloisa@sofluent.com"
```
- Press Enter for default location
- Optionally set a passphrase

### Step 2: Copy Public Key
```powershell
cat ~/.ssh/id_ed25519.pub
```
Copy the entire output

### Step 3: Add to GitHub
1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. **Title:** `SoFluent-Platform`
4. **Key:** Paste the public key
5. Click **"Add SSH key"**

**Note:** Git config is set to:
- **Name:** HeloisaSoFluent
- **Email:** heloisa@sofluent.ai

### Step 4: Update Remote and Push
```powershell
git remote set-url origin git@github.com:HeloisaSoFluent/SoFluent-Platform.git
git push -u origin main
```

---

## Verify Success

After pushing, verify:
```powershell
git remote -v
git log --oneline -1
```

Then check: https://github.com/HeloisaSoFluent/SoFluent-Platform

You should see all your files!

---

## Troubleshooting

**Still getting "Permission denied to Quadspace"?**
- Clear ALL GitHub credentials from Windows Credential Manager
- Restart PowerShell/terminal
- Try pushing again

**Token not working?**
- Make sure token has `repo` scope
- Check token hasn't expired
- Try creating a new token

**Need help?**
- GitHub Docs: https://docs.github.com/en/authentication
- Token Guide: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
