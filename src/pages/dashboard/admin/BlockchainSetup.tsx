
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NetworkStatus } from "@/components/NetworkStatus";
import { Server, Code, Info, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Contract addresses for display
const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  TRUST_SCORE: "0x5FbDB2315678afecb367f032d93F642f64180aa4",
  LOAN_MANAGER: "0x5FbDB2315678afecb367f032d93F642f64180aa5",
};

export default function BlockchainSetup() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blockchain Setup</h1>
        <NetworkStatus />
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Blockchain is always enabled</AlertTitle>
        <AlertDescription>
          This platform always uses blockchain functionality for maximum security and transparency.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="ganache">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="ganache">Network Setup</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="metamask">Wallet Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ganache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Network Configuration
              </CardTitle>
              <CardDescription>
                Configure the blockchain network settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Production Network Active
                    </h3>
                    <p className="mt-2 text-sm text-blue-700">
                      The platform is connected to the main blockchain network. All transactions are recorded on the blockchain for maximum security.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Network Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span className="font-medium">Production</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chain ID:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-green-600">Connected</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Gas Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Default Gas Price:</span>
                      <span className="font-medium">5 Gwei</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gas Limit:</span>
                      <span className="font-medium">300,000</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Smart Contracts
              </CardTitle>
              <CardDescription>
                Smart contract details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">KYC Verifier</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Manages identity verification and KYC document submissions.</p>
                    <p className="mt-2 text-xs text-muted-foreground font-mono">{CONTRACT_ADDRESSES.KYC_VERIFIER}</p>
                    <div className="mt-2 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Trust Score</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Calculates and stores user trust scores based on verification and history.</p>
                    <p className="mt-2 text-xs text-muted-foreground font-mono">{CONTRACT_ADDRESSES.TRUST_SCORE}</p>
                    <div className="mt-2 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Loan Manager</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Handles loan requests, approvals, and repayments.</p>
                    <p className="mt-2 text-xs text-muted-foreground font-mono">{CONTRACT_ADDRESSES.LOAN_MANAGER}</p>
                    <div className="mt-2 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metamask" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32.9582 1L19.8241 10.7183L22.2665 5.09987L32.9582 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.04187 1L15.0283 10.8237L12.7336 5.09987L2.04187 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Wallet Configuration
              </CardTitle>
              <CardDescription>
                Connect your wallet to interact with the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-green-50 p-4 border border-green-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Wallet Connection Required
                    </h3>
                    <p className="mt-2 text-sm text-green-700">
                      Connect your wallet using the "Connect" button in the top navigation bar to access all blockchain features.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Download MetaMask
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Install the MetaMask browser extension to connect to the blockchain.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <a href="https://docs.metamask.io/guide/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Wallet Documentation
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Learn how to set up and use your blockchain wallet securely.</p>
                  </CardContent>
                </Card>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => {
                  if (window.ethereum) {
                    window.ethereum.request({ method: 'eth_requestAccounts' });
                  } else {
                    window.open('https://metamask.io/download/', '_blank');
                  }
                }}
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
