
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { WalletStatus } from "@/components/WalletStatus";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { getNavItems } from "./getNavItems";

interface SidebarNavProps {
  user: User | null;
  onLogout: () => void;
}

export function SidebarNav({ user, onLogout }: SidebarNavProps) {
  const location = useLocation();

  const { main: mainNavItems, roleSpecific: roleNavItems } = getNavItems(user);

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href.endsWith('home') && location.pathname === href.replace('/home', '')) return true;
    return location.pathname.startsWith(href) && href !== `/dashboard/${user?.role}`;
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex flex-col space-y-1 p-4">
          <h1 className="text-2xl font-bold text-trustbond-primary">TrustBond</h1>
          <p className="text-sm text-gray-500">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Portal</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item, index) => (
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
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Role-specific navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {roleNavItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link to={item.href} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <SidebarMenuBadge>
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="flex flex-col gap-2">
          <WalletStatus />
          <Button 
            onClick={onLogout} 
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
