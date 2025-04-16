
import * as React from "react";
import { cn } from "@/lib/utils";

// Sidebar context
interface SidebarContextProps {
  open: boolean;
  toggle: () => void;
}

const SidebarContext = React.createContext<SidebarContextProps>({
  open: true,
  toggle: () => {},
});

// Sidebar provider
interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const context = React.useMemo(
    () => ({
      open,
      toggle,
    }),
    [open, toggle]
  );

  return (
    <SidebarContext.Provider value={context}>
      {children}
    </SidebarContext.Provider>
  );
}

// Hook to use the sidebar context
export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// Sidebar trigger component
interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, children, asChild = false, ...props }, ref) => {
  const { toggle } = useSidebar();

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      ref,
      onClick: (e: React.MouseEvent) => {
        toggle();
        (children as any).props?.onClick?.(e);
      },
      className: cn((children as any).props?.className, className),
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      onClick={toggle}
      className={cn("", className)}
      {...props}
    >
      {children}
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

// Sidebar component
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = useSidebar();

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-72 flex-col bg-white transition-transform md:relative md:translate-x-0",
          !open && "-translate-x-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

// Sidebar content component
export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

// Sidebar header component
export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b border-gray-200 p-4", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

// Sidebar footer component
export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-t border-gray-200 p-4", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

// Sidebar inset component
export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 transition-[margin] duration-300 md:ml-0",
        open && "md:ml-72",
        className
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";
