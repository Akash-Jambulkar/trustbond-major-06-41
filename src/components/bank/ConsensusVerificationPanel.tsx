import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface Verification {
  id: string;
  user_id: string;
  bank_id: string;
  loan_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface ConsensusVerificationPanelProps {
  loanId: string;
  onConsensusReached: (consensus: 'approved' | 'rejected') => void;
}

export const ConsensusVerificationPanel: React.FC<ConsensusVerificationPanelProps> = ({ loanId, onConsensusReached }) => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchVerifications();
  }, [loanId]);

  const fetchVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_verifications')
        .select('*')
        .eq('loan_id', loanId);

      if (error) {
        console.error("Error fetching verifications:", error);
        toast.error("Failed to load verifications");
      } else {
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

    try {
      const userId = user.id;

      const { data, error } = await supabase
        .from('loan_verifications')
        .insert([
          {
            loan_id: loanId,
            user_id: userId,
            bank_id: user.id,
            status: status
          }
        ])
        .select()

      if (error) {
        console.error("Error submitting verification:", error);
        toast.error("Failed to submit verification");
        return;
      }

      fetchVerifications();
      
      // Check if consensus is reached
      const approvedCount = verifications.filter(v => v.status === 'approved').length;
      const rejectedCount = verifications.filter(v => v.status === 'rejected').length;
      
      if (approvedCount >= 2) {
        onConsensusReached('approved');
      } else if (rejectedCount >= 2) {
        onConsensusReached('rejected');
      }
      
      toast.success(`Loan ${status} successfully`);
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error("An unexpected error occurred");
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
            className={`flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${verificationStatus === 'approved'
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            disabled={verificationStatus !== 'pending'}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </button>
          <button
            onClick={() => handleVerification('rejected')}
            className={`flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${verificationStatus === 'rejected'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            disabled={verificationStatus !== 'pending'}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
