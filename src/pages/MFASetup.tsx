
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Smartphone, Mail, ArrowLeft } from "lucide-react";

const MFASetup = () => {
  const [method, setMethod] = useState<"sms" | "email">("sms");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setupMFA } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (method === "sms" && !phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await setupMFA(phoneNumber, method);
      if (success) {
        toast.success("Multi-factor authentication enabled successfully");
        navigate(`/dashboard/${user?.role}`);
      }
    } catch (error) {
      console.error("MFA setup error:", error);
      toast.error("Failed to set up multi-factor authentication");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/${user?.role}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-trustbond-primary bg-opacity-10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-trustbond-primary" />
            </div>
            <CardTitle>Set Up Two-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Choose Verification Method</h3>
                <RadioGroup value={method} onValueChange={(value) => setMethod(value as "sms" | "email")} className="space-y-3">
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="sms" id="sms" />
                    <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                      <Smartphone className="h-4 w-4" />
                      <div className="space-y-1">
                        <p className="font-medium leading-none">SMS Verification</p>
                        <p className="text-xs text-muted-foreground">
                          Receive verification codes via text message
                        </p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                      <Mail className="h-4 w-4" />
                      <div className="space-y-1">
                        <p className="font-medium leading-none">Email Verification</p>
                        <p className="text-xs text-muted-foreground">
                          Receive verification codes via email
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {method === "sms" && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Standard message and data rates may apply
                  </p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || (method === "sms" && !phoneNumber)}
              >
                {isSubmitting ? "Setting Up..." : "Enable Two-Factor Authentication"}
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center text-gray-500 text-sm">
        © 2025 TrustBond. All rights reserved.
      </footer>
    </div>
  );
};

export default MFASetup;
