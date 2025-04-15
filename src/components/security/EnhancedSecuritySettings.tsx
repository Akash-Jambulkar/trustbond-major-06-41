
import React, { useState } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Shield, Key, Users, AlertTriangle, CheckCircle2, Wallet, Lock } from "lucide-react";

export const EnhancedSecuritySettings: React.FC = () => {
  const { isConnected, account } = useBlockchain();
  const [multiSigEnabled, setMultiSigEnabled] = useState(false);
  const [transactionLimit, setTransactionLimit] = useState("1");
  const [requiredSignatures, setRequiredSignatures] = useState("2");
  const [trustedAddresses, setTrustedAddresses] = useState<string[]>([]);
  const [newTrustedAddress, setNewTrustedAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      toast.success("Security settings updated successfully");
      setIsSaving(false);
    }, 2000);
  };

  const handleAddTrustedAddress = () => {
    if (!newTrustedAddress.startsWith("0x") || newTrustedAddress.length !== 42) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    if (trustedAddresses.includes(newTrustedAddress)) {
      toast.error("This address is already in your trusted list");
      return;
    }

    setTrustedAddresses([...trustedAddresses, newTrustedAddress]);
    setNewTrustedAddress("");
    toast.success("Trusted address added");
  };

  const handleRemoveTrustedAddress = (address: string) => {
    setTrustedAddresses(trustedAddresses.filter(addr => addr !== address));
    toast.success("Trusted address removed");
  };

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium">Wallet Not Connected</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Connect your wallet to configure enhanced security settings for your blockchain transactions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-trustbond-primary" />
          Security Settings
        </h2>
        <p className="text-muted-foreground">
          Configure enhanced security measures for your wallet connections and transactions
        </p>
      </div>

      <Tabs defaultValue="wallet-security">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="wallet-security">Wallet Security</TabsTrigger>
          <TabsTrigger value="transaction-security">Transaction Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallet-security" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Connection Settings
              </CardTitle>
              <CardDescription>
                Configure how your wallet connects to the TrustBond platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-disconnect">Auto Disconnect</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically disconnect wallet after period of inactivity
                  </p>
                </div>
                <Switch id="auto-disconnect" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inactivity-timeout">Inactivity Timeout (minutes)</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="inactivity-timeout">
                    <SelectValue placeholder="Select timeout duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="connection-notifications">Connection Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when your wallet connects/disconnects
                  </p>
                </div>
                <Switch id="connection-notifications" defaultChecked />
              </div>
              
              <div className="border p-4 rounded-md bg-amber-50 border-amber-200">
                <h4 className="text-sm font-medium flex items-center gap-1 text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  Current Connection
                </h4>
                <p className="text-xs text-amber-700 mt-1">
                  Connected address: {account ? 
                    `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 
                    "Not connected"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Advanced Security
              </CardTitle>
              <CardDescription>
                Additional security features to protect your assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="whitelist-only">Whitelist-Only Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Only allow transactions to pre-approved addresses
                  </p>
                </div>
                <Switch id="whitelist-only" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="transaction-notifications">Transaction Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for all transaction activities
                  </p>
                </div>
                <Switch id="transaction-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="spending-limits">Daily Spending Limits</Label>
                  <p className="text-sm text-muted-foreground">
                    Set maximum daily transaction amount
                  </p>
                </div>
                <Switch id="spending-limits" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transaction-security" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Multi-Signature Requirements
              </CardTitle>
              <CardDescription>
                Configure multi-signature requirements for large transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-multisig">Enable Multi-Signature</Label>
                  <p className="text-sm text-muted-foreground">
                    Require multiple signatures for transactions above the limit
                  </p>
                </div>
                <Switch 
                  id="enable-multisig" 
                  checked={multiSigEnabled}
                  onCheckedChange={setMultiSigEnabled}
                />
              </div>
              
              {multiSigEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="transaction-limit">Transaction Limit (ETH)</Label>
                    <Select value={transactionLimit} onValueChange={setTransactionLimit}>
                      <SelectTrigger id="transaction-limit">
                        <SelectValue placeholder="Select limit amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5 ETH</SelectItem>
                        <SelectItem value="1">1 ETH</SelectItem>
                        <SelectItem value="5">5 ETH</SelectItem>
                        <SelectItem value="10">10 ETH</SelectItem>
                        <SelectItem value="25">25 ETH</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Transactions above this amount will require multiple signatures
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="required-signatures">Required Signatures</Label>
                    <Select value={requiredSignatures} onValueChange={setRequiredSignatures}>
                      <SelectTrigger id="required-signatures">
                        <SelectValue placeholder="Number of signatures" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 signatures</SelectItem>
                        <SelectItem value="3">3 signatures</SelectItem>
                        <SelectItem value="4">4 signatures</SelectItem>
                        <SelectItem value="5">5 signatures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Trusted Addresses</Label>
                      {trustedAddresses.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {trustedAddresses.length} address(es) added
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter Ethereum address (0x...)" 
                        value={newTrustedAddress}
                        onChange={(e) => setNewTrustedAddress(e.target.value)}
                      />
                      <Button type="button" onClick={handleAddTrustedAddress}>Add</Button>
                    </div>
                    
                    {trustedAddresses.length > 0 && (
                      <div className="border rounded-md p-2 space-y-2 mt-2">
                        {trustedAddresses.map((address) => (
                          <div key={address} className="flex justify-between items-center text-sm bg-muted p-2 rounded-md">
                            <span>{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</span>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 text-red-500 hover:text-red-700 hover:bg-red-50">
                                  Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Trusted Address</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this address from your trusted list?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoveTrustedAddress(address)} className="bg-red-500 hover:bg-red-600">
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Transaction Security
              </CardTitle>
              <CardDescription>
                Additional security measures for transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="transaction-confirmation">Transaction Confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    Require additional confirmation for all transactions
                  </p>
                </div>
                <Switch id="transaction-confirmation" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="gas-limit">Maximum Gas Fee</Label>
                  <p className="text-sm text-muted-foreground">
                    Set maximum acceptable gas fee for transactions
                  </p>
                </div>
                <Switch id="gas-limit" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-reject">Auto Reject Suspicious Transactions</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically reject transactions that appear suspicious
                  </p>
                </div>
                <Switch id="auto-reject" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Changes
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
