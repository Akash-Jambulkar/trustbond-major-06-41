
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthUser } from "@/contexts/auth/types";
import { getNavItems } from "./getNavItems";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: AuthUser | null;
}

export function SidebarNav({ className, user, ...props }: SidebarNavProps) {
  const { collapsed } = useSidebar();
  
  // If user is not authenticated or has no role, use default items
  const userRole = user?.role || 'user';
  
  // Get navigation items based on user role
  const { mainItems, roleSpecificItems } = getNavItems(userRole);

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <nav className="grid gap-1">
        {!collapsed && (
          <div className="px-4 py-2">
            <h2 className="mb-2 text-sm font-semibold">Dashboard</h2>
          </div>
        )}
        {mainItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                "transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center py-3"
              )
            }
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>
      {roleSpecificItems.length > 0 && (
        <nav className="grid gap-1">
          {!collapsed && (
            <div className="px-4 py-2">
              <h2 className="mb-2 text-sm font-semibold">{userRole === 'bank' ? 'Bank' : userRole === 'admin' ? 'Admin' : 'User'}</h2>
            </div>
          )}
          {roleSpecificItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  "transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center py-3"
                )
              }
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
