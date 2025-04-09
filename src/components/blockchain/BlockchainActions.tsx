
import { useState } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, LineChart, CreditCard, AlertCircle } from "lucide-react";

export const BlockchainActions = () => {
  const { 
    isConnected, 
    account, 
    submitKYC, 
    getKYCStatus, 
    getTrustScore,
    requestLoan,
    getUserLoans,
    connectionError
  } = useBlockchain();
  
  const { enableBlockchain, isDemoMode } = useMode();

  const [documentHash, setDocumentHash] = useState("");
  const [kycStatus, setKycStatus] = useState<boolean | null>(null);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanDuration, setLoanDuration] = useState("");
  const [userLoans, setUserLoans] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // In demo mode or when blockchain is disabled, generate mock data
  const handleSubmitKYC = async () => {
    if (!documentHash) {
      toast.error("Please enter a document hash");
      return;
    }

    setIsLoading(true);
    try {
      if (isDemoMode || !enableBlockchain) {
        // Mock behavior for demo mode
        setTimeout(() => {
          toast.success("KYC documentation submitted successfully (Demo)");
          setDocumentHash("");
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // Real blockchain interaction
      await submitKYC(documentHash);
      setDocumentHash("");
    } catch (error) {
      console.error("Error submitting KYC:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckKYCStatus = async () => {
    if (!account && !isDemoMode) return;

    setIsLoading(true);
    try {
      if (isDemoMode || !enableBlockchain) {
        // Mock behavior for demo mode
        setTimeout(() => {
          const mockStatus = Math.random() > 0.3;
          setKycStatus(mockStatus);
          toast.info(`KYC Status: ${mockStatus ? "Verified" : "Not Verified"} (Demo)`);
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // Real blockchain interaction
      const status = await getKYCStatus(account!);
      setKycStatus(status);
      toast.info(`KYC Status: ${status ? "Verified" : "Not Verified"}`);
    } catch (error) {
      console.error("Error checking KYC status:", error);
      toast.error("Failed to check KYC status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckTrustScore = async () => {
    if (!account && !isDemoMode) return;

    setIsLoading(true);
    try {
      if (isDemoMode || !enableBlockchain) {
        // Mock behavior for demo mode
        setTimeout(() => {
          const mockScore = Math.floor(Math.random() * 100);
          setTrustScore(mockScore);
          toast.info(`Trust Score: ${mockScore} (Demo)`);
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // Real blockchain interaction
      const score = await getTrustScore(account!);
      setTrustScore(score);
      toast.info(`Trust Score: ${score}`);
    } catch (error) {
      console.error("Error checking trust score:", error);
      toast.error("Failed to check trust score");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestLoan = async () => {
    if (!loanAmount || !loanDuration) {
      toast.error("Please enter loan amount and duration");
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseFloat(loanAmount);
      const duration = parseInt(loanDuration);
      
      if (isNaN(amount) || isNaN(duration)) {
        throw new Error("Invalid loan parameters");
      }

      if (isDemoMode || !enableBlockchain) {
        // Mock behavior for demo mode
        setTimeout(() => {
          toast.success(`Loan request for ${amount} ETH submitted successfully (Demo)`);
          setLoanAmount("");
          setLoanDuration("");
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // Real blockchain interaction
      await requestLoan(amount, duration);
      setLoanAmount("");
      setLoanDuration("");
    } catch (error) {
      console.error("Error requesting loan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetUserLoans = async () => {
    if (!account && !isDemoMode) return;

    setIsLoading(true);
    try {
      if (isDemoMode || !enableBlockchain) {
        // Mock behavior for demo mode
        setTimeout(() => {
          const mockLoans = Math.random() > 0.5 
            ? [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000)]
            : [];
            
          setUserLoans(mockLoans);
          
          if (mockLoans.length === 0) {
            toast.info("No loans found for this account (Demo)");
          } else {
            toast.info(`Found ${mockLoans.length} loans (Demo)`);
          }
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // Real blockchain interaction
      const loans = await getUserLoans(account!);
      setUserLoans(loans);
      
      if (loans.length === 0) {
        toast.info("No loans found for this account");
      } else {
        toast.info(`Found ${loans.length} loans`);
      }
    } catch (error) {
      console.error("Error getting user loans:", error);
      toast.error("Failed to get user loans");
    } finally {
      setIsLoading(false);
    }
  };

  if (!enableBlockchain) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Actions</CardTitle>
          <CardDescription>Blockchain features are currently disabled</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 text-muted-foreground flex-col gap-2">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-center">
              Blockchain features are currently disabled in the app settings
            </p>
            <p className="text-xs text-center">
              Enable blockchain features in the mode toggle settings to interact with smart contracts
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected && !isDemoMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Actions</CardTitle>
          <CardDescription>Connect your wallet to interact with smart contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center p-6 text-muted-foreground">
            Please connect your MetaMask wallet to access blockchain features
          </p>
          {connectionError && (
            <div className="mt-2 p-3 bg-red-50 rounded-md text-sm text-red-600 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Connection Error</p>
                <p className="text-xs mt-1">{connectionError}</p>
                <p className="text-xs mt-2">
                  Ensure MetaMask is installed and unlocked. You can still use the app in demo mode
                  if MetaMask is not available.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Actions</CardTitle>
        <CardDescription>
          {isDemoMode ? "Demo Mode: Using simulated blockchain interactions" : "Interact with TrustBond smart contracts"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="kyc">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="kyc" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>KYC</span>
            </TabsTrigger>
            <TabsTrigger value="trust" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Trust Score</span>
            </TabsTrigger>
            <TabsTrigger value="loans" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Loans</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="kyc" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Submit KYC Documents</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Document Hash"
                  value={documentHash}
                  onChange={(e) => setDocumentHash(e.target.value)}
                />
                <Button onClick={handleSubmitKYC} disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the IPFS hash of your encrypted documents
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">KYC Status</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCheckKYCStatus} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Checking..." : "Check KYC Status"}
                </Button>
                {kycStatus !== null && (
                  <Badge variant={kycStatus ? "default" : "secondary"}>
                    {kycStatus ? "Verified" : "Not Verified"}
                  </Badge>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trust" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Your Trust Score</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCheckTrustScore} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Checking..." : "Check Trust Score"}
                </Button>
                {trustScore !== null && (
                  <Badge variant="default">{trustScore}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Trust scores range from 0 (unverified) to 100 (excellent)
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="loans" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Request Loan</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  placeholder="Amount (ETH)"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  type="number"
                  min="0.1"
                  step="0.1"
                />
                <Input
                  placeholder="Duration (days)"
                  value={loanDuration}
                  onChange={(e) => setLoanDuration(e.target.value)}
                  type="number"
                  min="1"
                />
              </div>
              <Button 
                onClick={handleRequestLoan} 
                disabled={isLoading || !loanAmount || !loanDuration}
                className="w-full"
              >
                {isLoading ? "Requesting..." : "Request Loan"}
              </Button>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Your Loans</h3>
              <Button 
                variant="outline" 
                onClick={handleGetUserLoans} 
                disabled={isLoading}
                className="w-full mb-2"
              >
                {isLoading ? "Loading..." : "View Your Loans"}
              </Button>
              
              {userLoans.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {userLoans.map((loanId) => (
                    <div key={loanId} className="p-2 text-sm">
                      Loan #{loanId}
                    </div>
                  ))}
                </div>
              ) : userLoans.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-2">
                  No loans found
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
        {isDemoMode ? "Demo Mode: No real wallet connected" : `Connected to: ${account}`}
      </CardFooter>
    </Card>
  );
};
