import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  User, 
  FileText, 
  CreditCard, 
  PieChart, 
  LogOut
} from "lucide-react";

interface NestedDashboardLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export const NestedDashboardLayout = ({ 
  children,
  activeTab 
}: NestedDashboardLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // Get navigation items based on user role
  const getNavItems = () => {
    if (user?.role === "user") {
      return [
        { label: "Dashboard", icon: <Home size={20} />, href: "/dashboard/user" },
        { label: "Profile", icon: <User size={20} />, href: "/dashboard/user/profile" },
        { label: "KYC Documents", icon: <FileText size={20} />, href: "/dashboard/user/kyc" },
        { label: "Loans", icon: <CreditCard size={20} />, href: "/dashboard/user/loans" },
        { label: "Trust Score", icon: <PieChart size={20} />, href: "/dashboard/user/trust-score" },
      ];
    } else if (user?.role === "bank") {
      // Return bank navigation items
      return [
        { label: "Dashboard", icon: <Home size={20} />, href: "/dashboard/bank" },
        { label: "Profile", icon: <User size={20} />, href: "/dashboard/bank/profile" },
        // ... other bank items
      ];
    } else if (user?.role === "admin") {
      // Return admin navigation items
      return [
        { label: "Dashboard", icon: <Home size={20} />, href: "/dashboard/admin" },
        { label: "Profile", icon: <User size={20} />, href: "/dashboard/admin/profile" },
        // ... other admin items
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  // Check if a nav item is active
  const isActive = (href: string) => {
    return location.pathname === href || (activeTab && href.includes(activeTab));
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Secondary Sidebar */}
      <div className="w-64 bg-trustbond-primary text-white overflow-y-auto">
        <div className="p-4 border-b border-trustbond-primary/20">
          <h1 className="text-2xl font-bold">TrustBond</h1>
          <p className="text-sm text-white/70">USER Dashboard</p>
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
          <Link 
            to="#" 
            className="flex items-center gap-2 text-white/80 hover:text-white p-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
};
