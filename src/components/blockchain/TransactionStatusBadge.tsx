
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { TransactionStatus } from "@/utils/transactions";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

export const TransactionStatusBadge = ({ status }: TransactionStatusBadgeProps) => {
  switch (status) {
    case 'confirmed':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Confirmed</span>
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Failed</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
  }
};
