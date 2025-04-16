
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  FileText, 
  CreditCard, 
  BarChart2, 
  Shield, 
  Settings, 
  LogOut, 
  Users, 
  Building, 
  CheckSquare,
  Lock,
  Activity,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NetworkStatus } from "@/components/NetworkStatus";
import { cn } from "@/lib/utils";

export const SidebarNav = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userLinks = [
    { href: "/dashboard/user", label: "Dashboard", icon: Home },
    { href: "/dashboard/user/kyc", label: "KYC Verification", icon: CheckSquare },
    { href: "/dashboard/user/loans", label: "My Loans", icon: CreditCard },
    { href: "/dashboard/user/loan-application", label: "Apply for Loan", icon: FileText },
    { href: "/dashboard/user/trust-score", label: "Trust Score", icon: Shield },
    { href: "/dashboard/user/credit-score", label: "Credit Score", icon: Activity },
    { href: "/dashboard/user/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/dashboard/user/profile", label: "Profile", icon: User },
    { href: "/dashboard/user/security", label: "Security", icon: Lock },
    { href: "/dashboard/user/transactions", label: "Transactions", icon: Database },
  ];

  const bankLinks = [
    { href: "/dashboard/bank", label: "Dashboard", icon: Home },
    { href: "/dashboard/bank/verify-kyc", label: "Verify KYC", icon: CheckSquare },
    { href: "/dashboard/bank/loans", label: "Loans", icon: CreditCard },
    { href: "/dashboard/bank/manage-loans", label: "Manage Loans", icon: FileText },
    { href: "/dashboard/bank/trust-scores", label: "Trust Scores", icon: Shield },
    { href: "/dashboard/bank/consensus-verification", label: "Consensus", icon: Users },
    { href: "/dashboard/bank/secure-sharing", label: "Secure Sharing", icon: Lock },
    { href: "/dashboard/bank/profile", label: "Profile", icon: Building },
    { href: "/dashboard/bank/transactions", label: "Transactions", icon: Database },
  ];

  const adminLinks = [
    { href: "/dashboard/admin", label: "Dashboard", icon: Home },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/bank-approvals", label: "Bank Approvals", icon: Building },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/admin/blockchain-setup", label: "Blockchain", icon: Database },
    { href: "/dashboard/admin/profile", label: "Profile", icon: User },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Database },
  ];

  // Determine which navigation links to use based on the user's role
  const navLinks = user?.role === "admin" 
    ? adminLinks 
    : user?.role === "bank" 
      ? bankLinks 
      : userLinks;

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col h-full py-4 bg-white">
      <div className="px-4 py-2 flex items-center mb-6">
        <div className="text-xl font-bold text-trustbond-primary">TrustBond</div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant={location.pathname === link.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                location.pathname === link.href ? "bg-trustbond-primary hover:bg-trustbond-primary/90" : ""
              )}
              onClick={() => navigate(link.href)}
            >
              <link.icon className="mr-2 h-5 w-5" />
              {link.label}
            </Button>
          ))}
        </nav>
      </ScrollArea>

      <div className="px-4 mt-auto pt-4 border-t">
        <div className="flex items-center mb-4">
          <NetworkStatus />
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
            <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.role || "user"}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};
