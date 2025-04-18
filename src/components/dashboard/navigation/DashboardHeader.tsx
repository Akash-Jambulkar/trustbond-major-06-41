
import { useState } from "react";
import { Search, Bell, HelpCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WalletStatus } from "@/components/WalletStatus";
import { NetworkStatus } from "@/components/NetworkStatus";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  user: any;
  className?: string;
}

export function DashboardHeader({ user, className }: DashboardHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const role = user?.role || "user";

  return (
    <header className={cn("py-3 px-6 flex items-center justify-between", className)}>
      {/* Left Side: Welcome & Search */}
      <div className="flex items-center">
        <div className={cn(
          "transition-all",
          isSearchExpanded ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          <h1 className="text-xl font-semibold text-trustbond-dark">
            Welcome, {user?.displayName || user?.email?.split('@')[0] || "User"}
          </h1>
          <p className="text-sm text-trustbond-muted">
            {role === "admin" 
              ? "Admin Dashboard" 
              : role === "bank" 
                ? "Bank Management Portal" 
                : "User Dashboard"}
          </p>
        </div>
        
        <div className={cn(
          "overflow-hidden transition-all duration-300 ml-4",
          isSearchExpanded ? "w-80" : "w-0"
        )}>
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-full focus-visible:ring-trustbond-primary" 
          />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          className="ml-2 rounded-full hover:bg-gray-100"
        >
          <Search className="h-5 w-5 text-trustbond-muted hover:text-trustbond-dark" />
        </Button>
      </div>
      
      {/* Right Side: Actions */}
      <div className="flex items-center space-x-3">
        <NetworkStatus />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-trustbond-muted hover:text-trustbond-dark" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <DropdownMenuItem className="cursor-pointer py-3">
                <div>
                  <p className="font-medium text-sm">KYC Verification Update</p>
                  <p className="text-xs text-trustbond-muted mt-1">Your KYC documents have been verified successfully.</p>
                  <p className="text-xs text-trustbond-muted/70 mt-1">10 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-3">
                <div>
                  <p className="font-medium text-sm">Trust Score Updated</p>
                  <p className="text-xs text-trustbond-muted mt-1">Your trust score has been updated to 85.</p>
                  <p className="text-xs text-trustbond-muted/70 mt-1">2 hours ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-3">
                <div>
                  <p className="font-medium text-sm">New Loan Offer</p>
                  <p className="text-xs text-trustbond-muted mt-1">You have a new loan offer from ABC Bank.</p>
                  <p className="text-xs text-trustbond-muted/70 mt-1">Yesterday</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center">
              <span className="text-sm text-trustbond-primary">View all notifications</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-gray-100"
        >
          <HelpCircle className="h-5 w-5 text-trustbond-muted hover:text-trustbond-dark" />
        </Button>
        
        <ModeToggle />
        
        <WalletStatus />
      </div>
    </header>
  );
}
