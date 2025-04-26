
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { User } from "./types";

// Setup MFA for a user
export const setupMFA = async (userId: string): Promise<{ qrCode: string; secret: string } | null> => {
  try {
    // This would implement MFA setup with a real service
    // For now, simulate generating QR code and secret
    // In a real implementation, we would use a library like 'speakeasy' to generate TOTP secrets
    
    const secret = generateRandomSecret();
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/TrustBond:${userId}?secret=${secret}&issuer=TrustBond`;
    
    // Store the secret temporarily (in a real app, this would be securely stored)
    sessionStorage.setItem(`mfa_setup_${userId}`, secret);
    
    return { qrCode, secret };
  } catch (error) {
    console.error("Error setting up MFA:", error);
    return null;
  }
};

// Verify MFA token against secret
export const verifyMFA = async (token: string, secret: string): Promise<boolean> => {
  try {
    // In a real app, this would verify the token using a library like 'speakeasy'
    // For demo purposes, accept any 6-digit token
    if (token && token.length === 6 && /^\d{6}$/.test(token)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error verifying MFA token:", error);
    return false;
  }
};

// Generate a random 16-character secret
const generateRandomSecret = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)];
  }
  return secret;
};

// Disable MFA for a user
export const disableMFA = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      toast.error("No user logged in");
      return false;
    }

    // Update the profiles table to disable MFA
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ mfa_enabled: false })
      .eq('id', userId);

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
