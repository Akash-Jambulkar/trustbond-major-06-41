
import React from "react";
import { CircleDollarSign, Clock, CheckCircle, XCircle, AlertTriangle, FileText, BarChart } from "lucide-react";

export const LOAN_STATUS = {
  0: { label: "Applied", icon: Clock, color: "text-amber-500" },
  1: { label: "Under Review", icon: FileText, color: "text-blue-500" },
  2: { label: "Approved", icon: CheckCircle, color: "text-green-500" },
  3: { label: "Rejected", icon: XCircle, color: "text-red-500" },
  4: { label: "Funded", icon: CircleDollarSign, color: "text-emerald-500" },
  5: { label: "Repaying", icon: BarChart, color: "text-indigo-500" },
  6: { label: "Completed", icon: CheckCircle, color: "text-green-700" },
  7: { label: "Defaulted", icon: AlertTriangle, color: "text-red-700" }
};

interface LoanStatusBadgeProps {
  status: number;
}

export const LoanStatusBadge: React.FC<LoanStatusBadgeProps> = ({ status }) => {
  if (!LOAN_STATUS[status]) return null;
  
  const StatusIcon = LOAN_STATUS[status].icon;
  
  return (
    <div className="flex items-center">
      <StatusIcon className={`h-4 w-4 ${LOAN_STATUS[status].color} mr-1`} />
      <span className={`text-sm ${LOAN_STATUS[status].color}`}>
        {LOAN_STATUS[status].label}
      </span>
    </div>
  );
};
