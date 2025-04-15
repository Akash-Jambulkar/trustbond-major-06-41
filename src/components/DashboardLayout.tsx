
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./dashboard/navigation/SidebarNav";
import { DashboardHeader } from "./dashboard/navigation/DashboardHeader";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();

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
