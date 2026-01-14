# Quick Brand Kit Setup - 3 Steps

## 🚀 Fastest Way to Apply Brand Kit

### Step 1: Download from Google Drive
1. Go to: https://drive.google.com/drive/folders/108UeI-Mr564Q05WOUT8SMKyFvARBj69q
2. Download all 5 folders (they'll download as ZIP files)
3. Extract ZIP files to your Downloads folder

### Step 2: Run Organization Script
Open PowerShell in the SoFluent-Platform directory and run:

```powershell
.\organize-brand-kit.ps1
```

The script will:
- ✅ Find your downloaded brand kit folders
- ✅ Copy logo files to correct location
- ✅ Copy font files to correct location
- ✅ Copy patterns to correct location
- ✅ Copy brand manual to correct location

### Step 3: Tell Me When Ready
Once the script completes, tell me:
**"Brand kit files are ready"**

I will then automatically:
1. Extract brand colors from manual PDF
2. Update all CSS with correct colors
3. Install and apply brand fonts
4. Replace logos throughout the site
5. Apply patterns and graphics
6. Ensure 100% brand compliance

---

## 📋 Manual Alternative

If the script doesn't work, manually copy files:

**From Downloads folder:**
- `2 - Logo/*` → `client/src/assets/branding/logos/`
- `4 - Fontes/*` → `client/src/assets/branding/fonts/`
- `3 - Padrões e Grafismos/*` → `client/src/assets/branding/patterns/`
- `1 - Manual de Marca/*` → `assets/branding/manual/`

Then tell me: **"Brand kit files are ready"**

---

**That's it! The script does the hard work, then I'll apply everything automatically.**
