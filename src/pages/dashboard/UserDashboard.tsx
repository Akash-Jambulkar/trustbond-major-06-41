
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const { isConnected, connectWallet } = useBlockchain();

  // Check wallet connection on mount
  useEffect(() => {
    if (!isConnected) {
      connectWallet().catch(console.error);
    }
  }, [isConnected, connectWallet]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header and Stats Section */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}</h1>
          <DashboardStats userRole="user" />
        </div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-2 p-4 text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>Please connect your wallet to access all dashboard features.</p>
            </CardContent>
          </Card>
        )}

        {/* Main Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
