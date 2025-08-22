#!/bin/bash
# Environment validation script for HYPEYA miniapp

echo "🔍 Checking HYPEYA Environment Configuration..."
echo "=================================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "   Run: cp .env.example .env.local"
    exit 1
fi

echo "✅ .env.local file found"

# Load environment variables
source .env.local

# Required variables
REQUIRED_VARS=(
    "NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME"
    "NEXT_PUBLIC_URL"
    "NEXT_PUBLIC_ONCHAINKIT_API_KEY"
)

# Optional but recommended variables
OPTIONAL_VARS=(
    "FARCASTER_HEADER"
    "FARCASTER_PAYLOAD"
    "FARCASTER_SIGNATURE"
    "WP_API_USERNAME"
    "WP_API_KEY"
)

echo ""
echo "📋 Required Variables:"
echo "====================="

all_required_set=true
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var - NOT SET"
        all_required_set=false
    else
        # Mask sensitive values
        if [[ $var == *"API_KEY"* ]]; then
            masked_value="${!var:0:8}...${!var: -4}"
            echo "✅ $var - $masked_value"
        else
            echo "✅ $var - ${!var}"
        fi
    fi
done

echo ""
echo "📋 Optional Variables:"
echo "====================="

for var in "${OPTIONAL_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "⚠️  $var - NOT SET"
    else
        if [[ $var == *"API_KEY"* ]] || [[ $var == *"KEY"* ]]; then
            masked_value="${!var:0:4}...${!var: -4}"
            echo "✅ $var - $masked_value"
        else
            echo "✅ $var - ${!var}"
        fi
    fi
done

echo ""
echo "🎯 Configuration Summary:"
echo "========================"

if [ "$all_required_set" = true ]; then
    echo "✅ All required variables are set!"
    echo "🚀 Ready to run: npm run dev"
else
    echo "❌ Some required variables are missing!"
    echo "📖 See docs/ENVIRONMENT_SETUP.md for help"
    exit 1
fi

echo ""
echo "🔗 Useful Commands:"
echo "=================="
echo "Start development: npm run dev"
echo "Type checking:     npm run typecheck"
echo "Linting:          npm run lint"
echo "Build:            npm run build"

echo ""
echo "📚 Documentation:"
echo "================="
echo "Environment Setup: docs/ENVIRONMENT_SETUP.md"
echo "MiniKit Guide:     docs/MINIKIT_INTEGRATION.md"
echo "OnchainKit Guide:  docs/ONCHAINKIT_INTEGRATION.md"
