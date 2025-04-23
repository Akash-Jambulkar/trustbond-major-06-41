
import { toast } from "sonner";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

interface UseKYCOperationsProps {
  web3: Web3 | null;
  account: string | null;
  kycContract: Contract | null;
  isConnected: boolean;
  trackAndWatchTransaction: (txHash: string, type: string, description: string, extraData?: Record<string, any>) => any;
  refreshTransactions: () => Promise<any[]>;
}

export const useKYCOperations = ({
  web3,
  account,
  kycContract,
  isConnected,
  trackAndWatchTransaction,
  refreshTransactions
}: UseKYCOperationsProps) => {
  const submitKYC = async (documentHash: string, feeInWei?: string): Promise<boolean> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const options: any = { from: account };
      if (feeInWei) {
        options.value = feeInWei;
      }
      
      const tx = await kycContract.methods.submitKYC(documentHash).send(options);
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'kyc',
        'KYC Document Submitted'
      );
      
      toast.success("KYC documents submitted successfully");
      await refreshTransactions();
      
      return true;
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC: " + (error as Error).message);
      return false;
    }
  };

  const verifyKYC = async (kycId: string, verificationStatus: 'verified' | 'rejected'): Promise<boolean> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const status = verificationStatus === 'verified';
      const userAddress = "0x" + kycId.substring(0, 40);
      
      const tx = await kycContract.methods.verifyKYC(userAddress, status).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'verification',
        `KYC ${status ? 'Approved' : 'Rejected'} for ${userAddress.substring(0, 6)}...`
      );
      
      toast.success(`KYC ${status ? 'approved' : 'rejected'} for ${userAddress}`);
      await refreshTransactions();
      
      return true;
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC: " + (error as Error).message);
      return false;
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
      return false;
    }
  };

  return {
    submitKYC,
    verifyKYC,
    getKYCStatus,
  };
};
