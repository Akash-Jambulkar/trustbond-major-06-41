
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User, UserRole } from "./types";

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
  role: UserRole = 'user'
): Promise<boolean> => {
  try {
    // Validate input parameters
    if (!email || !password || !name) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Password strength validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    // First, sign up the user with Supabase Auth
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
      // Handle specific auth errors
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please try logging in instead.");
      } else if (error.message.includes("invalid password")) {
        toast.error("Invalid password format. Password must be at least 6 characters long.");
      } else if (error.message.includes("email")) {
        toast.error("Invalid email format. Please check your email address.");
      } else {
        console.error("Registration error:", error);
        toast.error(`Registration failed: ${error.message}`);
      }
      return false;
    }

    if (!data.user) {
      toast.error("Registration failed: Could not create user account");
      return false;
    }

    // Use Supabase function to create profile
    // This approach uses a database function that has SECURITY DEFINER privilege
    // to bypass RLS policies when creating the profile
    const { error: profileError } = await supabase
      .rpc('create_profile_for_user', {
        user_id_param: data.user.id,
        email_param: email,
        name_param: name,
        role_param: role,
        mfa_enabled_param: false,
        kyc_status_param: 'not_submitted'
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      
      if (profileError.code === '23505') { // Unique violation
        toast.error("A profile with this email already exists");
      } else {
        toast.error(`Failed to create user profile: ${profileError.message}`);
      }
      
      // Even if profile creation fails, we should return true since the user account was created
      // The user can try to update their profile later
      toast.info("Account created, but profile setup encountered an issue. You can update your profile after logging in.");
      return true;
    }

    toast.success("Registration successful! Please check your email to verify your account.");
    return true;

  } catch (error) {
    console.error("Registration submission error:", error);
    toast.error("Registration failed: " + (error instanceof Error ? error.message : "An unexpected error occurred"));
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
