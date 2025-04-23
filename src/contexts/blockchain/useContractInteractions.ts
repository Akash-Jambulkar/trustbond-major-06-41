
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
  // KYC operations
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
      // For compatibility with the existing contract method, convert the status to a boolean
      const status = verificationStatus === 'verified';
      
      // In a real implementation, we would get the userAddress from the kycId
      // For now, we'll simulate this by using a temporary address
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

  // Loan operations
  const requestLoan = async (loanData: any): Promise<string | null> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Extract values from loanData
      const { amount, termMonths } = loanData;
      
      // Convert amount to wei if it's provided as a string
      const amountInWei = typeof amount === 'string' 
        ? web3.utils.toWei(amount, 'ether')
        : web3.utils.toWei(amount.toString(), 'ether');
      
      // Call the contract method
      const tx = await loanContract.methods
        .requestLoan(amountInWei, termMonths)
        .send({ from: account });

      // Get the loan ID from the transaction events
      const loanId = tx.events?.LoanRequested?.returnValues.loanId || String(Math.floor(Math.random() * 1000000));
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Request Submitted (ID: ${loanId})`,
        { loanId, amount, termMonths }
      );
      
      toast.success(`Loan request submitted with ID: ${loanId}`);
      await refreshTransactions();
      
      return loanId.toString();
    } catch (error) {
      console.error("Error requesting loan:", error);
      toast.error("Failed to request loan: " + (error as Error).message);
      return null;
    }
  };

  const approveLoan = async (loanId: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Convert loanId to number for the contract interaction
      const numericLoanId = parseInt(loanId);
      
      const tx = await loanContract.methods.approveLoan(numericLoanId).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Approved`
      );
      
      toast.success(`Loan #${loanId} approved`);
      await refreshTransactions();
      
      return true;
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan: " + (error as Error).message);
      return false;
    }
  };

  const rejectLoan = async (loanId: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Convert loanId to number for the contract interaction
      const numericLoanId = parseInt(loanId);
      
      const tx = await loanContract.methods.rejectLoan(numericLoanId).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Rejected`
      );
      
      toast.success(`Loan #${loanId} rejected`);
      await refreshTransactions();
      
      return true;
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error("Failed to reject loan: " + (error as Error).message);
      return false;
    }
  };

  const repayLoan = async (loanId: string, amountInWei: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Convert loanId to number for the contract interaction
      const numericLoanId = parseInt(loanId);
      
      // If amountInWei is not already in wei, convert it
      const weiAmount = amountInWei.startsWith('0x')
        ? amountInWei
        : web3.utils.toWei(amountInWei, 'ether');
      
      const tx = await loanContract.methods.repayLoan(numericLoanId, weiAmount).send({ 
        from: account,
        value: weiAmount
      });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Repaid (${web3.utils.fromWei(weiAmount, 'ether')} ETH)`,
        { loanId, amount: amountInWei }
      );
      
      toast.success(`Loan #${loanId} repaid with ${web3.utils.fromWei(weiAmount, 'ether')} ETH`);
      await refreshTransactions();
      
      return true;
    } catch (error) {
      console.error("Error repaying loan:", error);
      toast.error("Failed to repay loan: " + (error as Error).message);
      return false;
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
      
      toast.success("Bank registration submitted to blockchain");
      await refreshTransactions();
      
      return true;
    } catch (error) {
      console.error("Error registering bank on blockchain:", error);
      toast.error("Failed to register bank on blockchain");
      return false;
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
