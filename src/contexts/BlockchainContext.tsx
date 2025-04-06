
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Web3 from "web3";
import { toast } from "sonner";
import { Contract } from "web3-eth-contract";
import TrustScoreABI from "../contracts/TrustScore.json";
import KYCVerifierABI from "../contracts/KYCVerifier.json";
import LoanManagerABI from "../contracts/LoanManager.json";

// Contract addresses - these would be updated after deployment
const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: process.env.NODE_ENV === 'development' 
    ? "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Ganache local address
    : "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Production address (update when deployed)
  TRUST_SCORE: process.env.NODE_ENV === 'development'
    ? "0x5FbDB2315678afecb367f032d93F642f64180aa4" // Ganache local address
    : "0x5FbDB2315678afecb367f032d93F642f64180aa4", // Production address (update when deployed)
  LOAN_MANAGER: process.env.NODE_ENV === 'development'
    ? "0x5FbDB2315678afecb367f032d93F642f64180aa5" // Ganache local address
    : "0x5FbDB2315678afecb367f032d93F642f64180aa5", // Production address (update when deployed)
};

interface BlockchainContextType {
  web3: Web3 | null;
  account: string | null;
  networkId: number | null;
  isConnected: boolean;
  networkName: string;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  connectWallet: () => Promise<string>;
  disconnectWallet: () => void;
  switchNetwork: (networkId: number) => Promise<void>;
  kycContract: Contract | null;
  trustScoreContract: Contract | null;
  loanContract: Contract | null;
  isBlockchainLoading: boolean;
  submitKYC: (documentHash: string) => Promise<void>;
  verifyKYC: (userAddress: string, status: boolean) => Promise<void>;
  getKYCStatus: (userAddress: string) => Promise<boolean>;
  updateTrustScore: (userAddress: string, score: number) => Promise<void>;
  getTrustScore: (userAddress: string) => Promise<number>;
  requestLoan: (amount: number, duration: number) => Promise<number>;
  approveLoan: (loanId: number) => Promise<void>;
  rejectLoan: (loanId: number) => Promise<void>;
  repayLoan: (loanId: number, amount: number) => Promise<void>;
  getUserLoans: (userAddress: string) => Promise<number[]>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// Network IDs
const NETWORK_IDS = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  GANACHE: 1337,
  LOCALHOST: 5777,
};

// Get network name based on ID
const getNetworkName = (networkId: number | null): string => {
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

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(false);
  
  // Contract instances
  const [kycContract, setKycContract] = useState<Contract | null>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<Contract | null>(null);
  const [loanContract, setLoanContract] = useState<Contract | null>(null);

  // Derived state
  const networkName = getNetworkName(networkId);
  const isGanache = networkId === NETWORK_IDS.GANACHE || networkId === NETWORK_IDS.LOCALHOST;
  
  // For production, we would want to use a specific network like Ethereum mainnet
  // For development, we're okay with Ganache/localhost
  const isCorrectNetwork = process.env.NODE_ENV === 'development' 
    ? (networkId === NETWORK_IDS.GANACHE || networkId === NETWORK_IDS.LOCALHOST)
    : (networkId === NETWORK_IDS.MAINNET); // Change this for production

  // Initialize contracts when web3 and account are available
  useEffect(() => {
    if (web3 && account && isCorrectNetwork) {
      try {
        const kyc = new web3.eth.Contract(
          KYCVerifierABI.abi,
          CONTRACT_ADDRESSES.KYC_VERIFIER
        );
        setKycContract(kyc);

        const trustScore = new web3.eth.Contract(
          TrustScoreABI.abi,
          CONTRACT_ADDRESSES.TRUST_SCORE
        );
        setTrustScoreContract(trustScore);

        const loan = new web3.eth.Contract(
          LoanManagerABI.abi,
          CONTRACT_ADDRESSES.LOAN_MANAGER
        );
        setLoanContract(loan);
        
        console.log("Smart contracts initialized successfully");
      } catch (error) {
        console.error("Failed to initialize contracts:", error);
        toast.error("Failed to initialize smart contracts");
      }
    }
  }, [web3, account, networkId, isCorrectNetwork]);

  // Check if MetaMask is already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          
          // Get network ID
          const networkId = await web3Instance.eth.net.getId();
          setNetworkId(networkId);
          
          // Check if already connected
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            console.log("Already connected to account:", accounts[0]);
          }
        } catch (error) {
          console.error("Error checking existing connection:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account and network changes
  useEffect(() => {
    if (window.ethereum) {
      // Handle account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast.info(`Account changed to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`);
        } else {
          disconnectWallet();
        }
      });

      // Handle chain (network) changes
      window.ethereum.on("chainChanged", async () => {
        if (web3) {
          const newNetworkId = await web3.eth.net.getId();
          setNetworkId(newNetworkId);
          toast.info(`Network changed to ${getNetworkName(newNetworkId)}`);
          
          // If the network changed, we need to reinitialize contracts
          if (account) {
            // This will trigger the useEffect that initializes contracts
          }
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, [web3, account]);

  // Connect to MetaMask wallet
  const connectWallet = async (): Promise<string> => {
    setIsBlockchainLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask.");
      }

      // Request account access
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const networkId = await web3Instance.eth.net.getId();
      
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setNetworkId(networkId);
      
      toast.success("Wallet connected: " + accounts[0].substring(0, 6) + "..." + accounts[0].substring(accounts[0].length - 4));
      
      return accounts[0];
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet: " + (error as Error).message);
      throw error;
    } finally {
      setIsBlockchainLoading(false);
    }
  };

  // Switch to a different network
  const switchNetwork = async (targetNetworkId: number): Promise<void> => {
    if (!window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    try {
      // For Ganache/localhost, we need to add the network first
      if (targetNetworkId === NETWORK_IDS.GANACHE || targetNetworkId === NETWORK_IDS.LOCALHOST) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: web3?.utils.toHex(targetNetworkId),
              chainName: 'Ganache Local',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['http://127.0.0.1:7545'],
              blockExplorerUrls: null,
            },
          ],
        });
      } else {
        // For known networks, we can just switch
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3?.utils.toHex(targetNetworkId) }],
        });
      }

      // Update network ID after successful switch
      if (web3) {
        const newNetworkId = await web3.eth.net.getId();
        setNetworkId(newNetworkId);
        toast.success(`Switched to ${getNetworkName(newNetworkId)}`);
      }
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast.error("Failed to switch network: " + (error as Error).message);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setNetworkId(null);
    setKycContract(null);
    setTrustScoreContract(null);
    setLoanContract(null);
    
    toast.info("Wallet disconnected");
  };

  // KYC Contract Methods
  const submitKYC = async (documentHash: string): Promise<void> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      await kycContract.methods.submitKYC(documentHash).send({ from: account });
      toast.success("KYC documents submitted successfully");
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC: " + (error as Error).message);
      throw error;
    }
  };

  const verifyKYC = async (userAddress: string, status: boolean): Promise<void> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      await kycContract.methods.verifyKYC(userAddress, status).send({ from: account });
      toast.success(`KYC ${status ? 'approved' : 'rejected'} for ${userAddress}`);
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC: " + (error as Error).message);
      throw error;
    }
  };

  const getKYCStatus = async (userAddress: string): Promise<boolean> => {
    if (!web3 || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      return await kycContract.methods.getKYCStatus(userAddress).call();
    } catch (error) {
      console.error("Error getting KYC status:", error);
      throw error;
    }
  };

  // Trust Score Contract Methods
  const updateTrustScore = async (userAddress: string, score: number): Promise<void> => {
    if (!web3 || !account || !trustScoreContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      await trustScoreContract.methods.updateScore(userAddress, score).send({ from: account });
      toast.success(`Trust score updated for ${userAddress}`);
    } catch (error) {
      console.error("Error updating trust score:", error);
      toast.error("Failed to update trust score: " + (error as Error).message);
      throw error;
    }
  };

  const getTrustScore = async (userAddress: string): Promise<number> => {
    if (!web3 || !trustScoreContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const score = await trustScoreContract.methods.calculateScore(userAddress).call();
      return parseInt(score);
    } catch (error) {
      console.error("Error getting trust score:", error);
      throw error;
    }
  };

  // Loan Contract Methods
  const requestLoan = async (amount: number, duration: number): Promise<number> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const result = await loanContract.methods.requestLoan(amount, duration).send({ from: account });
      const loanId = result.events.LoanRequested.returnValues.loanId;
      toast.success(`Loan request submitted with ID: ${loanId}`);
      return loanId;
    } catch (error) {
      console.error("Error requesting loan:", error);
      toast.error("Failed to request loan: " + (error as Error).message);
      throw error;
    }
  };

  const approveLoan = async (loanId: number): Promise<void> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      await loanContract.methods.approveLoan(loanId).send({ from: account });
      toast.success(`Loan #${loanId} approved`);
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan: " + (error as Error).message);
      throw error;
    }
  };

  const rejectLoan = async (loanId: number): Promise<void> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      await loanContract.methods.rejectLoan(loanId).send({ from: account });
      toast.success(`Loan #${loanId} rejected`);
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error("Failed to reject loan: " + (error as Error).message);
      throw error;
    }
  };

  const repayLoan = async (loanId: number, amount: number): Promise<void> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      await loanContract.methods.repayLoan(loanId, amount).send({ from: account });
      toast.success(`Loan #${loanId} repaid with ${amount} ETH`);
    } catch (error) {
      console.error("Error repaying loan:", error);
      toast.error("Failed to repay loan: " + (error as Error).message);
      throw error;
    }
  };

  const getUserLoans = async (userAddress: string): Promise<number[]> => {
    if (!web3 || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      return await loanContract.methods.getUserLoans(userAddress).call();
    } catch (error) {
      console.error("Error getting user loans:", error);
      throw error;
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        web3,
        account,
        networkId,
        networkName,
        isConnected: !!account,
        isCorrectNetwork,
        isGanache,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        kycContract,
        trustScoreContract,
        loanContract,
        isBlockchainLoading,
        submitKYC,
        verifyKYC,
        getKYCStatus,
        updateTrustScore,
        getTrustScore,
        requestLoan,
        approveLoan,
        rejectLoan,
        repayLoan,
        getUserLoans
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
