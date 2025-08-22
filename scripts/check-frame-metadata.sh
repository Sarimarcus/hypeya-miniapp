#!/bin/bash
# Frame metadata verification script

echo "🔍 Checking Frame Metadata Implementation..."
echo "============================================="

if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    exit 1
fi

# Source environment variables
source .env.local

echo "📋 Frame Metadata Configuration:"
echo "================================"
echo "Project Name: ${NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}"
echo "App URL: ${NEXT_PUBLIC_URL}"
echo "Hero Image: ${NEXT_PUBLIC_APP_HERO_IMAGE}"
echo "Splash Image: ${NEXT_PUBLIC_APP_SPLASH_IMAGE}"
echo "Background Color: ${NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR}"

echo ""
echo "🧪 Testing Frame Metadata..."
echo "============================"

if command -v curl >/dev/null 2>&1; then
    if curl -s -I http://localhost:3001 >/dev/null 2>&1; then
        echo "✅ Development server is running"

        # Check if metadata is in the HTML
        HTML_CONTENT=$(curl -s http://localhost:3001 2>/dev/null || true)

        if echo "$HTML_CONTENT" | grep -q "fc:frame"; then
            echo "✅ Frame metadata found in HTML!"
        else
            echo "⚠️  Frame metadata not detected in HTML"
        fi

        if echo "$HTML_CONTENT" | grep -q "Launch ${NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}"; then
            echo "✅ Launch button title configured correctly"
        else
            echo "⚠️  Launch button title not found"
        fi

    else
        echo "⚠️  Development server not accessible at http://localhost:3001"
        echo "   Start with: npm run dev"
    fi
else
    echo "⚠️  curl not available for testing"
fi

echo ""
echo "🔗 URLs to Test:"
echo "================"
echo "Local Demo: http://localhost:3001/frame-demo"
echo "Production: ${NEXT_PUBLIC_URL}/frame-demo"
echo ""
echo "🧪 Test Frame Integration:"
echo "=========================="
echo "1. Share your app URL on Farcaster"
echo "2. Open in Coinbase Wallet mobile app"
echo "3. Look for 'Launch ${NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}' button"
echo ""
echo "📚 Documentation:"
echo "================="
echo "MiniKit Docs: https://docs.coinbase.com/minikit"
echo "Frame Metadata: https://docs.farcaster.xyz/reference/frames/spec"
