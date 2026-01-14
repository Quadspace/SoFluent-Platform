# So Fluent Brand Kit Organization Script
# This script helps organize downloaded brand kit files

Write-Host "So Fluent Brand Kit Organizer" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "client\src\assets\branding")) {
    Write-Host "Error: Please run this script from the SoFluent-Platform root directory" -ForegroundColor Red
    exit 1
}

# Ask user where they downloaded the brand kit
Write-Host "Where did you download the brand kit files?" -ForegroundColor Yellow
Write-Host "1. Downloads folder (default)"
Write-Host "2. Desktop"
Write-Host "3. Custom path"
$location = Read-Host "Enter choice (1-3) or press Enter for default"

$downloadPath = switch ($location) {
    "2" { "$env:USERPROFILE\Desktop" }
    "3" { Read-Host "Enter full path to downloaded files" }
    default { "$env:USERPROFILE\Downloads" }
}

Write-Host ""
Write-Host "Looking for brand kit folders in: $downloadPath" -ForegroundColor Yellow

# Find brand kit folders
$logoFolder = Get-ChildItem -Path $downloadPath -Directory -Filter "*Logo*" -ErrorAction SilentlyContinue | Select-Object -First 1
$fontFolder = Get-ChildItem -Path $downloadPath -Directory -Filter "*Font*" -ErrorAction SilentlyContinue | Select-Object -First 1
$patternFolder = Get-ChildItem -Path $downloadPath -Directory -Filter "*Padr*" -ErrorAction SilentlyContinue | Select-Object -First 1
$manualFolder = Get-ChildItem -Path $downloadPath -Directory -Filter "*Manual*" -ErrorAction SilentlyContinue | Select-Object -First 1

# Copy Logo Files
if ($logoFolder) {
    Write-Host "Found Logo folder: $($logoFolder.FullName)" -ForegroundColor Green
    $logoDest = "client\src\assets\branding\logos"
    New-Item -ItemType Directory -Force -Path $logoDest | Out-Null
    Copy-Item "$($logoFolder.FullName)\*" -Destination $logoDest -Recurse -Force
    Write-Host "✓ Logo files copied to $logoDest" -ForegroundColor Green
} else {
    Write-Host "⚠ Logo folder not found. Please place logo files manually in: client\src\assets\branding\logos\" -ForegroundColor Yellow
}

# Copy Font Files
if ($fontFolder) {
    Write-Host "Found Fontes folder: $($fontFolder.FullName)" -ForegroundColor Green
    $fontDest = "client\src\assets\branding\fonts"
    New-Item -ItemType Directory -Force -Path $fontDest | Out-Null
    Copy-Item "$($fontFolder.FullName)\*" -Destination $fontDest -Recurse -Force
    Write-Host "✓ Font files copied to $fontDest" -ForegroundColor Green
} else {
    Write-Host "⚠ Fontes folder not found. Please place font files manually in: client\src\assets\branding\fonts\" -ForegroundColor Yellow
}

# Copy Pattern Files
if ($patternFolder) {
    Write-Host "Found Padrões e Grafismos folder: $($patternFolder.FullName)" -ForegroundColor Green
    $patternDest = "client\src\assets\branding\patterns"
    New-Item -ItemType Directory -Force -Path $patternDest | Out-Null
    Copy-Item "$($patternFolder.FullName)\*" -Destination $patternDest -Recurse -Force
    Write-Host "✓ Pattern files copied to $patternDest" -ForegroundColor Green
} else {
    Write-Host "⚠ Padrões e Grafismos folder not found. Please place pattern files manually in: client\src\assets\branding\patterns\" -ForegroundColor Yellow
}

# Copy Manual PDF
if ($manualFolder) {
    Write-Host "Found Manual de Marca folder: $($manualFolder.FullName)" -ForegroundColor Green
    $manualDest = "assets\branding\manual"
    New-Item -ItemType Directory -Force -Path $manualDest | Out-Null
    Copy-Item "$($manualFolder.FullName)\*" -Destination $manualDest -Recurse -Force
    Write-Host "✓ Manual files copied to $manualDest" -ForegroundColor Green
} else {
    Write-Host "⚠ Manual de Marca folder not found. Please place manual PDF manually in: assets\branding\manual\" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Brand kit organization complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify files are in correct locations"
Write-Host "2. Tell me: 'Brand kit files are ready'"
Write-Host "3. I'll extract specifications and apply brand kit automatically"
Write-Host ""

# List what was found
Write-Host "Files found:" -ForegroundColor Cyan
if ($logoFolder) {
    $logoFiles = Get-ChildItem -Path "client\src\assets\branding\logos" -File | Select-Object -ExpandProperty Name
    Write-Host "  Logos: $($logoFiles.Count) files" -ForegroundColor White
}
if ($fontFolder) {
    $fontFiles = Get-ChildItem -Path "client\src\assets\branding\fonts" -File | Select-Object -ExpandProperty Name
    Write-Host "  Fonts: $($fontFiles.Count) files" -ForegroundColor White
}
if ($patternFolder) {
    $patternFiles = Get-ChildItem -Path "client\src\assets\branding\patterns" -File -Recurse | Select-Object -ExpandProperty Name
    Write-Host "  Patterns: $($patternFiles.Count) files" -ForegroundColor White
}
if ($manualFolder) {
    $manualFiles = Get-ChildItem -Path "assets\branding\manual" -File | Select-Object -ExpandProperty Name
    Write-Host "  Manual: $($manualFiles.Count) files" -ForegroundColor White
}
