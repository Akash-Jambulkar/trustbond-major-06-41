
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import MFAVerification from "./MFAVerification";

interface MultifactorAuthProps {
  onComplete?: (verified: boolean) => void;
  email?: string;
}

export const MultifactorAuth = ({ onComplete, email }: MultifactorAuthProps) => {
  const { user, disableMFA } = useAuth();
  const [isDisabling, setIsDisabling] = useState(false);
  const [showVerification, setShowVerification] = useState(!!onComplete);
  const navigate = useNavigate();

  const handleSetupMFA = () => {
    navigate("/mfa-setup");
  };

  const handleDisableMFA = async () => {
    if (confirm("Are you sure you want to disable two-factor authentication? This will reduce the security of your account.")) {
      setIsDisabling(true);
      try {
        const success = await disableMFA();
        if (success) {
          toast.success("Two-factor authentication has been disabled");
        }
      } catch (error) {
        console.error("Error disabling MFA:", error);
        toast.error("Failed to disable two-factor authentication");
      } finally {
        setIsDisabling(false);
      }
    }
  };

  const handleVerifyComplete = () => {
    if (onComplete) {
      onComplete(true);
    }
    setShowVerification(false);
  };

  const handleVerifyCancel = () => {
    if (onComplete) {
      onComplete(false);
    }
    setShowVerification(false);
  };

  if (showVerification && email) {
    return (
      <MFAVerification
        email={email}
        onVerify={handleVerifyComplete}
        onCancel={handleVerifyCancel}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-trustbond-primary" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user?.mfaEnabled ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="mt-0.5 bg-green-100 rounded-full p-1">
                <Shield className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium text-green-700">Two-Factor Authentication is Enabled</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your account is protected with an additional layer of security.
                  You will be asked to enter a verification code when signing in.
                </p>
              </div>
            </div>
            
            <div className="rounded-md bg-amber-50 p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Important Security Information</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      If you disable two-factor authentication, your account will only be protected by your password.
                      We strongly recommend keeping two-factor authentication enabled for enhanced security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="mt-0.5 bg-amber-100 rounded-full p-1">
                <Shield className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-medium text-amber-700">Two-Factor Authentication is Disabled</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your account is currently only protected by your password.
                  Enable two-factor authentication to add an extra layer of security.
                </p>
              </div>
            </div>
            
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Why use two-factor authentication?</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Protection against password theft</li>
                      <li>Adds an extra verification step when signing in</li>
                      <li>Prevents unauthorized access to your account</li>
                      <li>Recommended for banking and financial services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {user?.mfaEnabled ? (
          <Button variant="destructive" onClick={handleDisableMFA} disabled={isDisabling} className="w-full">
            {isDisabling ? "Disabling..." : "Disable Two-Factor Authentication"}
          </Button>
        ) : (
          <Button onClick={handleSetupMFA} className="w-full">
            Set Up Two-Factor Authentication
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MultifactorAuth;
