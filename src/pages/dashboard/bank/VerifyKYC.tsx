
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface KYCSubmission {
  id: string;
  document_type: string;
  document_hash: string;
  verification_status: string;
  submitted_at: string;
  user_id: string;
  wallet_address?: string;
  user_info?: {
    name: string;
    email: string;
  };
}

const VerifyKYC = () => {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});
  const { verifyKYC } = useBlockchain();
  const { user } = useAuth();

  useEffect(() => {
    fetchKYCSubmissions();
  }, []);

  const fetchKYCSubmissions = async () => {
    setLoading(true);
    try {
      // First fetch the KYC submissions
      const { data, error } = await supabase
        .from('kyc_document_submissions')
        .select('*')
        .eq('verification_status', 'pending');

      if (error) {
        console.error('Error fetching KYC submissions:', error);
        toast.error('Failed to fetch KYC submissions');
        setSubmissions([]);
        return;
      }
      
      if (!data || data.length === 0) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      // Then fetch user profiles separately and combine the data
      const enhancedSubmissions = await Promise.all(data.map(async (submission) => {
        if (submission.user_id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', submission.user_id)
            .maybeSingle();
            
          if (!profileError && profileData) {
            return {
              ...submission,
              user_info: {
                name: profileData.name || 'Unknown User',
                email: profileData.email || 'No email'
              }
            };
          }
        }
        
        return {
          ...submission,
          user_info: { 
            name: 'Unknown User', 
            email: 'No email' 
          }
        };
      }));
      
      setSubmissions(enhancedSubmissions);
    } catch (error) {
      console.error('Error in fetchKYCSubmissions:', error);
      toast.error('An error occurred while fetching KYC submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (kycId: string, status: 'verified' | 'rejected', userWalletAddress?: string) => {
    if (!user || !user.id) return;
    
    // Set verifying state for this submission
    setVerifying(prev => ({ ...prev, [kycId]: true }));
    
    try {
      // Find the submission
      const submission = submissions.find(s => s.id === kycId);
      if (!submission) {
        toast.error('Submission not found');
        return;
      }
      
      // Call blockchain verification if available
      let result;
      try {
        result = await verifyKYC(kycId, status);
      } catch (err) {
        console.error('Error calling verifyKYC:', err);
        toast.error('Failed to verify KYC on blockchain');
        setVerifying(prev => ({ ...prev, [kycId]: false }));
        return;
      }
      
      // Get transaction hash from result if available
      const txHash = result && typeof result === 'object' && result !== null && 'transactionHash' in result
        ? result.transactionHash as string
        : 'blockchain-tx-' + Math.random().toString(36).substring(2, 15);
      
      // Update verification status in database
      const { error: updateError } = await supabase
        .from('kyc_document_submissions')
        .update({
          verification_status: status,
          verified_at: new Date().toISOString(),
          verification_tx_hash: txHash,
          verifier_address: user.walletAddress || 'bank-verification'
        })
        .eq('id', kycId);

      if (updateError) {
        console.error('Error updating KYC submission:', updateError);
        toast.error('Failed to update verification status in database');
      } else {
        // Also update user's profile KYC status
        if (submission.user_id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ kyc_status: status })
            .eq('id', submission.user_id);
            
          if (profileError) {
            console.error('Error updating user KYC status:', profileError);
          }
        }
        
        // Log transaction
        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            transaction_hash: txHash,
            type: 'kyc_verification',
            status: 'completed',
            from_address: user.walletAddress || user.id,
            user_id: submission.user_id,
            bank_id: user.id
          });
          
        if (txError) {
          console.error('Error recording transaction:', txError);
        }
        
        toast.success(`KYC ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
        fetchKYCSubmissions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error verifying KYC:', error);
      toast.error('An error occurred during verification');
    } finally {
      setVerifying(prev => ({ ...prev, [kycId]: false }));
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">KYC Verification</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">No pending KYC submissions found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map(submission => (
            <Card key={submission.id} className="p-4">
              <h3 className="text-lg font-semibold">
                {submission.user_info?.name || 'Unknown User'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {submission.user_info?.email || 'No email'}
              </p>
              
              <div className="space-y-2 mb-4">
                <p><span className="font-medium">Document Type:</span> {submission.document_type}</p>
                <p><span className="font-medium">Submitted:</span> {new Date(submission.submitted_at).toLocaleString()}</p>
                <p className="text-xs truncate">
                  <span className="font-medium">Document Hash:</span> {submission.document_hash}
                </p>
                {submission.wallet_address && (
                  <p className="text-xs truncate">
                    <span className="font-medium">Wallet:</span> {submission.wallet_address}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleVerify(submission.id, 'verified', submission.wallet_address)}
                  className="flex-1"
                  disabled={verifying[submission.id]}
                >
                  {verifying[submission.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Approve
                </Button>
                <Button
                  onClick={() => handleVerify(submission.id, 'rejected', submission.wallet_address)}
                  variant="destructive"
                  className="flex-1"
                  disabled={verifying[submission.id]}
                >
                  {verifying[submission.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyKYC;
