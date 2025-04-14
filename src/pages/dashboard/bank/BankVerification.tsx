
import React from "react";
import { VerificationSteps } from "@/components/verification/VerificationSteps";
import { DocumentViewer } from "@/components/verification/DocumentViewer";
import { FraudDetectionPanel } from "@/components/verification/FraudDetectionPanel";
import { DocumentType } from "@/utils/documentHash";

// Sample document URL - in a real app, this would be loaded from a secure source
const SAMPLE_DOCUMENT_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export default function BankVerification() {
  // This is a simplified version that demonstrates the components
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">KYC Verification Center</h1>
        <p className="text-muted-foreground">
          Verify and secure identity documents on the blockchain
        </p>
      </div>

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
              alert(`Document ${approved ? 'approved' : 'rejected'}`);
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
    </div>
  );
}
