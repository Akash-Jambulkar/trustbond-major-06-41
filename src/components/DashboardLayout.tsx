
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { WalletStatus } from "@/components/WalletStatus";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  User, 
  FileText, 
  CreditCard, 
  PieChart, 
  Settings, 
  LogOut, 
  Building2,
  ShieldCheck,
  Users,
  Server
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { label: "Dashboard", icon: <Home size={20} />, href: `/dashboard/${user?.role}` },
      { label: "Profile", icon: <User size={20} />, href: `/dashboard/${user?.role}/profile` },
    ];

    // Role-specific items
    if (user?.role === "user") {
      return [
        ...baseItems,
        { label: "KYC Documents", icon: <FileText size={20} />, href: "/dashboard/user/kyc" },
        { label: "Loans", icon: <CreditCard size={20} />, href: "/dashboard/user/loans" },
        { label: "Trust Score", icon: <PieChart size={20} />, href: "/dashboard/user/trust-score" },
      ];
    } else if (user?.role === "bank") {
      return [
        ...baseItems,
        { label: "Verify KYC", icon: <ShieldCheck size={20} />, href: "/dashboard/bank/verify-kyc" },
        { label: "Consensus Verification", icon: <Users size={20} />, href: "/dashboard/bank/consensus-verification" },
        { label: "Loan Requests", icon: <CreditCard size={20} />, href: "/dashboard/bank/loans" },
        { label: "Trust Scores", icon: <PieChart size={20} />, href: "/dashboard/bank/trust-scores" },
      ];
    } else if (user?.role === "admin") {
      return [
        ...baseItems,
        { label: "Banks", icon: <Building2 size={20} />, href: "/dashboard/admin/banks" },
        { label: "Users", icon: <Users size={20} />, href: "/dashboard/admin/users" },
        { label: "Blockchain Setup", icon: <Server size={20} />, href: "/dashboard/admin/blockchain-setup" },
        { label: "Settings", icon: <Settings size={20} />, href: "/dashboard/admin/settings" },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href.endsWith('home') && location.pathname === href.replace('/home', '')) return true;
    return location.pathname.startsWith(href) && href !== `/dashboard/${user?.role}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-trustbond-primary text-white">
        <div className="p-4 border-b border-trustbond-primary/20">
          <h1 className="text-2xl font-bold">TrustBond</h1>
          <p className="text-sm text-white/70">{user?.role?.toUpperCase()} Dashboard</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 p-2 rounded transition-colors ${
                    isActive(item.href) 
                      ? 'bg-white/20 text-white' 
                      : 'hover:bg-trustbond-primary/80 text-white/80 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-trustbond-primary/20">
          <Button 
            onClick={() => logout()} 
            variant="ghost" 
            className="flex items-center justify-start w-full text-white hover:bg-trustbond-primary/80"
          >
            <LogOut size={20} className="mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-semibold text-trustbond-dark">
            Welcome, {user?.name}
          </h2>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <WalletStatus />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};
