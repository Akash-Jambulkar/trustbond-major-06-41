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

// Helper function to map user with profile and role
export const mapUserWithProfile = (
  supabaseUser: any, 
  profile: any
): User => {
  return {
    id: supabaseUser.id,
    user_id: supabaseUser.id, // Include for backward compatibility
    email: supabaseUser.email || '',
    name: profile?.name,
    role: profile?.role || 'user',
    mfaEnabled: profile?.mfa_enabled || false,
    kyc_status: profile?.kyc_status || 'not_submitted',
    user_metadata: supabaseUser.user_metadata,
    aud: supabaseUser.aud,
    phone: profile?.phone,
    address: profile?.address,
    walletAddress: profile?.walletAddress
  };
};

// Create a user with profile and role assignment
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

    // Check if a user with this email already exists in the profiles table
    const { data: existingProfiles, error: profileCheckError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (profileCheckError) {
      console.error("Error checking for existing profile:", profileCheckError);
    } else if (existingProfiles) {
      toast.error("This email is already registered. Please try logging in instead.");
      return false;
    }

    const { data: { user }, error } = await supabase.auth.signUp({
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

    if (!user) {
      toast.error("Registration failed: Could not create user account");
      return false;
    }

    // Create initial role assignment
    const { error: roleError } = await supabase
      .from('user_role_assignments')
      .insert([
        { 
          user_id: user.id,
          role: role
        }
      ]);

    if (roleError) {
      console.error("Role assignment error:", roleError);
      toast.error("Failed to assign user role");
      return false;
    }

    // Use Supabase function to create profile
    // This approach uses a database function that has SECURITY DEFINER privilege
    // to bypass RLS policies when creating the profile
    const { error: profileError } = await supabase
      .rpc('create_profile_for_user', {
        user_id_param: user.id,
        email_param: email,
        name_param: name,
        role_param: role,
        mfa_enabled_param: false,
        kyc_status_param: 'not_submitted'
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      
      if (profileError.code === '23505') { // Unique violation
        // If we get a unique constraint violation after checking for existing profiles,
        // it likely means there's a race condition or the database trigger already created the profile
        console.log("A profile already exists for this user - continuing with login process");
        toast.success("Registration successful! Please check your email to verify your account.");
        return true;
      } else {
        // For other errors, notify but don't block the registration
        console.warn(`Profile creation warning: ${profileError.message}`);
        toast.info("Account created, but your profile may need to be updated after login");
      }
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

export const mockWalletUser = (address: string): User => {
  return {
    id: address,
    user_id: address, // Include for backward compatibility
    email: `wallet-${address.substring(0, 8)}@example.com`,
    name: `Wallet User ${address.substring(0, 6)}`,
    role: 'user',
    mfaEnabled: false,
    kyc_status: 'not_submitted',
    user_metadata: {},
    aud: 'authenticated',
    phone: '',
    address: '',
    walletAddress: address
  };
};
