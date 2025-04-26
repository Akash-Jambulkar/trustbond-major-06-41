
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KYCDocumentUpload } from "@/components/KYCDocumentUpload";
import { Shield, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface KYCStatus {
  verification_status: "pending" | "verified" | "rejected";
  document_type: string;
  document_hash: string;
  submitted_at: string;
  verified_at: string | null;
  rejection_reason: string | null;
  blockchain_tx_hash: string | null;
  verification_tx_hash: string | null;
}

export default function KYCPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKYCStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('kyc_document_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('KYC status check error:', error);
        toast({
          variant: "destructive",
          title: "Error retrieving KYC status",
          description: "Please try refreshing the page."
        });
      } else {
        setKycStatus(data);
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCStatus();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your Know Your Customer verification process to access all platform features
        </p>
      </div>

      {isLoading ? (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-32">
              <RefreshCw className="h-8 w-8 animate-spin text-trustbond-primary" />
            </div>
          </CardContent>
        </Card>
      ) : kycStatus ? (
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-trustbond-primary" />
                  KYC Status
                </CardTitle>
                <CardDescription>
                  Current status of your KYC verification
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchKYCStatus}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Document Type</h3>
                  <Badge variant="outline" className="capitalize">
                    {kycStatus.document_type}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Submitted</h3>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(kycStatus.submitted_at), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  {kycStatus.verification_status === "pending" && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Pending Verification
                    </Badge>
                  )}
                  {kycStatus.verification_status === "verified" && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {kycStatus.verification_status === "rejected" && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Rejected
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Document Hash</h3>
                <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                  {kycStatus.document_hash}
                </p>
              </div>

              {kycStatus.blockchain_tx_hash && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Submission Transaction</h3>
                  <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                    {kycStatus.blockchain_tx_hash}
                  </p>
                </div>
              )}

              {kycStatus.verification_status === "verified" && kycStatus.verification_tx_hash && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Verification Transaction</h3>
                  <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                    {kycStatus.verification_tx_hash}
                  </p>
                </div>
              )}

              {kycStatus.verification_status === "rejected" && kycStatus.rejection_reason && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Document Rejected</AlertTitle>
                  <AlertDescription>
                    {kycStatus.rejection_reason}
                  </AlertDescription>
                </Alert>
              )}

              {kycStatus.verification_status === "pending" && (
                <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Verification in Progress</AlertTitle>
                  <AlertDescription>
                    Your document is being reviewed by bank partners. This typically takes 1-2 business days.
                  </AlertDescription>
                </Alert>
              )}

              {kycStatus.verification_status === "verified" && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Verification Complete</AlertTitle>
                  <AlertDescription>
                    Your identity has been verified successfully. You now have full access to platform features.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <KYCDocumentUpload />
      )}
    </div>
  );
}
