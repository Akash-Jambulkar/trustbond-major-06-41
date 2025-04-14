
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";

interface MultifactorAuthProps {
  onComplete: (verified: boolean) => void;
  email?: string;
}

export const MultifactorAuth = ({ onComplete, email }: MultifactorAuthProps) => {
  const [value, setValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { isProductionMode } = useMode();

  // In demo mode, we'll auto-fill a code
  useEffect(() => {
    if (!isProductionMode && !isCodeSent) {
      setTimeout(() => {
        setIsCodeSent(true);
        toast.success("Demo verification code sent", {
          description: "Use code 123456 to verify",
        });
      }, 1000);
    }
  }, [isProductionMode]);
  
  const handleSendCode = async () => {
    setIsSending(true);
    
    try {
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsCodeSent(true);
      toast.success("Verification code sent", {
        description: `Check your ${email || "email"} for the verification code`,
      });
    } catch (error) {
      toast.error("Failed to send verification code");
    } finally {
      setIsSending(false);
    }
  };
  
  const handleVerify = async () => {
    if (value.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // In a real implementation, we would verify with the backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!isProductionMode || value === "123456") {
        toast.success("MFA verification successful");
        onComplete(true);
      } else {
        toast.error("Invalid verification code. Please try again.");
        setValue("");
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Multi-Factor Authentication
        </CardTitle>
        <CardDescription>
          Protect your account with an additional layer of security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCodeSent ? (
          <div className="text-center py-4">
            <Lock className="h-16 w-16 mx-auto mb-4 text-primary opacity-80" />
            <p className="mb-4">
              We'll send a verification code to your {email ? `email (${email})` : "email"} to complete the authentication process.
            </p>
            <Button 
              onClick={handleSendCode} 
              disabled={isSending} 
              className="w-full"
            >
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSending ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-center text-sm text-muted-foreground">
                Enter the 6-digit verification code sent to your {email ? email : "email"}
              </p>
              <div className="flex justify-center py-4">
                <InputOTP maxLength={6} value={value} onChange={setValue}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleVerify} 
                disabled={value.length !== 6 || isVerifying}
                className="w-full"
              >
                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isVerifying ? "Verifying..." : "Verify Code"}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleSendCode} 
                disabled={isSending}
                className="text-sm"
              >
                {isSending ? "Sending..." : "Resend Code"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-center text-sm text-muted-foreground">
          {!isProductionMode && (
            <p className="text-blue-600 font-medium">
              Demo Mode: Use code 123456
            </p>
          )}
          <p className="mt-1">
            Having trouble? Contact support for assistance.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
