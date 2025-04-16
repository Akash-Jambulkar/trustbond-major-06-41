
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./dashboard/navigation/SidebarNav";
import { DashboardHeader } from "./dashboard/navigation/DashboardHeader";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Use real-time updates hook
  useRealTimeUpdates();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        {/* Main Sidebar */}
        <Sidebar className="border-r border-gray-200">
          <SidebarNav user={user} onLogout={logout} />
        </Sidebar>

        {/* Main content */}
        <SidebarInset className="p-0 flex-1">
          <div className="flex flex-col h-full overflow-hidden">
            <DashboardHeader user={user} />
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
