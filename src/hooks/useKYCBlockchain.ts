
import { useState, useEffect, useCallback } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { trackTransaction, watchTransaction } from "@/utils/transactions";

export const useKYCBlockchain = () => {
  const { web3, account, isConnected } = useBlockchain();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [documentHash, setDocumentHash] = useState<string | null>(null);

  // Check if the user has already submitted KYC documents
  useEffect(() => {
    const checkDocumentHash = async () => {
      if (!isConnected || !account) return;

      try {
        // For this example, we'll simulate already submitted
        const randomValue = Math.random();
        if (randomValue > 0.7) {
          setDocumentHash("0x" + Math.random().toString(16).substring(2, 30));
          setHasSubmitted(true);
        } else {
          setDocumentHash(null);
          setHasSubmitted(false);
        }
      } catch (error) {
        console.error("Error checking document hash:", error);
        setDocumentHash(null);
        setHasSubmitted(false);
      }
    };

    checkDocumentHash();
  }, [isConnected, account]);

  // Submit KYC documents to blockchain
  const submitKYC = useCallback(
    async (documentHash: string) => {
      if (!isConnected || !account || !web3) {
        toast.error("Wallet not connected");
        return null;
      }

      setIsSubmitting(true);
      try {
        // Get the document type from the hash (optional)
        // We use a default document type if it's not specified
        const documentType = "generic";
        
        // Simulate transaction
        const txHash = "0x" + Math.random().toString(16).substring(2, 66);
        
        // Track the transaction
        if (typeof trackTransaction === 'function') {
          trackTransaction(
            txHash,
            "kyc",
            "Submit KYC Document",
            account,
            1337 // Mock chain ID
          );
        }

        // Watch for transaction confirmation
        if (typeof watchTransaction === 'function' && web3) {
          watchTransaction(web3, txHash, account);
        }

        toast.success("KYC document submitted successfully");
        setHasSubmitted(true);
        setDocumentHash(documentHash);
        return txHash;
      } catch (error) {
        console.error("Error submitting KYC:", error);
        toast.error("Failed to submit KYC document");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isConnected, account, web3]
  );

  // Check if a document hash is already used
  const checkDocumentHashUniqueness = useCallback(
    async (hash: string) => {
      if (!isConnected) {
        return true; // Assume unique if not connected
      }

      try {
        // Simulate checking uniqueness
        return Math.random() > 0.2; // 80% chance it's unique
      } catch (error) {
        console.error("Error checking document hash uniqueness:", error);
        return true; // Assume unique on error
      }
    },
    [isConnected]
  );

  return {
    isSubmitting,
    hasSubmitted,
    documentHash,
    submitKYC,
    checkDocumentHashUniqueness,
  };
};
