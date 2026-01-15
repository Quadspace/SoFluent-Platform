# Push to HeloisaSoFluent Repository
# This script will prompt for HeloisaSoFluent GitHub credentials

Write-Host "`n🚀 Pushing SoFluent Platform to HeloisaSoFluent GitHub`n" -ForegroundColor Cyan

# Verify repository config
Write-Host "Repository: " -NoNewline
git remote get-url origin
Write-Host "Git User: " -NoNewline
git config user.name
Write-Host "Git Email: " -NoNewline
git config user.email
Write-Host ""
Write-Host "Expected: HeloisaSoFluent / heloisa@sofluent.ai" -ForegroundColor Cyan
Write-Host ""

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "When prompted:" -ForegroundColor Yellow
Write-Host "  Username: HeloisaSoFluent" -ForegroundColor White
Write-Host "  Password: Use Personal Access Token (not password)" -ForegroundColor White
Write-Host "  Get token: https://github.com/settings/tokens`n" -ForegroundColor White

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!`n" -ForegroundColor Green
    Write-Host "Repository: https://github.com/HeloisaSoFluent/SoFluent-Platform`n" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Push failed. Please check credentials.`n" -ForegroundColor Red
    Write-Host "If you need a Personal Access Token:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Generate new token (classic)" -ForegroundColor White
    Write-Host "  3. Select 'repo' scope" -ForegroundColor White
    Write-Host "  4. Copy token and use as password when prompted`n" -ForegroundColor White
}
