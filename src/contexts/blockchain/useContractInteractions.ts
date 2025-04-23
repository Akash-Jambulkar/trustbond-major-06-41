
import { useKYCOperations } from "./useKYCOperations";
import { useTrustScoreOperations } from "./useTrustScoreOperations";
import { useLoanOperations } from "./useLoanOperations";

interface UseContractInteractionsProps {
  web3: any;
  account: string | null;
  kycContract: any;
  trustScoreContract: any;
  loanContract: any;
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
  // KYC Operations
  const {
    submitKYC,
    verifyKYC,
    getKYCStatus
  } = useKYCOperations({
    web3,
    account,
    kycContract,
    isConnected,
    trackAndWatchTransaction,
    refreshTransactions
  });

  // Trust Score Operations
  const {
    updateTrustScore,
    getTrustScore
  } = useTrustScoreOperations({
    web3,
    account,
    trustScoreContract,
    isConnected,
    trackAndWatchTransaction,
    refreshTransactions
  });

  // Loan Operations
  const {
    requestLoan,
    approveLoan,
    rejectLoan,
    repayLoan,
    getUserLoans,
    registerBank
  } = useLoanOperations({
    web3,
    account,
    loanContract,
    kycContract,
    trustScoreContract,
    isConnected,
    networkId,
    trackAndWatchTransaction,
    refreshTransactions
  });

  return {
    // KYC Operations
    submitKYC,
    verifyKYC,
    getKYCStatus,

    // Trust Score Operations
    updateTrustScore,
    getTrustScore,

    // Loan Operations
    requestLoan,
    approveLoan,
    rejectLoan,
    repayLoan,
    getUserLoans,
    registerBank
  };
};
