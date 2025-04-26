
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { User } from '../types';
import { setupMFA as setupMFAUtil, verifyMFA as verifyMFAUtil } from '../mfaUtils';

export const useMFAAuth = (
  user: User | null,
  setUser: (user: User | null) => void
) => {
  const [isMFARequired, setIsMFARequired] = useState<boolean>(false);

  const setupMFA = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to set up MFA");
        return null;
      }

      const { qrCode, secret } = await setupMFAUtil(user.id);

      if (!qrCode || !secret) {
        toast.error("Failed to set up MFA");
        return null;
      }

      return { qrCode, secret };
    } catch (error) {
      console.error("MFA setup error:", error);
      toast.error("Failed to set up MFA");
      return null;
    }
  };

  const verifyMFA = async (token: string, secret: string) => {
    try {
      const isValid = await verifyMFAUtil(token, secret);

      if (isValid && user) {
        const updatedUser = { ...user, mfaEnabled: true };
        setUser(updatedUser);

        // Update profile in database
        const { error } = await supabase
          .from('profiles')
          .update({ mfa_enabled: true })
          .eq('id', user.id);

        if (error) {
          console.error("Error updating MFA status in database:", error);
        }

        toast.success("MFA enabled successfully");
        return true;
      }
      
      toast.error("Invalid verification code");
      return false;
    } catch (error) {
      console.error("MFA verification error:", error);
      toast.error("Failed to verify MFA token");
      return false;
    }
  };

  const disableMFA = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to disable MFA");
        return false;
      }

      const updatedUser = { ...user, mfaEnabled: false };
      setUser(updatedUser);

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({ mfa_enabled: false })
        .eq('id', user.id);

      if (error) {
        console.error("Error updating MFA status in database:", error);
        toast.error("Failed to disable MFA in database");
        return false;
      }

      toast.success("MFA disabled successfully");
      return true;
    } catch (error) {
      console.error("MFA disable error:", error);
      toast.error("Failed to disable MFA");
      return false;
    }
  };

  return {
    isMFARequired,
    setIsMFARequired,
    setupMFA,
    verifyMFA,
    disableMFA
  };
};
