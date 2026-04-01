#!/bin/bash
# VocabMaster Testing Dependencies Installation Script
# Run this script to install testing dependencies

echo "🚀 Installing VocabMaster Testing Dependencies..."
echo ""

# Check if npm is available
echo "📦 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

# Install Vitest and dependencies
echo ""
echo "📦 Installing Vitest and testing libraries..."
echo "This may take a few minutes..."

npm install --save-dev vitest @vitest/ui @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event --loglevel=info

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation completed!"
    echo ""
    echo "🧪 Running tests to verify setup..."
    npm test -- --run

    echo ""
    echo "🎉 Setup complete! You can now use:"
    echo "   npm test           - Run tests"
    echo "   npm run test:watch - Watch mode"
    echo "   npm run test:ui    - UI interface"
else
    echo ""
    echo "❌ Installation failed"
    echo ""
    echo "Please try manually:"
    echo "npm install --save-dev vitest @vitest/ui @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event"
    exit 1
fi
