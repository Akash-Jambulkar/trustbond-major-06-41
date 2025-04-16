
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Shield, CreditCard, AlertTriangle } from "lucide-react";
import { LoanAnalyticsDashboard } from "@/components/analytics/LoanAnalyticsDashboard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useKYCStatusUI } from "@/hooks/useKYCStatusUI";

const UserHome = () => {
  const { user } = useAuth();
  const { isConnected } = useBlockchain();
  const navigate = useNavigate();
  
  // Use custom hooks
  const { kycStatus, trustScore, activeLoans, isLoading, error } = useDashboardData();
  const { getStatusIcon, getStatusText, getStatusDescription, needsAction } = useKYCStatusUI(kycStatus);

  return (
    <div className="space-y-6 p-6">
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

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="mt-0.5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800">Data Loading Error</h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}. Please try refreshing the page.
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
            {getStatusIcon()}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getStatusText()}
            </div>
            <p className="text-xs text-muted-foreground">
              {getStatusDescription()}
            </p>
            {needsAction && (
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
