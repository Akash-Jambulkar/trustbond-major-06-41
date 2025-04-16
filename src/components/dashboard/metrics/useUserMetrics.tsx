
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { DashboardMetric } from "./types";
import { ShieldCheck, ChartBar, CreditCard, AlertCircle } from "lucide-react";

export const useUserMetrics = () => {
  const { 
    isConnected, 
    account, 
    getKYCStatus, 
    trustScoreContract, 
    loanContract, 
    web3 
  } = useBlockchain();

  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserMetrics = async () => {
      if (!isConnected || !account) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Get KYC status
        const kycStatus = await getKYCStatus(account);
        
        // Get trust score
        let trustScore = 0;
        if (trustScoreContract) {
          try {
            trustScore = parseInt(await trustScoreContract.methods.calculateScore(account).call());
          } catch (error) {
            console.error("Error fetching trust score:", error);
          }
        }

        // Get loan count
        let activeLoans = 0;
        let totalLoanBalance = "0";
        if (loanContract && web3) {
          try {
            const loanIds = await loanContract.methods.getUserLoans(account).call();
            
            const loanPromises = loanIds.map((id: string) => 
              loanContract.methods.getLoan(id).call()
            );
            
            const loanDetails = await Promise.all(loanPromises);
            
            // Filter active loans (status 4 or 5)
            const activeLoansArray = loanDetails.filter((loan: any) => 
              loan.status === '4' || loan.status === '5'
            );
            
            activeLoans = activeLoansArray.length;
            
            // Calculate total loan balance
            const totalBalance = activeLoansArray.reduce(
              (acc: any, loan: any) => acc + parseInt(loan.remainingAmount), 
              0
            );
            
            totalLoanBalance = web3.utils.fromWei(totalBalance.toString(), "ether");
          } catch (error) {
            console.error("Error fetching loan data:", error);
          }
        }

        const userMetrics: DashboardMetric[] = [
          {
            title: "Identity Status",
            value: kycStatus ? "Verified" : "Pending",
            icon: <ShieldCheck size={16} className="text-green-600" />,
            status: kycStatus ? "up" : "neutral"
          },
          {
            title: "Trust Score",
            value: trustScore,
            change: "+2 this month",
            icon: <ChartBar size={16} className="text-blue-600" />,
            status: "up"
          },
          {
            title: "Active Loans",
            value: activeLoans,
            icon: <CreditCard size={16} className="text-purple-600" />,
            status: "neutral"
          },
          {
            title: "Loan Balance",
            value: `${parseFloat(totalLoanBalance).toFixed(2)} ETH`,
            icon: <AlertCircle size={16} className="text-amber-600" />,
            status: "neutral"
          }
        ];

        setMetrics(userMetrics);
      } catch (error) {
        console.error("Error loading user metrics:", error);
        setError("Failed to load user metrics");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserMetrics();
  }, [isConnected, account, getKYCStatus, trustScoreContract, loanContract, web3]);

  return { metrics, isLoading, error, setMetrics };
};
