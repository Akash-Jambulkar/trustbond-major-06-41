
import { cn } from "@/lib/utils";
import { PageContainer } from "./PageContainer";
import { BankSidebar } from "./BankSidebar";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen w-full">
      <BankSidebar />
      <PageContainer className={cn("p-4 md:p-6 lg:p-8 w-full", className)} {...props}>
        {children}
      </PageContainer>
    </div>
  );
}
