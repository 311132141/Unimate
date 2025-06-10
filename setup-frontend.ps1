Write-Host "Installing frontend libraries..." -ForegroundColor Green

# Traditional frontend
Write-Host "Setting up traditional HTML/JS frontend..." -ForegroundColor Cyan
cd $PSScriptRoot\frontend
npm install

# Next.js frontend
Write-Host "`nSetting up Next.js frontend..." -ForegroundColor Cyan
cd $PSScriptRoot\unimate-kiosk
npm install

Write-Host "`nInstallation complete!" -ForegroundColor Green
Write-Host "You can now run the traditional frontend with: cd frontend && npm run dev"
Write-Host "Or run the Next.js frontend with: cd unimate-kiosk && npm run dev"
