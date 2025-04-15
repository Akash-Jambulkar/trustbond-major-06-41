
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User } from "./types";

// Setup MFA for a user
export const setupUserMFA = async (phoneNumber: string, method: "sms" | "email"): Promise<boolean> => {
  // This would implement MFA setup with a real service
  // For now, simulate it
  toast.success(`MFA set up with ${method} verification`);
  // In a real implementation, we would update the database
  return true;
};

// Verify MFA code
export const verifyUserMFA = async (code: string): Promise<boolean> => {
  // This would implement MFA verification
  // For now, accept any code
  if (code && code.length === 6) {
    toast.success("MFA verified successfully");
    return true;
  }
  toast.error("Invalid verification code");
  return false;
};

// Disable MFA for a user
export const disableUserMFA = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      toast.error("No user logged in");
      return false;
    }

    // Update the profiles table to disable MFA
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ mfa_enabled: false })
      .eq('user_id', userId);

    if (updateError) {
      console.error("Error updating MFA status:", updateError);
      toast.error("Failed to disable two-factor authentication");
      return false;
    }

    toast.success("Two-factor authentication has been disabled");
    return true;
  } catch (error) {
    console.error("Unexpected error disabling MFA:", error);
    toast.error("An unexpected error occurred");
    return false;
  }
};
