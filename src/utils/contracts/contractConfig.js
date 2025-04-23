
// This file provides contract configuration for your frontend

// Contract addresses - update these after deployment
export const CONTRACT_ADDRESSES = {
  // Example addresses - replace with actual deployed addresses from Ganache
  KYCVerifier: "0xF9D456e454B408Dc7Bc4BD201169E7e6e7aAe0F4",
  TrustScore: "0xd12fDF106a3cB35388fBA1202c46a9cCaC0168B2",
  LoanManager: "0x5341bDcD24CB14f353695257c9224849f9F2D6C7" // This will be updated after successful deployment
};

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 5777, // Ganache development network
  name: "Ganache Network",
  rpcUrl: "http://localhost:7545"
};

// KYC submission fee in ETH
export const KYC_SUBMISSION_FEE = "0.01"; // 0.01 ETH fee for KYC submission

// Helper function to initialize contracts
export const initializeContracts = (web3) => {
  if (!web3) return { kycContract: null, trustScoreContract: null, loanContract: null };

  try {
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
  } catch (error) {
    console.error("Error initializing contracts:", error);
    return { kycContract: null, trustScoreContract: null, loanContract: null };
  }
};
