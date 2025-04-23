
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { useKYCOperations } from "./hooks/useKYCOperations";
import { useTrustScoreOperations } from "./hooks/useTrustScoreOperations";
import { useLoanOperations } from "./hooks/useLoanOperations";

interface UseContractInteractionsProps {
  web3: Web3 | null;
  account: string | null;
  kycContract: Contract | null;
  trustScoreContract: Contract | null;
  loanContract: Contract | null;
  isConnected: boolean;
  networkId: number | null;
  trackAndWatchTransaction: (txHash: string, type: string, description: string, extraData?: Record<string, any>) => any;
  refreshTransactions: () => Promise<any[]>;
}

export const useContractInteractions = ({
  web3,
  account,
  kycContract,
  trustScoreContract,
  loanContract,
  isConnected,
  networkId,
  trackAndWatchTransaction,
  refreshTransactions
}: UseContractInteractionsProps) => {
  // Use the separated hooks
  const kycOperations = useKYCOperations({
    web3,
    account,
    kycContract,
    isConnected,
    trackAndWatchTransaction,
    refreshTransactions
  });

  const trustScoreOperations = useTrustScoreOperations({
    web3,
    account,
    trustScoreContract,
    isConnected,
    trackAndWatchTransaction,
    refreshTransactions
  });

  const loanOperations = useLoanOperations({
    web3,
    account,
    loanContract,
    isConnected,
    trackAndWatchTransaction,
    refreshTransactions
  });

  // Bank registration operation (remaining in this file as it's a simple operation)
  const registerBank = async (bankData: any): Promise<boolean> => {
    if (!web3 || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      const { name, registrationNumber } = bankData;
      const walletAddress = bankData.walletAddress || account;
      
      const txHash = "0x" + Math.random().toString(16).substring(2, 42);
      
      trackAndWatchTransaction(
        txHash,
        'registration',
        `Bank Registration: ${name}`,
        { ...bankData }
      );
      
      return true;
    } catch (error) {
      console.error("Error registering bank on blockchain:", error);
      return false;
    }
  };

  return {
    // KYC operations
    ...kycOperations,
    
    // Trust score operations
    ...trustScoreOperations,
    
    // Loan operations
    ...loanOperations,
    
    // Bank operations
    registerBank
  };
};
