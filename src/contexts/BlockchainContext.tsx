
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";

// Mock ABI for KYC Verification Contract
const kycVerifierAbi = [
  // Events
  "event KYCSubmitted(address indexed user, string documentHash)",
  "event KYCVerified(address indexed user, bool status)",
  
  // Functions
  "function submitKYC(string memory documentHash) external",
  "function verifyKYC(address user, bool status) external",
  "function getKYCStatus(address user) external view returns (bool)",
];

// Mock ABI for Trust Score Contract
const trustScoreAbi = [
  // Events
  "event ScoreUpdated(address indexed user, uint256 newScore)",
  
  // Functions
  "function calculateScore(address user) external view returns (uint256)",
  "function updateScore(address user, uint256 score) external",
];

// Mock ABI for Loan Manager Contract
const loanManagerAbi = [
  // Events
  "event LoanRequested(address indexed user, uint256 amount, uint256 duration)",
  "event LoanApproved(address indexed user, uint256 loanId)",
  "event LoanRejected(address indexed user, uint256 loanId)",
  "event LoanRepaid(address indexed user, uint256 loanId, uint256 amount)",
  
  // Functions
  "function requestLoan(uint256 amount, uint256 duration) external returns (uint256)",
  "function approveLoan(uint256 loanId) external",
  "function rejectLoan(uint256 loanId) external",
  "function repayLoan(uint256 loanId, uint256 amount) external",
  "function getLoan(uint256 loanId) external view returns (address, uint256, uint256, uint256, bool, bool)",
  "function getUserLoans(address user) external view returns (uint256[])",
];

interface BlockchainContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<string>;
  disconnectWallet: () => void;
  kycContract: ethers.Contract | null;
  trustScoreContract: ethers.Contract | null;
  loanContract: ethers.Contract | null;
  isBlockchainLoading: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// Demo contract addresses
const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  TRUST_SCORE: "0x5FbDB2315678afecb367f032d93F642f64180aa4",
  LOAN_MANAGER: "0x5FbDB2315678afecb367f032d93F642f64180aa5",
};

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(false);
  
  // Contract instances
  const [kycContract, setKycContract] = useState<ethers.Contract | null>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<ethers.Contract | null>(null);
  const [loanContract, setLoanContract] = useState<ethers.Contract | null>(null);

  // Initialize contracts when provider and signer are available
  useEffect(() => {
    if (provider && signer) {
      try {
        const kyc = new ethers.Contract(
          CONTRACT_ADDRESSES.KYC_VERIFIER,
          kycVerifierAbi,
          signer
        );
        setKycContract(kyc);

        const trustScore = new ethers.Contract(
          CONTRACT_ADDRESSES.TRUST_SCORE,
          trustScoreAbi,
          signer
        );
        setTrustScoreContract(trustScore);

        const loan = new ethers.Contract(
          CONTRACT_ADDRESSES.LOAN_MANAGER,
          loanManagerAbi,
          signer
        );
        setLoanContract(loan);
      } catch (error) {
        console.error("Failed to initialize contracts:", error);
        toast.error("Failed to initialize smart contracts");
      }
    }
  }, [provider, signer]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  // Connect to MetaMask wallet
  const connectWallet = async (): Promise<string> => {
    setIsBlockchainLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask.");
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = newProvider.getSigner();
      const address = await newSigner.getAddress();

      setProvider(newProvider);
      setSigner(newSigner);
      setAccount(address);
      
      toast.success("Wallet connected: " + address.substring(0, 6) + "..." + address.substring(address.length - 4));
      
      return address;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet: " + (error as Error).message);
      throw error;
    } finally {
      setIsBlockchainLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setKycContract(null);
    setTrustScoreContract(null);
    setLoanContract(null);
    
    toast.info("Wallet disconnected");
  };

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        signer,
        account,
        isConnected: !!account,
        connectWallet,
        disconnectWallet,
        kycContract,
        trustScoreContract,
        loanContract,
        isBlockchainLoading,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
