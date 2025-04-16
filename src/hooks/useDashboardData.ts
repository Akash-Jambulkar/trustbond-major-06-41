
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";

export type KYCStatusType = 'pending' | 'verified' | 'not_submitted';

export const useDashboardData = () => {
  const { 
    isConnected, 
    account, 
    getKYCStatus, 
    trustScoreContract, 
    loanContract
  } = useBlockchain();

  const [kycStatus, setKYCStatus] = useState<KYCStatusType>('not_submitted');
  const [trustScore, setTrustScore] = useState<number>(0);
  const [activeLoans, setActiveLoans] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isConnected || !account) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Fetch KYC Status
        const status = await getKYCStatus(account);
        setKYCStatus(status ? 'verified' : 'pending');

        // Fetch Trust Score
        if (trustScoreContract) {
          const score = await trustScoreContract.methods.calculateScore(account).call();
          setTrustScore(parseInt(score));
        }

        // Fetch Active Loans
        if (loanContract) {
          const loanIds = await loanContract.methods.getUserLoans(account).call();
          const activeLoanDetails = await Promise.all(
            loanIds.map((id: string) => loanContract.methods.getLoan(id).call())
          );
          
          const activeLoansCount = activeLoanDetails.filter(
            (loan: any) => loan.status === '4' || loan.status === '5'
          ).length;
          
          setActiveLoans(activeLoansCount);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isConnected, account, getKYCStatus, trustScoreContract, loanContract]);

  return {
    kycStatus,
    trustScore,
    activeLoans,
    isLoading,
    error
  };
};
