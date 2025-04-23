
import { toast } from "sonner";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface UseLoanOperationsProps {
  web3: Web3 | null;
  account: string | null;
  loanContract: Contract | null;
  kycContract: Contract | null;
  trustScoreContract: Contract | null;
  isConnected: boolean;
  networkId: number | null;
  trackAndWatchTransaction: (txHash: string, type: string, description: string, extraData?: Record<string, any>) => any;
  refreshTransactions: () => Promise<any[]>;
}

export const useLoanOperations = ({
  web3,
  account,
  loanContract,
  kycContract,
  trustScoreContract,
  isConnected,
  networkId,
  trackAndWatchTransaction,
  refreshTransactions
}: UseLoanOperationsProps) => {
  // Request a loan (as a borrower)
  const requestLoan = async (amount: string, purpose: string, term: number): Promise<boolean> => {
    if (!web3 || !account || !loanContract || !kycContract) {
      throw new Error("Wallet not connected or contracts not initialized");
    }

    try {
      // Check if user is KYC verified
      const isKYCVerified = await kycContract.methods.getKYCStatus(account).call();
      if (!isKYCVerified) {
        toast.error("KYC verification required before requesting a loan");
        return false;
      }

      // Convert amount to Wei
      const amountInWei = web3.utils.toWei(amount, 'ether');
      
      // Calculate interest rate based on trust score
      let interestRate = 10; // Default 10%
      if (trustScoreContract) {
        try {
          const score = await trustScoreContract.methods.calculateScore(account).call();
          // Simple algorithm: higher score = lower interest rate (between 5% and 15%)
          interestRate = Math.max(5, Math.min(15, 20 - Math.floor(Number(score) / 10)));
        } catch (error) {
          console.warn("Could not get trust score, using default interest rate", error);
        }
      }

      // Submit loan request to blockchain
      const tx = await loanContract.methods
        .requestLoan(amountInWei, interestRate, term, purpose)
        .send({ from: account });
        
      // Get loan ID from events
      const loanId = tx.events?.LoanRequested?.returnValues?.loanId || 'unknown';

      // Track the transaction
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Request: ${amount} ETH`,
        {
          loanId,
          amount: amountInWei,
          interestRate,
          term,
          purpose,
          timestamp: new Date().toISOString()
        }
      );
      
      // Store loan request in database for better UX and reporting
      try {
        // Get the logged in user ID
        const { data: authData } = await supabase.auth.getSession();
        const userId = authData.session?.user?.id;
        
        if (userId) {
          // Convert amount to a number for the database
          const amountNumber = parseFloat(amount);
          
          // Store loan request
          await supabase
            .from('loans')
            .insert({
              user_id: userId,
              amount: amountNumber,
              interest_rate: interestRate,
              term_months: term,
              status: 'pending',
              purpose: purpose,
              blockchain_address: account
            });
            
          // Store loan event - ensure amount is properly typed
          await supabase
            .from('loan_events')
            .insert({
              loan_id: loanId,
              event_type: 'requested',
              amount: amountNumber,
              transaction_hash: tx.transactionHash,
              metadata: {
                interestRate,
                term,
                purpose
              } as Json
            });
        }
      } catch (dbError) {
        console.error("Database sync error:", dbError);
        // Continue as blockchain transaction was successful
      }

      toast.success("Loan request submitted");
      await refreshTransactions();
      return true;
    } catch (error) {
      console.error("Error requesting loan:", error);
      toast.error("Failed to request loan: " + (error as Error).message);
      return false;
    }
  };

  // Approve a loan (as a bank)
  const approveLoan = async (loanId: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract || !kycContract) {
      throw new Error("Wallet not connected or contracts not initialized");
    }

    try {
      // Get loan details to verify borrower's KYC status
      const loan = await loanContract.methods.getLoan(loanId).call();
      const borrower = loan.borrower;
      
      // Check if borrower is KYC verified
      const isKYCVerified = await kycContract.methods.getKYCStatus(borrower).call();
      if (!isKYCVerified) {
        toast.error("Cannot approve loan: borrower is not KYC verified");
        return false;
      }

      // Approve the loan on blockchain
      const tx = await loanContract.methods
        .approveLoan(loanId)
        .send({ from: account });
        
      // Track the transaction
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Approved: #${loanId}`,
        {
          loanId,
          borrower,
          amount: loan.amount,
          timestamp: new Date().toISOString()
        }
      );
      
      // Update database records
      try {
        // Get the loan record from Supabase
        const { data: loanData } = await supabase
          .from('loans')
          .select('id, user_id')
          .eq('blockchain_address', borrower)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (loanData) {
          // Get the bank user ID
          const { data: authData } = await supabase.auth.getSession();
          const bankId = authData.session?.user?.id;
          
          if (bankId) {
            // Update loan status
            await supabase
              .from('loans')
              .update({
                status: 'approved',
                bank_id: bankId,
                updated_at: new Date().toISOString()
              })
              .eq('id', loanData.id);
              
            // Convert loanId to string for Supabase
            const loanIdString = String(loanData.id);
            
            // Store loan event
            await supabase
              .from('loan_events')
              .insert({
                loan_id: loanIdString,
                event_type: 'approved',
                transaction_hash: tx.transactionHash,
                metadata: {
                  approver: account,
                  bankId
                } as Json
              });
          }
        }
      } catch (dbError) {
        console.error("Database sync error:", dbError);
      }

      toast.success("Loan approved successfully");
      await refreshTransactions();
      return true;
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan: " + (error as Error).message);
      return false;
    }
  };

  // Reject a loan (as a bank)
  const rejectLoan = async (loanId: string, reason: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Get loan details
      const loan = await loanContract.methods.getLoan(loanId).call();

      // Reject the loan on blockchain
      const tx = await loanContract.methods
        .rejectLoan(loanId)
        .send({ from: account });
        
      // Track the transaction
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Rejected: #${loanId}`,
        {
          loanId,
          borrower: loan.borrower,
          reason,
          timestamp: new Date().toISOString()
        }
      );
      
      // Update database records
      try {
        // Get the loan record from Supabase
        const { data: loanData } = await supabase
          .from('loans')
          .select('id, user_id')
          .eq('blockchain_address', loan.borrower)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (loanData) {
          // Get the bank user ID
          const { data: authData } = await supabase.auth.getSession();
          const bankId = authData.session?.user?.id;
          
          if (bankId) {
            // Update loan status
            await supabase
              .from('loans')
              .update({
                status: 'rejected',
                bank_id: bankId,
                updated_at: new Date().toISOString()
              })
              .eq('id', loanData.id);
              
            // Convert loanId to string for Supabase
            const loanIdString = String(loanData.id);
            
            // Store loan event
            await supabase
              .from('loan_events')
              .insert({
                loan_id: loanIdString,
                event_type: 'rejected',
                transaction_hash: tx.transactionHash,
                metadata: {
                  rejecter: account,
                  bankId,
                  reason
                } as Json
              });
          }
        }
      } catch (dbError) {
        console.error("Database sync error:", dbError);
      }

      toast.success("Loan rejected");
      await refreshTransactions();
      return true;
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error("Failed to reject loan: " + (error as Error).message);
      return false;
    }
  };

  // Repay a loan (as a borrower)
  const repayLoan = async (loanId: string, amount: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Convert amount to Wei
      const amountInWei = web3.utils.toWei(amount, 'ether');

      // Repay the loan on blockchain
      const tx = await loanContract.methods
        .repayLoan(loanId)
        .send({ 
          from: account,
          value: amountInWei
        });
        
      // Track the transaction
      trackAndWatchTransaction(
        tx.transactionHash,
        'repayment',
        `Loan Repayment: ${amount} ETH`,
        {
          loanId,
          amount: amountInWei,
          timestamp: new Date().toISOString()
        }
      );
      
      // Update database records
      try {
        // Get the loan record from Supabase
        const { data: loanData } = await supabase
          .from('loans')
          .select('id, repaid_amount')
          .eq('blockchain_address', account)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (loanData) {
          // Parse and convert numeric values
          const currentRepaid = parseFloat(loanData.repaid_amount?.toString() || '0');
          const repaymentAmount = parseFloat(amount);
          const newRepaidTotal = currentRepaid + repaymentAmount;
          
          // Update loan repayment
          await supabase
            .from('loans')
            .update({
              repaid_amount: newRepaidTotal,
              status: 'active',  // Will be updated to 'completed' if fully repaid
              updated_at: new Date().toISOString()
            })
            .eq('id', loanData.id);
            
          // Convert loanId to string for Supabase
          const loanIdString = String(loanData.id);
            
          // Store loan event - ensure amount is a number
          await supabase
            .from('loan_events')
            .insert({
              loan_id: loanIdString,
              event_type: 'repayment',
              amount: repaymentAmount,
              transaction_hash: tx.transactionHash
            });
        }
      } catch (dbError) {
        console.error("Database sync error:", dbError);
      }

      toast.success("Loan repayment successful");
      await refreshTransactions();
      return true;
    } catch (error) {
      console.error("Error repaying loan:", error);
      toast.error("Failed to repay loan: " + (error as Error).message);
      return false;
    }
  };

  // Get user loans from blockchain
  const getUserLoans = async (userAddress?: string): Promise<any[]> => {
    if (!web3 || !loanContract) {
      console.error("Web3 or loan contract not initialized");
      return [];
    }

    try {
      const address = userAddress || account;
      if (!address) {
        console.error("No user address provided");
        return [];
      }

      // Get loan IDs for the user
      const loanIds = await loanContract.methods.getUserLoans(address).call();
      
      // Get details for each loan
      const loans = await Promise.all(
        loanIds.map(async (id: string) => {
          const loan = await loanContract.methods.getLoan(id).call();
          
          // Get loan status as a string
          let statusStr = '';
          switch (String(loan.status)) {
            case '0': statusStr = 'pending'; break;
            case '1': statusStr = 'approved'; break;
            case '2': statusStr = 'rejected'; break;
            case '3': statusStr = 'funded'; break;
            case '4': statusStr = 'active'; break;
            case '5': statusStr = 'completed'; break;
            case '6': statusStr = 'defaulted'; break;
            default: statusStr = 'unknown';
          }
          
          // Return formatted loan object
          return {
            id,
            borrower: loan.borrower,
            amount: loan.amount,
            interestRate: loan.interestRate,
            term: loan.term,
            purpose: loan.purpose || 'Not specified',
            status: statusStr,
            remainingAmount: loan.remainingAmount,
            repaymentDeadline: loan.repaymentDeadline,
            bankAddress: loan.bankAddress
          };
        })
      );
      
      // Sort loans by status (active first, then pending, etc.)
      return loans.sort((a, b) => {
        const statusOrder: Record<string, number> = {
          'active': 0,
          'funded': 1,
          'pending': 2, 
          'approved': 3,
          'completed': 4,
          'rejected': 5,
          'defaulted': 6,
          'unknown': 7
        };
        return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      });
    } catch (error) {
      console.error("Error fetching user loans:", error);
      return [];
    }
  };

  // Register a bank on the blockchain
  const registerBank = async (name: string, regNumber: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Register bank on blockchain
      const tx = await loanContract.methods
        .registerBank(name, regNumber)
        .send({ from: account });
        
      // Track the transaction
      trackAndWatchTransaction(
        tx.transactionHash,
        'registration',
        'Bank Registration',
        {
          name,
          regNumber,
          timestamp: new Date().toISOString()
        }
      );
      
      // Update database
      try {
        // Get the user ID
        const { data: authData } = await supabase.auth.getSession();
        const userId = authData.session?.user?.id;
        
        if (userId) {
          // Update profile as bank
          await supabase
            .from('profiles')
            .update({
              role: 'bank',
              wallet_address: account,
              bank_registration_status: 'registered',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        }
      } catch (dbError) {
        console.error("Database sync error:", dbError);
      }

      toast.success("Bank registered successfully");
      await refreshTransactions();
      return true;
    } catch (error) {
      console.error("Error registering bank:", error);
      toast.error("Failed to register bank: " + (error as Error).message);
      return false;
    }
  };

  return {
    requestLoan,
    approveLoan,
    rejectLoan,
    repayLoan,
    getUserLoans,
    registerBank
  };
};
