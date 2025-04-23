
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AlertTriangle, Check, Info, RefreshCcw, Settings, Shield } from "lucide-react";

const BlockchainSetup = () => {
  const { 
    isConnected, 
    networkName, 
    isCorrectNetwork, 
    isGanache, 
    connectWallet, 
    switchNetwork,
    account
  } = useBlockchain();

  const { enableBlockchain, toggleBlockchain } = useMode();
  
  // Contract addresses
  const [contractAddresses, setContractAddresses] = useState({
    kycVerifier: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    trustScore: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    loanManager: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  });

  // Network options
  const networkOptions = [
    { id: 1337, name: "Ganache (Local)" },
    { id: 5, name: "Goerli Testnet" },
    { id: 11155111, name: "Sepolia Testnet" }
  ];

  const handleBlockchainToggle = (checked: boolean) => {
    toggleBlockchain();
    if (checked) {
      toast.success("Blockchain features enabled");
    } else {
      toast.info("Blockchain features disabled");
    }
  };

  const handleAddressUpdate = (contract: string, address: string) => {
    setContractAddresses(prev => ({
      ...prev,
      [contract]: address
    }));
  };

  const handleSaveAddresses = () => {
    // In a production environment, these would be saved to a database
    // For now, we'll just show a toast message
    toast.success("Contract addresses updated");
    localStorage.setItem("contractAddresses", JSON.stringify(contractAddresses));
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast.success("Wallet connected successfully");
    } catch (error) {
      toast.error("Failed to connect wallet. Make sure MetaMask is installed and unlocked.");
    }
  };

  const handleSwitchNetwork = async (networkId: number) => {
    try {
      await switchNetwork(networkId);
      toast.success(`Switched to ${networkOptions.find(n => n.id === networkId)?.name}`);
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast.error("Failed to switch network. This may be due to a MetaMask extension issue.");
    }
  };

  useEffect(() => {
    // Load saved contract addresses from localStorage
    const savedAddresses = localStorage.getItem("contractAddresses");
    if (savedAddresses) {
      setContractAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blockchain Setup</h1>
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => window.location.reload()}>
          <RefreshCcw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <Alert className={`${enableBlockchain ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
        {enableBlockchain ? (
          <Check className="h-4 w-4 text-green-700" />
        ) : (
          <Info className="h-4 w-4 text-amber-700" />
        )}
        <AlertTitle className={enableBlockchain ? "text-green-700" : "text-amber-700"}>
          {enableBlockchain ? "Blockchain features are enabled" : "Blockchain features are disabled"}
        </AlertTitle>
        <AlertDescription className={enableBlockchain ? "text-green-700" : "text-amber-700"}>
          {enableBlockchain
            ? "The system will interact with smart contracts for KYC verification, trust scores, and loan management."
            : "Enable blockchain features to interact with smart contracts for enhanced security and transparency."}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="connection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connection" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Connection Settings
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Smart Contracts
          </TabsTrigger>
        </TabsList>

        {/* Connection Settings Tab */}
        <TabsContent value="connection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Features</CardTitle>
              <CardDescription>
                Enable or disable blockchain integration for enhanced security and transparency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Enable Blockchain Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle blockchain functionality for the entire platform
                  </p>
                </div>
                <Switch checked={enableBlockchain} onCheckedChange={handleBlockchainToggle} />
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Wallet Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to interact with the blockchain
                </p>
                
                {isConnected ? (
                  <Alert className="bg-green-50 border-green-200 text-green-700">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Wallet Connected</AlertTitle>
                    <AlertDescription>
                      <p>Address: {account}</p>
                      <p>Network: {networkName} {isGanache && "(Development)"}</p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button 
                    onClick={handleConnectWallet} 
                    disabled={!enableBlockchain}
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Network Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Select the blockchain network to connect to
                </p>
                
                {!isCorrectNetwork && isConnected && (
                  <Alert className="bg-amber-50 border-amber-200 mb-4">
                    <AlertTriangle className="h-4 w-4 text-amber-700" />
                    <AlertTitle className="text-amber-700">
                      Incorrect Network
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                      You are currently connected to {networkName}. Please switch to a compatible network.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {networkOptions.map(network => (
                    <Button 
                      key={network.id} 
                      variant={networkName === network.name ? "default" : "outline"} 
                      onClick={() => handleSwitchNetwork(network.id)}
                      disabled={!enableBlockchain || !isConnected}
                      className="w-full"
                    >
                      {network.name}
                      {networkName === network.name && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Contracts Tab */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Addresses</CardTitle>
              <CardDescription>
                Configure the addresses for the smart contracts used in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-700" />
                <AlertTitle className="text-blue-700">Configuration Instructions</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <p>After deploying your smart contracts, enter their addresses here to connect the platform.</p>
                  <p className="mt-2">For local development with Ganache, use the addresses provided during deployment.</p>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="kycVerifier">KYC Verifier Contract Address</Label>
                  <Input 
                    id="kycVerifier" 
                    value={contractAddresses.kycVerifier} 
                    onChange={(e) => handleAddressUpdate('kycVerifier', e.target.value)}
                    placeholder="0x..." 
                    className="font-mono"
                  />
                </div>
                
                <div>
                  <Label htmlFor="trustScore">Trust Score Contract Address</Label>
                  <Input 
                    id="trustScore" 
                    value={contractAddresses.trustScore} 
                    onChange={(e) => handleAddressUpdate('trustScore', e.target.value)}
                    placeholder="0x..." 
                    className="font-mono"
                  />
                </div>
                
                <div>
                  <Label htmlFor="loanManager">Loan Manager Contract Address</Label>
                  <Input 
                    id="loanManager" 
                    value={contractAddresses.loanManager} 
                    onChange={(e) => handleAddressUpdate('loanManager', e.target.value)}
                    placeholder="0x..." 
                    className="font-mono"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAddresses} disabled={!enableBlockchain}>
                Save Contract Addresses
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
              <CardDescription>
                Initialize and manage database tables for blockchain operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Database Configuration</AlertTitle>
                <AlertDescription>
                  <p>The system requires several database tables to be set up for proper functioning:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>bank_registrations: For bank registration and approval</li>
                    <li>transactions: For blockchain transaction history</li>
                    <li>kyc_documents: For KYC document tracking</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Bank Registrations Table</h3>
                    <p className="text-sm text-red-500">Not detected</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Initialize
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Transactions Table</h3>
                    <p className="text-sm text-red-500">Not detected</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Initialize
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">KYC Documents Table</h3>
                    <p className="text-sm text-red-500">Not detected</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Initialize
                  </Button>
                </div>
              </div>
              
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-700" />
                <AlertTitle className="text-amber-700">Database Tables Not Detected</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Database setup requires connecting to Supabase or another database provider. 
                  Please set up the required tables in your database before trying again.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockchainSetup;
