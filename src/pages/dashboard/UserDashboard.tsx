
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, Activity, AlertCircle, Wallet } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useBlockchain();

  useEffect(() => {
    if (!isConnected) {
      connectWallet().catch(console.error);
    }
  }, [isConnected, connectWallet]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name || 'User'}</h1>
          <p className="text-muted-foreground">
            Manage your personal loans, identity verification, and trust score.
          </p>
        </div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-4 p-4 text-amber-800">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <p className="flex-1">Please connect your wallet to access all features and view your personal data.</p>
              <Button 
                variant="default" 
                className="flex items-center gap-2"
                onClick={() => connectWallet()}
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-4 h-auto py-5 px-6 bg-white hover:bg-gray-50 border-gray-200"
            onClick={() => navigate('/dashboard/user/loan-application')}
          >
            <CreditCard className="h-6 w-6 text-trustbond-primary" />
            <div className="text-left flex-1">
              <p className="font-semibold text-base">Apply for Loan</p>
              <p className="text-sm text-muted-foreground">Submit a new loan application</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-4 h-auto py-5 px-6 bg-white hover:bg-gray-50 border-gray-200"
            onClick={() => navigate('/dashboard/user/kyc')}
          >
            <Shield className="h-6 w-6 text-trustbond-secondary" />
            <div className="text-left flex-1">
              <p className="font-semibold text-base">KYC Verification</p>
              <p className="text-sm text-muted-foreground">Verify your identity</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-4 h-auto py-5 px-6 bg-white hover:bg-gray-50 border-gray-200"
            onClick={() => navigate('/dashboard/user/trust-score')}
          >
            <Activity className="h-6 w-6 text-trustbond-accent" />
            <div className="text-left flex-1">
              <p className="font-semibold text-base">Trust Score</p>
              <p className="text-sm text-muted-foreground">View your trust score</p>
            </div>
          </Button>
        </div>

        {/* Main Stats Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Financial Overview</h2>
          <DashboardStats userRole="user" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
