import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useBlockchainConnection = ({ enableBlockchain = false }) => {
  const [web3, setWeb3] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string>("Not Connected");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [isGanache, setIsGanache] = useState<boolean>(false);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [contracts, setContracts] = useState<any>({ kycContract: null, trustScoreContract: null, loanContract: null });
  const { user } = useAuth();
  
  // Initialize Web3
  useEffect(() => {
    if (!enableBlockchain) return;
    
    const initWeb3 = async () => {
      try {
        // Check if Web3 is injected by MetaMask or similar
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          console.log("Web3 initialized using window.ethereum");
        } else {
          console.log("No Web3 detected. Please install MetaMask or similar extension.");
          setConnectionError("No Web3 detected. Please install MetaMask.");
        }
      } catch (error) {
        console.error("Error initializing Web3:", error);
        setConnectionError("Error initializing wallet connection.");
      }
    };
    
    initWeb3();
  }, [enableBlockchain]);
  
  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (!web3 || !enableBlockchain) {
      setConnectionError("Web3 not initialized or blockchain features disabled");
      return;
    }
    
    setIsBlockchainLoading(true);
    setConnectionError(null);
    
    try {
      console.log("Requesting account access...");
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        const connectedAccount = accounts[0];
        console.log("Connected account:", connectedAccount);
        setAccount(connectedAccount);
        setIsConnected(true);
        toast.success("Wallet connected successfully");
        
        // Get network ID
        const netId = await web3.eth.getChainId();
        setNetworkId(netId);
        
        // Determine network name
        const netName = getNetworkName(netId);
        setNetworkName(netName);
        
        // Check if Ganache (development network)
        setIsGanache(netId === 1337);
        
        // Check if correct network for the environment
        setIsCorrectNetwork(isValidNetwork(netId));
        
        // Store wallet address in the user's profile
        await updateUserWalletAddress(connectedAccount);
        
        return true;
      } else {
        setConnectionError("No accounts found");
        return false;
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      const errorMessage = error.message || "Failed to connect wallet";
      setConnectionError(errorMessage);
      toast.error("Failed to connect wallet");
      return false;
    } finally {
      setIsBlockchainLoading(false);
    }
  }, [web3, enableBlockchain]);
  
  // Update user's wallet address in database
  const updateUserWalletAddress = async (address: string) => {
    if (!user?.id) return;
    
    try {
      console.log("Updating user wallet address in database:", address);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          wallet_address: address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error("Failed to update wallet address in database:", error);
      } else {
        console.log("Wallet address updated successfully in database");
      }
    } catch (err) {
      console.error("Error updating wallet address in database:", err);
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = useCallback(async () => {
    console.log("Disconnecting wallet...");
    setAccount(null);
    setIsConnected(false);
    setNetworkId(null);
    setNetworkName("Not Connected");
    setIsCorrectNetwork(false);
    setIsGanache(false);
    setConnectionError(null);
    toast.success("Wallet disconnected");
  }, []);
  
  // Switch network function
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!web3) {
      toast.error("Web3 not initialized");
      return;
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(chainId) }],
      });
      
      // Get network ID
      const netId = await web3.eth.getChainId();
      setNetworkId(netId);
      
      // Determine network name
      const netName = getNetworkName(netId);
      setNetworkName(netName);
      
      // Check if Ganache (development network)
      setIsGanache(netId === 1337);
      
       // Check if correct network for the environment
      setIsCorrectNetwork(isValidNetwork(netId));
      
      toast.success(`Switched to ${netName}`);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        toast.error("This network is not available in your MetaMask. Please add it manually.");
      } else {
        console.error("Error switching network:", switchError);
        toast.error("Failed to switch network");
      }
    }
  }, [web3]);
  
  useEffect(() => {
    if (!web3) return;
    
    const loadContracts = async () => {
      try {
        // Dynamically import contract configurations
        const kycConfig = await import("@/utils/contracts/KYC.json");
        const trustScoreConfig = await import("@/utils/contracts/TrustScore.json");
        const loanConfig = await import("@/utils/contracts/Loan.json");
        
        // Get network ID
        const netId = await web3.eth.getChainId();
        setNetworkId(netId);
        
        // Determine network name
        const netName = getNetworkName(netId);
        setNetworkName(netName);
        
        // Check if Ganache (development network)
        setIsGanache(netId === 1337);
        
        // Check if correct network for the environment
        setIsCorrectNetwork(isValidNetwork(netId));
        
        // Get contract addresses based on network ID
        const kycAddress = kycConfig.networks[netId]?.address;
        const trustScoreAddress = trustScoreConfig.networks[netId]?.address;
        const loanAddress = loanConfig.networks[netId]?.address;
        
        if (!kycAddress || !trustScoreAddress || !loanAddress) {
          console.error("Contract addresses not found for network ID:", netId);
          setConnectionError(`Contract addresses not found for network: ${netName}`);
          return;
        }
        
        // Initialize contracts
        const kycContractInstance = new web3.eth.Contract(kycConfig.abi, kycAddress);
        const trustScoreContractInstance = new web3.eth.Contract(trustScoreConfig.abi, trustScoreAddress);
        const loanContractInstance = new web3.eth.Contract(loanConfig.abi, loanAddress);
        
        setContracts({
          kycContract: kycContractInstance,
          trustScoreContract: trustScoreContractInstance,
          loanContract: loanContractInstance
        });
        
        console.log("Contracts initialized successfully");
      } catch (error) {
        console.error("Error loading contracts:", error);
        setConnectionError("Error loading contracts. Please ensure contracts are deployed on the network.");
      }
    };
    
    loadContracts();
  }, [web3]);
  
  return {
    web3,
    account, 
    networkId,
    networkName,
    isConnected,
    isCorrectNetwork,
    isGanache,
    isBlockchainLoading,
    connectionError,
    kycContract: contracts.kycContract,
    trustScoreContract: contracts.trustScoreContract,
    loanContract: contracts.loanContract,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
};

// Helper function to get network name by ID
const getNetworkName = (networkId: number): string => {
  const networks: Record<number, string> = {
    1: "Ethereum Mainnet",
    5: "Goerli Testnet",
    11155111: "Sepolia Testnet",
    1337: "Ganache (Local)",
    31337: "Hardhat (Local)"
  };
  
  return networks[networkId] || `Unknown Network (ID: ${networkId})`;
};

// Helper function to check if network is valid for the current environment
const isValidNetwork = (networkId: number): boolean => {
  // In development, allow local networks
  if (process.env.NODE_ENV === 'development') {
    return [1, 5, 11155111, 1337, 31337].includes(networkId);
  }
  
  // In production, only allow mainnet and test networks
  return [1, 5, 11155111].includes(networkId);
};
