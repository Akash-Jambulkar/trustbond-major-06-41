
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, X } from "lucide-react";

interface MFAVerificationProps {
  email: string;
  onVerify: () => void;
  onCancel: () => void;
}

const MFAVerification = ({ email, onVerify, onCancel }: MFAVerificationProps) => {
  const [code, setCode] = useState("");
  const [remainingTime, setRemainingTime] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Start countdown timer
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [remainingTime]);

  const handleVerify = () => {
    if (!code) {
      toast.error("Please enter the verification code");
      return;
    }

    if (code.length !== 6) {
      toast.error("Verification code must be 6 digits");
      return;
    }

    // For demo purposes, we'll accept any 6-digit code
    // In a real implementation, this would validate against a server
    if (/^\d{6}$/.test(code)) {
      toast.success("Verification successful!");
      onVerify();
    } else {
      toast.error("Invalid verification code. Please try again.");
    }
  };

  const handleResendCode = () => {
    setIsResending(true);
    
    // Simulate API call to resend code
    setTimeout(() => {
      toast.success(`A new verification code has been sent to ${email}`);
      setRemainingTime(60);
      setIsResending(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Shield className="text-trustbond-primary h-5 w-5 mr-2" />
          <h3 className="text-lg font-semibold">Security Verification</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">
          For your security, we've sent a 6-digit verification code to:
        </p>
        <p className="font-medium">{email}</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verification-code">Verification Code</Label>
          <Input
            id="verification-code"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>
        
        <Button onClick={handleVerify} className="w-full">
          Verify
        </Button>
        
        <div className="text-center">
          {remainingTime > 0 ? (
            <p className="text-sm text-gray-500">
              Resend code in {remainingTime} seconds
            </p>
          ) : (
            <Button 
              variant="link" 
              onClick={handleResendCode} 
              disabled={isResending}
              className="text-sm"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MFAVerification;
