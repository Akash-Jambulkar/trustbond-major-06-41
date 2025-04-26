
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface KYCSubmission {
  id: string;
  user_id: string;
  document_type: string;
  document_hash: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  blockchain_address?: string;
  wallet_address?: string;
  user_email?: string;
  user_name?: string;
}

const VerifyKYCPage = () => {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const { isConnected, account, verifyKYC } = useBlockchain();
  const { user } = useAuth();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      console.log("Fetching KYC submissions...");
      
      // Use either kyc_documents or kyc_document_submissions table
      // First try kyc_document_submissions
      let { data: submissionsData, error: submissionsError } = await supabase
        .from('kyc_document_submissions')
        .select(`
          id,
          user_id,
          document_type,
          document_hash,
          verification_status as status,
          submitted_at as created_at,
          wallet_address,
          profiles:user_id (email, name)
        `)
        .eq('verification_status', 'pending');
      
      if (submissionsError || !submissionsData || submissionsData.length === 0) {
        console.log("No data in kyc_document_submissions or error, trying kyc_documents");
        
        // Fall back to kyc_documents if no submissions found
        const { data: docsData, error: docsError } = await supabase
          .from('kyc_documents')
          .select(`
            id,
            user_id,
            document_type,
            document_hash,
            verification_status as status,
            created_at,
            profiles:user_id (email, name)
          `)
          .eq('verification_status', 'pending');
          
        if (docsError) {
          console.error("Error fetching from both tables:", docsError);
          throw docsError;
        }
        
        submissionsData = docsData || [];
      }
      
      console.log("Fetched submissions:", submissionsData);
      
      const formattedSubmissions = submissionsData.map((sub: any) => ({
        id: sub.id,
        user_id: sub.user_id,
        document_type: sub.document_type,
        document_hash: sub.document_hash,
        status: sub.status,
        created_at: sub.created_at,
        blockchain_address: sub.blockchain_address || "",
        wallet_address: sub.wallet_address || "",
        user_email: sub.profiles?.email,
        user_name: sub.profiles?.name
      }));
      
      setSubmissions(formattedSubmissions);
      console.log("Formatted submissions:", formattedSubmissions);
    } catch (error) {
      console.error("Error fetching KYC submissions:", error);
      toast.error("Failed to load KYC submissions");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.role === 'bank') {
      fetchSubmissions();
    }
  }, [user]);
  
  const handleUpdateVerification = async (submission: KYCSubmission, approved: boolean) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    try {
      setVerifying(true);
      
      if (!submission.id) {
        toast.error("No KYC ID found for submission");
        setVerifying(false);
        return;
      }
      
      const verificationStatus = approved ? 'verified' as const : 'rejected' as const;
      console.log(`Verifying KYC ${submission.id} as ${verificationStatus}`);
      
      // Try blockchain verification first
      let success = false;
      if (submission.wallet_address) {
        try {
          success = await verifyKYC(submission.id, verificationStatus);
          console.log("Blockchain verification result:", success);
        } catch (error) {
          console.error("Blockchain verification failed:", error);
        }
      }
      
      // Update database record regardless of blockchain result
      // Try kyc_document_submissions first
      const { error: subError } = await supabase
        .from('kyc_document_submissions')
        .update({ 
          verification_status: verificationStatus,
          verifier_address: account,
          verified_at: new Date().toISOString(),
          rejection_reason: !approved ? rejectionReason : null
        })
        .eq('id', submission.id);
        
      if (subError) {
        console.log("Could not update kyc_document_submissions, trying kyc_documents");
        // Try kyc_documents if submission update fails
        const { error: docError } = await supabase
          .from('kyc_documents')
          .update({ 
            verification_status: verificationStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', submission.id);
          
        if (docError) {
          console.error("Error updating both tables:", docError);
          throw docError;
        }
      }
      
      // Update user profile KYC status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: verificationStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.user_id);
        
      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
      
      // Remove from list
      setSubmissions(prev => 
        prev.filter(sub => sub.id !== submission.id)
      );
      
      toast.success(`KYC ${approved ? 'approved' : 'rejected'} successfully`);
      setIsDialogOpen(false);
      setRejectionReason("");
      
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast.error(`Failed to ${approved ? 'approve' : 'reject'} KYC`);
    } finally {
      setVerifying(false);
    }
  };
  
  const openDetailDialog = (submission: KYCSubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
    setRejectionReason("");
  };
  
  if (user?.role !== 'bank' && user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              You do not have permission to access this page.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Verify KYC Submissions</h1>
          <p className="text-muted-foreground">
            Review and verify KYC documents submitted by users.
          </p>
        </div>
        <Button variant="outline" onClick={fetchSubmissions} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-trustbond-primary" />
            Pending KYC Verifications
          </CardTitle>
          <CardDescription>
            Verify or reject KYC submissions. This will update the user's verification status on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending KYC submissions to verify.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.user_name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{submission.user_email || 'No email'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{submission.document_type}</TableCell>
                    <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {submission.wallet_address || submission.blockchain_address || 'No wallet'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{submission.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openDetailDialog(submission)}>
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {selectedSubmission && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Verify KYC Submission</DialogTitle>
              <DialogDescription>
                Review the user's KYC information and approve or reject.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-muted-foreground">User:</div>
                <div className="col-span-2 font-medium">{selectedSubmission.user_name || 'Unknown'}</div>
                
                <div className="text-muted-foreground">Email:</div>
                <div className="col-span-2">{selectedSubmission.user_email || 'No email'}</div>
                
                <div className="text-muted-foreground">Document:</div>
                <div className="col-span-2">{selectedSubmission.document_type}</div>
                
                <div className="text-muted-foreground">Wallet:</div>
                <div className="col-span-2 font-mono text-sm">
                  {selectedSubmission.wallet_address || selectedSubmission.blockchain_address || 'No wallet address'}
                </div>
                
                <div className="text-muted-foreground">Hash:</div>
                <div className="col-span-2 font-mono text-xs truncate">
                  {selectedSubmission.document_hash}
                </div>
                
                <div className="text-muted-foreground">Date:</div>
                <div className="col-span-2">
                  {new Date(selectedSubmission.created_at).toLocaleDateString()}
                </div>
              </div>
              
              {/* Add rejection reason input field */}
              <div className="pt-4">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason (optional)
                </label>
                <textarea 
                  id="rejectionReason"
                  className="w-full p-2 border rounded-md" 
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason if rejecting the KYC submission"
                />
              </div>
            </div>
            
            <DialogFooter className="flex space-x-2 sm:justify-end">
              <Button
                variant="destructive"
                onClick={() => handleUpdateVerification(selectedSubmission, false)}
                disabled={verifying || !isConnected}
              >
                {verifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                Reject
              </Button>
              <Button
                variant="default"
                onClick={() => handleUpdateVerification(selectedSubmission, true)}
                disabled={verifying || !isConnected}
              >
                {verifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VerifyKYCPage;
