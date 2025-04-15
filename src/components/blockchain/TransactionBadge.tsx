
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, CreditCard, Shield, FileText } from "lucide-react";

interface TransactionBadgeProps {
  type: string;
  className?: string;
}

export const TransactionBadge = ({ type, className }: TransactionBadgeProps) => {
  let badgeContent;
  
  switch (type.toLowerCase()) {
    case "kyc":
      badgeContent = {
        label: "KYC",
        icon: Shield,
        color: "bg-blue-50 text-blue-700 border-blue-200"
      };
      break;
    case "verification":
      badgeContent = {
        label: "Verification",
        icon: CheckCircle,
        color: "bg-green-50 text-green-700 border-green-200"
      };
      break;
    case "loan":
      badgeContent = {
        label: "Loan",
        icon: CreditCard,
        color: "bg-purple-50 text-purple-700 border-purple-200"
      };
      break;
    case "repayment":
      badgeContent = {
        label: "Repayment",
        icon: CreditCard,
        color: "bg-amber-50 text-amber-700 border-amber-200"
      };
      break;
    default:
      badgeContent = {
        label: "Transaction",
        icon: FileText,
        color: "bg-gray-50 text-gray-700 border-gray-200"
      };
  }
  
  const Icon = badgeContent.icon;
  
  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${badgeContent.color} ${className}`}>
      <Icon className="h-3 w-3" />
      <span>{badgeContent.label}</span>
    </Badge>
  );
};
