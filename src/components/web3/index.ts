// Web3 components index
// Centralized exports for OnchainKit integration

export { default as Web3Providers } from "../providers/Web3Providers";
export { default as WalletConnect } from "./WalletConnect";
export { default as TipCreator } from "./TipCreator";
export { MiniKitStatus, MiniKitWalletConnect } from "./MiniKitComponents";

// Re-export commonly used OnchainKit components
export {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";

export {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";

export {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";

// Re-export Web3 configuration
export * from "../../lib/web3";
