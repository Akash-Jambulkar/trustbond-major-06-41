
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";

export type KYCStatusType = 'pending' | 'verified' | 'not_submitted';

export const useDashboardData = () => {
  const { 
    isConnected, 
    account, 
    getKYCStatus, 
    trustScoreContract, 
    loanContract,
    kycStatus
  } = useBlockchain();

  const [trustScore, setTrustScore] = useState<number>(0);
  const [activeLoans, setActiveLoans] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // For demo purposes, set some mock values when blockchain isn't connected
        if (!isConnected || !account) {
          setTrustScore(Math.floor(Math.random() * 100));
          setActiveLoans(Math.floor(Math.random() * 5));
          setIsLoading(false);
          return;
        }

        // Simulate trust score calculation
        const simulatedScore = Math.floor(Math.random() * 100);
        setTrustScore(simulatedScore);

        // Simulate active loans
        const simulatedLoans = Math.floor(Math.random() * 5);
        setActiveLoans(simulatedLoans);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data from the blockchain");
        toast.error("Error loading dashboard data", { 
          description: "failed to fetch data from the blockchain" 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isConnected, account, getKYCStatus]);

  return {
    kycStatus,
    trustScore,
    activeLoans,
    isLoading,
    error
  };
};
