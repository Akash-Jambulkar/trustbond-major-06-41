
import React, { createContext, useContext, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {}
});

export const useSidebar = () => {
  return useContext(SidebarContext);
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Sidebar = ({ children, className, ...props }: SidebarProps) => {
  const { collapsed } = useSidebar();

  return (
    <div
      data-sidebar=""
      data-collapsed={collapsed}
      className={cn(
        "h-full border-r bg-white transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[260px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarInset = ({ children, className, ...props }: SidebarProps) => {
  return (
    <div
      className={cn("h-full flex-1 overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
};
