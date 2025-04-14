
import React from "react";
import { CircleDollarSign, Clock, CheckCircle, XCircle, AlertTriangle, FileText, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const LOAN_STATUS = {
  0: { label: "Applied", icon: Clock, color: "text-amber-500", badgeVariant: "outline", bgColor: "bg-amber-50 border-amber-200 text-amber-700" },
  1: { label: "Under Review", icon: FileText, color: "text-blue-500", badgeVariant: "outline", bgColor: "bg-blue-50 border-blue-200 text-blue-700" },
  2: { label: "Approved", icon: CheckCircle, color: "text-green-500", badgeVariant: "outline", bgColor: "bg-green-50 border-green-200 text-green-700" },
  3: { label: "Rejected", icon: XCircle, color: "text-red-500", badgeVariant: "outline", bgColor: "bg-red-50 border-red-200 text-red-700" },
  4: { label: "Funded", icon: CircleDollarSign, color: "text-emerald-500", badgeVariant: "outline", bgColor: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  5: { label: "Repaying", icon: BarChart, color: "text-indigo-500", badgeVariant: "outline", bgColor: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  6: { label: "Completed", icon: CheckCircle, color: "text-green-700", badgeVariant: "outline", bgColor: "bg-green-50 border-green-200 text-green-800" },
  7: { label: "Defaulted", icon: AlertTriangle, color: "text-red-700", badgeVariant: "outline", bgColor: "bg-red-50 border-red-200 text-red-800" }
};

interface LoanStatusBadgeProps {
  status: number;
  showIcon?: boolean;
  showBadge?: boolean;
}

export const LoanStatusBadge: React.FC<LoanStatusBadgeProps> = ({ 
  status, 
  showIcon = true, 
  showBadge = false 
}) => {
  if (!LOAN_STATUS[status]) return null;
  
  const StatusIcon = LOAN_STATUS[status].icon;
  
  if (showBadge) {
    return (
      <Badge variant="outline" className={LOAN_STATUS[status]?.bgColor || ""}>
        {showIcon && <StatusIcon className="h-3 w-3 mr-1" />}
        {LOAN_STATUS[status].label}
      </Badge>
    );
  }
  
  return (
    <div className="flex items-center">
      {showIcon && <StatusIcon className={`h-4 w-4 ${LOAN_STATUS[status].color} mr-1`} />}
      <span className={`text-sm ${LOAN_STATUS[status].color}`}>
        {LOAN_STATUS[status].label}
      </span>
    </div>
  );
};
