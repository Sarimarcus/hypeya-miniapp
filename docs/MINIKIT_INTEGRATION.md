# MiniKit Integration Guide

This guide explains how to use Coinbase's MiniKit in your HYPEYA mini-app.

## What is MiniKit?

MiniKit is Coinbase's framework for building mini-applications that run within the Coinbase Wallet app. It provides:

- **Seamless Wallet Integration**: No manual wallet connection required
- **Enhanced UX**: Native mobile experience within Coinbase Wallet
- **Direct Payments**: Simplified crypto transactions
- **Device Access**: Camera, contacts, and other device features

## Implementation

### 1. Hybrid Provider Setup

The app automatically detects the environment and uses the appropriate provider:

```tsx
// Automatic detection and provider selection
import { Web3Providers } from '@/components/web3';

function App() {
  return (
    <Web3Providers>
      <YourApp />
    </Web3Providers>
  );
}
```

### 2. Environment Detection

Use the `useMiniKit` hook to detect and respond to the MiniKit environment:

```tsx
import { useMiniKit, useMiniKitAPI } from '@/hooks/useMiniKit';

function MyComponent() {
  const isMiniKit = useMiniKit();
  const { isReady, minikit, coinbaseWallet } = useMiniKitAPI();

  if (isMiniKit) {
    return <MiniKitSpecificUI />;
  }

  return <RegularWebUI />;
}
```

### 3. Status Components

Display MiniKit status to users:

```tsx
import { MiniKitStatus, MiniKitWalletConnect } from '@/components/web3';

function Dashboard() {
  return (
    <div>
      <MiniKitStatus />
      <MiniKitWalletConnect />
    </div>
  );
}
```

## Key Features

### Automatic Provider Switching

- **MiniKit Environment**: Uses `MiniKitProvider` for enhanced integration
- **Regular Web**: Uses standard `OnchainKitProvider` with wallet connection
- **Seamless Transition**: Same components work in both environments

### Enhanced Wallet Integration

```tsx
// Wallet connection is automatic in MiniKit
function WalletSection() {
  const { isMiniKit, isReady } = useMiniKitAPI();

  if (isMiniKit && isReady) {
    // User is already connected via MiniKit
    return <ConnectedInterface />;
  }

  // Show regular wallet connection
  return <ConnectWallet />;
}
```

### Environment-Specific Features

```tsx
function FeatureComponent() {
  const { isMiniKit, minikit } = useMiniKitAPI();

  const handlePayment = () => {
    if (isMiniKit && minikit) {
      // Use MiniKit's enhanced payment flow
      minikit.payment.send({ ... });
    } else {
      // Use regular Web3 transaction
      // ... standard transaction logic
    }
  };

  return (
    <button onClick={handlePayment}>
      {isMiniKit ? 'Pay with MiniKit' : 'Connect & Pay'}
    </button>
  );
}
```

## Development Testing

### Local Development

1. **Regular Browser**: App runs with standard OnchainKit
2. **Coinbase Wallet**: Open the app URL in Coinbase Wallet's built-in browser

### Environment Detection

The system detects MiniKit through:

- `window.coinbaseWallet` presence
- `window.minikit` API availability
- User-Agent containing "CoinbaseWallet"
- Parent window context (iframe detection)

### Debug Information

Use `MiniKitStatus` component to see current environment details:

```tsx
<MiniKitStatus />
```

This shows:
- Environment type (MiniKit vs regular web)
- API availability status
- Connection readiness

## Deployment Considerations

### Web Manifest

Ensure your `manifest.json` supports MiniKit integration:

```json
{
  "name": "HYPEYA",
  "short_name": "HYPEYA",
  "display": "standalone",
  "start_url": "/",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### URL Configuration

MiniKit apps should work with both:
- Direct web access: `https://yourdomain.com`
- MiniKit integration: Embedded within Coinbase Wallet

### Performance

- **SSR Safe**: Components handle server-side rendering
- **Dynamic Loading**: Web3 providers load only when needed
- **Efficient Detection**: Minimal overhead for environment detection

## Best Practices

1. **Progressive Enhancement**: Always provide fallbacks for non-MiniKit environments
2. **User Communication**: Clearly indicate MiniKit-specific features
3. **Error Handling**: Handle cases where MiniKit APIs might be unavailable
4. **Testing**: Test in both regular browsers and Coinbase Wallet

## API Reference

### Hooks

- `useMiniKit()`: Returns boolean indicating MiniKit environment
- `useMiniKitAPI()`: Returns detailed MiniKit state and APIs

### Components

- `MiniKitStatus`: Shows current environment status
- `MiniKitWalletConnect`: Environment-aware wallet connection
- `Web3Providers`: Automatic provider selection

### Types

```typescript
interface MiniKitAPI {
  isMiniKit: boolean;
  isReady: boolean;
  minikit: unknown | null;
  coinbaseWallet: unknown | null;
}
```
