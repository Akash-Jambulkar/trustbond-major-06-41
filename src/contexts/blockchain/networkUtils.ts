
import { NetworkName } from "./types";
import { NETWORK_IDS } from "@/contexts/blockchain/types";

// Map network IDs to names
export const getNetworkName = (networkId?: number): NetworkName => {
  if (!networkId) return "Unknown";
  
  switch (networkId) {
    case NETWORK_IDS.MAINNET:
      return "Ethereum Mainnet";
    case NETWORK_IDS.GOERLI:
      return "Goerli Testnet";
    case NETWORK_IDS.SEPOLIA:
      return "Sepolia Testnet";
    case NETWORK_IDS.GANACHE:
    case NETWORK_IDS.LOCALHOST:
      return "Local Network";
    // Handle legacy networks that might appear in old code
    case 3: // ROPSTEN (deprecated)
      return "Ropsten Testnet (Deprecated)";
    case 4: // RINKEBY (deprecated)
      return "Rinkeby Testnet (Deprecated)";
    case 42: // KOVAN (deprecated)
      return "Kovan Testnet (Deprecated)";
    default:
      return "Unknown Network";
  }
};

// Determine if a network is supported for the application
export const isSupportedNetwork = (networkId?: number): boolean => {
  if (!networkId) return false;
  
  return [
    NETWORK_IDS.MAINNET,
    NETWORK_IDS.GOERLI,
    NETWORK_IDS.SEPOLIA,
    NETWORK_IDS.GANACHE,
    NETWORK_IDS.LOCALHOST
  ].includes(networkId);
};

// Get the chain ID to switch to for development
export const getPreferredDevChainId = (): number => {
  return NETWORK_IDS.GANACHE;
};

// Format chain ID for MetaMask
export const formatChainIdForMetaMask = (chainId: number): string => {
  return `0x${chainId.toString(16)}`;
};
