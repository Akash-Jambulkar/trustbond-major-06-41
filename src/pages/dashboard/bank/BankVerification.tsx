
import React, { useState } from "react";
import { VerificationSteps } from "@/components/verification/VerificationSteps";
import { DocumentViewer } from "@/components/verification/DocumentViewer";
import { FraudDetectionPanel } from "@/components/verification/FraudDetectionPanel";
import { DocumentType } from "@/utils/documentHash";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";

// Sample document URL - in a real app, this would be loaded from a secure source
const SAMPLE_DOCUMENT_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export default function BankVerification() {
  const [currentTab, setCurrentTab] = useState<string>("kyc");
  const [loanId, setLoanId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { isConnected, loanContract, account, approveLoan, rejectLoan } = useBlockchain();

  const handleApproveLoan = async () => {
    if (!loanId.trim()) {
      toast.error("Please enter a valid loan ID");
      return;
    }

    setIsProcessing(true);
    try {
      await approveLoan(parseInt(loanId));
      toast.success(`Loan #${loanId} has been approved successfully`);
      setLoanId("");
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error(`Failed to approve loan: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectLoan = async () => {
    if (!loanId.trim()) {
      toast.error("Please enter a valid loan ID");
      return;
    }

    setIsProcessing(true);
    try {
      await rejectLoan(parseInt(loanId));
      toast.success(`Loan #${loanId} has been rejected`);
      setLoanId("");
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error(`Failed to reject loan: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">KYC Verification Center</h1>
        <p className="text-muted-foreground">
          Verify and secure identity documents on the blockchain
        </p>
      </div>

      <Tabs defaultValue="kyc" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="loans">Loan Approval</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kyc">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <VerificationSteps currentStep={3} />
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <DocumentViewer
                documentURL={SAMPLE_DOCUMENT_URL}
                documentType="Aadhaar"
                documentHash="0x8a723aef5d7e86c65a3a321e7d77bc5a82f7aeb761d61f706cbf13f1dcad6478"
                onVerify={(approved) => {
                  toast(`Document ${approved ? 'approved' : 'rejected'}`);
                }}
              />
              
              <FraudDetectionPanel
                documentType={"aadhaar" as DocumentType}
                documentNumber="123456789012"
                onAnalysisComplete={(result) => {
                  console.log("Analysis result:", result);
                }}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="loans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Approval Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review and approve or reject loan applications using the blockchain smart contract.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="loanId" className="text-sm font-medium">
                        Loan ID
                      </label>
                      <input
                        id="loanId"
                        type="text"
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter Loan ID"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        disabled={!isConnected || isProcessing || !loanId.trim()}
                        onClick={handleApproveLoan}
                      >
                        {isProcessing ? "Processing..." : "Approve Loan"}
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        className="w-full" 
                        disabled={!isConnected || isProcessing || !loanId.trim()}
                        onClick={handleRejectLoan}
                      >
                        {isProcessing ? "Processing..." : "Reject Loan"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Contract Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Loan Approval Process</h3>
                    <p className="text-sm text-muted-foreground">
                      When a loan is approved, the smart contract automatically:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      <li>Updates the loan status on the blockchain</li>
                      <li>Transfers the loan amount to the borrower's wallet</li>
                      <li>Records the transaction details immutably</li>
                      <li>Updates the borrower's trust score</li>
                      <li>Initializes the repayment schedule</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Contract Status</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {isConnected ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contract Address:</span>
                        <span className="ml-2 font-mono text-xs">
                          0x5FbDB2315678afecb367f032d93F642f64180aa5
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!isConnected && (
                    <div className="bg-amber-50 p-3 rounded-md text-amber-800 border border-amber-200 text-sm">
                      Please connect your wallet to interact with the loan approval smart contract.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
