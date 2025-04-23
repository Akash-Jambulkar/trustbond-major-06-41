
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Wallet } from "lucide-react";
import { getNavItems } from "@/components/dashboard/navigation/getNavItems";

const UserDashboard = () => {
  const { user } = useAuth();
  const { isConnected, connectWallet } = useBlockchain();
  const location = useLocation();
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  
  // Get user-specific navigation items
  const { mainItems, roleSpecificItems } = user?.role 
    ? getNavItems(user.role) 
    : { mainItems: [], roleSpecificItems: [] };
  
  // Update active state based on current route
  const sidebarNavItems = [...mainItems, ...roleSpecificItems].map(item => ({
    ...item,
    active: location.pathname === item.href
  }));

  // Try to connect wallet automatically on first load
  useEffect(() => {
    if (!isConnected && !connectionAttempted) {
      connectWallet().catch(err => {
        console.log("Auto wallet connection failed:", err);
      });
      setConnectionAttempted(true);
    }
  }, [isConnected, connectWallet, connectionAttempted]);

  return (
    <DashboardLayout sidebarNavItems={sidebarNavItems}>
      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-full w-full h-full">
        {/* Wallet Connection Warning */}
        {!isConnected && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-4 p-4 text-amber-800">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <p className="flex-1">Please connect your wallet to access all blockchain features.</p>
              <Button 
                variant="default" 
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={() => {
                  connectWallet();
                  setConnectionAttempted(true);
                }}
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 w-full">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
