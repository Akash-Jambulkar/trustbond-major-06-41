
// This file provides an example of how to integrate deployed contracts with your frontend

// Contract addresses - update these after deployment
export const CONTRACT_ADDRESSES = {
  // Example addresses - replace with actual deployed addresses
  KYCVerifier: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  TrustScore: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  LoanManager: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
};

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 1337, // Local development network
  name: "Development Network",
  rpcUrl: "http://localhost:8545"
};

// Helper function to initialize contracts
export const initializeContracts = (web3) => {
  if (!web3) return { kycContract: null, trustScoreContract: null, loanContract: null };

  // Import ABIs
  const KYCVerifierABI = require('../../contracts/KYCVerifier.json').abi;
  const TrustScoreABI = require('../../contracts/TrustScore.json').abi;
  const LoanManagerABI = require('../../contracts/LoanManager.json').abi;

  // Create contract instances
  const kycContract = new web3.eth.Contract(
    KYCVerifierABI,
    CONTRACT_ADDRESSES.KYCVerifier
  );

  const trustScoreContract = new web3.eth.Contract(
    TrustScoreABI,
    CONTRACT_ADDRESSES.TrustScore
  );

  const loanContract = new web3.eth.Contract(
    LoanManagerABI,
    CONTRACT_ADDRESSES.LoanManager
  );

  return { kycContract, trustScoreContract, loanContract };
};
