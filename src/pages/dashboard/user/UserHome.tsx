
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
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-trustbond-primary/10 to-trustbond-secondary/5 p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-trustbond-dark">Welcome, {user?.name || 'User'}</h1>
          <p className="text-gray-600 mt-1">Manage your personal loans, identity verification, and trust score.</p>
        </div>
        <Button 
          onClick={() => navigate("/dashboard/user/loan-application")}
          className="bg-trustbond-primary hover:bg-trustbond-primary/90 shadow-sm whitespace-nowrap"
          size="lg"
        >
          Apply for a Loan
        </Button>
      </div>

      {!isConnected && (
        <Card className="bg-amber-50 border-amber-200 shadow-sm">
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
        <Card className="bg-red-50 border-red-200 shadow-sm">
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

      <h2 className="text-xl font-semibold mb-2 text-trustbond-dark">Your Financial Overview</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-l-4 border-l-trustbond-primary h-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">KYC Status</CardTitle>
            {getStatusIcon()}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-2">
              {getStatusText()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {getStatusDescription()}
            </p>
            {needsAction && (
              <Button 
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => navigate("/dashboard/user/kyc")}
              >
                {kycStatus === 'pending' ? 'Check Status' : 'Complete KYC'}
              </Button>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-trustbond-secondary h-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Trust Score</CardTitle>
            <Shield className="h-5 w-5 text-trustbond-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-2">{trustScore}/100</div>
            <p className="text-sm text-muted-foreground mt-2">
              {trustScore > 80 ? 'Excellent' : trustScore > 60 ? 'Good' : 'Needs Improvement'}
            </p>
            <Button 
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => navigate("/dashboard/user/trust-score")}
            >
              View Score Details
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-trustbond-accent h-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Active Loans</CardTitle>
            <CreditCard className="h-5 w-5 text-trustbond-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-2">{activeLoans}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {activeLoans > 0 ? `${activeLoans} active loan${activeLoans > 1 ? 's' : ''}` : 'No active loans'}
            </p>
            <Button 
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => navigate("/dashboard/user/loans")}
            >
              Manage Your Loans
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-trustbond-dark">Loan Analytics Dashboard</h2>
        <LoanAnalyticsDashboard />
      </div>
    </div>
  );
};

export default UserHome;
