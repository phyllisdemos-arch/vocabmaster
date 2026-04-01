# VocabMaster Testing Dependencies Installation Script
# Run this script in PowerShell to install testing dependencies

Write-Host "🚀 Installing VocabMaster Testing Dependencies..." -ForegroundColor Green
Write-Host ""

# Check if npm is available
Write-Host "📦 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install Vitest and dependencies
Write-Host ""
Write-Host "📦 Installing Vitest and testing libraries..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan

try {
    npm install --save-dev vitest @vitest/ui @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event --loglevel=info

    Write-Host ""
    Write-Host "✅ Installation completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🧪 Running tests to verify setup..." -ForegroundColor Yellow

    # Run tests
    npm test -- --run

    Write-Host ""
    Write-Host "🎉 Setup complete! You can now use:" -ForegroundColor Green
    Write-Host "   npm test           - Run tests" -ForegroundColor Cyan
    Write-Host "   npm run test:watch - Watch mode" -ForegroundColor Cyan
    Write-Host "   npm run test:ui    - UI interface" -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "❌ Installation failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please try manually:" -ForegroundColor Yellow
    Write-Host "npm install --save-dev vitest @vitest/ui @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event" -ForegroundColor Cyan
    exit 1
}
