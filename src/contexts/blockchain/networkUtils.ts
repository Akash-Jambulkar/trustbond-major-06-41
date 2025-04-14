
import { NETWORK_IDS } from "./types";

export const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: import.meta.env.VITE_APP_KYC_VERIFIER_ADDRESS || 
    (import.meta.env.MODE === 'development' 
      ? "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      : "0x5FbDB2315678afecb367f032d93F642f64180aa3"),
  TRUST_SCORE: import.meta.env.VITE_APP_TRUST_SCORE_ADDRESS || 
    (import.meta.env.MODE === 'development'
      ? "0x5FbDB2315678afecb367f032d93F642f64180aa4"
      : "0x5FbDB2315678afecb367f032d93F642f64180aa4"),
  LOAN_MANAGER: import.meta.env.VITE_APP_LOAN_MANAGER_ADDRESS || 
    (import.meta.env.MODE === 'development'
      ? "0x5FbDB2315678afecb367f032d93F642f64180aa5"
      : "0x5FbDB2315678afecb367f032d93F642f64180aa5"),
};

export const getNetworkName = (networkId: number | null): string => {
  if (!networkId) return "Not Connected";
  
  switch (networkId) {
    case NETWORK_IDS.MAINNET:
      return "Ethereum Mainnet";
    case NETWORK_IDS.ROPSTEN:
      return "Ropsten Testnet";
    case NETWORK_IDS.RINKEBY:
      return "Rinkeby Testnet";
    case NETWORK_IDS.GOERLI:
      return "Goerli Testnet";
    case NETWORK_IDS.KOVAN:
      return "Kovan Testnet";
    case NETWORK_IDS.GANACHE:
      return "Ganache";
    case NETWORK_IDS.LOCALHOST:
      return "Localhost";
    default:
      return `Unknown Network (${networkId})`;
  }
};
