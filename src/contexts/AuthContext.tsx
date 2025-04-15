import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Define the user type to match both Supabase User and our custom UserProfile
export type User = {
  user_id: string;
  email: string;
  name?: string;
  role: 'user' | 'bank' | 'admin';
  mfa_enabled: boolean;
  kyc_status?: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  app_metadata?: any;
  user_metadata?: any;
  aud?: string;
};

// Define the auth context type
export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithWallet: (address: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setupMFA: (phoneNumber: string, method: "sms" | "email") => Promise<boolean>;
  verifyMFA: (code: string) => Promise<boolean>;
  isMFARequired: boolean;
};

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMFARequired, setIsMFARequired] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load user profile");
            return;
          }

          const userWithProfile: User = {
            ...session.user,
            user_id: session.user.id,
            email: session.user.email || '',
            name: profile?.name,
            role: profile?.role || 'user',
            mfa_enabled: profile?.mfa_enabled || false,
            kyc_status: profile?.kyc_status || 'not_submitted',
            app_metadata: session.user.app_metadata,
            user_metadata: session.user.user_metadata,
            aud: session.user.aud
          };

          setUser(userWithProfile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Session loading error:", error);
        toast.error("Failed to load session");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Implement the login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error("Login failed: " + error.message);
        return false;
      }

      // Fetch the user profile after successful login
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Failed to load user profile");
        return false;
      }

      const userWithProfile: User = {
        ...data.user,
        user_id: data.user.id,
        email: data.user.email || '',
        name: profile?.name,
        role: profile?.role || 'user',
        mfa_enabled: profile?.mfa_enabled || false,
        kyc_status: profile?.kyc_status || 'not_submitted',
        app_metadata: data.user.app_metadata,
        user_metadata: data.user.user_metadata,
        aud: data.user.aud
      };

      setUser(userWithProfile);
      setIsAuthenticated(true);
      
      // Check if MFA is required
      if (userWithProfile.mfa_enabled) {
        setIsMFARequired(true);
        toast.info("Multi-factor authentication required");
        navigate("/mfa-verify");
      } else {
        navigate(`/dashboard/${userWithProfile.role}`);
      }

      return true;
    } catch (error) {
      console.error("Login submission error:", error);
      toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Implement the register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
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
        console.error("Registration error:", error);
        toast.error("Registration failed: " + error.message);
        return false;
      }

      // Create a user profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: data.user.id,
            email: email,
            name: name,
            role: 'user',
            mfa_enabled: false,
            kyc_status: 'not_submitted'
          }
        ]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error("Failed to create user profile");
        return false;
      }

      toast.success("Registration successful! Please check your email to verify your account.");
      return true;
    } catch (error) {
      console.error("Registration submission error:", error);
      toast.error("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Implement the logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed");
        return;
      }

      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout submission error:", error);
      toast.error("Logout failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Implement the loginWithWallet function
  const loginWithWallet = async (address: string) => {
    // This would implement wallet-based authentication
    // For now, simulate it with a toast message
    toast.success(`Logged in with wallet address: ${address}`);
    // Set a mock user for now
    const mockUser: User = {
      user_id: address,
      email: `wallet-${address.substring(0, 8)}@example.com`,
      name: `Wallet User ${address.substring(0, 6)}`,
      role: 'user',
      mfa_enabled: false,
      kyc_status: 'not_submitted',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated'
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  // Implement setupMFA function
  const setupMFA = async (phoneNumber: string, method: "sms" | "email") => {
    // This would implement MFA setup with a real service
    // For now, simulate it
    toast.success(`MFA set up with ${method} verification`);
    if (user) {
      // Update user with MFA enabled
      const updatedUser = { ...user, mfa_enabled: true };
      setUser(updatedUser);
      // In a real implementation, we would update the database too
    }
    return true;
  };

  // Implement verifyMFA function
  const verifyMFA = async (code: string) => {
    // This would implement MFA verification
    // For now, accept any code
    if (code && code.length === 6) {
      setIsMFARequired(false);
      toast.success("MFA verified successfully");
      
      if (user) {
        navigate(`/dashboard/${user.role}`);
      } else {
        navigate("/login");
      }
      
      return true;
    }
    toast.error("Invalid verification code");
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithWallet,
        register,
        logout,
        setupMFA,
        verifyMFA,
        isMFARequired
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
