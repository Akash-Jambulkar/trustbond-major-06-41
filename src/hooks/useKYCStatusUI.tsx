
import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { KYCStatusType } from "./useDashboardData";

export const useKYCStatusUI = (kycStatus: KYCStatusType) => {
  const getStatusIcon = () => {
    switch (kycStatus) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'not_submitted':
      case 'not_verified':
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (kycStatus) {
      case 'verified':
        return <span className="text-green-500">Verified</span>;
      case 'pending':
        return <span className="text-amber-500">Pending Verification</span>;
      case 'rejected':
        return <span className="text-red-500">Rejected</span>;
      case 'not_submitted':
      case 'not_verified':
      default:
        return <span className="text-red-500">Not Submitted</span>;
    }
  };

  const getStatusDescription = () => {
    switch (kycStatus) {
      case 'verified':
        return 'Your identity has been verified';
      case 'pending':
        return 'Waiting for bank verification';
      case 'rejected':
        return 'Your verification was rejected. Please submit new documents.';
      case 'not_submitted':
      case 'not_verified':
      default:
        return 'Submit your documents to get verified';
    }
  };

  return {
    getStatusIcon,
    getStatusText,
    getStatusDescription,
    needsAction: kycStatus !== 'verified'
  };
};
