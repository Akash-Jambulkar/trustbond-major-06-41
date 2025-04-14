
import { ReactNode } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
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
  Shield,
  Users,
  Server
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
        { label: "Enhanced Verification", icon: <Shield size={20} />, href: "/dashboard/bank/verification" },
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
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Main Sidebar */}
        <Sidebar className="bg-trustbond-primary text-white">
          <SidebarHeader>
            <div className="flex flex-col space-y-1 p-2">
              <h1 className="text-2xl font-bold">TrustBond</h1>
              <p className="text-sm text-white/70">{user?.role?.toUpperCase()} Dashboard</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item, index) => (
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
          </SidebarContent>
          <SidebarFooter>
            <Button 
              onClick={() => logout()} 
              variant="ghost" 
              className="w-full text-white hover:bg-trustbond-primary/80 justify-start"
            >
              <LogOut size={20} className="mr-2" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <SidebarInset className="p-0">
          <div className="flex flex-col h-full overflow-hidden">
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

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {children || <Outlet />}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
