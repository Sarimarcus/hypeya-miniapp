// Web3 configuration for HYPEYA mini-app
// OnchainKit + Wagmi setup for Base network integration

import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

// Environment-based chain selection
const isDevelopment = process.env.NODE_ENV === "development";

// Configure supported chains
export const chains = [
  base, // Base mainnet for production
  baseSepolia, // Base testnet for development
] as const;

// Main chain configuration
export const mainChain = isDevelopment ? baseSepolia : base;

// Wagmi configuration
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "HYPEYA",
      appLogoUrl: "/icon-192x192.png",
      preference: "smartWalletOnly", // Use smart wallets for better UX
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true, // Enable SSR support for Next.js
});

// OnchainKit configuration
export const onchainKitConfig = {
  apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
  chain: mainChain,
  schemaId: process.env.NEXT_PUBLIC_ONCHAINKIT_SCHEMA_ID,
};

// Contract addresses (when we deploy contracts)
export const CONTRACTS = {
  // Premium content NFT contract
  premiumContent: {
    [base.id]: process.env.NEXT_PUBLIC_PREMIUM_CONTENT_CONTRACT_BASE,
    [baseSepolia.id]: process.env.NEXT_PUBLIC_PREMIUM_CONTENT_CONTRACT_SEPOLIA,
  },
  // Creator rewards token contract
  rewardsToken: {
    [base.id]: process.env.NEXT_PUBLIC_REWARDS_TOKEN_CONTRACT_BASE,
    [baseSepolia.id]: process.env.NEXT_PUBLIC_REWARDS_TOKEN_CONTRACT_SEPOLIA,
  },
} as const;

// Web3 feature flags
export const FEATURES = {
  premiumContent: true, // Token-gated premium articles
  creatorRewards: true, // Tip creators with crypto
  nftArticles: false, // Articles as NFTs (future)
  socialPayments: true, // Social tipping
  walletConnect: true, // Wallet connection
} as const;

// Default token addresses for payments
export const TOKENS = {
  USDC: {
    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
    [baseSepolia.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base Sepolia
  },
  ETH: "native", // Native ETH
} as const;

// Payment configuration
export const PAYMENT_CONFIG = {
  defaultToken: "USDC",
  premiumArticlePrice: "2", // $2 USDC
  tipAmounts: ["0.5", "1", "2", "5"], // Preset tip amounts in USDC
  minimumTip: "0.1",
} as const;

// Demo author wallets for testing
export const DEMO_AUTHOR_WALLETS = {
  DEFAULT_AUTHOR: process.env.NEXT_PUBLIC_DEMO_AUTHOR_WALLET,
  HYPEYA_TEAM: process.env.NEXT_PUBLIC_HYPEYA_TEAM_WALLET,
} as const;

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
