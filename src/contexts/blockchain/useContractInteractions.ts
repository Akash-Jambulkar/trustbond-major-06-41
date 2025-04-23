import { useState } from "react";
import { toast } from "sonner";
import { TransactionType } from "@/utils/transactions/types";

interface ContractInteractionsProps {
  web3: any;
  account: string | null;
  kycContract: any;
  trustScoreContract: any;
  loanContract: any;
  isConnected: boolean;
  networkId: number | null;
  trackAndWatchTransaction: (
    hash: string,
    type: TransactionType,
    description: string,
    extraData?: Record<string, any>
  ) => any;
  refreshTransactions: () => Promise<any>;
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
}: ContractInteractionsProps) => {
  
  // Submit KYC document hash to blockchain
  const submitKYC = async (
    documentHash: string, 
    documentType = 'default', 
    feeInWei?: string
  ) => {
    if (!web3 || !account || !kycContract) {
      toast.error("Blockchain connection required");
      return { success: false, hash: null };
    }

    try {
      // Set up default KYC fee if not provided (0.01 ETH in Wei)
      const defaultFee = web3.utils.toWei('0.01', 'ether');
      const fee = feeInWei || defaultFee;
      
      console.log(`Submitting KYC with fee: ${fee} wei (${web3.utils.fromWei(fee, 'ether')} ETH)`);
      
      // Call submitKYC function on the smart contract
      const tx = await kycContract.methods.submitKYC(documentHash).send({
        from: account,
        value: fee, // This is the KYC fee that will be deducted
        gas: 300000
      });
      
      console.log("KYC submission transaction:", tx);
      
      // Track transaction
      trackAndWatchTransaction(
        tx.transactionHash,
        'kyc',
        'KYC Document Submission',
        { 
          documentHash, 
          documentType,
          fee: web3.utils.fromWei(fee, 'ether'),
          fromAddress: account
        }
      );
      
      toast.success("KYC document submitted successfully!");
      return { success: true, hash: tx.transactionHash };
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC document");
      return { success: false, hash: null };
    }
  };

  // Get KYC status from blockchain
  const getKYCStatus = async (address?: string) => {
    if (!web3 || !kycContract) return null;
    
    try {
      const targetAddress = address || account;
      if (!targetAddress) return null;
      
      const status = await kycContract.methods.getVerificationStatus(targetAddress).call();
      return status;
    } catch (error) {
      console.error("Error getting KYC status:", error);
      return null;
    }
  };

  // Verify a submitted KYC document (for bank/admin role)
  const verifyKYC = async (userAddress: string, approved: boolean) => {
    if (!web3 || !account || !kycContract) {
      toast.error("Blockchain connection required");
      return false;
    }
    
    try {
      const tx = await kycContract.methods.verifyKYC(userAddress, approved).send({
        from: account,
        gas: 200000
      });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'verification',
        `KYC ${approved ? 'Approval' : 'Rejection'}`,
        { targetAddress: userAddress }
      );
      
      toast.success(`KYC ${approved ? 'approved' : 'rejected'} successfully`);
      return true;
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC");
      return false;
    }
  };

  // Update trust score for a user (for bank/admin role)
  const updateTrustScore = async (userAddress: string, score: number) => {
    if (!web3 || !account || !trustScoreContract) {
      toast.error("Blockchain connection required");
      return false;
    }
    
    try {
      const tx = await trustScoreContract.methods.updateTrustScore(userAddress, score).send({
        from: account,
        gas: 200000
      });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'trust_score',
        `Trust Score Update: ${score}`,
        { targetAddress: userAddress, score }
      );
      
      toast.success("Trust score updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating trust score:", error);
      toast.error("Failed to update trust score");
      return false;
    }
  };

  // Get trust score for a user
  const getTrustScore = async (address?: string) => {
    if (!web3 || !trustScoreContract) return null;
    
    try {
      const targetAddress = address || account;
      if (!targetAddress) return null;
      
      const score = await trustScoreContract.methods.getTrustScore(targetAddress).call();
      return parseInt(score);
    } catch (error) {
      console.error("Error getting trust score:", error);
      return null;
    }
  };

  // Request a loan
  const requestLoan = async (amount: string, purpose: string, termMonths: number) => {
    if (!web3 || !account || !loanContract) {
      toast.error("Blockchain connection required");
      return { success: false };
    }
    
    try {
      const amountInWei = web3.utils.toWei(amount, 'ether');
      
      const tx = await loanContract.methods.requestLoan(amountInWei, purpose, termMonths).send({
        from: account,
        gas: 300000
      });
      
      const loanId = tx.events.LoanRequested.returnValues.loanId;
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Request: ${amount} ETH`,
        { 
          loanId,
          amount,
          purpose,
          termMonths,
          fromAddress: account
        }
      );
      
      toast.success("Loan request submitted successfully");
      return { success: true, loanId };
    } catch (error) {
      console.error("Error requesting loan:", error);
      toast.error("Failed to submit loan request");
      return { success: false };
    }
  };

  // Approve a loan (for bank role)
  const approveLoan = async (loanId: string, interestRate: number) => {
    if (!web3 || !account || !loanContract) {
      toast.error("Blockchain connection required");
      return false;
    }
    
    try {
      const tx = await loanContract.methods.approveLoan(loanId, interestRate).send({
        from: account,
        gas: 300000
      });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Approval`,
        { 
          loanId,
          interestRate,
          fromAddress: account
        }
      );
      
      toast.success("Loan approved successfully");
      return true;
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan");
      return false;
    }
  };

  // Reject a loan (for bank role)
  const rejectLoan = async (loanId: string, reason: string) => {
    if (!web3 || !account || !loanContract) {
      toast.error("Blockchain connection required");
      return false;
    }
    
    try {
      const tx = await loanContract.methods.rejectLoan(loanId, reason).send({
        from: account,
        gas: 200000
      });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Rejection`,
        { 
          loanId,
          reason,
          fromAddress: account
        }
      );
      
      toast.success("Loan rejected successfully");
      return true;
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error("Failed to reject loan");
      return false;
    }
  };

  // Repay a loan
  const repayLoan = async (loanId: string, amount: string) => {
    if (!web3 || !account || !loanContract) {
      toast.error("Blockchain connection required");
      return false;
    }
    
    try {
      const amountInWei = web3.utils.toWei(amount, 'ether');
      
      const tx = await loanContract.methods.repayLoan(loanId).send({
        from: account,
        value: amountInWei,
        gas: 300000
      });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Repayment: ${amount} ETH`,
        { 
          loanId,
          amount,
          fromAddress: account
        }
      );
      
      toast.success("Loan repayment successful");
      return true;
    } catch (error) {
      console.error("Error repaying loan:", error);
      toast.error("Failed to repay loan");
      return false;
    }
  };

  // Get all loans for a user
  const getUserLoans = async (address?: string) => {
    if (!web3 || !loanContract) return [];
    
    try {
      const targetAddress = address || account;
      if (!targetAddress) return [];
      
      const loans = await loanContract.methods.getUserLoans(targetAddress).call();
      return loans;
    } catch (error) {
      console.error("Error getting user loans:", error);
      return [];
    }
  };

  // Register as a bank
  const registerBank = async (name: string, registrationNumber: string) => {
    if (!web3 || !account || !kycContract) {
      toast.error("Blockchain connection required");
      return false;
    }
    
    try {
      // Registration fee (0.1 ETH)
      const registrationFee = web3.utils.toWei('0.1', 'ether');
      
      const tx = await kycContract.methods.registerAsBank(name, registrationNumber).send({
        from: account,
        value: registrationFee,
        gas: 300000
      });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'registration',
        `Bank Registration: ${name}`,
        { 
          name,
          registrationNumber,
          fee: '0.1',
          fromAddress: account
        }
      );
      
      toast.success("Bank registration submitted successfully");
      return true;
    } catch (error) {
      console.error("Error registering as bank:", error);
      toast.error("Failed to register as bank");
      return false;
    }
  };

  // Function to clear blockchain cache - can be used to force refresh data
  const clearBlockchainCache = () => {
    try {
      localStorage.removeItem('blockchain_data_cache');
      toast.success("Blockchain cache cleared");
      return true;
    } catch (error) {
      console.error("Error clearing cache:", error);
      return false;
    }
  };

  return {
    submitKYC,
    verifyKYC,
    getKYCStatus,
    updateTrustScore,
    getTrustScore,
    requestLoan,
    approveLoan,
    rejectLoan,
    repayLoan,
    getUserLoans,
    registerBank,
    clearBlockchainCache
  };
};
