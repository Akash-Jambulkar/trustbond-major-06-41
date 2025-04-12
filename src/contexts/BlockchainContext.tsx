import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMode } from "@/contexts/ModeContext";
import Web3 from "web3";
import { toast } from "sonner";
import { Contract } from "web3-eth-contract";
import { AbiItem } from 'web3-utils';
import TrustScoreABI from "../contracts/TrustScore.json";
import KYCVerifierABI from "../contracts/KYCVerifier.json";
import LoanManagerABI from "../contracts/LoanManager.json";
import { 
  trackTransaction, 
  watchTransaction, 
  getTransactions, 
  Transaction 
} from "@/utils/transactionTracker";

const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: process.env.NODE_ENV === 'development' 
    ? "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    : "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  TRUST_SCORE: process.env.NODE_ENV === 'development'
    ? "0x5FbDB2315678afecb367f032d93F642f64180aa4"
    : "0x5FbDB2315678afecb367f032d93F642f64180aa4",
  LOAN_MANAGER: process.env.NODE_ENV === 'development'
    ? "0x5FbDB2315678afecb367f032d93F642f64180aa5"
    : "0x5FbDB2315678afecb367f032d93F642f64180aa5",
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
  connectionError: string | null;
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
  transactions: Transaction[];
  refreshTransactions: () => void;
  registerBank: (name: string, registrationNumber: string, walletAddress: string) => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

const NETWORK_IDS = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  GANACHE: 1337,
  LOCALHOST: 5777,
};

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
  const { enableBlockchain, isDemoMode } = useMode();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [kycContract, setKycContract] = useState<Contract | null>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<Contract | null>(null);
  const [loanContract, setLoanContract] = useState<Contract | null>(null);

  const networkName = getNetworkName(networkId);
  const isGanache = networkId === NETWORK_IDS.GANACHE || networkId === NETWORK_IDS.LOCALHOST;
  
  const isCorrectNetwork = process.env.NODE_ENV === 'development' 
    ? (networkId === NETWORK_IDS.GANACHE || networkId === NETWORK_IDS.LOCALHOST)
    : (networkId !== null && networkId !== NETWORK_IDS.GANACHE && networkId !== NETWORK_IDS.LOCALHOST);

  const refreshTransactions = () => {
    if (account) {
      const accountTransactions = getTransactions(account);
      setTransactions(accountTransactions);
    } else {
      setTransactions([]);
    }
  };

  useEffect(() => {
    refreshTransactions();
  }, [account]);

  useEffect(() => {
    if (web3 && account) {
      try {
        const kyc = new web3.eth.Contract(
          KYCVerifierABI.abi as AbiItem[],
          CONTRACT_ADDRESSES.KYC_VERIFIER
        );
        setKycContract(kyc);

        const trustScore = new web3.eth.Contract(
          TrustScoreABI.abi as AbiItem[],
          CONTRACT_ADDRESSES.TRUST_SCORE
        );
        setTrustScoreContract(trustScore);

        const loan = new web3.eth.Contract(
          LoanManagerABI.abi as AbiItem[],
          CONTRACT_ADDRESSES.LOAN_MANAGER
        );
        setLoanContract(loan);
        
        console.log("Smart contracts initialized successfully");
      } catch (error) {
        console.error("Failed to initialize contracts:", error);
        toast.error("Failed to initialize smart contracts");
      }
    }
  }, [web3, account, networkId]);

  useEffect(() => {
    if (!enableBlockchain || isDemoMode) {
      return;
    }
    
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          
          const networkId = await web3Instance.eth.net.getId();
          setNetworkId(networkId);
          
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            console.log("Already connected to account:", accounts[0]);
          }
        } catch (error) {
          console.error("Error checking existing connection:", error);
          setConnectionError("Error checking existing connection");
        }
      }
    };
    
    checkConnection();
  }, [enableBlockchain, isDemoMode]);

  useEffect(() => {
    if (window.ethereum && enableBlockchain && !isDemoMode) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast.info(`Account changed to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", async () => {
        if (web3) {
          const newNetworkId = await web3.eth.net.getId();
          setNetworkId(newNetworkId);
          toast.info(`Network changed to ${getNetworkName(newNetworkId)}`);
          
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
  }, [web3, account, enableBlockchain, isDemoMode]);

  const connectWallet = async (): Promise<string> => {
    setIsBlockchainLoading(true);
    setConnectionError(null);
    try {
      if (!window.ethereum) {
        const error = "MetaMask not detected. Please install MetaMask.";
        setConnectionError(error);
        throw new Error(error);
      }

      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      try {
        const networkId = await web3Instance.eth.net.getId();
        setNetworkId(networkId);
      } catch (netError) {
        console.error("Failed to get network ID:", netError);
        setConnectionError("Failed to get network ID. Make sure MetaMask is connected to a network.");
      }
      
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      
      toast.success("Wallet connected: " + accounts[0].substring(0, 6) + "..." + accounts[0].substring(accounts[0].length - 4));
      
      return accounts[0];
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setConnectionError(errorMessage);
      toast.error("Failed to connect wallet: " + errorMessage);
      throw error;
    } finally {
      setIsBlockchainLoading(false);
    }
  };

  const switchNetwork = async (targetNetworkId: number): Promise<void> => {
    if (!window.ethereum) {
      const error = "MetaMask not detected";
      setConnectionError(error);
      throw new Error(error);
    }

    try {
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
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3?.utils.toHex(targetNetworkId) }],
        });
      }

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

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setNetworkId(null);
    setKycContract(null);
    setTrustScoreContract(null);
    setLoanContract(null);
    setConnectionError(null);
    setTransactions([]);
    
    toast.info("Wallet disconnected");
  };

  const submitKYC = async (documentHash: string): Promise<void> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await kycContract.methods.submitKYC(documentHash).send({ from: account });
      
      const transaction = trackTransaction(
        tx.transactionHash,
        'kyc',
        'KYC Document Submitted',
        account,
        networkId || 0
      );
      
      watchTransaction(web3, tx.transactionHash, account);
      
      toast.success("KYC documents submitted successfully");
      refreshTransactions();
      
      return tx;
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
      const tx = await kycContract.methods.verifyKYC(userAddress, status).send({ from: account });
      
      const transaction = trackTransaction(
        tx.transactionHash,
        'verification',
        `KYC ${status ? 'Approved' : 'Rejected'} for ${userAddress.substring(0, 6)}...`,
        account,
        networkId || 0
      );
      
      watchTransaction(web3, tx.transactionHash, account);
      
      toast.success(`KYC ${status ? 'approved' : 'rejected'} for ${userAddress}`);
      refreshTransactions();
      
      return tx;
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

  const updateTrustScore = async (userAddress: string, score: number): Promise<void> => {
    if (!web3 || !account || !trustScoreContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await trustScoreContract.methods.updateScore(userAddress, score).send({ from: account });
      
      const transaction = trackTransaction(
        tx.transactionHash,
        'verification',
        `Trust Score Updated for ${userAddress.substring(0, 6)}...`,
        account,
        networkId || 0
      );
      
      watchTransaction(web3, tx.transactionHash, account);
      
      toast.success(`Trust score updated for ${userAddress}`);
      refreshTransactions();
      
      return tx;
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

  const requestLoan = async (amount: number, duration: number): Promise<number> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await loanContract.methods.requestLoan(amount, duration).send({ from: account });
      const loanId = tx.events.LoanRequested.returnValues.loanId;
      
      const transaction = trackTransaction(
        tx.transactionHash,
        'loan',
        `Loan Request Submitted (ID: ${loanId})`,
        account,
        networkId || 0
      );
      
      watchTransaction(web3, tx.transactionHash, account);
      
      toast.success(`Loan request submitted with ID: ${loanId}`);
      refreshTransactions();
      
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
      const tx = await loanContract.methods.approveLoan(loanId).send({ from: account });
      
      const transaction = trackTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Approved`,
        account,
        networkId || 0
      );
      
      watchTransaction(web3, tx.transactionHash, account);
      
      toast.success(`Loan #${loanId} approved`);
      refreshTransactions();
      
      return tx;
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
      const tx = await loanContract.methods.rejectLoan(loanId).send({ from: account });
      
      const transaction = trackTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Rejected`,
        account,
        networkId || 0
      );
      
      watchTransaction(web3, tx.transactionHash, account);
      
      toast.success(`Loan #${loanId} rejected`);
      refreshTransactions();
      
      return tx;
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
      const tx = await loanContract.methods.repayLoan(loanId, amount).send({ from: account });
      
      const transaction = trackTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Repaid (${amount} ETH)`,
        account,
        networkId || 0
      );
      
      watchTransaction(web3, tx.transactionHash, account);
      
      toast.success(`Loan #${loanId} repaid with ${amount} ETH`);
      refreshTransactions();
      
      return tx;
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

  const registerBank = async (name: string, registrationNumber: string, walletAddress: string): Promise<void> => {
    if (!web3 || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      const txHash = "0x" + Math.random().toString(16).substring(2, 42);
      
      const transaction = trackTransaction(
        txHash,
        'registration',
        `Bank Registration: ${name}`,
        account,
        networkId || 0,
        { name, registrationNumber }
      );
      
      if (web3) {
        watchTransaction(web3, txHash, account);
      }
      
      toast.success("Bank registration submitted to blockchain");
      refreshTransactions();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error registering bank on blockchain:", error);
      toast.error("Failed to register bank on blockchain");
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
        connectionError,
        submitKYC,
        verifyKYC,
        getKYCStatus,
        updateTrustScore,
        getTrustScore,
        requestLoan,
        approveLoan,
        rejectLoan,
        repayLoan,
        getUserLoans,
        transactions,
        refreshTransactions,
        registerBank
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

declare global {
  interface Window {
    ethereum: any;
  }
}
