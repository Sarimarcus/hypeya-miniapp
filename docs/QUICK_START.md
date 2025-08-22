# Quick Start Guide

Get your HYPEYA miniapp running with MiniKit in 5 minutes!

## 1. Copy Environment Template

```bash
cp .env.example .env.local
```

## 2. Get Your Coinbase API Key

1. Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Create account or sign in
3. Create new project named "HYPEYA"
4. Generate Client API Key
5. Copy the key

## 3. Configure Environment

Edit `.env.local`:

```bash
# Required - Replace with your values
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME="HYPEYA"
NEXT_PUBLIC_URL="http://localhost:3000"  # or your domain
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your_api_key_here"

# WordPress (if you have it)
WP_API_USERNAME="your_username"
WP_API_KEY="your_app_password"
```

## 4. Validate Configuration

```bash
npm run check-env
```

## 5. Start Development

```bash
npm run dev
```

## 6. Test MiniKit

### In Browser:

- Visit `http://localhost:3000`
- Should show "Running as regular web app"

### In Coinbase Wallet:

- Open Coinbase Wallet mobile app
- Navigate to your deployed URL
- Should show "MiniKit Environment Detected"

## Next Steps

- Deploy to Vercel with production environment variables
- Test in Coinbase Wallet mobile app
- Read full guides in `docs/` folder

## Troubleshooting

**Can't find API key?**

- Visit [CDP Console](https://portal.cdp.coinbase.com/)
- Check "API Keys" section

**Environment validation fails?**

- Run `npm run check-env` for detailed info
- Check `docs/ENVIRONMENT_SETUP.md`

**MiniKit not detected?**

- Test in actual Coinbase Wallet app
- Ensure `NEXT_PUBLIC_URL` is correct
