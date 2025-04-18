
import { useLocation, Link } from "react-router-dom";
import {
  BarChart2,
  FileText,
  Home,
  Lock,
  LogOut,
  Search,
  Settings,
  Shield,
  User,
  CreditCard,
  Activity,
  Globe,
  Landmark,
  Building,
  Users,
  CheckCircle,
  Database,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarNavProps {
  user: any;
  onLogout: () => void;
}

export function SidebarNav({ user, onLogout }: SidebarNavProps) {
  const location = useLocation();
  const role = user?.role || "user";

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/user",
      icon: Home,
    },
    {
      title: "KYC Verification",
      href: "/dashboard/user/kyc",
      icon: Shield,
    },
    {
      title: "Loans",
      href: "/dashboard/user/loans",
      icon: CreditCard,
    },
    {
      title: "Apply for Loan",
      href: "/dashboard/user/loan-application",
      icon: FileText,
    },
    {
      title: "Trust Score",
      href: "/dashboard/user/trust-score",
      icon: Activity,
    },
    {
      title: "Credit Score",
      href: "/dashboard/user/credit-score",
      icon: BarChart2,
    },
    {
      title: "Compliance & Market",
      href: "/dashboard/user/compliance-market",
      icon: Globe,
    },
    {
      title: "Analytics",
      href: "/dashboard/user/analytics",
      icon: BarChart2,
    },
    {
      title: "Transactions",
      href: "/dashboard/user/transactions",
      icon: Activity,
    },
    {
      title: "Security Settings",
      href: "/dashboard/user/security",
      icon: Lock,
    },
    {
      title: "Profile",
      href: "/dashboard/user/profile",
      icon: User,
    },
  ];

  const bankNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/bank",
      icon: Home,
    },
    {
      title: "Verify KYC",
      href: "/dashboard/bank/verify-kyc",
      icon: Shield,
    },
    {
      title: "Manage Loans",
      href: "/dashboard/bank/manage-loans",
      icon: CreditCard,
    },
    {
      title: "Trust Scores",
      href: "/dashboard/bank/trust-scores",
      icon: Activity,
    },
    {
      title: "Consensus Verification",
      href: "/dashboard/bank/consensus-verification",
      icon: Users,
    },
    {
      title: "Secure Sharing",
      href: "/dashboard/bank/secure-sharing",
      icon: Lock,
    },
    {
      title: "Transactions",
      href: "/dashboard/bank/transactions",
      icon: Activity,
    },
    {
      title: "Bank Profile",
      href: "/dashboard/bank/profile",
      icon: Landmark,
    },
  ];

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: Home,
    },
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Bank Approvals",
      href: "/dashboard/admin/bank-approvals",
      icon: CheckCircle,
    },
    {
      title: "Bank Registration",
      href: "/dashboard/admin/bank-registration",
      icon: Building,
    },
    {
      title: "Blockchain Setup",
      href: "/dashboard/admin/blockchain-setup",
      icon: Database,
    },
    {
      title: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Activity,
    },
    {
      title: "Settings",
      href: "/dashboard/admin/settings",
      icon: Settings,
    },
    {
      title: "Profile",
      href: "/dashboard/admin/profile",
      icon: User,
    },
  ];

  // Choose the appropriate navigation items based on user role
  const navItems = role === "admin" 
    ? adminNavItems 
    : role === "bank" 
      ? bankNavItems 
      : userNavItems;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Logo Area */}
      <div className="px-3 py-4">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2"
        >
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">TB</span>
          </div>
          <span className="font-bold text-trustbond-dark">TrustBond</span>
        </Link>
      </div>

      {/* Role Indicator */}
      <div className="px-3 mb-2">
        <div className="inline-flex items-center px-2 py-1 rounded-md bg-trustbond-primary/10 text-xs font-medium text-trustbond-primary">
          <Layers className="h-3 w-3 mr-1" />
          {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
        </div>
      </div>
      
      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                location.pathname === item.href
                  ? "bg-trustbond-primary text-white"
                  : "text-trustbond-dark hover:bg-trustbond-primary/10 hover:text-trustbond-primary"
              )}
            >
              <item.icon className={cn("h-4 w-4", location.pathname === item.href ? "text-white" : "text-trustbond-muted")} />
              {item.title}
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* User/Logout */}
      <div className="mt-auto px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-trustbond-primary/10 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-trustbond-primary" />
          </div>
          <div className="truncate">
            <p className="text-sm font-medium text-trustbond-dark truncate">
              {user?.displayName || user?.email || "User"}
            </p>
            <p className="text-xs text-trustbond-muted truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
