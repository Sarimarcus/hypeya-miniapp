// Author wallet utilities
// Helper functions for getting author crypto wallet addresses

import { Article } from "@/types/article";

/**
 * Get author wallet address with fallbacks
 * Priority: 1) Author's actual wallet, 2) Demo wallets from env, 3) undefined
 */
export function getAuthorWalletAddress(
  author: Article["author"]
): string | undefined {
  // TODO: When WordPress author profiles have wallet addresses
  // if (author.walletAddress) {
  //   return author.walletAddress;
  // }

  // Demo/fallback wallet addresses from environment
  const demoWallet = process.env.NEXT_PUBLIC_DEMO_AUTHOR_WALLET;
  const hypeYaTeamWallet = process.env.NEXT_PUBLIC_HYPEYA_TEAM_WALLET;

  // If author is Hypeya Team, use team wallet
  if (author.name?.toLowerCase().includes("hypeya")) {
    return hypeYaTeamWallet || demoWallet;
  }

  // For other authors, use demo wallet for testing
  return demoWallet;
}

/**
 * Check if tipping is available for an author
 */
export function isTippingAvailable(author: Article["author"]): boolean {
  return !!getAuthorWalletAddress(author);
}

/**
 * Get display name for tipping
 */
export function getTippingDisplayName(author: Article["author"]): string {
  return author.name || "Author";
}

/**
 * Validate wallet address format
 */
export function isValidWalletAddress(
  address: string | undefined
): address is string {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get author wallet with validation
 */
export function getValidatedAuthorWallet(
  author: Article["author"]
): string | undefined {
  const address = getAuthorWalletAddress(author);
  return isValidWalletAddress(address) ? address : undefined;
}

// Demo wallet addresses for reference
export const DEMO_WALLETS = {
  DEFAULT_AUTHOR: process.env.NEXT_PUBLIC_DEMO_AUTHOR_WALLET,
  HYPEYA_TEAM: process.env.NEXT_PUBLIC_HYPEYA_TEAM_WALLET,
} as const;
