
import React from "react";
import { CreditScoreReport } from "@/components/credit/CreditScoreReport";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertCircle, 
  Lock, 
  Shield 
} from "lucide-react";

const CreditScorePage = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">External Credit Score</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive credit analysis from our partner credit bureaus
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Credit Score Report</CardTitle>
              <CardDescription>
                Your real-time credit assessment from our partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreditScoreReport />
            </CardContent>
          </Card>

          <div className="col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Shield className="h-4 w-4 mr-2 text-primary" />
                  Data Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your credit score is securely retrieved through encrypted channels. 
                  We never store your full credit report on our servers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Lock className="h-4 w-4 mr-2 text-primary" />
                  Data Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This credit information is used only to enhance your loan eligibility 
                  assessment and is never shared with third parties without your explicit consent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                  Important Note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Credit scores may vary between different agencies. This score is 
                  provided for informational purposes and may differ from scores used by lenders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScorePage;
