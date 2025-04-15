
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">
        Welcome, {user?.name}
      </h2>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/dashboard/${user?.role}/transactions`)}
          className="flex items-center gap-2"
        >
          <Wallet size={18} />
          <span>Blockchain Transactions</span>
        </Button>
        <Button 
          size="sm"
          className="flex items-center gap-2"
        >
          <span>Connect MetaMask</span>
        </Button>
      </div>
    </header>
  );
}
