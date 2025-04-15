
import React from "react";
import { AuthUser } from "@/contexts/auth/types";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export const DashboardHeader = ({ user }: { user: AuthUser | null }) => {
  const { collapsed, setCollapsed } = useSidebar();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 h-8 w-8 md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden items-center gap-4 md:flex">
          <p className="text-sm font-medium">
            Welcome, {user?.name || 'Guest'}
          </p>
        </div>
      </div>
    </header>
  );
};
