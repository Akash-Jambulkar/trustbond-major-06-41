
import { KYCDocumentUpload } from "@/components/KYCDocumentUpload";
import { BlockchainActions } from "@/components/blockchain/BlockchainActions";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

const KYCPage = () => {
  const { account, isConnected } = useBlockchain();
  const [kycStatus, setKycStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch KYC status when connected
  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!isConnected || !account) return;
      
      setIsLoading(true);
      try {
        // For now, simulate a KYC status check
        // In a real implementation, this would call getKYCStatus from the blockchain context
        const simulatedStatus = Math.random() > 0.5;
        setKycStatus(simulatedStatus);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKYCStatus();
  }, [isConnected, account]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">KYC Verification</h1>
          <p className="text-muted-foreground">
            Submit and manage your KYC documents for identity verification.
          </p>
        </div>

        {/* KYC Status Alert */}
        {kycStatus !== null && (
          <Alert className={kycStatus ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
            {kycStatus ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <Info className="h-4 w-4 text-amber-600" />
            )}
            <AlertTitle className={kycStatus ? "text-green-800" : "text-amber-800"}>
              {kycStatus ? "KYC Verified" : "KYC Not Verified"}
            </AlertTitle>
            <AlertDescription className={kycStatus ? "text-green-700" : "text-amber-700"}>
              {kycStatus 
                ? "Your KYC documents have been verified. You now have access to all platform features."
                : "Your KYC documents are pending verification or have not been submitted. Please submit or wait for verification."}
            </AlertDescription>
          </Alert>
        )}

        {/* If not connected, show warning */}
        {!isConnected && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Not Connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to submit and view your KYC documents.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
            <TabsTrigger value="status">Blockchain Status</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-6">
            <KYCDocumentUpload />
          </TabsContent>
          <TabsContent value="status" className="mt-6">
            <BlockchainActions />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default KYCPage;
