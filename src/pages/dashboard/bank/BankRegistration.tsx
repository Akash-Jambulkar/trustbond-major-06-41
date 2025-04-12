
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { BankRegistrationForm } from "@/components/bank/BankRegistrationForm";
import { useBlockchain } from "@/contexts/BlockchainContext";

export default function BankRegistration() {
  const { isConnected } = useBlockchain();

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
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No applications found for your connected wallet address.
                      </p>
                    </div>
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
