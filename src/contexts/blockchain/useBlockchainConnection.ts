
import { useState, useEffect, useCallback } from 'react';
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { toast } from "sonner";
import { AbiItem } from 'web3-utils';
import TrustScoreABI from "../../contracts/TrustScore.json";
import KYCVerifierABI from "../../contracts/KYCVerifier.json";
import LoanManagerABI from "../../contracts/LoanManager.json";
import { CONTRACT_ADDRESSES, getNetworkName } from './networkUtils';
import { NETWORK_IDS } from './types';

interface UseBlockchainConnectionProps {
  enableBlockchain: boolean;
  isDemoMode: boolean;
}

export const useBlockchainConnection = ({ enableBlockchain, isDemoMode }: UseBlockchainConnectionProps) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [kycContract, setKycContract] = useState<Contract | null>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<Contract | null>(null);
  const [loanContract, setLoanContract] = useState<Contract | null>(null);

  const networkName = getNetworkName(networkId);
  const isGanache = networkId === NETWORK_IDS.GANACHE || networkId === NETWORK_IDS.LOCALHOST;
  const isCorrectNetwork = import.meta.env.MODE === 'development' 
    ? (networkId === NETWORK_IDS.GANACHE || networkId === NETWORK_IDS.LOCALHOST)
    : (networkId !== null && networkId !== NETWORK_IDS.GANACHE && networkId !== NETWORK_IDS.LOCALHOST);
  const isConnected = !!account;

  // Initialize contracts when web3 is available
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

  // Check for existing connection on load
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

  // Set up event listeners for wallet and network changes
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
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, [web3, enableBlockchain, isDemoMode]);

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

  const disconnectWallet = useCallback(() => {
    setWeb3(null);
    setAccount(null);
    setNetworkId(null);
    setKycContract(null);
    setTrustScoreContract(null);
    setLoanContract(null);
    setConnectionError(null);
    
    toast.info("Wallet disconnected");
  }, []);

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
    kycContract,
    trustScoreContract,
    loanContract,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };
};
