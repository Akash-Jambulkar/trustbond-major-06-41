
import { useNavigate } from "react-router-dom";
import { WalletStatus } from "@/components/WalletStatus";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const DashboardHeader = ({ user }: { user: any }) => {
  const navigate = useNavigate();

  const getRoleName = (role: string) => {
    switch (role) {
      case 'user':
        return 'User Dashboard';
      case 'bank':
        return 'Bank Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden mr-2">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
        </div>
        
        <h1 className="text-lg font-semibold">{getRoleName(user?.role || 'user')}</h1>
        
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <WalletStatus />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
