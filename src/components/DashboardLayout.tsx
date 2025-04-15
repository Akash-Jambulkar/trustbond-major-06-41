
import { ReactNode } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { WalletStatus } from "@/components/WalletStatus";
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
  Shield,
  Users,
  Server,
  BarChart3,
  Lock,
  Wallet,
  LineChart,
  BookOpen
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarMenuBadge,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get navigation items based on user role
  const getNavItems = () => {
    // Common items for all user types
    const commonItems = [
      { label: "Dashboard", icon: <Home size={20} />, href: `/dashboard/${user?.role}` },
      { label: "Profile", icon: <User size={20} />, href: `/dashboard/${user?.role}/profile` },
    ];

    // User specific items
    const userItems = [
      { 
        label: "Identity", 
        icon: <FileText size={20} />, 
        href: "/dashboard/user/kyc",
        badge: "Verified" 
      },
      { 
        label: "Loans", 
        icon: <CreditCard size={20} />, 
        href: "/dashboard/user/loans" 
      },
      { 
        label: "Credit Score", 
        icon: <PieChart size={20} />, 
        href: "/dashboard/user/credit-score" 
      },
      { 
        label: "Trust Score", 
        icon: <LineChart size={20} />, 
        href: "/dashboard/user/trust-score" 
      },
      { 
        label: "Analytics", 
        icon: <BarChart3 size={20} />, 
        href: "/dashboard/user/analytics" 
      },
      { 
        label: "Compliance & Market", 
        icon: <BookOpen size={20} />, 
        href: "/dashboard/user/compliance-market" 
      },
      { 
        label: "Security", 
        icon: <Lock size={20} />, 
        href: "/dashboard/user/security" 
      },
      { 
        label: "Blockchain", 
        icon: <Wallet size={20} />, 
        href: "/dashboard/user/transactions" 
      },
    ];

    // Bank specific items
    const bankItems = [
      { 
        label: "KYC Verification", 
        icon: <ShieldCheck size={20} />, 
        href: "/dashboard/bank/verify-kyc",
        badge: "12" 
      },
      { 
        label: "Enhanced Verification", 
        icon: <Shield size={20} />, 
        href: "/dashboard/bank/verification" 
      },
      { 
        label: "Consensus Verification", 
        icon: <Users size={20} />, 
        href: "/dashboard/bank/consensus-verification" 
      },
      { 
        label: "Loans", 
        icon: <CreditCard size={20} />, 
        href: "/dashboard/bank/loans", 
        badge: "5" 
      },
      { 
        label: "Trust Scores", 
        icon: <PieChart size={20} />, 
        href: "/dashboard/bank/trust-scores" 
      },
      { 
        label: "Secure Sharing", 
        icon: <Lock size={20} />, 
        href: "/dashboard/bank/secure-sharing" 
      },
      { 
        label: "Blockchain", 
        icon: <Wallet size={20} />, 
        href: "/dashboard/bank/transactions" 
      },
    ];

    // Admin specific items
    const adminItems = [
      { 
        label: "Bank Approvals", 
        icon: <Building2 size={20} />, 
        href: "/dashboard/admin/bank-approvals",
        badge: "3" 
      },
      { 
        label: "User Management", 
        icon: <Users size={20} />, 
        href: "/dashboard/admin/users" 
      },
      { 
        label: "Blockchain Setup", 
        icon: <Server size={20} />, 
        href: "/dashboard/admin/blockchain-setup" 
      },
      { 
        label: "System Settings", 
        icon: <Settings size={20} />, 
        href: "/dashboard/admin/settings" 
      },
      { 
        label: "Transactions", 
        icon: <Wallet size={20} />, 
        href: "/dashboard/admin/transactions" 
      },
    ];

    // Return navigation items based on user role
    if (user?.role === "user") {
      return { main: commonItems, roleSpecific: userItems };
    } else if (user?.role === "bank") {
      return { main: commonItems, roleSpecific: bankItems };
    } else if (user?.role === "admin") {
      return { main: commonItems, roleSpecific: adminItems };
    }

    return { main: commonItems, roleSpecific: [] };
  };

  const { main: mainNavItems, roleSpecific: roleNavItems } = getNavItems();

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href.endsWith('home') && location.pathname === href.replace('/home', '')) return true;
    return location.pathname.startsWith(href) && href !== `/dashboard/${user?.role}`;
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        {/* Main Sidebar */}
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader>
            <div className="flex flex-col space-y-1 p-4">
              <h1 className="text-2xl font-bold text-trustbond-primary">TrustBond</h1>
              <p className="text-sm text-gray-500">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Portal</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {/* Main navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.href)}
                        tooltip={item.label}
                      >
                        <Link to={item.href} className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {/* Role-specific navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Features</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {roleNavItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.href)}
                        tooltip={item.label}
                      >
                        <Link to={item.href} className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                          {item.badge && (
                            <SidebarMenuBadge>
                              {item.badge}
                            </SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-gray-200 p-4">
            <div className="flex flex-col gap-2">
              <WalletStatus />
              <Button 
                onClick={() => logout()} 
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <SidebarInset className="p-0 flex-1">
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
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

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {children || <Outlet />}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
