
import { useNavigate } from "react-router-dom";
import { WalletStatus } from "@/components/WalletStatus";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/contexts/auth/types";

export const DashboardHeader = ({ user }: { user: User }) => {
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
        
        <div className="hidden md:flex gap-4 ml-8">
          {user.role === 'user' && (
            <>
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={() => navigate('/dashboard/user/loan-application')}
              >
                Apply for Loan
              </Button>
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={() => navigate('/dashboard/user/kyc')}
              >
                KYC Verification
              </Button>
            </>
          )}
          
          {user.role === 'bank' && (
            <>
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={() => navigate('/dashboard/bank/verify-kyc')}
              >
                Verify KYC
              </Button>
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={() => navigate('/dashboard/bank/manage-loans')}
              >
                Manage Loans
              </Button>
            </>
          )}
          
          {user.role === 'admin' && (
            <>
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={() => navigate('/dashboard/admin/users')}
              >
                Users
              </Button>
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={() => navigate('/dashboard/admin/bank-approvals')}
              >
                Bank Approvals
              </Button>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-trustbond-primary"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.role === 'user' ? (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">KYC Status Updated</p>
                      <p className="text-xs text-muted-foreground">Your KYC verification was approved</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Trust Score Increased</p>
                      <p className="text-xs text-muted-foreground">Your trust score has increased to 75</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </DropdownMenuItem>
                </>
              ) : user.role === 'bank' ? (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">New KYC Request</p>
                      <p className="text-xs text-muted-foreground">3 new KYC documents require verification</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Loan Application</p>
                      <p className="text-xs text-muted-foreground">2 new loan applications need review</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Bank Registration</p>
                      <p className="text-xs text-muted-foreground">New bank registration request</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">System Alert</p>
                      <p className="text-xs text-muted-foreground">Blockchain network performance optimized</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <WalletStatus />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
