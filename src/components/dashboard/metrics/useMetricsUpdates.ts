
import { useEffect } from "react";
import { RealTimeEventType } from "@/utils/realTimeData";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { DashboardMetric } from "./types";

export const useMetricsUpdates = (
  userRole: "user" | "bank" | "admin",
  metrics: DashboardMetric[],
  setMetrics: React.Dispatch<React.SetStateAction<DashboardMetric[]>>
) => {
  const { account, getKYCStatus, loanContract, web3 } = useBlockchain();

  // Handle KYC updates
  useEffect(() => {
    const handleKYCUpdate = async () => {
      if (userRole === "user" && account) {
        const kycStatus = await getKYCStatus(account);
        
        setMetrics(prevMetrics => 
          prevMetrics.map(metric => 
            metric.title === "Identity Status" 
              ? {
                  ...metric,
                  value: kycStatus ? "Verified" : "Pending",
                  status: kycStatus ? "up" : "neutral"
                }
              : metric
          )
        );
      }
    };

    // This would typically use the real-time update system
    const kycEventListener = (data: any) => {
      handleKYCUpdate();
    };

    // Setup event listener
    window.addEventListener(RealTimeEventType.KYC_UPDATED, kycEventListener as EventListener);
    
    return () => {
      window.removeEventListener(RealTimeEventType.KYC_UPDATED, kycEventListener as EventListener);
    };
  }, [userRole, account, getKYCStatus, setMetrics]);

  // Handle trust score updates
  useEffect(() => {
    const handleTrustScoreUpdate = (data: any) => {
      if (userRole === "user") {
        setMetrics(prevMetrics => 
          prevMetrics.map(metric => 
            metric.title === "Trust Score" 
              ? {
                  ...metric,
                  value: data.score || metric.value,
                  change: `+${data.change || 2} this month`,
                  status: "up"
                }
              : metric
          )
        );
      }
    };

    // Setup event listener
    window.addEventListener(RealTimeEventType.TRUST_SCORE_UPDATED, handleTrustScoreUpdate as EventListener);
    
    return () => {
      window.removeEventListener(RealTimeEventType.TRUST_SCORE_UPDATED, handleTrustScoreUpdate as EventListener);
    };
  }, [userRole, setMetrics]);

  // Handle loan updates
  useEffect(() => {
    const handleLoanUpdate = async () => {
      if ((userRole === "user" || userRole === "bank") && loanContract && web3 && account) {
        try {
          // Refresh loan data
          const loanIds = await loanContract.methods.getUserLoans(account).call();
          
          const loanPromises = loanIds.map((id: string) => 
            loanContract.methods.getLoan(id).call()
          );
          
          const loanDetails = await Promise.all(loanPromises);
          
          // Filter active loans
          const activeLoansArray = loanDetails.filter((loan: any) => 
            loan.status === '4' || loan.status === '5'
          );
          
          const activeLoans = activeLoansArray.length;
          
          // Calculate total loan balance
          const totalBalance = activeLoansArray.reduce(
            (acc: any, loan: any) => acc + parseInt(loan.remainingAmount), 
            0
          );
          
          const totalLoanBalance = web3.utils.fromWei(totalBalance.toString(), "ether");

          setMetrics(prevMetrics => 
            prevMetrics.map(metric => {
              if (metric.title === "Active Loans") {
                return {
                  ...metric,
                  value: activeLoans
                };
              }
              if (metric.title === "Loan Balance") {
                return {
                  ...metric,
                  value: `${parseFloat(totalLoanBalance).toFixed(2)} ETH`
                };
              }
              return metric;
            })
          );
        } catch (error) {
          console.error("Error updating loan metrics:", error);
        }
      }
    };

    // Setup event listener
    const loanEventListener = (data: any) => {
      handleLoanUpdate();
    };
    
    window.addEventListener(RealTimeEventType.LOAN_UPDATED, loanEventListener as EventListener);
    
    return () => {
      window.removeEventListener(RealTimeEventType.LOAN_UPDATED, loanEventListener as EventListener);
    };
  }, [userRole, account, loanContract, web3, setMetrics]);
};
