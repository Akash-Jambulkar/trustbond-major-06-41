
import { NETWORK_IDS, NetworkType } from './types';

// Contract addresses
export const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  TRUST_SCORE: "0x5FbDB2315678afecb367f032d93F642f64180aa4",
  LOAN_MANAGER: "0x5FbDB2315678afecb367f032d93F642f64180aa5",
};

// Get human-readable network name
export const getNetworkName = (networkId: number | null): string => {
  if (!networkId) return "Not Connected";
  
  switch (networkId) {
    case NETWORK_IDS.MAINNET:
      return "Ethereum Mainnet";
    case NETWORK_IDS.GOERLI:
      return "Goerli Testnet";
    case NETWORK_IDS.GANACHE:
    case NETWORK_IDS.LOCALHOST:
      return "Ganache Local";
    default:
      return `Unknown Network (ID: ${networkId})`;
  }
};

// Get network type
export const getNetworkType = (networkId: number | null): NetworkType => {
  if (!networkId) return "unknown";
  
  switch (networkId) {
    case NETWORK_IDS.MAINNET:
      return "mainnet";
    case NETWORK_IDS.GOERLI:
      return "testnet";
    case NETWORK_IDS.GANACHE:
    case NETWORK_IDS.LOCALHOST:
      return "local";
    default:
      return "unknown";
  }
};

// Check if network is supported
export const isNetworkSupported = (networkId: number | null): boolean => {
  if (!networkId) return false;
  
  const supportedNetworks = [
    NETWORK_IDS.MAINNET,
    NETWORK_IDS.GOERLI,
    NETWORK_IDS.GANACHE,
    NETWORK_IDS.LOCALHOST
  ];
  
  return supportedNetworks.includes(networkId);
};
