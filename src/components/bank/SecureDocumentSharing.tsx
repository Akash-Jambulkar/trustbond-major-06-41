
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ChevronRight, FileText, Lock, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useEffect } from "react";

interface Document {
  id: string;
  name: string;
  type: string;
  user: string;
  date: string;
  status: "verified" | "pending" | "rejected";
}

interface Bank {
  id: string;
  name: string;
  address: string;
  verified: boolean;
}

export function SecureDocumentSharing() {
  const [activeTab, setActiveTab] = useState("share");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [expiryDays, setExpiryDays] = useState("7");
  const [allowDownload, setAllowDownload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<any[]>([]);
  const { isConnected } = useBlockchain();
  
  // Effect to fetch verified documents
  useEffect(() => {
    // In a real implementation, this would fetch from your API or blockchain
    // Leaving documents empty for now
    setDocuments([]);
  }, []);

  // Effect to fetch verified banks
  useEffect(() => {
    // In a real implementation, this would fetch from your API or blockchain
    // Leaving banks empty for now
    setBanks([]); 
  }, []);

  // Effect to fetch shared documents
  useEffect(() => {
    // In a real implementation, this would fetch from your API or blockchain
    // Leaving shared documents empty for now
    setSharedDocuments([]);
  }, []);

  const handleShare = async () => {
    if (!selectedDocument || !selectedBank) {
      toast.error("Please select both a document and a bank");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Document shared successfully", {
        description: `Document access granted to the selected bank for ${expiryDays} days`
      });
      
      setSelectedDocument(null);
      setSelectedBank(null);
      setExpiryDays("7");
      setAllowDownload(false);
      setActiveTab("active");
    } catch (error) {
      toast.error("Failed to share document", {
        description: "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = (shareId: string) => {
    toast.success("Access revoked successfully");
    // In a real app, this would update the list of shared documents
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
            Expired
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Secure Sharing</AlertTitle>
        <AlertDescription className="text-amber-700">
          Document sharing is encrypted end-to-end and access is granted only to verified banks in the network.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="share">Share Document</TabsTrigger>
          <TabsTrigger value="active">Active Shares</TabsTrigger>
          <TabsTrigger value="requests">Access Requests</TabsTrigger>
        </TabsList>
        
        {/* Share Document Tab */}
        <TabsContent value="share">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share Verified Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document">Select Document</Label>
                <Select onValueChange={setSelectedDocument} value={selectedDocument || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified document" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents
                      .filter(doc => doc.status === "verified")
                      .map(doc => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.name} - {doc.user}
                        </SelectItem>
                      ))}
                    {documents.filter(doc => doc.status === "verified").length === 0 && (
                      <SelectItem value="no-docs" disabled>
                        No verified documents available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bank">Share with Bank</Label>
                <Select onValueChange={setSelectedBank} value={selectedBank || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id} disabled={!bank.verified}>
                        {bank.name} {!bank.verified && "(Not Verified)"}
                      </SelectItem>
                    ))}
                    {banks.length === 0 && (
                      <SelectItem value="no-banks" disabled>
                        No verified banks available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Only verified banks can receive shared documents
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Access Expiry</Label>
                  <Select onValueChange={setExpiryDays} value={expiryDays}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiry period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between space-x-2 pt-6">
                  <Label htmlFor="allow-download" className="flex-1">
                    Allow Download
                  </Label>
                  <Switch
                    id="allow-download"
                    checked={allowDownload}
                    onCheckedChange={setAllowDownload}
                  />
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <div className="flex items-center p-3 border rounded-md bg-gray-50">
                  <Lock className="h-4 w-4 mr-2 text-gray-500" />
                  <div className="text-sm text-gray-700">
                    End-to-end encrypted sharing with blockchain verification
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleShare}
                disabled={!selectedDocument || !selectedBank || isSubmitting || !isConnected}
              >
                {isSubmitting ? "Processing..." : "Share Document Securely"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Active Shares Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Active Document Shares
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sharedDocuments.length > 0 ? (
                <div className="space-y-4">
                  {sharedDocuments.map(share => (
                    <div key={share.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">{share.documentName}</h4>
                        <p className="text-sm text-gray-500">
                          Shared with: {share.sharedWith}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">
                            Shared: {share.sharedOn}
                          </p>
                          <span className="text-xs">•</span>
                          <p className="text-xs text-gray-500">
                            Expires: {share.expires}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(share.status)}
                        
                        {share.status === "active" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleRevoke(share.id)}
                          >
                            Revoke Access
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No active document shares
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Requests Tab */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Document Access Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No pending document access requests
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
