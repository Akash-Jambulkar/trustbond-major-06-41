
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KYCDocumentUpload } from "@/components/kyc/KYCDocumentUpload";
import { KYCHistory } from "@/components/kyc/KYCHistory";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";

export const KYCTabs = () => {
  const { user } = useAuth();
  const { isConnected } = useBlockchain();
  
  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="w-full border-b px-6 pt-4">
        <TabsTrigger value="upload" className="px-8 py-2">Document Upload</TabsTrigger>
        <TabsTrigger value="history" className="px-8 py-2">Verification History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="p-6">
        {!isConnected && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to submit KYC documents.
            </AlertDescription>
          </Alert>
        )}
        
        <KYCDocumentUpload />
      </TabsContent>
      
      <TabsContent value="history" className="p-6">
        {!isConnected && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to view your verification history.
            </AlertDescription>
          </Alert>
        )}
        
        <KYCHistory />
      </TabsContent>
    </Tabs>
  );
};
