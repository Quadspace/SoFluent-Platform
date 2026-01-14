# Download & Place Brand Kit Files - Step by Step Guide

## 🎯 Goal
Download brand kit from Google Drive and place files in correct locations for automatic application.

**Brand Kit:** https://drive.google.com/drive/folders/108UeI-Mr564Q05WOUT8SMKyFvARBj69q

---

## 📥 Step-by-Step Download Instructions

### Step 1: Access Google Drive
1. Open: https://drive.google.com/drive/folders/108UeI-Mr564Q05WOUT8SMKyFvARBj69q
2. You should see 5 folders:
   - `1 - Manual de Marca`
   - `2 - Logo`
   - `3 - Padrões e Grafismos`
   - `4 - Fontes`
   - `5 - Cartão de Visita`

### Step 2: Download Each Folder

**For each folder:**
1. Right-click on the folder
2. Select "Download" (or "Download folder")
3. Wait for download to complete
4. Extract ZIP file if needed

### Step 3: Organize Files

After downloading, you'll have folders like:
- `1 - Manual de Marca/`
- `2 - Logo/`
- `3 - Padrões e Grafismos/`
- `4 - Fontes/`
- `5 - Cartão de Visita/`

---

## 📁 Step 4: Place Files in Correct Locations

### A. Logo Files
**From:** `2 - Logo/` folder  
**To:** `client/src/assets/branding/logos/`

**What to place:**
- All `.svg` files (logo.svg, logo-dark.svg, logo-white.svg, etc.)
- All `.png` files (various sizes)
- `favicon.ico` or `.svg` for favicon

**Quick copy command (Windows PowerShell):**
```powershell
# Navigate to your Downloads folder where you extracted the brand kit
cd $env:USERPROFILE\Downloads

# Copy logo files (adjust folder name if different)
Copy-Item "2 - Logo\*" -Destination "C:\Users\MichaelSanders\SoFluent-Platform\client\src\assets\branding\logos\" -Recurse
```

### B. Font Files
**From:** `4 - Fontes/` folder  
**To:** `client/src/assets/branding/fonts/`

**What to place:**
- All font files (`.woff2`, `.woff`, `.ttf`, `.otf`)

**Quick copy command:**
```powershell
Copy-Item "4 - Fontes\*" -Destination "C:\Users\MichaelSanders\SoFluent-Platform\client\src\assets\branding\fonts\" -Recurse
```

### C. Patterns & Graphics
**From:** `3 - Padrões e Grafismos/` folder  
**To:** `client/src/assets/branding/patterns/`

**What to place:**
- All pattern files (`.svg`, `.png`)
- All graphic files

**Quick copy command:**
```powershell
Copy-Item "3 - Padrões e Grafismos\*" -Destination "C:\Users\MichaelSanders\SoFluent-Platform\client\src\assets\branding\patterns\" -Recurse
```

### D. Brand Manual
**From:** `1 - Manual de Marca/` folder  
**To:** `assets/branding/manual/`

**What to place:**
- Brand manual PDF file(s)

**Quick copy command:**
```powershell
Copy-Item "1 - Manual de Marca\*" -Destination "C:\Users\MichaelSanders\SoFluent-Platform\assets\branding\manual\" -Recurse
```

### E. Business Card Reference
**From:** `5 - Cartão de Visita/` folder  
**To:** `assets/branding/reference/`

**Quick copy command:**
```powershell
Copy-Item "5 - Cartão de Visita\*" -Destination "C:\Users\MichaelSanders\SoFluent-Platform\assets\branding\reference\" -Recurse
```

---

## 🚀 Step 5: Automated Script (Easier Option)

I've created a PowerShell script that will help organize files automatically. Run this after downloading:

```powershell
# Run this script from the SoFluent-Platform directory
.\organize-brand-kit.ps1
```

---

## ✅ Step 6: Verify Files Are Placed

After placing files, check these folders have content:

- ✅ `client/src/assets/branding/logos/` - Has logo files
- ✅ `client/src/assets/branding/fonts/` - Has font files  
- ✅ `client/src/assets/branding/patterns/` - Has pattern files
- ✅ `assets/branding/manual/` - Has brand manual PDF

---

## 🔧 Step 7: Tell Me When Ready

Once files are placed, tell me:
**"Brand kit files are ready"**

I will then:
1. ✅ Read brand manual PDF to extract exact specifications
2. ✅ Update all colors to match brand kit exactly
3. ✅ Install and apply brand fonts
4. ✅ Replace logos throughout the site
5. ✅ Apply patterns and graphics
6. ✅ Ensure 100% brand compliance

---

## 📋 Quick Checklist

- [ ] Downloaded `1 - Manual de Marca` folder
- [ ] Downloaded `2 - Logo` folder
- [ ] Downloaded `3 - Padrões e Grafismos` folder
- [ ] Downloaded `4 - Fontes` folder
- [ ] Downloaded `5 - Cartão de Visita` folder
- [ ] Extracted ZIP files if needed
- [ ] Copied logo files to `client/src/assets/branding/logos/`
- [ ] Copied font files to `client/src/assets/branding/fonts/`
- [ ] Copied patterns to `client/src/assets/branding/patterns/`
- [ ] Copied manual PDF to `assets/branding/manual/`
- [ ] Verified files are in correct locations
- [ ] Ready to tell me: "Brand kit files are ready"

---

## 🆘 Need Help?

If you have issues:
1. **Can't download:** Share screenshots or file names
2. **Files are different:** Tell me what files you have
3. **Need manual placement:** I can guide you step-by-step

**Once files are placed, I'll handle everything else automatically!**
