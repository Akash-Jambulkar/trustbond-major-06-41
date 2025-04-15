
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { RealTimeEventType, useRealTimeUpdates } from "@/utils/realTimeData";
import { AlertCircle, ArrowUpRight, ChartBar, CheckCircle, CreditCard, ShieldCheck } from "lucide-react";

interface DashboardMetric {
  title: string;
  value: string | number;
  change?: string;
  status?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

interface DashboardStatsProps {
  userRole: "user" | "bank" | "admin";
}

export const DashboardStats = ({ userRole }: DashboardStatsProps) => {
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

  // Initial load of dashboard metrics
  useEffect(() => {
    const loadDashboardMetrics = async () => {
      if (!isConnected || !account) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Common data for all user types
        let userMetrics: DashboardMetric[] = [];

        // User-specific metrics
        if (userRole === "user") {
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

          userMetrics = [
            {
              title: "Identity Status",
              value: kycStatus ? "Verified" : "Pending",
              icon: <ShieldCheck className="h-4 w-4 text-green-600" />,
              status: kycStatus ? "up" : "neutral"
            },
            {
              title: "Trust Score",
              value: trustScore,
              change: "+2 this month",
              icon: <ChartBar className="h-4 w-4 text-blue-600" />,
              status: "up"
            },
            {
              title: "Active Loans",
              value: activeLoans,
              icon: <CreditCard className="h-4 w-4 text-purple-600" />,
              status: "neutral"
            },
            {
              title: "Loan Balance",
              value: `${parseFloat(totalLoanBalance).toFixed(2)} ETH`,
              icon: <AlertCircle className="h-4 w-4 text-amber-600" />,
              status: "neutral"
            }
          ];
        }
        // Bank-specific metrics
        else if (userRole === "bank") {
          userMetrics = [
            {
              title: "Pending KYC",
              value: 12,
              change: "+3 today",
              icon: <ShieldCheck className="h-4 w-4 text-amber-600" />,
              status: "up"
            },
            {
              title: "Active Loans",
              value: 128,
              change: "+8 this week",
              icon: <CreditCard className="h-4 w-4 text-purple-600" />,
              status: "up"
            },
            {
              title: "Loan Volume",
              value: "245.8 ETH",
              change: "+12.4 ETH this month",
              icon: <ChartBar className="h-4 w-4 text-blue-600" />,
              status: "up"
            },
            {
              title: "KYC Success Rate",
              value: "94%",
              change: "+2% this month",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
              status: "up"
            }
          ];
        }
        // Admin-specific metrics
        else if (userRole === "admin") {
          userMetrics = [
            {
              title: "System Status",
              value: "Operational",
              icon: <CheckCircle className="h-4 w-4 text-green-600" />,
              status: "up"
            },
            {
              title: "Active Users",
              value: 156,
              change: "+12 this week",
              icon: <ArrowUpRight className="h-4 w-4 text-blue-600" />,
              status: "up"
            },
            {
              title: "Banks Registered",
              value: 8,
              change: "+1 this month",
              icon: <CreditCard className="h-4 w-4 text-purple-600" />,
              status: "up"
            },
            {
              title: "Total Transactions",
              value: 12458,
              change: "+234 today",
              icon: <ChartBar className="h-4 w-4 text-blue-600" />,
              status: "up"
            }
          ];
        }

        setMetrics(userMetrics);
      } catch (error) {
        console.error("Error loading dashboard metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardMetrics();
  }, [isConnected, account, userRole, getKYCStatus, trustScoreContract, loanContract, web3]);

  // Real-time updates for metrics
  useRealTimeUpdates(RealTimeEventType.KYC_UPDATED, async (data) => {
    if (userRole === "user") {
      const kycStatus = await getKYCStatus(account || "");
      
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
  });

  useRealTimeUpdates(RealTimeEventType.TRUST_SCORE_UPDATED, (data) => {
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
  });

  useRealTimeUpdates(RealTimeEventType.LOAN_UPDATED, async (data) => {
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
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium h-4 bg-gray-200 rounded"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="text-xs text-muted-foreground h-3 bg-gray-100 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.change && (
              <p className={`text-xs ${
                metric.status === "up" 
                  ? "text-green-600" 
                  : metric.status === "down" 
                  ? "text-red-600" 
                  : "text-muted-foreground"
              }`}>
                {metric.change}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
