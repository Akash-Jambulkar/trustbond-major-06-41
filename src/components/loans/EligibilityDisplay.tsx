
import React from 'react';
import { Button } from '@/components/ui/button';

interface EligibilityDisplayProps {
  eligible: boolean;
  reason?: string;
  kyc: number;
}

export const EligibilityDisplay: React.FC<EligibilityDisplayProps> = ({ eligible, reason, kyc }) => {
  return (
    <div className="space-y-2">
      <div className={`p-3 rounded-md ${eligible ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
        {eligible 
          ? "You are eligible to apply for a loan" 
          : reason || "You are not currently eligible for a loan"}
      </div>

      {!eligible && kyc !== 1 && (
        <div className="rounded-md bg-blue-50 p-4 text-blue-800 border border-blue-200">
          <h3 className="font-medium">Next Steps to Qualify</h3>
          <p className="mt-1 text-sm">
            Complete your KYC verification to become eligible for loans.
          </p>
          <Button 
            variant="link" 
            className="text-blue-600 p-0 mt-2"
            onClick={() => window.location.href = '/dashboard/user/kyc'}
          >
            Go to KYC Verification
          </Button>
        </div>
      )}
    </div>
  );
};
