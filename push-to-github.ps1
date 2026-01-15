# PowerShell script to push to GitHub
# Run this script after creating the repository on GitHub

Write-Host "🚀 So Fluent Platform - GitHub Deployment" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not a git repository. Run this from the project root." -ForegroundColor Red
    exit 1
}

# Check git status
Write-Host "📋 Checking git status..." -ForegroundColor Yellow
git status --short

# Check remote
Write-Host ""
Write-Host "🔗 Checking remote configuration..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null
if ($remote) {
    Write-Host "Current remote: $remote" -ForegroundColor Green
} else {
    Write-Host "No remote configured. Setting up..." -ForegroundColor Yellow
    git remote add origin https://github.com/HeloisaSoFluent/SoFluent-Platform.git
}

# Verify we have commits
Write-Host ""
Write-Host "📝 Checking commits..." -ForegroundColor Yellow
$lastCommit = git log -1 --oneline
Write-Host "Last commit: $lastCommit" -ForegroundColor Green

# Ask user if repository exists
Write-Host ""
Write-Host "⚠️  IMPORTANT: Make sure the repository exists on GitHub!" -ForegroundColor Yellow
Write-Host "   If not, create it at: https://github.com/HeloisaSoFluent" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Does the repository exist on GitHub? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host ""
    Write-Host "📖 Please create the repository first:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://github.com/HeloisaSoFluent" -ForegroundColor White
    Write-Host "   2. Click '+' → 'New repository'" -ForegroundColor White
    Write-Host "   3. Name: SoFluent-Platform" -ForegroundColor White
    Write-Host "   4. DO NOT initialize with README" -ForegroundColor White
    Write-Host "   5. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 0
}

# Push to GitHub
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "   Repository: https://github.com/HeloisaSoFluent/SoFluent-Platform" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Verify files on GitHub" -ForegroundColor White
    Write-Host "   2. Connect to Manus" -ForegroundColor White
    Write-Host "   3. Use MANUS_DEPLOYMENT_PROMPT.md" -ForegroundColor White
} catch {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Repository doesn't exist - Create it on GitHub first" -ForegroundColor White
    Write-Host "  2. Authentication failed - Use Personal Access Token" -ForegroundColor White
    Write-Host "  3. Permission denied - Check repository access" -ForegroundColor White
    Write-Host ""
    Write-Host "See GITHUB_DEPLOYMENT_GUIDE.md for detailed instructions." -ForegroundColor Cyan
    exit 1
}
