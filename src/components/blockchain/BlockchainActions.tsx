
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Wallet } from "lucide-react";
import { hashDocument } from "@/utils/documentHash";
import { TransactionHistory } from "./TransactionHistory";
import { setupBasicEventListeners } from "@/utils/eventListener";

export const BlockchainActions = () => {
  const { 
    account, 
    isConnected, 
    kycContract, 
    trustScoreContract,
    loanContract, 
    submitKYC, 
    networkName, 
    isCorrectNetwork 
  } = useBlockchain();
  
  const { enableBlockchain } = useMode();
  const [documentId, setDocumentId] = useState("");
  const [hashedDocument, setHashedDocument] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup event listeners when contracts are available
  useEffect(() => {
    if (enableBlockchain && isConnected && kycContract && trustScoreContract && loanContract) {
      setupBasicEventListeners(kycContract, trustScoreContract, loanContract);
    }
  }, [kycContract, trustScoreContract, loanContract, isConnected, enableBlockchain]);

  const handleGenerateHash = async () => {
    if (!documentId) {
      return;
    }

    setIsHashing(true);
    try {
      const hash = await hashDocument(documentId);
      setHashedDocument(hash);
    } catch (error) {
      console.error("Error hashing document:", error);
    } finally {
      setIsHashing(false);
    }
  };

  const handleSubmitToBlockchain = async () => {
    if (!hashedDocument || !isConnected) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitKYC(hashedDocument);
      setDocumentId("");
      setHashedDocument("");
    } catch (error) {
      console.error("Error submitting to blockchain:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!enableBlockchain) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Blockchain features are disabled</AlertTitle>
        <AlertDescription>
          Enable blockchain features in the settings to use this functionality.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {!isConnected ? (
        <Alert variant="destructive">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet using the button in the top navigation bar.
          </AlertDescription>
        </Alert>
      ) : !isCorrectNetwork ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wrong Network</AlertTitle>
          <AlertDescription>
            Your wallet is connected to {networkName}. Please switch to the correct network.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Hash Generator</CardTitle>
            <CardDescription>Generate a secure hash for your document</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentId">Document ID or Number</Label>
                <Input 
                  id="documentId"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  placeholder="Enter document ID"
                  disabled={!isConnected || isHashing || !isCorrectNetwork}
                />
              </div>

              {hashedDocument && (
                <div>
                  <Label htmlFor="hashedDocument">Document Hash</Label>
                  <div className="flex">
                    <Input 
                      id="hashedDocument"
                      value={hashedDocument}
                      readOnly
                      className="font-mono text-xs"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This hash uniquely represents your document on the blockchain without revealing its contents.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              disabled={!documentId || isHashing || !isConnected || !isCorrectNetwork}
              onClick={handleGenerateHash}
            >
              {isHashing ? "Generating..." : "Generate Hash"}
            </Button>
            <Button
              disabled={!hashedDocument || isSubmitting || !isConnected || !isCorrectNetwork}
              onClick={handleSubmitToBlockchain}
            >
              {isSubmitting ? "Submitting..." : "Submit to Blockchain"}
            </Button>
          </CardFooter>
        </Card>

        <TransactionHistory />
      </div>
    </div>
  );
};
