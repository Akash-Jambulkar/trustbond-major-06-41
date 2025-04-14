
import React from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { ConsensusVerificationPanel } from "@/components/bank/ConsensusVerificationPanel";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Shield, Users } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";

const ConsensusVerificationPage = () => {
  const { isConnected } = useBlockchain();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Consensus Verification</h1>
          <p className="text-muted-foreground">
            Participate in multi-bank consensus verification of KYC documents
          </p>
        </div>
        
        {!isConnected && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Wallet Not Connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to participate in consensus verification.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ConsensusVerificationPanel />
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-trustbond-primary" />
                  About Consensus Verification
                </CardTitle>
                <CardDescription>
                  How multi-bank verification works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-trustbond-primary" />
                    Collective Decision Making
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Consensus verification requires multiple banks to review and approve KYC documents, 
                    creating a more trustworthy verification process.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Threshold-based Approval</h3>
                  <p className="text-sm text-muted-foreground">
                    Documents are approved when they receive verification from at least 66% of participating banks.
                    This ensures broad agreement on the document's validity.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Blockchain Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    All consensus decisions are recorded on the blockchain, creating an immutable
                    audit trail of verification decisions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Benefits</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>Reduced fraud through multiple independent verifications</li>
                    <li>Enhanced trust between participating financial institutions</li>
                    <li>Transparent and auditable verification process</li>
                    <li>Reduced verification costs through shared resources</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConsensusVerificationPage;
