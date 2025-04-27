import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Define user type to include walletAddress
interface User {
  id: string;
  email: string;
  user_id?: string;
  name?: string;
  role: string;
  walletAddress?: string;
  kyc_status?: string;
  mfaEnabled?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithWallet: (address: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setupMFA: () => Promise<void>;
  verifyMFA: (otp: string) => Promise<boolean>;
  isMFARequired: boolean;
  disableMFA: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [isMFARequired, setIsMFARequired] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error("Invalid credentials");
        return false;
      }

      if (data?.user?. факторов?.length === 0) {
        setIsMFARequired(false);
      } else {
        setIsMFARequired(true);
      }

      const { user: authUser } = data;

      // Fetch user profile to get additional data like wallet address
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, role, wallet_address, kyc_status, mfa_enabled')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      const userData: User = {
        id: authUser.id,
        email: authUser.email || '',
        role: profile?.role || 'user',
        name: profile?.name || authUser.email?.split('@')[0] || 'User',
        walletAddress: profile?.wallet_address || undefined,
        kyc_status: profile?.kyc_status || 'not_submitted',
        mfaEnabled: profile?.mfa_enabled || false
      };

      setUser(userData);
      setIsAuthenticated(true);
      navigate("/dashboard");
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login submission error:", error);
      toast.error("Login failed: " + (error as Error).message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithWallet = async (address: string) => {
    setIsLoading(true);
    try {
      // Mock authentication for wallet login
      const userData: User = {
        id: address,
        email: `wallet-${address.substring(0, 8)}@example.com`,
        name: `Wallet User ${address.substring(0, 6)}`,
        role: 'user',
        walletAddress: address,
        kyc_status: 'not_submitted',
        mfaEnabled: false
      };

      setUser(userData);
      setIsAuthenticated(true);
      navigate("/dashboard");
      toast.success("Wallet login successful!");
      return true;
    } catch (error) {
      console.error("Wallet login error:", error);
      toast.error("Wallet login failed: " + (error as Error).message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
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
            role: 'user',
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
            role: 'user'
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
          role_param: 'user',
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed");
      } else {
        setUser(null);
        setIsAuthenticated(false);
        navigate("/");
        toast.success("Logout successful!");
      }
    } catch (error) {
      console.error("Logout submission error:", error);
      toast.error("Logout failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const setupMFA = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const { data, error } = await supabase.auth.mfa.enroll();

      if (error) {
        console.error("MFA setup error:", error);
        toast.error("MFA setup failed");
        return;
      }

      console.log("MFA setup data:", data);
      toast.success("MFA setup initiated. Please check your email for verification instructions.");
    } catch (error) {
      console.error("MFA setup submission error:", error);
      toast.error("MFA setup failed: " + (error as Error).message);
    }
  };

  const verifyMFA = async (otp: string) => {
    if (!user) {
      toast.error("User not authenticated");
      return false;
    }

    try {
      const { data, error } = await supabase.auth.mfa.verify({ factor_id: user.factors[0].id, challenge_id: user.factors[0].challenges[0].id, otp });

      if (error) {
        console.error("MFA verification error:", error);
        toast.error("MFA verification failed");
        return false;
      }

      console.log("MFA verification data:", data);
      toast.success("MFA verification successful!");
      return true;
    } catch (error) {
      console.error("MFA verification submission error:", error);
      toast.error("MFA verification failed: " + (error as Error).message);
      return false;
    }
  };

  const disableMFA = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const { data, error } = await supabase.auth.mfa.unenroll({ factor_id: user.factors[0].id });

      if (error) {
        console.error("MFA disable error:", error);
        toast.error("MFA disable failed");
        return;
      }

      console.log("MFA disable data:", data);
      toast.success("MFA disabled successfully!");
    } catch (error) {
      console.error("MFA disable submission error:", error);
      toast.error("MFA disable failed: " + (error as Error).message);
    }
  };

  // Load session when component mounts
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const { user: authUser } = session;

          // Fetch user profile to get additional data like wallet address
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('name, role, wallet_address, kyc_status, mfa_enabled')
            .eq('id', authUser.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }

          const userData: User = {
            id: authUser.id,
            email: authUser.email || '',
            role: profile?.role || 'user',
            name: profile?.name || authUser.email?.split('@')[0] || 'User',
            walletAddress: profile?.wallet_address || undefined,
            kyc_status: profile?.kyc_status || 'not_submitted',
            mfaEnabled: profile?.mfa_enabled || false
          };

          setUser(userData);
          setIsAuthenticated(true);

          console.log("User session loaded:", userData);
        }
      } catch (error) {
        console.error("Session loading error:", error);
        toast.error("Failed to load session");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user: authUser } = session;

          // Fetch user profile to get additional data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('name, role, wallet_address, kyc_status, mfa_enabled')
            .eq('id', authUser.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }

          const userData: User = {
            id: authUser.id,
            email: authUser.email || '',
            role: profile?.role || 'user',
            name: profile?.name || authUser.email?.split('@')[0] || 'User',
            walletAddress: profile?.wallet_address || undefined,
            kyc_status: profile?.kyc_status || 'not_submitted',
            mfaEnabled: profile?.mfa_enabled || false
          };

          setUser(userData);
          setIsAuthenticated(true);

          console.log("Auth state changed - signed in:", userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          console.log("Auth state changed - signed out");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        login,
        loginWithWallet,
        register,
        logout,
        setupMFA,
        verifyMFA,
        isMFARequired,
        disableMFA
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
