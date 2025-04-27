
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from 'sonner';
import { LoanVerification, loanVerificationsTable } from '@/utils/supabase-tables';

interface ConsensusVerificationPanelProps {
  loanId: string;
  onConsensusReached: (consensus: 'approved' | 'rejected') => void;
}

export const ConsensusVerificationPanel: React.FC<ConsensusVerificationPanelProps> = ({ loanId, onConsensusReached }) => {
  const [verifications, setVerifications] = useState<LoanVerification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchVerifications();
  }, [loanId]);

  const fetchVerifications = async () => {
    try {
      console.log("Fetching verifications for loan:", loanId);
      // Use the loanVerificationsTable helper function
      const { data, error } = await loanVerificationsTable()
        .select('*')
        .eq('loan_id', loanId);

      if (error) {
        console.error("Error fetching verifications:", error);
        toast.error("Failed to load verifications");
      } else {
        console.log("Verifications fetched successfully:", data);
        // Set verifications with type safety
        setVerifications(data || []);
      }
    } catch (error) {
      console.error("Error fetching verifications:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleVerification = async (status: 'approved' | 'rejected') => {
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(`Submitting ${status} verification for loan:`, loanId);
      const userId = user.id;

      // Create new verification object with proper typing
      const newVerification: Omit<LoanVerification, 'id' | 'created_at'> = {
        loan_id: loanId,
        user_id: userId,
        bank_id: user.id,
        status
      };

      console.log("Verification data being submitted:", newVerification);

      // Use the loanVerificationsTable helper function for insert
      const { data, error } = await loanVerificationsTable()
        .insert(newVerification);

      if (error) {
        console.error("Error submitting verification:", error);
        toast.error("Failed to submit verification");
        return;
      }

      console.log("Verification submitted successfully:", data);
      
      // Refresh verifications
      fetchVerifications();
      
      // Check if consensus is reached after adding new verification
      const updatedVerifications = [...verifications, data?.[0] as LoanVerification];
      const approvedCount = updatedVerifications.filter(v => v.status === 'approved').length;
      const rejectedCount = updatedVerifications.filter(v => v.status === 'rejected').length;
      
      if (approvedCount >= 2) {
        onConsensusReached('approved');
      } else if (rejectedCount >= 2) {
        onConsensusReached('rejected');
      }
      
      toast.success(`Loan ${status} successfully`);
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVerificationStatus = (): 'approved' | 'rejected' | 'pending' => {
    if (!user) return 'pending';
    
    const userVerification = verifications.find(v => v.bank_id === user.id);
    return userVerification ? userVerification.status : 'pending';
  };

  const verificationStatus = getVerificationStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Verification</CardTitle>
        <CardDescription>Provide your assessment for this loan application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{user?.name || 'Bank User'}</p>
            <p className="text-sm text-muted-foreground">
              {user?.email || 'bank@example.com'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleVerification('approved')}
            disabled={isSubmitting || verificationStatus !== 'pending'}
            className={`flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              verificationStatus === 'approved'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
            Approve
          </button>
          <button
            onClick={() => handleVerification('rejected')}
            disabled={isSubmitting || verificationStatus !== 'pending'}
            className={`flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              verificationStatus === 'rejected'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
            Reject
          </button>
        </div>

        {/* Display current verifications */}
        {verifications.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Current Verifications</h4>
            {verifications.map((verification, index) => (
              <div key={verification.id || index} className="flex items-center justify-between text-sm">
                <span>Bank ID: {verification.bank_id.substring(0, 8)}...</span>
                <span className={verification.status === 'approved' ? 'text-green-600' : 'text-red-600'}>
                  {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
