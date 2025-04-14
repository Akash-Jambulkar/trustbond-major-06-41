
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KYCDocumentUpload } from "@/components/kyc/KYCDocumentUpload";
import { KYCHistory } from "@/components/kyc/KYCHistory";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface KYCTabsProps {
  mfaVerified?: boolean;
}

export const KYCTabs = ({ mfaVerified = true }: KYCTabsProps) => {
  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Document Upload</TabsTrigger>
        <TabsTrigger value="history">Verification History</TabsTrigger>
      </TabsList>
      
      {!mfaVerified && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please complete the multi-factor authentication before uploading documents.
          </AlertDescription>
        </Alert>
      )}
      
      <TabsContent value="upload" className="mt-4">
        {mfaVerified ? <KYCDocumentUpload /> : null}
      </TabsContent>
      <TabsContent value="history" className="mt-4">
        <KYCHistory />
      </TabsContent>
    </Tabs>
  );
};
