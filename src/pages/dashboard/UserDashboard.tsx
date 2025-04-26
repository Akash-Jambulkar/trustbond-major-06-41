
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Wallet, Loader2 } from "lucide-react";
import { getNavItems } from "@/components/dashboard/navigation/getNavItems";

const UserDashboard = () => {
  const { user } = useAuth();
  const { isConnected, connectWallet, isBlockchainLoading } = useBlockchain();
  const location = useLocation();
  const navigate = useNavigate();
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  
  // Check if user is appropriate role for this dashboard
  useEffect(() => {
    if (user && user.role !== "user") {
      console.log(`User role is ${user.role}, redirecting from user dashboard`);
      navigate(`/dashboard/${user.role}`);
    }
  }, [user, navigate]);

  // If user isn't available yet or isn't the correct role, show nothing
  if (!user || user.role !== "user") {
    return null;
  }
  
  // Get user-specific navigation from the utility function
  const { mainItems, roleSpecificItems } = getNavItems("user");
  const sidebarNavItems = [...mainItems, ...roleSpecificItems].map(item => ({
    ...item,
    active: location.pathname === item.href
  }));

  // Try to connect wallet automatically on first load
  useEffect(() => {
    const autoConnectWallet = async () => {
      if (!isConnected && !connectionAttempted && !isBlockchainLoading) {
        console.log("Attempting to auto-connect wallet...");
        setConnectionAttempted(true);
        
        try {
          await connectWallet();
        } catch (err) {
          console.error("Auto wallet connection failed:", err);
        }
      }
    };
    
    autoConnectWallet();
  }, [isConnected, connectWallet, connectionAttempted, isBlockchainLoading]);

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
                disabled={isBlockchainLoading}
              >
                {isBlockchainLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </>
                )}
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
