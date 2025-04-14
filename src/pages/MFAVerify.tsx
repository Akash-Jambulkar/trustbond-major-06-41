
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp";
import { Keypad, KeypadButton } from "@/components/ui/keypad";
import { toast } from "sonner";
import { Shield, Smartphone, Mail, ArrowLeft } from "lucide-react";

// Custom InputOTPSlot component that doesn't require index prop
const InputOTPSlot = ({ char, hasFakeCaret, isActive }: { char: string; hasFakeCaret: boolean; isActive: boolean }) => {
  return (
    <div
      className={`relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md ${isActive ? "z-10 ring-2 ring-ring ring-offset-background" : ""}`}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
};

const MFAVerify = () => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyMFA, login, isMFARequired } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error("Please enter all 6 digits of the verification code");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await verifyMFA(code);
      if (!success) {
        // Error message already shown by verifyMFA
        setCode("");
      }
    } catch (error) {
      console.error("MFA verification error:", error);
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonPress = (digit: string) => {
    if (code.length < 6) {
      setCode(prevCode => prevCode + digit);
    }
  };

  const handleBackspace = () => {
    setCode(prevCode => prevCode.slice(0, -1));
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  // If MFA is not required, redirect to login
  if (!isMFARequired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Verification Not Required</CardTitle>
            <CardDescription>
              You don't need to verify at this time
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={handleBackToLogin}>
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the 6-digit verification code sent to your device
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Verification code was sent via email or SMS</span>
              </div>
              
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              
              <div className="mt-8">
                <Keypad>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                      <KeypadButton
                        key={digit}
                        onClick={() => handleButtonPress(digit.toString())}
                        disabled={isSubmitting}
                      >
                        {digit}
                      </KeypadButton>
                    ))}
                    <KeypadButton
                      onClick={handleBackspace}
                      disabled={isSubmitting}
                      className="col-span-1"
                    >
                      ←
                    </KeypadButton>
                    <KeypadButton
                      onClick={() => handleButtonPress("0")}
                      disabled={isSubmitting}
                      className="col-span-1"
                    >
                      0
                    </KeypadButton>
                    <KeypadButton
                      type="submit"
                      disabled={code.length !== 6 || isSubmitting}
                      className="col-span-1 bg-trustbond-primary text-white hover:bg-trustbond-primary/90"
                    >
                      ✓
                    </KeypadButton>
                  </div>
                </Keypad>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Didn't receive a code?{" "}
                  <Button
                    variant="link"
                    className="p-0 text-trustbond-primary"
                    disabled={isSubmitting}
                    onClick={() => toast.info("A new code will be sent shortly")}
                  >
                    Resend code
                  </Button>
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={code.length !== 6 || isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleBackToLogin}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
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

export default MFAVerify;
