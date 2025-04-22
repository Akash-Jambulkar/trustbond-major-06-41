
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Contract } from "web3-eth-contract";
import Web3 from "web3";

// Submit loan application to blockchain and database
export const submitLoanRequest = async ({
  web3,
  loanContract,
  account,
  loanData,
  userId
}: {
  web3: Web3;
  loanContract: Contract;
  account: string;
  loanData: any;
  userId: string;
}) => {
  try {
    console.log("Submitting loan request to blockchain...", {
      from: account,
      amount: loanData.amount,
      bankId: loanData.bankId
    });

    // Convert amount to wei 
    const amountInWei = web3.utils.toWei(loanData.amount.toString(), 'ether');
    
    // Call the contract method
    const tx = await loanContract.methods
      .requestLoan(amountInWei, loanData.termMonths, loanData.bankId)
      .send({ from: account });

    console.log("Loan request submitted to blockchain", tx.transactionHash);
    
    // Store loan request in database
    const { data, error } = await supabase
      .from("loans")
      .insert({
        user_id: userId,
        bank_id: loanData.bankId,
        amount: loanData.amount,
        interest_rate: loanData.interestRate,
        term_months: loanData.termMonths,
        status: "pending",
        purpose: loanData.purpose,
        blockchain_address: account,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing loan request in database:", error);
      toast.error("Failed to record loan application");
      // But continue since the blockchain transaction was successful
    }

    // Record transaction
    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        transaction_hash: tx.transactionHash,
        type: "loan",
        from_address: account,
        to_address: loanData.bankId,
        amount: Number(loanData.amount), // Ensure it's a number for the database
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: userId,
        bank_id: loanData.bankId
      });

    if (txError) {
      console.error("Error recording transaction:", txError);
      // But continue since the main operations were successful
    }

    toast.success("Loan application submitted successfully");
    return data?.id || null;
  } catch (error) {
    console.error("Error submitting loan request:", error);
    toast.error("Failed to submit loan application to blockchain");
    return null;
  }
};

// Approve a loan request
export const approveLoanRequest = async ({
  web3,
  loanContract,
  account,
  loanId,
  bankId
}: {
  web3: Web3;
  loanContract: Contract;
  account: string;
  loanId: string;
  bankId: string;
}) => {
  try {
    // Get loan data from database
    const { data: loanData, error: loanError } = await supabase
      .from("loans")
      .select("user_id, amount, blockchain_address")
      .eq("id", loanId)
      .eq("bank_id", bankId)
      .single();

    if (loanError || !loanData) {
      console.error("Error fetching loan data:", loanError);
      toast.error("Failed to fetch loan data");
      return false;
    }

    const borrowerAddress = loanData.blockchain_address;
    
    if (!borrowerAddress) {
      console.error("Borrower address not found");
      toast.error("Borrower wallet address not found");
      return false;
    }

    // Convert amount to wei
    const amountInWei = web3.utils.toWei(loanData.amount.toString(), 'ether');

    // Call blockchain method to approve loan
    const tx = await loanContract.methods
      .approveLoan(borrowerAddress, amountInWei)
      .send({ from: account });

    console.log("Loan approved on blockchain", tx.transactionHash);

    // Update loan in database
    const { error: loanUpdateError } = await supabase
      .from("loans")
      .update({
        status: "approved",
        updated_at: new Date().toISOString()
      })
      .eq("id", loanId);

    if (loanUpdateError) {
      console.error("Error updating loan in database:", loanUpdateError);
      // But continue since the blockchain transaction was successful
    }

    // Record transaction
    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        transaction_hash: tx.transactionHash,
        type: "loan_approval",
        from_address: account,
        to_address: borrowerAddress,
        amount: Number(loanData.amount), // Ensure it's a number for the database
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: loanData.user_id,
        bank_id: bankId
      });

    if (txError) {
      console.error("Error recording transaction:", txError);
      // But continue since the main operations were successful
    }

    toast.success("Loan approved successfully");
    return true;
  } catch (error) {
    console.error("Error approving loan:", error);
    toast.error("Failed to approve loan on blockchain");
    return false;
  }
};

// Reject a loan request
export const rejectLoanRequest = async ({
  web3,
  loanContract,
  account,
  loanId,
  bankId
}: {
  web3: Web3;
  loanContract: Contract;
  account: string;
  loanId: string;
  bankId: string;
}) => {
  try {
    // Get loan data from database
    const { data: loanData, error: loanError } = await supabase
      .from("loans")
      .select("user_id, blockchain_address")
      .eq("id", loanId)
      .eq("bank_id", bankId)
      .single();

    if (loanError || !loanData) {
      console.error("Error fetching loan data:", loanError);
      toast.error("Failed to fetch loan data");
      return false;
    }

    const borrowerAddress = loanData.blockchain_address;
    
    if (!borrowerAddress) {
      console.error("Borrower address not found");
      toast.error("Borrower wallet address not found");
      return false;
    }

    // Call blockchain method to reject loan
    const tx = await loanContract.methods
      .rejectLoan(borrowerAddress)
      .send({ from: account });

    console.log("Loan rejected on blockchain", tx.transactionHash);

    // Update loan in database
    const { error: loanUpdateError } = await supabase
      .from("loans")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString()
      })
      .eq("id", loanId);

    if (loanUpdateError) {
      console.error("Error updating loan in database:", loanUpdateError);
      // But continue since the blockchain transaction was successful
    }

    // Record transaction
    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        transaction_hash: tx.transactionHash,
        type: "loan_rejection",
        from_address: account,
        to_address: borrowerAddress,
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: loanData.user_id,
        bank_id: bankId
      });

    if (txError) {
      console.error("Error recording transaction:", txError);
      // But continue since the blockchain transaction was successful
    }

    toast.success("Loan rejected successfully");
    return true;
  } catch (error) {
    console.error("Error rejecting loan:", error);
    toast.error("Failed to reject loan on blockchain");
    return false;
  }
};

// Add the repayLoanRequest function to the existing loanOperations.ts file

// Repay a loan
export const repayLoanRequest = async ({
  web3,
  loanContract,
  account,
  loanId,
  amount,
  userId
}: {
  web3: Web3;
  loanContract: Contract;
  account: string;
  loanId: string;
  amount: string;
  userId: string;
}) => {
  try {
    // Get loan data from database
    const { data: loanData, error: loanError } = await supabase
      .from("loans")
      .select("bank_id, amount, repaid_amount")
      .eq("id", loanId)
      .eq("user_id", userId)
      .single();

    if (loanError || !loanData) {
      console.error("Error fetching loan data:", loanError);
      toast.error("Failed to fetch loan data");
      return false;
    }

    // Convert repayment amount to wei - ensure amount is a string
    const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

    // Call blockchain method to repay loan
    const tx = await loanContract.methods
      .repayLoan(loanId, amountInWei)
      .send({ from: account, value: amountInWei });

    console.log("Loan repayment processed on blockchain", tx.transactionHash);

    // Calculate new repaid amount - ensure proper type handling
    const currentRepaidAmount = parseFloat(loanData.repaid_amount?.toString() || '0');
    const repaymentAmount = parseFloat(amount.toString());
    const newRepaidAmount = currentRepaidAmount + repaymentAmount;
    
    // Determine if loan is fully repaid
    const totalAmount = parseFloat(loanData.amount.toString());
    const isFullyRepaid = newRepaidAmount >= totalAmount;

    // Update loan in database - use proper types for Supabase
    const { error: loanUpdateError } = await supabase
      .from("loans")
      .update({
        repaid_amount: newRepaidAmount,
        status: isFullyRepaid ? "repaid" : "approved",
        updated_at: new Date().toISOString()
      })
      .eq("id", loanId);

    if (loanUpdateError) {
      console.error("Error updating loan in database:", loanUpdateError);
      // But continue since the blockchain transaction was successful
    }

    // Record transaction - ensure amount is correct type for database
    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        transaction_hash: tx.transactionHash,
        type: "repayment",
        from_address: account,
        to_address: loanData.bank_id,
        amount: Number(amount), // Convert to number for the database
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: userId,
        bank_id: loanData.bank_id
      });

    if (txError) {
      console.error("Error recording transaction:", txError);
      // But continue since the main operations were successful
    }

    toast.success(`Loan repayment of ${amount} ETH processed successfully`);
    return true;
  } catch (error) {
    console.error("Error repaying loan:", error);
    toast.error("Failed to process loan repayment on blockchain");
    return false;
  }
};
