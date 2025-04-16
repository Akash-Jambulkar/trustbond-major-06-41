
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, Activity, AlertCircle } from "lucide-react";

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
      <div className="flex flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">
            Manage your loans, verify your identity, and track your trust score.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 h-auto py-4 px-6"
            onClick={() => navigate('/dashboard/user/loan-application')}
          >
            <CreditCard className="h-5 w-5" />
            <div className="text-left">
              <p className="font-semibold">Apply for Loan</p>
              <p className="text-sm text-muted-foreground">Submit a new loan application</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 h-auto py-4 px-6"
            onClick={() => navigate('/dashboard/user/kyc')}
          >
            <Shield className="h-5 w-5" />
            <div className="text-left">
              <p className="font-semibold">KYC Verification</p>
              <p className="text-sm text-muted-foreground">Verify your identity</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 h-auto py-4 px-6"
            onClick={() => navigate('/dashboard/user/trust-score')}
          >
            <Activity className="h-5 w-5" />
            <div className="text-left">
              <p className="font-semibold">Trust Score</p>
              <p className="text-sm text-muted-foreground">View your trust score</p>
            </div>
          </Button>
        </div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-2 p-4 text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>Please connect your wallet to access all features.</p>
            </CardContent>
          </Card>
        )}

        {/* Main Stats Section */}
        <DashboardStats userRole="user" />

        {/* Main Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
