
import { cn } from "@/lib/utils";
import { PageContainer } from "./PageContainer";
import { BankSidebar } from "./BankSidebar";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <BankSidebar />
      <PageContainer className={cn("p-8", className)} {...props}>
        {children}
      </PageContainer>
    </div>
  );
}
