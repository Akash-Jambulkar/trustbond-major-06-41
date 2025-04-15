
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FileText,
  Users,
  CreditCard,
  PieChart,
  Shield,
  Wallet,
  Settings,
  LogOut
} from "lucide-react";
import { WalletStatus } from "@/components/WalletStatus";
import { useAuth } from "@/contexts/AuthContext";

export function BankSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    {
      name: "Home",
      href: "/dashboard/bank",
      icon: Building2
    },
    {
      name: "KYC Verification",
      href: "/dashboard/bank/verify-kyc",
      icon: FileText
    },
    {
      name: "Consensus Verification",
      href: "/dashboard/bank/consensus-verification",
      icon: Users
    },
    {
      name: "Manage Loans",
      href: "/dashboard/bank/loans",
      icon: CreditCard
    },
    {
      name: "Trust Scores",
      href: "/dashboard/bank/trust-scores",
      icon: PieChart
    },
    {
      name: "Secure Sharing",
      href: "/dashboard/bank/secure-sharing",
      icon: Shield
    },
    {
      name: "Blockchain Transactions",
      href: "/dashboard/bank/transactions",
      icon: Wallet
    },
    {
      name: "Settings",
      href: "/dashboard/bank/settings",
      icon: Settings
    }
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-trustbond-primary">TrustBond</h2>
        <p className="text-sm text-gray-500">Bank Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-muted"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <WalletStatus />
        <Button 
          onClick={() => logout()} 
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
