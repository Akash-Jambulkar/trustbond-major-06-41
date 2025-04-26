
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

  // Updated to match the expected interface in AuthProvider
  const setupMFA = async (phoneNumber: string, method: "sms" | "email") => {
    try {
      if (!user) {
        toast.error("You must be logged in to set up MFA");
        return false;
      }

      // We're ignoring phoneNumber and method for now since our implementation is simplified
      // In a real app, these would be used to send verification codes
      console.log(`Setting up MFA with ${method} for ${phoneNumber}`);
      
      const result = await setupMFAUtil(user.id);
      
      if (!result) {
        toast.error("Failed to set up MFA");
        return false;
      }
      
      // Show QR code to user (this would typically be displayed in the UI)
      toast.success("MFA setup initiated successfully");
      
      return true;
    } catch (error) {
      console.error("MFA setup error:", error);
      toast.error("Failed to set up MFA");
      return false;
    }
  };

  // Updated to match the expected interface in AuthProvider
  const verifyMFA = async (code: string) => {
    try {
      if (!user) {
        toast.error("You must be logged in to verify MFA");
        return false;
      }
      
      // For demonstration purposes, we'll accept any 6-digit code
      // In a real app, we would verify against a stored secret
      const isValid = code && code.length === 6 && /^\d{6}$/.test(code);

      if (isValid) {
        // Update user in local state
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
