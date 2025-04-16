
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Shield, CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { LoanAnalyticsDashboard } from "@/components/analytics/LoanAnalyticsDashboard";

const UserHome = () => {
  const { user } = useAuth();
  const { 
    isConnected, 
    account, 
    getKYCStatus, 
    trustScoreContract, 
    loanContract, 
    web3 
  } = useBlockchain();
  const navigate = useNavigate();

  const [kycStatus, setKYCStatus] = useState<'pending' | 'verified' | 'not_submitted'>('not_submitted');
  const [trustScore, setTrustScore] = useState<number>(0);
  const [activeLoans, setActiveLoans] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isConnected || !account) return;

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
      }
    };

    fetchDashboardData();
  }, [isConnected, account, getKYCStatus, trustScoreContract, loanContract]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'User'}</h1>
        <Button 
          onClick={() => navigate("/dashboard/user/loan-application")}
          className="bg-trustbond-primary hover:bg-trustbond-primary/90"
        >
          Apply for a Loan
        </Button>
      </div>

      {!isConnected && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="mt-0.5 text-amber-600" />
              <div>
                <h3 className="font-medium text-amber-800">Wallet Not Connected</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Connect your wallet to access all TrustBond features and manage your financial identity securely on the blockchain.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
            {kycStatus === 'verified' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : kycStatus === 'pending' ? (
              <Clock className="h-4 w-4 text-amber-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kycStatus === 'verified' ? (
                <span className="text-green-500">Verified</span>
              ) : kycStatus === 'pending' ? (
                <span className="text-amber-500">Pending Verification</span>
              ) : (
                <span className="text-red-500">Not Submitted</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {kycStatus === 'verified' ? (
                'Your identity has been verified'
              ) : kycStatus === 'pending' ? (
                'Waiting for bank verification'
              ) : (
                'Submit your documents to get verified'
              )}
            </p>
            {kycStatus !== 'verified' && (
              <Button 
                variant="link" 
                className="p-0 h-auto mt-2 text-sm"
                onClick={() => navigate("/dashboard/user/kyc")}
              >
                {kycStatus === 'pending' ? 'Check Status' : 'Complete KYC'}
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
            <Shield className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trustScore}/100</div>
            <p className="text-xs text-muted-foreground">
              {trustScore > 80 ? 'Excellent' : trustScore > 60 ? 'Good' : 'Needs Improvement'}
            </p>
            <Button 
              variant="link" 
              className="p-0 h-auto mt-2 text-sm"
              onClick={() => navigate("/dashboard/user/trust-score")}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans}</div>
            <p className="text-xs text-muted-foreground">
              {activeLoans > 0 ? `${activeLoans} active loan${activeLoans > 1 ? 's' : ''}` : 'No active loans'}
            </p>
            <Button 
              variant="link" 
              className="p-0 h-auto mt-2 text-sm"
              onClick={() => navigate("/dashboard/user/loans")}
            >
              Manage Loans
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <LoanAnalyticsDashboard />
      </div>
    </div>
  );
};

export default UserHome;
