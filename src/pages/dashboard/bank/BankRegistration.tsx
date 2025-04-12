
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { BankRegistrationForm } from "@/components/bank/BankRegistrationForm";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { getBankRegistrationStatus } from "@/utils/bankRegistration";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { BankRegistration as BankRegistrationType } from "@/utils/bankRegistration";

export default function BankRegistration() {
  const { isConnected, account } = useBlockchain();
  const [registration, setRegistration] = useState<BankRegistrationType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistration = async () => {
      if (isConnected && account) {
        setLoading(true);
        try {
          const data = await getBankRegistrationStatus(account);
          setRegistration(data);
        } catch (error) {
          console.error("Error fetching registration:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setRegistration(null);
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [isConnected, account]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center text-green-600 font-medium">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Approved</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-red-600 font-medium">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-amber-600 font-medium">
            <Clock className="h-5 w-5 mr-2" />
            <span>Pending Review</span>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Bank Registration - TrustBond</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Bank Registration</h1>
        
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Registration Information</AlertTitle>
            <AlertDescription className="text-blue-700">
              Banks must complete this registration process to join the TrustBond network. Your 
              application will be reviewed by the network administrators before approval.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="registration" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4">
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="status">Application Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="registration">
              <BankRegistrationForm />
            </TabsContent>
            
            <TabsContent value="status">
              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                  <CardDescription>
                    Check the status of your bank registration application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isConnected ? (
                    loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading application status...</p>
                      </div>
                    ) : registration ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-medium">{registration.name}</h3>
                          {getStatusBadge(registration.status)}
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Registration ID</p>
                            <p className="font-medium">{registration.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Registration Number</p>
                            <p className="font-medium">{registration.registrationNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Wallet Address</p>
                            <p className="font-mono text-sm">{registration.walletAddress}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Submitted On</p>
                            <p className="font-medium">{new Date(registration.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {registration.blockchainTxHash && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium mb-1">Blockchain Transaction</p>
                            <a 
                              href={`https://etherscan.io/tx/${registration.blockchainTxHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-mono text-sm break-all"
                            >
                              {registration.blockchainTxHash}
                            </a>
                          </div>
                        )}
                        
                        {registration.status === 'pending' && (
                          <Alert className="bg-amber-50 border-amber-200">
                            <Clock className="h-4 w-4 text-amber-600" />
                            <AlertTitle className="text-amber-800">Under Review</AlertTitle>
                            <AlertDescription className="text-amber-700">
                              Your application is currently under review. You will be notified when the status changes.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {registration.status === 'approved' && (
                          <div className="flex justify-center">
                            <Button className="bg-green-600 hover:bg-green-700">
                              Access Bank Dashboard
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No applications found for your connected wallet address.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-amber-600">
                        Please connect your wallet to check your application status.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
