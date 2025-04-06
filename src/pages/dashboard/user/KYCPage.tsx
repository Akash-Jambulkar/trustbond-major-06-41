
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FilePenLine, Upload, ShieldCheck, AlertCircle } from "lucide-react";
import { ethers } from "ethers";

const KYCPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [documentHash, setDocumentHash] = useState("");
  const { kycContract, account, isConnected } = useBlockchain();

  // Generate a simple hash for demo purposes
  const generateHash = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as ArrayBuffer;
        const hashArray = Array.from(new Uint8Array(content)).map(b => b.toString(16).padStart(2, '0'));
        const hash = "0x" + hashArray.join('').substring(0, 64);
        resolve(hash);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const hash = await generateHash(file);
      setDocumentHash(hash);
      toast.success("Document prepared for submission");
    } catch (error) {
      console.error("Error preparing document:", error);
      toast.error("Failed to prepare document");
    }
  };

  const submitKYC = async () => {
    if (!documentHash || !kycContract || !isConnected) {
      toast.error("Please connect wallet and select a document first");
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await kycContract.submitKYC(documentHash);
      toast.success("KYC submission sent to blockchain!");
      
      // Wait for transaction confirmation
      await tx.wait();
      toast.success("KYC document successfully submitted!");
    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error("Failed to submit KYC document to blockchain");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkKYCStatus = async () => {
    if (!kycContract || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsChecking(true);
    try {
      const status = await kycContract.getKYCStatus(account);
      setKycStatus(status);
      toast.success("Successfully retrieved KYC status");
    } catch (error) {
      console.error("Error checking KYC status:", error);
      toast.error("Failed to check KYC status");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilePenLine className="h-6 w-6" />
              Submit KYC Documents
            </CardTitle>
            <CardDescription>
              Upload your identity documents for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your document or click to browse
                </p>
                <Input 
                  id="document-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                <Label 
                  htmlFor="document-upload" 
                  className="bg-trustbond-primary text-white py-2 px-4 rounded cursor-pointer hover:bg-trustbond-primary/90"
                >
                  Select Document
                </Label>
                {documentHash && (
                  <div className="mt-4 p-2 bg-gray-50 border border-gray-200 rounded text-xs break-all">
                    <p className="font-semibold">Document Hash:</p>
                    <p>{documentHash}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={submitKYC}
              disabled={!documentHash || isSubmitting || !isConnected}
            >
              {isSubmitting ? "Submitting..." : "Submit Documents"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" />
              KYC Verification Status
            </CardTitle>
            <CardDescription>
              Check the current status of your KYC verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {kycStatus === null ? (
              <div className="border rounded-lg p-6 text-center">
                <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">
                  Connect your wallet and click the button below to check your KYC status
                </p>
              </div>
            ) : (
              <div className={`border rounded-lg p-6 text-center ${kycStatus ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
                {kycStatus ? (
                  <>
                    <ShieldCheck className="h-10 w-10 mx-auto text-green-500 mb-2" />
                    <p className="text-green-700 font-medium">Your KYC has been verified!</p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-10 w-10 mx-auto text-yellow-500 mb-2" />
                    <p className="text-yellow-700 font-medium">Your KYC is pending verification</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={checkKYCStatus}
              disabled={isChecking || !isConnected}
            >
              {isChecking ? "Checking..." : "Check KYC Status"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default KYCPage;
