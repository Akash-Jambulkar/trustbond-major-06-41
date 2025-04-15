
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthUser } from "@/contexts/auth/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getNavItems } from "./getNavItems";
import { LogOut, User } from "lucide-react";

interface SidebarNavProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export const SidebarNav = ({ user, onLogout }: SidebarNavProps) => {
  const location = useLocation();
  
  // Get navigation items based on user role
  const role = user?.role || 'user';
  const navItemGroups = getNavItems(role);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white">
      <div className="px-3 py-4">
        <Link
          to="/"
          className="flex h-10 items-center px-2 text-lg font-semibold tracking-tight"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          TrustBond
        </Link>
        <div className="mt-2">
          <p className="px-2 text-xs font-medium text-muted-foreground">
            {user ? `${role.charAt(0).toUpperCase() + role.slice(1)} Portal` : 'Guest'}
          </p>
        </div>
      </div>
      <div className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {navItemGroups.main.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              asChild
              className={cn(
                "w-full justify-start",
                location.pathname === item.href && "bg-secondary"
              )}
            >
              <Link to={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
          
          {navItemGroups.roleSpecific.length > 0 && (
            <>
              <Separator className="my-2" />
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                {role.charAt(0).toUpperCase() + role.slice(1)} Features
              </p>
              
              {navItemGroups.roleSpecific.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start",
                    location.pathname === item.href && "bg-secondary"
                  )}
                >
                  <Link to={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="space-y-1">
          <Separator className="my-2" />
          {user && (
            <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          )}
          <div className="px-2 py-2">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || 'Not logged in'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
