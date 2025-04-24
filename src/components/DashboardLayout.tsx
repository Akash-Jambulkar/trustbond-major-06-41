
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarNav } from "./dashboard/navigation/SidebarNav";
import { DashboardHeader } from "./dashboard/navigation/DashboardHeader";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { getNavItems } from "./dashboard/navigation/getNavItems";

interface DashboardLayoutProps {
  children?: ReactNode;
  sidebarNavItems?: Array<{
    title: string;
    href: string;
    icon: any;
    active: boolean;
  }>;
}

export const DashboardLayout = ({ children, sidebarNavItems }: DashboardLayoutProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Use real-time updates hook
  useRealTimeUpdates();

  // Get navigation items based on user role if not provided explicitly
  const generatedNavItems = user?.role ? getNavItems(user.role).mainItems.concat(
    getNavItems(user.role).roleSpecificItems
  ) : [];
  
  // Use provided sidebarNavItems or generated ones based on user role
  const finalNavItems = sidebarNavItems && sidebarNavItems.length > 0 ? sidebarNavItems : generatedNavItems;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Main Sidebar - Compact and modern */}
      <div className="flex-shrink-0 w-64 bg-white border-r border-gray-200 shadow-sm">
        <SidebarNav 
          user={user} 
          onLogout={logout} 
          navItems={finalNavItems} 
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} className="border-b border-gray-200 bg-white shadow-sm" />
        
        {/* Content Area with proper padding and overflow handling */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
