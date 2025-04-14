
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KYCDocumentUpload } from "@/components/KYCDocumentUpload";
import { BlockchainActions } from "@/components/blockchain/BlockchainActions";

export const KYCTabs = () => {
  return (
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
  );
};
