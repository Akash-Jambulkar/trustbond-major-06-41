
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NetworkStatus } from "@/components/NetworkStatus";
import { ChevronRight, Download, Server, Code, Info, ExternalLink } from "lucide-react";

const BlockchainSetup = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Blockchain Setup</h2>
          <NetworkStatus />
        </div>
        
        <Tabs defaultValue="ganache">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="ganache">Ganache Setup</TabsTrigger>
            <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
            <TabsTrigger value="metamask">MetaMask</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ganache" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Setting Up Ganache
                </CardTitle>
                <CardDescription>
                  Ganache provides a local Ethereum blockchain for testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-amber-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        For Development Only
                      </h3>
                      <p className="mt-2 text-sm text-amber-700">
                        Ganache is for local testing only. The smart contracts deployed to Ganache will not persist after Ganache is closed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Step 1: Install Ganache</h3>
                  <p className="text-sm text-gray-600">
                    Ganache is available as a desktop application or command-line tool.
                  </p>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" className="flex items-center gap-2">
                      <a href="https://trufflesuite.com/ganache/" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        Download Ganache
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href="https://www.npmjs.com/package/ganache" target="_blank" rel="noopener noreferrer">
                        <Code className="h-4 w-4 mr-1" /> 
                        npm i -g ganache
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Step 2: Launch Ganache</h3>
                  <p className="text-sm text-gray-600">
                    Launch Ganache and create a new workspace.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 pl-4">
                    <li>Open the Ganache application</li>
                    <li>Click "New Workspace" (Ethereum)</li>
                    <li>Give your workspace a name (e.g., "TrustBond")</li>
                    <li>Configure the workspace settings:
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>Set port number to 7545</li>
                        <li>Set Network ID to 1337</li>
                      </ul>
                    </li>
                    <li>Click "Save Workspace"</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Step 3: Connect MetaMask to Ganache</h3>
                  <p className="text-sm text-gray-600">
                    Configure MetaMask to connect to your local Ganache blockchain.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 pl-4">
                    <li>Open MetaMask and go to Networks dropdown</li>
                    <li>Select "Add Network" → "Add a network manually"</li>
                    <li>Enter the following details:
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>Network Name: Ganache</li>
                        <li>New RPC URL: http://127.0.0.1:7545</li>
                        <li>Chain ID: 1337</li>
                        <li>Currency Symbol: ETH</li>
                      </ul>
                    </li>
                    <li>Click "Save"</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Step 4: Import Ganache Accounts to MetaMask</h3>
                  <p className="text-sm text-gray-600">
                    Import test accounts from Ganache to MetaMask for testing.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 pl-4">
                    <li>In Ganache, click on the key icon next to any account to view its private key</li>
                    <li>Copy the private key</li>
                    <li>In MetaMask, click on your account icon → "Import Account"</li>
                    <li>Paste the private key and click "Import"</li>
                    <li>Repeat for any additional accounts you need</li>
                  </ol>
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
                  Deploy and interact with TrustBond smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">TrustBond Contract Architecture</h3>
                  <p className="text-sm text-gray-600">
                    TrustBond uses a set of smart contracts for different features.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">KYC Verifier</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Manages identity verification and KYC document submissions.</p>
                        <p className="mt-2 text-xs text-muted-foreground">Address: {CONTRACT_ADDRESSES.KYC_VERIFIER}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Trust Score</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Calculates and stores user trust scores based on verification and history.</p>
                        <p className="mt-2 text-xs text-muted-foreground">Address: {CONTRACT_ADDRESSES.TRUST_SCORE}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Loan Manager</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Handles loan requests, approvals, and repayments.</p>
                        <p className="mt-2 text-xs text-muted-foreground">Address: {CONTRACT_ADDRESSES.LOAN_MANAGER}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Contract Development Tools</h3>
                  <p className="text-sm text-gray-600">
                    Tools for developing, testing, and deploying smart contracts.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          <a href="https://remix.ethereum.org/" target="_blank" rel="noopener noreferrer">
                            Remix IDE
                          </a>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Browser-based IDE for developing Ethereum smart contracts.</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          <a href="https://hardhat.org/" target="_blank" rel="noopener noreferrer">
                            Hardhat
                          </a>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Development environment for Ethereum software.</p>
                      </CardContent>
                    </Card>
                  </div>
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
                    <path d="M28.2 23.5133L24.6814 28.8875L32.2672 30.9394L34.4357 23.6147L28.2 23.5133Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M0.5768 23.6147L2.73509 30.9394L10.3209 28.8875L6.80232 23.5133L0.5768 23.6147Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  MetaMask Configuration
                </CardTitle>
                <CardDescription>
                  Configure MetaMask for TrustBond blockchain interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Wallet Connection
                      </h3>
                      <p className="mt-2 text-sm text-green-700">
                        TrustBond uses MetaMask for blockchain interactions. Connect your wallet using the "Connect MetaMask" button in the top navigation bar.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Step 1: Install MetaMask</h3>
                  <p className="text-sm text-gray-600">
                    If you haven't already, install the MetaMask browser extension.
                  </p>
                  <Button asChild variant="outline" className="flex items-center gap-2">
                    <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      Download MetaMask
                    </a>
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Step 2: Create or Import a Wallet</h3>
                  <p className="text-sm text-gray-600">
                    Follow the MetaMask setup process to create a new wallet or import an existing one.
                  </p>
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Security Tip
                        </h3>
                        <p className="mt-2 text-sm text-blue-700">
                          Always keep your recovery phrase secret and secure. Never share it with anyone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Step 3: Switch to the Correct Network</h3>
                  <p className="text-sm text-gray-600">
                    For testing, connect to Ganache (local) or a testnet like Goerli.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Development</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Use Ganache (localhost:7545) with Network ID 1337.</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Production</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Use Ethereum Mainnet for live transactions (not recommended for testing).</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Step 4: Connect to TrustBond</h3>
                  <p className="text-sm text-gray-600">
                    Click the "Connect MetaMask" button in the TrustBond interface to connect your wallet.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 pl-4">
                    <li>Make sure you're on the correct network in MetaMask</li>
                    <li>Click the "Connect MetaMask" button in TrustBond</li>
                    <li>Approve the connection request in the MetaMask popup</li>
                    <li>Your wallet address will appear in the interface</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Contract addresses for display
const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  TRUST_SCORE: "0x5FbDB2315678afecb367f032d93F642f64180aa4",
  LOAN_MANAGER: "0x5FbDB2315678afecb367f032d93F642f64180aa5",
};

export default BlockchainSetup;
