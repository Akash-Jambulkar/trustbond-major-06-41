
import { useEffect } from "react";
import { KYCDocumentUpload } from "@/components/kyc/KYCDocumentUpload";
import { KYCWorkflowStatus } from "@/components/kyc/KYCWorkflowStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useKYCSubmission } from "@/hooks/useKYCSubmission";

export default function KYCPage() {
  const { user } = useAuth();
  const { submission, isLoading, error } = useKYCSubmission(user?.id);

  useEffect(() => {
    if (error) {
      console.error('KYC submission error:', error);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your Know Your Customer verification process to access all platform features
        </p>
      </div>

      <KYCWorkflowStatus 
        submission={submission || undefined} 
        userRole={user?.role || 'user'} 
        isLoading={isLoading} 
      />

      {(!submission || submission.verification_status === 'rejected') && (
        <KYCDocumentUpload />
      )}
    </div>
  );
}
