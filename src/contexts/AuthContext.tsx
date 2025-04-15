
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, type UserProfile } from "@/lib/supabase";
import { toast } from "sonner";

// Define the auth context type
type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  enableMFA: () => Promise<boolean>;
  verifyMFA: (code: string) => Promise<boolean>;
  disableMFA: () => Promise<boolean>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          // Fetch user profile
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (data) {
            setUser(data as UserProfile);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }

      setIsLoading(false);
    };

    initAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch user profile when signed in
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (data) {
          setUser(data as UserProfile);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    // Clean up subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success("Logged in successfully!");
      
      // Fetch user profile
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();
        
        if (data) {
          const userProfile = data as UserProfile;
          setUser(userProfile);
          
          // Redirect based on role
          if (userProfile.role === 'user') {
            navigate('/dashboard/user');
          } else if (userProfile.role === 'bank') {
            navigate('/dashboard/bank');
          } else if (userProfile.role === 'admin') {
            navigate('/dashboard/admin');
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
              name,
              email,
              role,
              kyc_status: 'not_submitted',
              mfa_enabled: false,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          toast.error("Failed to create user profile");
          return false;
        }

        toast.success("Account created successfully!");

        // Specific setup for bank accounts
        if (role === 'bank') {
          navigate('/dashboard/bank/bank-registration');
        } else {
          navigate('/dashboard/user');
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.success("Logged out successfully!");
  };

  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.user_id);

      if (error) {
        toast.error("Failed to update profile");
        return false;
      }

      // Update local user state
      setUser({ ...user, ...data });
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
      return false;
    }
  };

  // Enable MFA
  const enableMFA = async () => {
    if (!user) return false;
    
    // In a real implementation, you'd integrate with a proper MFA provider
    // For demo purposes, we'll just update the user profile
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ mfa_enabled: true })
        .eq('user_id', user.user_id);

      if (error) {
        toast.error("Failed to enable MFA");
        return false;
      }

      setUser({ ...user, mfa_enabled: true });
      toast.success("MFA enabled successfully!");
      return true;
    } catch (error) {
      console.error("Enable MFA error:", error);
      toast.error("Failed to enable MFA");
      return false;
    }
  };

  // Verify MFA
  const verifyMFA = async (code: string) => {
    // In a real implementation, you'd verify the MFA code
    // For demo purposes, we'll accept any code
    if (code && code.length === 6) {
      toast.success("MFA verified successfully!");
      return true;
    }
    
    toast.error("Invalid MFA code");
    return false;
  };

  // Disable MFA
  const disableMFA = async () => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ mfa_enabled: false })
        .eq('user_id', user.user_id);

      if (error) {
        toast.error("Failed to disable MFA");
        return false;
      }

      setUser({ ...user, mfa_enabled: false });
      toast.success("MFA disabled successfully!");
      return true;
    } catch (error) {
      console.error("Disable MFA error:", error);
      toast.error("Failed to disable MFA");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        enableMFA,
        verifyMFA,
        disableMFA,
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
