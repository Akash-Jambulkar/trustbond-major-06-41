
import { toast } from "sonner";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

interface UseTrustScoreOperationsProps {
  web3: Web3 | null;
  account: string | null;
  trustScoreContract: Contract | null;
  isConnected: boolean;
  trackAndWatchTransaction: (txHash: string, type: string, description: string, extraData?: Record<string, any>) => any;
  refreshTransactions: () => Promise<any[]>;
}

export const useTrustScoreOperations = ({
  web3,
  account,
  trustScoreContract,
  isConnected,
  trackAndWatchTransaction,
  refreshTransactions
}: UseTrustScoreOperationsProps) => {
  const updateTrustScore = async (userAddress: string, score: number): Promise<void> => {
    if (!web3 || !account || !trustScoreContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await trustScoreContract.methods.updateScore(userAddress, score).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'verification',
        `Trust Score Updated for ${userAddress.substring(0, 6)}...`
      );
      
      toast.success(`Trust score updated for ${userAddress}`);
      await refreshTransactions();
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

  return {
    updateTrustScore,
    getTrustScore,
  };
};
