
import { toast } from "sonner";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

interface UseLoanOperationsProps {
  web3: Web3 | null;
  account: string | null;
  loanContract: Contract | null;
  isConnected: boolean;
  trackAndWatchTransaction: (txHash: string, type: string, description: string, extraData?: Record<string, any>) => any;
  refreshTransactions: () => Promise<any[]>;
}

export const useLoanOperations = ({
  web3,
  account,
  loanContract,
  isConnected,
  trackAndWatchTransaction,
  refreshTransactions
}: UseLoanOperationsProps) => {
  const requestLoan = async (amount: string | number, purpose: string, termMonths: number): Promise<string | null> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Fix the toString type error by properly checking the type
      const amountInWei = typeof amount === 'string' 
        ? web3.utils.toWei(amount, 'ether')
        : web3.utils.toWei(amount.toString(), 'ether');
      
      const tx = await loanContract.methods
        .requestLoan(amountInWei, termMonths)
        .send({ from: account });

      const loanId = tx.events?.LoanRequested?.returnValues.loanId || String(Math.floor(Math.random() * 1000000));
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan Request Submitted (ID: ${loanId})`,
        { loanId, amount, termMonths, purpose }
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

  const approveLoan = async (loanId: string, interestRate: number): Promise<boolean> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const numericLoanId = parseInt(loanId);
      const tx = await loanContract.methods.approveLoan(numericLoanId, interestRate).send({ from: account });
      
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

  const rejectLoan = async (loanId: string, reason: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const numericLoanId = parseInt(loanId);
      const tx = await loanContract.methods.rejectLoan(numericLoanId).send({ from: account });
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'loan',
        `Loan #${loanId} Rejected: ${reason}`
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
      const numericLoanId = parseInt(loanId);
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

  const getUserLoans = async (userAddress: string): Promise<any[]> => {
    if (!web3 || !loanContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const address = userAddress || account;
      if (!address) return [];
      
      return await loanContract.methods.getUserLoans(address).call();
    } catch (error) {
      console.error("Error getting user loans:", error);
      return [];
    }
  };

  return {
    requestLoan,
    approveLoan,
    rejectLoan,
    repayLoan,
    getUserLoans,
  };
};
