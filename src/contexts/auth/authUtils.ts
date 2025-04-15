
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User } from "../auth/types";

// Helper function to fetch user profile after login
export const fetchUserProfile = async (userId: string): Promise<any> => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    toast.error("Failed to load user profile");
    return null;
  }

  return profile;
};

// Create a user with profile in one utility function
export const createUserWithProfile = async (
  email: string, 
  password: string, 
  name: string,
  role: 'user' | 'bank' = 'user'
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          role: role,
          mfa_enabled: false,
          kyc_status: 'not_submitted'
        }
      }
    });

    if (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed: " + error.message);
      return false;
    }

    if (!data.user) {
      console.error("No user returned from signUp");
      toast.error("Registration failed: No user created");
      return false;
    }

    // Create a user profile in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          user_id: data.user.id,
          email: email,
          name: name,
          role: role,
          mfa_enabled: false,
          kyc_status: 'not_submitted'
        }
      ]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      toast.error("Failed to create user profile: " + profileError.message);
      return false;
    }

    toast.success("Registration successful! Please check your email to verify your account.");
    return true;
  } catch (error) {
    console.error("Registration submission error:", error);
    toast.error("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
    return false;
  }
};

// Helper function to map supabase user to our User type
export const mapUserWithProfile = (
  supabaseUser: any, 
  profile: any
): User => {
  return {
    id: supabaseUser.id,
    user_id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.name,
    role: profile?.role || 'user',
    mfa_enabled: profile?.mfa_enabled || false,
    kyc_status: profile?.kyc_status || 'not_submitted',
    app_metadata: supabaseUser.app_metadata,
    user_metadata: supabaseUser.user_metadata,
    aud: supabaseUser.aud,
    phone: profile?.phone,
    address: profile?.address,
    walletAddress: profile?.walletAddress
  };
};

export const mockWalletUser = (address: string): User => {
  return {
    id: address,
    user_id: address,
    email: `wallet-${address.substring(0, 8)}@example.com`,
    name: `Wallet User ${address.substring(0, 6)}`,
    role: 'user',
    mfa_enabled: false,
    kyc_status: 'not_submitted',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    phone: '',
    address: '',
    walletAddress: address
  };
};
