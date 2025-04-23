import { toast } from "sonner";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { supabase } from "@/integrations/supabase/client";

export interface UseTrustScoreOperationsProps {
  web3: any;
  account: string | null;
  trustScoreContract: any;
  isConnected: boolean;
  trackAndWatchTransaction: (txHash: string, type: string, description: string, extraData?: Record<string, any>) => any;
  refreshTransactions: () => Promise<any[]>;
  clearBlockchainCache: () => void;
}

export const useTrustScoreOperations = ({
  web3,
  account,
  trustScoreContract,
  isConnected,
  trackAndWatchTransaction,
  refreshTransactions,
  clearBlockchainCache
}: UseTrustScoreOperationsProps) => {
  const updateTrustScore = async (userAddress: string, score: number): Promise<boolean> => {
    if (!web3 || !account || !trustScoreContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      let currentScore = 0;
      try {
        currentScore = parseInt(await trustScoreContract.methods.calculateScore(userAddress).call());
      } catch (error) {
        console.warn("Could not get current trust score:", error);
      }
      
      const scoreChange = score - currentScore;

      const tx = await trustScoreContract.methods
        .updateScore(userAddress, score)
        .send({ from: account });
        
      trackAndWatchTransaction(
        tx.transactionHash,
        'trust_score',
        `Trust Score Updated: ${score}`,
        {
          userAddress,
          newScore: score,
          previousScore: currentScore,
          change: scoreChange,
          timestamp: new Date().toISOString()
        }
      );
      
      try {
        const { data: targetUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('wallet_address', userAddress)
          .maybeSingle();
          
        if (targetUser) {
          await supabase
            .from('profiles')
            .update({
              trust_score: score,
              updated_at: new Date().toISOString()
            })
            .eq('id', targetUser.id);
        }
      } catch (dbError) {
        console.error("Database sync error:", dbError);
      }

      toast.success(`Trust score updated to ${score}`);
      await refreshTransactions();
      return true;
    } catch (error) {
      console.error("Error updating trust score:", error);
      toast.error("Failed to update trust score: " + (error as Error).message);
      return false;
    }
  };

  const getTrustScore = async (userAddress?: string): Promise<number> => {
    if (!web3 || !trustScoreContract) {
      console.error("Web3 or trust score contract not initialized");
      return 0;
    }

    try {
      const address = userAddress || account;
      if (!address) {
        console.error("No user address provided");
        return 0;
      }

      const score = await trustScoreContract.methods.calculateScore(address).call();
      return parseInt(score);
    } catch (error) {
      console.error("Error getting trust score:", error);
      return 0;
    }
  };

  return {
    updateTrustScore,
    getTrustScore
  };
};
