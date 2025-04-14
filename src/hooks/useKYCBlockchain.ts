
import { useState, useEffect, useCallback } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { trackTransaction, watchTransaction } from "@/utils/transactionTracker";

export const useKYCBlockchain = () => {
  const { kycContract, web3, account, isConnected } = useBlockchain();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [documentHash, setDocumentHash] = useState<string | null>(null);

  // Check if the user has already submitted KYC documents
  useEffect(() => {
    const checkDocumentHash = async () => {
      if (!isConnected || !kycContract || !account) return;

      try {
        const hash = await kycContract.methods.getDocumentHash(account).call();
        if (hash && hash !== "") {
          setDocumentHash(hash);
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
  }, [isConnected, kycContract, account]);

  // Submit KYC documents to blockchain
  const submitKYC = useCallback(
    async (documentHash: string, documentType: string) => {
      if (!isConnected || !kycContract || !account || !web3) {
        toast.error("Wallet not connected");
        return null;
      }

      setIsSubmitting(true);
      try {
        // Call the contract method that accepts document type
        const tx = await kycContract.methods
          .submitKYC(documentHash, documentType)
          .send({ from: account });

        // Track the transaction
        trackTransaction(
          tx.transactionHash,
          "kyc",
          "Submit KYC Document",
          account,
          await web3.eth.getChainId()
        );

        // Watch for transaction confirmation
        watchTransaction(web3, tx.transactionHash, account);

        toast.success("KYC document submitted successfully");
        setHasSubmitted(true);
        setDocumentHash(documentHash);
        return tx.transactionHash;
      } catch (error) {
        console.error("Error submitting KYC:", error);
        toast.error("Failed to submit KYC document");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isConnected, kycContract, account, web3]
  );

  // Check if a document hash is already used
  const checkDocumentHashUniqueness = useCallback(
    async (hash: string) => {
      if (!isConnected || !kycContract) {
        return true; // Assume unique if not connected
      }

      try {
        const isUsed = await kycContract.methods.isDocumentHashUsed(hash).call();
        return !isUsed;
      } catch (error) {
        console.error("Error checking document hash uniqueness:", error);
        return true; // Assume unique on error
      }
    },
    [isConnected, kycContract]
  );

  return {
    isSubmitting,
    hasSubmitted,
    documentHash,
    submitKYC,
    checkDocumentHashUniqueness,
  };
};
