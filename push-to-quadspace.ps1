# Push to Quadspace GitHub Account
# Then fork to HeloisaSoFluent

Write-Host "`n🚀 Pushing SoFluent Platform to Quadspace GitHub`n" -ForegroundColor Cyan

# Verify repository config
Write-Host "Repository: " -NoNewline
git remote get-url origin
Write-Host "Git User: " -NoNewline
git config user.name
Write-Host "Git Email: " -NoNewline
git config user.email
Write-Host ""

# Check if repository exists
Write-Host "Checking repository status..." -ForegroundColor Yellow
git ls-remote origin 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n⚠️  Repository doesn't exist on GitHub yet!`n" -ForegroundColor Yellow
    Write-Host "Please create it first:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "  2. Repository name: SoFluent-Platform" -ForegroundColor White
    Write-Host "  3. Description: So Fluent Platform - 100% Manus Ready" -ForegroundColor White
    Write-Host "  4. Visibility: Private (recommended) or Public" -ForegroundColor White
    Write-Host "  5. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
    Write-Host "  6. Click 'Create repository'" -ForegroundColor White
    Write-Host "`nThen run this script again.`n" -ForegroundColor Yellow
    exit 1
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to Quadspace GitHub!`n" -ForegroundColor Green
    Write-Host "Repository: https://github.com/Quadspace/SoFluent-Platform`n" -ForegroundColor Cyan
    Write-Host "Next step: Fork to HeloisaSoFluent" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://github.com/Quadspace/SoFluent-Platform" -ForegroundColor White
    Write-Host "  2. Click 'Fork' (top right)" -ForegroundColor White
    Write-Host "  3. Select 'HeloisaSoFluent' as the owner" -ForegroundColor White
    Write-Host "  4. Click 'Create fork'`n" -ForegroundColor White
} else {
    Write-Host "`n❌ Push failed. Please check:" -ForegroundColor Red
    Write-Host "  - Repository exists: https://github.com/Quadspace/SoFluent-Platform" -ForegroundColor White
    Write-Host "  - You have push access" -ForegroundColor White
    Write-Host "  - Authentication credentials are correct`n" -ForegroundColor White
}
