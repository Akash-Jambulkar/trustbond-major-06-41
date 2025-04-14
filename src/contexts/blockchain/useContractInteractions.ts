
import { toast } from "sonner";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

interface UseContractInteractionsProps {
  web3: Web3 | null;
  account: string | null;
  kycContract: Contract | null;
  trustScoreContract: Contract | null;
  loanContract: Contract | null;
  isConnected: boolean;
  networkId: number | null;
  trackAndWatchTransaction: (txHash: string, type: string, description: string, extraData?: Record<string, any>) => any;
  refreshTransactions: () => void;
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
  // KYC operations
  const submitKYC = async (documentHash: string): Promise<void> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await kycContract.methods.submitKYC(documentHash).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'kyc',
        'KYC Document Submitted'
      );
      
      toast.success("KYC documents submitted successfully");
      refreshTransactions();
      
      return tx;
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC: " + (error as Error).message);
      throw error;
    }
  };

  const verifyKYC = async (userAddress: string, status: boolean): Promise<void> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await kycContract.methods.verifyKYC(userAddress, status).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'verification',
        `KYC ${status ? 'Approved' : 'Rejected'} for ${userAddress.substring(0, 6)}...`
      );
      
      toast.success(`KYC ${status ? 'approved' : 'rejected'} for ${userAddress}`);
      refreshTransactions();
      
      return tx;
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC: " + (error as Error).message);
      throw error;
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
      throw error;
    }
  };

  // Trust score operations
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
      refreshTransactions();
      
      return tx;
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

  // Loan operations
  const requestLoan = async (amount: number, duration: number): Promise<number> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await loanContract.methods.requestLoan(amount, duration).send({ from: account });
      const loanId = tx.events.LoanRequested.returnValues.loanId;
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Request Submitted (ID: ${loanId})`
      );
      
      toast.success(`Loan request submitted with ID: ${loanId}`);
      refreshTransactions();
      
      return loanId;
    } catch (error) {
      console.error("Error requesting loan:", error);
      toast.error("Failed to request loan: " + (error as Error).message);
      throw error;
    }
  };

  const approveLoan = async (loanId: number): Promise<void> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await loanContract.methods.approveLoan(loanId).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Approved`
      );
      
      toast.success(`Loan #${loanId} approved`);
      refreshTransactions();
      
      return tx;
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan: " + (error as Error).message);
      throw error;
    }
  };

  const rejectLoan = async (loanId: number): Promise<void> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await loanContract.methods.rejectLoan(loanId).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Rejected`
      );
      
      toast.success(`Loan #${loanId} rejected`);
      refreshTransactions();
      
      return tx;
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error("Failed to reject loan: " + (error as Error).message);
      throw error;
    }
  };

  const repayLoan = async (loanId: number, amount: number): Promise<void> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await loanContract.methods.repayLoan(loanId, amount).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Repaid (${amount} ETH)`
      );
      
      toast.success(`Loan #${loanId} repaid with ${amount} ETH`);
      refreshTransactions();
      
      return tx;
    } catch (error) {
      console.error("Error repaying loan:", error);
      toast.error("Failed to repay loan: " + (error as Error).message);
      throw error;
    }
  };

  const getUserLoans = async (userAddress: string): Promise<number[]> => {
    if (!web3 || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      return await loanContract.methods.getUserLoans(userAddress).call();
    } catch (error) {
      console.error("Error getting user loans:", error);
      throw error;
    }
  };

  // Bank operations
  const registerBank = async (name: string, registrationNumber: string, walletAddress: string): Promise<void> => {
    if (!web3 || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      const txHash = "0x" + Math.random().toString(16).substring(2, 42);
      
      trackAndWatchTransaction(
        txHash,
        'registration',
        `Bank Registration: ${name}`,
        { name, registrationNumber }
      );
      
      toast.success("Bank registration submitted to blockchain");
      refreshTransactions();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error registering bank on blockchain:", error);
      toast.error("Failed to register bank on blockchain");
      throw error;
    }
  };

  return {
    // KYC operations
    submitKYC,
    verifyKYC,
    getKYCStatus,
    
    // Trust score operations
    updateTrustScore,
    getTrustScore,
    
    // Loan operations
    requestLoan,
    approveLoan,
    rejectLoan,
    repayLoan,
    getUserLoans,
    
    // Bank operations
    registerBank
  };
};
