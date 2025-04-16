import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Wallet } from "lucide-react";

const BankDashboard = () => {
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useBlockchain();

  useEffect(() => {
    if (!isConnected) {
      connectWallet().catch(console.error);
    }
  }, [isConnected, connectWallet]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-full w-full h-full">
        {!isConnected && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-4 p-4 text-amber-800">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <p className="flex-1">Please connect your wallet to access all features and perform verification operations.</p>
              <Button 
                variant="default" 
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={() => connectWallet()}
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 w-full">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BankDashboard;
