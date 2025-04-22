import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMode } from "@/contexts/ModeContext";
import { CONTRACT_ADDRESSES, initializeContracts } from "@/utils/contracts/contractConfig";

interface BlockchainContextType {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isBlockchainLoading: boolean;
  networkName: string;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  switchNetwork: (chainId: number) => Promise<void>;
  connectionError: string | null;
  blockNumber: number | null;
  submitKYC: (documentHash: string, fee?: string) => Promise<boolean>;
  isContractsInitialized: boolean;
  
  web3: any | null;
  networkId: number | null;
  kycContract: any | null;
  trustScoreContract: any | null;
  loanContract: any | null;
  kycStatus?: 'not_verified' | 'pending' | 'verified' | 'rejected';
  verifyKYC: (address: string, verificationStatus: boolean) => Promise<boolean>;
  getKYCStatus: (address: string) => Promise<boolean>;
  submitLoanApplication: (loanData: any) => Promise<string | null>;
  approveLoan: (loanId: string) => Promise<boolean>;
  rejectLoan: (loanId: string) => Promise<boolean>;
  getTransactionHistory: () => Promise<any[]>;
  simulateBlockchainEvent: () => Promise<boolean | void>;
  registerBank: (bankData: any) => Promise<boolean>;
  repayLoan: (loanId: string, amount: string) => Promise<boolean>;
}

export const BlockchainContext = createContext<BlockchainContextType>({
  account: null,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isBlockchainLoading: false,
  networkName: "",
  isCorrectNetwork: false,
  isGanache: false,
  switchNetwork: async () => {},
  connectionError: null,
  blockNumber: null,
  submitKYC: async () => false,
  isContractsInitialized: false,
  
  web3: null,
  networkId: null,
  kycContract: null,
  trustScoreContract: null,
  loanContract: null,
  kycStatus: 'not_verified',
  verifyKYC: async () => false,
  getKYCStatus: async () => false,
  submitLoanApplication: async () => null,
  approveLoan: async () => false,
  rejectLoan: async () => false,
  getTransactionHistory: async () => [],
  simulateBlockchainEvent: async () => false,
  registerBank: async () => false,
  repayLoan: async () => false,
});

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const { toast } = useToast();
  const { enableBlockchain } = useMode();
  
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(false);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState("");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isGanache, setIsGanache] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [isContractsInitialized, setIsContractsInitialized] = useState(false);
  
  const [web3, setWeb3] = useState<any | null>(null);
  const [kycContract, setKycContract] = useState<any | null>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<any | null>(null);
  const [loanContract, setLoanContract] = useState<any | null>(null);
  const [kycStatus, setKycStatus] = useState<'not_verified' | 'pending' | 'verified' | 'rejected'>('not_verified');

  useEffect(() => {
    if (enableBlockchain) {
      checkIfWalletIsConnected();
      
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [enableBlockchain]);

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      initializeBlockchainContracts();
    } else {
      setIsContractsInitialized(false);
    }
  }, [isConnected, isCorrectNetwork]);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        setConnectionError("No Ethereum wallet found. Please install MetaMask.");
        return;
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        await checkNetwork();
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
      setConnectionError("Error checking wallet connection.");
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkIdDecimal = parseInt(chainId, 16);
      setNetworkId(networkIdDecimal);
      
      let name = "";
      let correctNetwork = false;
      let ganache = false;
      
      switch (networkIdDecimal) {
        case 1:
          name = "Ethereum Mainnet";
          correctNetwork = true;
          break;
        case 5:
          name = "Goerli Testnet";
          correctNetwork = true;
          break;
        case 11155111:
          name = "Sepolia Testnet";
          correctNetwork = true;
          break;
        case 1337:
          name = "Ganache";
          correctNetwork = true;
          ganache = true;
          break;
        default:
          name = "Unknown Network";
          correctNetwork = false;
      }
      
      setNetworkName(name);
      setIsCorrectNetwork(correctNetwork);
      setIsGanache(ganache);
      
      const blockNumber = await window.ethereum.request({ 
        method: 'eth_blockNumber'
      });
      setBlockNumber(parseInt(blockNumber, 16));
      
    } catch (error) {
      console.error("Error checking network:", error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsBlockchainLoading(true);
      setConnectionError(null);
      
      if (!window.ethereum) {
        setConnectionError("No Ethereum wallet found. Please install MetaMask.");
        throw new Error("No Ethereum wallet found. Please install MetaMask.");
      }
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts'
      });
      
      setAccount(accounts[0]);
      setIsConnected(true);
      
      await checkNetwork();
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
      });
      
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setConnectionError(error?.message || "Error connecting wallet.");
      
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error?.message || "Failed to connect wallet.",
      });
      
      throw error;
    } finally {
      setIsBlockchainLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setConnectionError(null);
    setIsContractsInitialized(false);
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const switchNetwork = async (chainId: number) => {
    try {
      if (!window.ethereum) return;
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await addNetwork(chainId);
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      } else {
        console.error("Error switching network:", switchError);
      }
    }
  };

  const addNetwork = async (chainId: number) => {
    try {
      if (!window.ethereum) return;
      
      let params;
      switch (chainId) {
        case 1:
          params = {
            chainId: '0x1',
            chainName: 'Ethereum Mainnet',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://mainnet.infura.io/v3/'],
            blockExplorerUrls: ['https://etherscan.io']
          };
          break;
        case 5:
          params = {
            chainId: '0x5',
            chainName: 'Goerli Testnet',
            nativeCurrency: {
              name: 'Goerli Ether',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://goerli.infura.io/v3/'],
            blockExplorerUrls: ['https://goerli.etherscan.io']
          };
          break;
        case 1337:
          params = {
            chainId: '0x539',
            chainName: 'Ganache',
            nativeCurrency: {
              name: 'Ganache Ether',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['http://localhost:7545'],
            blockExplorerUrls: []
          };
          break;
        default:
          throw new Error('Unsupported network');
      }
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
      
    } catch (error) {
      console.error("Error adding network:", error);
    }
  };

  const initializeBlockchainContracts = async () => {
    try {
      if (!window.ethereum || !account) return;
      
      const Web3 = require('web3');
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      
      const contracts = initializeContracts(web3Instance);
      setKycContract(contracts.kycContract);
      setTrustScoreContract(contracts.trustScoreContract);
      setLoanContract(contracts.loanContract);
      
      console.log("Contracts initialized with addresses:", CONTRACT_ADDRESSES);
      
      setIsContractsInitialized(true);
      
      toast({
        title: "Contracts initialized",
        description: "Smart contracts are ready to use.",
      });
      
    } catch (error) {
      console.error("Error initializing contracts:", error);
      setIsContractsInitialized(false);
      
      toast({
        variant: "destructive",
        title: "Contract initialization failed",
        description: "Failed to initialize smart contracts. Please try again.",
      });
    }
  };

  const submitKYC = async (documentHash: string, fee: string = "10000000000000000"): Promise<boolean> => {
    if (!isConnected || !isContractsInitialized || !kycContract || !web3) {
      throw new Error("Wallet not connected or contracts not initialized");
    }
    
    try {
      console.log(`Submitting KYC document hash: ${documentHash} with fee: ${fee} wei`);
      
      const tx = await kycContract.methods.submitKYC(documentHash).send({ 
        from: account,
        value: fee
      });
      
      console.log("KYC submission transaction:", tx);
      
      const transactionRecord = {
        hash: tx.transactionHash,
        from: account,
        to: CONTRACT_ADDRESSES.KYCVerifier,
        value: fee,
        timestamp: Date.now(),
        type: 'KYC_SUBMISSION'
      };
      console.log("Transaction recorded:", transactionRecord);
      
      toast({
        title: "KYC document submitted",
        description: "Your document has been submitted to the blockchain with fee payment.",
      });
      
      setKycStatus('pending');
      
      return true;
    } catch (error) {
      console.error("Error submitting KYC:", error);
      throw error;
    }
  };

  const verifyKYC = async (userAddress: string, verificationStatus: boolean): Promise<boolean> => {
    if (!isConnected || !isContractsInitialized || !kycContract || !web3) {
      throw new Error("Wallet not connected or contracts not initialized");
    }
    
    try {
      console.log(`Verifying KYC for ${userAddress} with status: ${verificationStatus ? 'Verified' : 'Rejected'}`);
      
      const tx = await kycContract.methods.verifyKYC(userAddress, verificationStatus).send({
        from: account
      });
      
      console.log("KYC verification transaction:", tx);
      
      const transactionRecord = {
        hash: tx.transactionHash,
        from: account,
        to: CONTRACT_ADDRESSES.KYCVerifier,
        value: '0',
        timestamp: Date.now(),
        type: verificationStatus ? 'KYC_VERIFICATION_APPROVED' : 'KYC_VERIFICATION_REJECTED'
      };
      console.log("Verification transaction recorded:", transactionRecord);
      
      toast({
        title: `KYC ${verificationStatus ? 'verified' : 'rejected'}`,
        description: `The user's KYC has been ${verificationStatus ? 'verified' : 'rejected'}.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error verifying KYC:", error);
      throw error;
    }
  };

  const getKYCStatus = async (address: string): Promise<boolean> => {
    if (!isConnected || !isContractsInitialized || !kycContract) {
      return false;
    }
    
    try {
      const status = await kycContract.methods.isKYCVerified(address).call();
      return status;
    } catch (error) {
      console.error("Error getting KYC status:", error);
      return false;
    }
  };

  const submitLoanApplication = async (loanData: any): Promise<string | null> => {
    if (!isConnected || !isContractsInitialized || !loanContract) {
      throw new Error("Wallet not connected or contracts not initialized");
    }
    
    try {
      const tx = await loanContract.methods.submitLoan(loanData).send({
        from: account
      });
      
      console.log("Loan application transaction:", tx);
      
      return tx.transactionHash;
    } catch (error) {
      console.error("Error submitting loan application:", error);
      throw error;
    }
  };

  const approveLoan = async (loanId: string): Promise<boolean> => {
    if (!isConnected || !isContractsInitialized || !loanContract) {
      throw new Error("Wallet not connected or contracts not initialized");
    }
    
    try {
      const tx = await loanContract.methods.approveLoan(loanId).send({
        from: account
      });
      
      console.log("Loan approval transaction:", tx);
      
      return true;
    } catch (error) {
      console.error("Error approving loan:", error);
      throw error;
    }
  };

  const rejectLoan = async (loanId: string): Promise<boolean> => {
    if (!isConnected || !isContractsInitialized || !loanContract) {
      throw new Error("Wallet not connected or contracts not initialized");
    }
    
    try {
      const tx = await loanContract.methods.rejectLoan(loanId).send({
        from: account
      });
      
      console.log("Loan rejection transaction:", tx);
      
      return true;
    } catch (error) {
      console.error("Error rejecting loan:", error);
      throw error;
    }
  };

  const getTransactionHistory = async (): Promise<any[]> => {
    return [];
  };

  const simulateBlockchainEvent = async (): Promise<boolean | void> => {
    return true;
  };

  const registerBank = async (bankData: any): Promise<boolean> => {
    return true;
  };

  const repayLoan = async (loanId: string, amount: string): Promise<boolean> => {
    if (!isConnected || !isContractsInitialized || !loanContract) {
      throw new Error("Wallet not connected or contracts not initialized");
    }
    
    try {
      const tx = await loanContract.methods.repayLoan(loanId, amount).send({
        from: account
      });
      
      console.log("Loan repayment transaction:", tx);
      
      return true;
    } catch (error) {
      console.error("Error repaying loan:", error);
      throw error;
    }
  };

  const contextValue = {
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
    isBlockchainLoading,
    networkName,
    isCorrectNetwork,
    isGanache,
    switchNetwork,
    connectionError,
    blockNumber,
    submitKYC,
    isContractsInitialized,
    
    web3,
    networkId,
    kycContract,
    trustScoreContract,
    loanContract,
    kycStatus,
    verifyKYC,
    getKYCStatus,
    submitLoanApplication,
    approveLoan,
    rejectLoan,
    getTransactionHistory,
    simulateBlockchainEvent,
    registerBank,
    repayLoan,
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => useContext(BlockchainContext);
