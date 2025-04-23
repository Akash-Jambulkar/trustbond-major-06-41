
import { useState, useEffect } from 'react';
import Web3 from "web3";
import { getTransactions, trackTransaction as track, watchTransaction, Transaction, TransactionType } from "@/utils/transactions";
import { getFromCache, storeInCache, getCacheKey } from "@/utils/cache/blockchainCache";

interface UseTransactionManagementProps {
  account: string | null;
  web3: Web3 | null;
  networkId: number | null;
  isOptimized?: boolean;
}

export const useTransactionManagement = ({ 
  account, 
  web3, 
  networkId,
  isOptimized = true 
}: UseTransactionManagementProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    refreshTransactions();
  }, [account]);

  const refreshTransactions = async () => {
    if (account) {
      try {
        // Try to get from cache first if optimization is enabled
        if (isOptimized) {
          const cacheKey = getCacheKey('transactions', account, networkId?.toString());
          const cachedTransactions = getFromCache<Transaction[]>(cacheKey, 'transactions');
          
          if (cachedTransactions) {
            setTransactions(cachedTransactions);
            return cachedTransactions;
          }
        }
        
        // If not cached or cache disabled, fetch from source
        const accountTransactions = await getTransactions(account);
        
        // Store in cache if optimization is enabled
        if (isOptimized) {
          const cacheKey = getCacheKey('transactions', account, networkId?.toString());
          storeInCache(cacheKey, 'transactions', accountTransactions);
        }
        
        setTransactions(accountTransactions);
        return accountTransactions;
      } catch (error) {
        console.error("Failed to refresh transactions:", error);
        setTransactions([]);
        return [];
      }
    }
    setTransactions([]);
    return [];
  };

  const trackTransaction = (
    txHash: string,
    type: TransactionType,
    description: string,
    extraData?: Record<string, any>
  ) => {
    if (!account || !networkId) return null;
    
    const tx = track(
      txHash,
      type,
      description,
      account,
      networkId,
      extraData
    );
    
    if (web3) {
      watchTransaction(web3, txHash, account);
    }
    
    // Clear transactions cache when a new transaction is tracked
    if (isOptimized) {
      const cacheKey = getCacheKey('transactions', account, networkId?.toString());
      // We don't delete from cache here but will fetch fresh data on next refreshTransactions
    }
    
    return tx;
  };

  return {
    transactions,
    refreshTransactions,
    trackTransaction
  };
};
